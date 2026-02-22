export type Stage = 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Growth' | 'Late Stage';

export interface Company {
  id: string;
  name: string;
  url: string;
  description: string;
  industry: string;
  location: string;
  stage: Stage;
  fundingAmount: string;
  foundedDate: string;
  logo?: string;
  enriched?: boolean;
}

export interface Signal {
  id: string;
  type: 'hiring' | 'blog' | 'product' | 'funding' | 'other';
  title: string;
  description: string;
  date: string;
  link?: string;
}

export interface EnrichmentData {
  companyId: string;
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: {
    url: string;
    timestamp: string;
  }[];
}

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  createdAt: string;
}
