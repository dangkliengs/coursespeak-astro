export interface Deal {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  content?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  provider: string;
  image: string;
  url: string;
  coupon?: string;
  rating?: number;
  students?: number;
  instructor?: string;
  duration?: string;
  level?: string;
}
