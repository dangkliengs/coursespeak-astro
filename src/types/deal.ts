export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  provider: string;
  image: string;
  url: string;
  rating?: number;
  students?: number;
  instructor?: string;
  duration?: string;
  level?: string;
  language?: string;
  lastUpdated?: string;
}
