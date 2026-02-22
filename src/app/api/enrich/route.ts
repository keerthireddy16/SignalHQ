import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { companyId, url } = await req.json();

        // 1. API Key Validation
        const API_KEY = process.env.GEMINI_API_KEY?.trim();
        if (!API_KEY) {
            console.error('CRITICAL: GEMINI_API_KEY is missing in environment variables.');
            return NextResponse.json({ error: "GEMINI_API_KEY is missing in environment variables." }, { status: 400 });
        }

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 2. Robust Web Fetching with Cheerio
        let scrapedText = '';
        try {
            console.log(`[Enrichment] Fetching content from: ${url}`);
            const response = await axios.get(url, {
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            });

            const $ = cheerio.load(response.data);

            // Remove scripts, styles, and junk
            $('script, style, nav, footer, iframe, noscript').remove();

            // Targeted extraction from main or body
            const target = $('main').length > 0 ? $('main') : $('body');
            scrapedText = target.text().replace(/\s+/g, ' ').trim().substring(0, 10000);

            console.log(`[Enrichment] Scraped ${scrapedText.length} characters.`);
        } catch (scrapeError: any) {
            console.warn(`[Enrichment] Scrape failed for ${url}: ${scrapeError.message}`);
            scrapedText = "Scrape failed or content blocked. Use general knowledge if possible.";
        }

        // 3. Gemini Integration via SDK
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            You are a VC intelligence agent. Analyze this content from ${url}.
            Return a raw JSON object matching this exact interface:
            { 
              "summary": "2-sentence vision/product summary", 
              "whatTheyDo": ["Key feature 1", "Key feature 2", "Key feature 3"], 
              "keywords": ["Sector", "Tech", "Model"], 
              "signals": ["Funding/Hiring/Growth indicators"] 
            }

            CONTENT:
            ${scrapedText}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            const data = JSON.parse(responseText);
            return NextResponse.json({
                companyId,
                ...data,
                sources: [
                    { url, timestamp: new Date().toLocaleString() }
                ]
            });
        } catch (parseError) {
            console.error('[Enrichment] AI Response Parse Error:', responseText);
            return NextResponse.json({ error: "Intelligence extraction failed: Invalid format." }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[Enrichment] Unhandled Server Error:', error);

        // Handle Quota/Rate Limit Errors (429)
        if (error.message?.includes('429') || error.status === 429) {
            return NextResponse.json({
                error: "AI Quota Exceeded (429)",
                details: "The free-tier API limit has been reached. Please wait a minute and try again, or check your API key quota.",
                meta: { retryAfter: error.retryDelay || '60s' }
            }, { status: 429 });
        }

        if (error.response) {
            console.error('[Enrichment] Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return NextResponse.json({
            error: "Failed to process enrichment.",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
