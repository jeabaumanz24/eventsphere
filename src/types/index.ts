export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  category: 'Photographers' | 'Planners' | 'Caterers' | 'Florists' | 'Makeup Artists' | 'Cultural Specialists';
  rating: number;
  reviewCount: number;
  location: string;
  startingPrice: string;
  image: string;
  culturalSpecialties: string[];
  description: string;
  features: string[];
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  content: string[];
  author: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientNames: string;
  role: string;
  eventDetails: string;
  rating: number;
  highlight: string;
}

export interface Persona {
  id: 'customer' | 'vendor';
  title: string;
  name: string;
  age?: number;
  role: string;
  location: string;
  image: string;
  goal: string;
  painPoints: string[];
  eventSphereSolutions: string[];
  quote: string;
}
