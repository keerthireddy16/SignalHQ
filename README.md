# SignalHQ - Venture Capital Intelligence Engine

A precision AI scout designed to turn VC investment theses into an always-on discovery workflow. Built as a high-fidelity intelligence interface for the VC sourcing ecosystem.

## 🚀 Core Features

### 1. Workflow-Driven Discovery
*   **Deep Search**: Fast, global search across the entire company database.
*   **Faceted Filtering**: Precision filters for Investment Stage and Sector Focus.
*   **Custom View Persistence**: Save your filtered views and re-run them instantly with full state restoration (Query + Stage + Sector).
*   **Smart Table**: Sortable results with "Funding" amount parsing and clean "Page-based" pagination.

### 2. Live AI Enrichment (The "Core Scan")
*   **Autonomous Intelligence**: On-demand public web scraping powered by **Google Gemini 1.5 Flash**.
*   **Intelligence Extraction**:
    *   **Vision Summary**: 1-2 sentence vision-centric summary.
    *   **Core Competencies**: 3-6 targeted product/market bullets.
    *   **Market Keywords**: 5-10 specific industry tags for fast categorization.
    *   **Differentiated Signals**: 2-4 signals inferred from live page content (Hiring, Tech Stack, Growth).
*   **Source Verifiability**: Every signal includes the exact URL scraped and a high-resolution timestamp.

### 3. Pipeline & Library Management
*   **Custom Lists**: Create and manage multiple sourcing pipelines (e.g., "Seed SaaS", "Late Stage Fintech").
*   **Intelligence Library**: Save specific companies or filtered views to your personal library for future tracking.
*   **Export Ready**: One-click export of lists to JSON/CSV for integration with CRM workflows.

## 🛠️ Technical Architecture

*   **Frontend**: Next.js 16 (App Router) + Tailwind CSS 4 + Lucide React.
*   **Intelligence**: Gemini 1.5 Flash (Standardized for high availability and quota resilience).
*   **Scraping**: Server-side Cheerio engine with browser-spoofing headers for robust public page access.
*   **Data Persistence**: Full state synchronization via `localStorage` and URL deep-linking.
*   **Hardened Security**: 
    *   **Server-Side Isolation**: API keys are strictly confined to the `/api/enrich` route.
    *   **Git Protection**: Comprehensive `.gitignore` patterns prevent credential leaks.

## ⚙️ Local Setup

1.  **Clone the Repository**:
    ```bash
    git clone [repository-url]
    cd vc-scout
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_ai_studio_key
    ```
4.  **Launch the System**:
    ```bash
    npm run dev
    ```
    Access the interface at `http://localhost:3000/companies`.

---
*Developed for the VC Intelligence Interface + Live Enrichment Assignment - 2026*
