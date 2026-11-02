import heroWeddingImg from '../assets/images/hero_wedding_celebration_1793613514585.jpg';
import aiEcosystemImg from '../assets/images/ai_event_ecosystem_1793613514541.jpg';
import photographerMariaImg from '../assets/images/vendor_photographer_maria_1793613516394.jpg';
import customerDiwataImg from '../assets/images/customer_diwata_portrait_1793613517155.jpg';
import floralDesignImg from '../assets/images/vendor_floral_design_1793613516461.jpg';

import { Vendor, BlogPost, Testimonial, Persona } from '../types';

export {
  heroWeddingImg,
  aiEcosystemImg,
  photographerMariaImg,
  customerDiwataImg,
  floralDesignImg,
};

export const statsData = [
  { value: '500+', label: 'Verified Vendors', description: 'Hand-picked across Greater Adelaide & Barossa' },
  { value: '2,000+', label: 'Events Planned', description: 'From intimate vineyard vows to 500-guest galas' },
  { value: '50+', label: 'Cultural Categories', description: 'Honoring Greek, Filipino, South Asian, Italian & more' },
  { value: '95%', label: 'Customer Satisfaction', description: 'Verified reviews from couples and event hosts' },
];

export const servicesData = [
  {
    id: 'vendor-matching',
    title: 'AI Vendor Matching',
    subtitle: 'Precision fit algorithm',
    description: 'Find vendors uniquely tailored to your event type, cultural customs, preferred Adelaide location, and realistic budget constraints.',
    badge: 'Intelligent Matching',
    metrics: '98% match acceptance rate',
    iconName: 'Sparkles',
  },
  {
    id: 'budget-tools',
    title: 'Budget Planning Tools',
    subtitle: 'Dynamic fiscal tracking',
    description: 'Smart budgeting calculators and spending recommendations that prevent surprise costs and distribute funds intelligently across categories.',
    badge: 'Real-time Forecasts',
    metrics: 'Saves average $4,200 AUD',
    iconName: 'Calculator',
  },
  {
    id: 'event-resources',
    title: 'Event Resources',
    subtitle: 'Curated knowledge base',
    description: 'Bespoke cultural checklists, milestone timelines, seating algorithms, and vendor brief templates tested by Adelaide planners.',
    badge: 'Tradition-Ready',
    metrics: '60+ culturally-nuanced guides',
    iconName: 'BookOpen',
  },
  {
    id: 'analytics-insights',
    title: 'Analytics Insights',
    subtitle: 'Market trend intelligence',
    description: 'Data-driven recommendations based on historical South Australian event pricing, seasonal floral availability, and peak booking dates.',
    badge: 'SA Market Trends',
    metrics: 'Refreshed weekly in Adelaide',
    iconName: 'BarChart3',
  },
];

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Tell us about your event',
    description: 'Share your celebration vision: estimated guest count, preferred South Australian backdrop (vineyard, coastline, CBD ballroom), cultural ceremonies, and initial budget parameters.',
    badgeText: '5-Minute Guided Intake',
    detail: 'Our intake captures specific ritual requirements (tea ceremonies, henna nights, nikah, barong attire protocols) so nothing is overlooked.',
  },
  {
    step: '02',
    title: 'Receive AI-powered recommendations',
    description: 'Our proprietary model matches you with available, culturally experienced Adelaide vendors, generates dynamic budget allocations, and models a milestone calendar.',
    badgeText: 'Instant Precision Match',
    detail: 'AI evaluates verified portfolio credentials, verified vendor insurance, calendar slots, and client ratings matching your exact aesthetic.',
  },
  {
    step: '03',
    title: 'Connect with verified vendors',
    description: 'Message shortlisted vendors directly, request customized proposals, schedule coffee tastings or site walk-throughs, and book securely with transparent milestone contracts.',
    badgeText: 'Seamless Onboarding',
    detail: 'All communication, contracts, deposit receipts, and revisions remain neatly centralized inside your EventSphere portal.',
  },
];

export const vendorsData: Vendor[] = [
  {
    id: 'v1',
    name: 'Maria Santos',
    businessName: 'Santos Fine Art Photography',
    category: 'Photographers',
    rating: 4.98,
    reviewCount: 84,
    location: 'Adelaide CBD & Barossa',
    startingPrice: '$2,850 AUD',
    image: photographerMariaImg,
    culturalSpecialties: ['Multicultural Weddings', 'Filipino Traditions', 'Mediterranean Celebrations'],
    description: 'Capturing candid emotion, rich film-like tones, and cultural heritage ceremonies across South Australia’s historic venues.',
    features: ['High-resolution digital gallery', 'Drone aerial permits', 'Multilingual coverage', 'Drone + 35mm film add-on'],
    featured: true,
  },
  {
    id: 'v2',
    name: 'Aria Botanical Arts',
    businessName: 'Aria & Co. Floral Design',
    category: 'Florists',
    rating: 4.95,
    reviewCount: 62,
    location: 'Adelaide Hills (Stirling)',
    startingPrice: '$1,900 AUD',
    image: floralDesignImg,
    culturalSpecialties: ['Native South Australian', 'Asian Floral Sculptures', 'European Garland Arches'],
    description: 'Bespoke sculptural botanical styling combining South Australian king proteas with delicate imported garden roses and earthy ceramics.',
    features: ['Eco-friendly foam-free design', 'On-site installation & packdown', 'Complimentary tablescape mockups'],
    featured: true,
  },
  {
    id: 'v3',
    name: 'Le Barossa & Spice',
    businessName: 'Barossa Fusion Catering Co.',
    category: 'Caterers',
    rating: 4.92,
    reviewCount: 97,
    location: 'Tanunda & Adelaide Metro',
    startingPrice: '$95 AUD / guest',
    image: heroWeddingImg,
    culturalSpecialties: ['South Asian Banquets', 'Greek Feast Tables', 'Filipino Lechon Roasts'],
    description: 'Award-winning multicultural feasts blending Barossa Valley produce and local wines with authentic family recipes and strict dietary certifications.',
    features: ['Halal, Kosher & Vegetarian certified', 'Sommelier wine pairing', 'Live cooking culinary stations'],
  },
  {
    id: 'v4',
    name: 'Elysian Occasions',
    businessName: 'Elysian Multicultural Event Planning',
    category: 'Planners',
    rating: 5.0,
    reviewCount: 51,
    location: 'North Adelaide',
    startingPrice: '$3,400 AUD',
    image: aiEcosystemImg,
    culturalSpecialties: ['Fusion Ceremonies', 'Multi-day Celebrations', 'Luxury Private Galas'],
    description: 'End-to-end luxury coordination specializing in honoring dual heritage families without stress, language barriers, or scheduling confusion.',
    features: ['Bilingual coordinator staffing', 'Vendor dispute mediation', '24/7 day-of executive control'],
    featured: true,
  },
  {
    id: 'v5',
    name: 'Lumina Beauty Studio',
    businessName: 'Lumina Bridal & Cultural Makeup',
    category: 'Makeup Artists',
    rating: 4.96,
    reviewCount: 112,
    location: 'Norwood & Mobile SA',
    startingPrice: '$180 AUD / look',
    image: customerDiwataImg,
    culturalSpecialties: ['Diverse Skin Tone Artistry', 'Waterproof 16hr Bridal', 'Bridal Dupatta / Veil Styling'],
    description: 'Specialists in luminous, skin-focused bridal makeup designed to endure warm Adelaide summers, dance floors, and emotional rituals.',
    features: ['Luxury skincare prep ritual', 'Airbrush finish standard', 'Bridal party group morning packages'],
  },
  {
    id: 'v6',
    name: 'Harmonia Cultural Specialists',
    businessName: 'Harmonia Traditional Event Producers',
    category: 'Cultural Specialists',
    rating: 4.97,
    reviewCount: 38,
    location: 'Henley Beach & State-wide',
    startingPrice: '$1,200 AUD',
    image: heroWeddingImg,
    culturalSpecialties: ['Chinese Tea Ceremonies', 'Indian Mandap & Pandit Booking', 'Lebanese Zaffe Drummers'],
    description: 'Authentic cultural consultancies and ceremonial master-of-ceremonies who preserve ancestral rituals with modern elegance.',
    features: ['Ritual prop rental inventories', 'Cultural etiquette bride/groom briefing', 'Bilingual MCs'],
  },
];

export const customerPersona: Persona = {
  id: 'customer',
  title: 'Event Customer',
  name: 'Diwata dela Cruz',
  age: 31,
  role: 'Event Host & Bride-to-be',
  location: 'Prospect, Adelaide SA',
  image: customerDiwataImg,
  goal: 'Wants convenience, transparent pricing, and vetted vendors who respect both Australian lifestyle and Filipino-Spanish cultural traditions.',
  painPoints: [
    'Overwhelmed scrolling through fragmented Instagram tags and disjointed vendor portals',
    'Uncertain whether venues permit external specialty caterers or late-night rituals',
    'Stress keeping track of multi-vendor payment milestones in spreadsheet chaos',
  ],
  eventSphereSolutions: [
    'One-click cultural filter instantly curated Adelaide vendors familiar with her ceremony rites',
    'Dynamic budget simulator rebalanced catering and floral allocations automatically',
    'Shared digital timeline ensured her Australian and overseas family remained synchronized',
  ],
  quote: "EventSphere gave me peace of mind. Finding a photographer who understood the significance of our veil and cord ceremony without needing a 2-hour explanation was priceless.",
};

export const vendorPersona: Persona = {
  id: 'vendor',
  title: 'Event Vendor',
  name: 'Maria Santos',
  role: 'Wedding Photographer & Founder',
  location: 'Norwood, Adelaide SA',
  image: photographerMariaImg,
  goal: 'Wants qualified client leads, higher business visibility across multicultural couples, and streamlined booking administration.',
  painPoints: [
    'Spending 15+ hours weekly responding to generic price inquiries that lead nowhere',
    'High marketing spend on generic wedding registries with low conversion rates',
    'Difficulty showcasing expertise in multicultural customs to international couples',
  ],
  eventSphereSolutions: [
    'AI matching connects her only with couples whose date, aesthetic, and budget match her packages',
    'Direct verified profile with customer reviews and high-resolution visual portfolio tags',
    'Built-in invoice and contract generation reduces non-shooting admin time by 60%',
  ],
  quote: "EventSphere doubled my high-ticket multicultural bookings in six months. The couples who contact me are already educated on my work and ready to confirm.",
};

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    quote: "Planning a dual Hindu-Australian wedding in the Barossa seemed impossible until we used EventSphere. The AI matched us with a caterer capable of a sacred vegetarian lunch followed by an Adelaide Hills vineyard dinner. It saved us at least 40 hours of research.",
    clientNames: 'Priya & Rohan Patel',
    role: 'Couples / Bride & Groom',
    eventDetails: '320 Guests · Barossa Valley Vows',
    rating: 5,
    highlight: 'Saved 40+ hours of vendor research',
  },
  {
    id: 't2',
    quote: "The budget forecasting tool predicted our rental and floral costs within 3% of our actual final total. We didn't get hit by a single surprise corkage or overtime fee. Every recommended vendor delivered 10/10 service.",
    clientNames: 'Elena Rossi & Marco DeLuca',
    role: 'Couple / Hosts',
    eventDetails: '180 Guests · Glenelg Beachfront Pavilion',
    rating: 5,
    highlight: 'Budget accuracy within 3% with zero surprises',
  },
  {
    id: 't3',
    quote: "Finding vendors in Adelaide who understand our traditional Filipino cord, veil, and coins ceremony was our biggest anxiety. EventSphere connected us directly to Maria Santos and our dream coordinator within 24 hours.",
    clientNames: 'Diwata & Liam Miller',
    role: 'Couple / Newlyweds',
    eventDetails: '220 Guests · Adelaide Botanic Gardens',
    rating: 5,
    highlight: 'Found culturally-vetted dream vendors in 24 hours',
  },
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'b1',
    title: 'How to Plan a Multicultural Wedding in Australia',
    category: 'Cultural Planning',
    readTime: '6 min read',
    publishedDate: 'October 2026',
    author: 'EventSphere Editorial Team',
    summary: 'A comprehensive guide to harmonizing dual traditions, managing bilingual timelines, and briefing Australian venues on sacred ceremonial protocols.',
    content: [
      'Multicultural weddings are among Australia’s most vibrant celebrations, weaving ancestral lineage, culinary legacy, and modern Australian landscapes into a deeply meaningful experience.',
      '1. Prioritize Ceremony Balance: Whether combining a morning tea ceremony with an afternoon civil exchange or an evening Sangeet with vineyard vows, design breathing space between events for your guests.',
      '2. Brief Venues on Traditional Rituals Early: Certain ceremonies involve fire (Agni in Hindu rituals), open flames, or specific confectionery setups. EventSphere helps verify venue compliance prior to deposit payments.',
      '3. Curate a Meaningful Program Guide: Guests unfamiliar with your customs appreciate brief pocket programs explaining the cultural symbolism of blessings, dances, and garment colors.',
    ],
  },
  {
    id: 'b2',
    title: 'Wedding Budget Checklist: Where to Save & Where to Splurge',
    category: 'Budgeting & Finance',
    readTime: '5 min read',
    publishedDate: 'November 2026',
    author: 'Marcus Vance, Financial Planner & Event Strategist',
    summary: 'Discover the realistic cost benchmarks for Adelaide weddings, how to avoid hidden overtime fees, and where your dollars deliver the highest emotional impact.',
    content: [
      'In South Australia, the average wedding budget ranges between $35,000 and $75,000 AUD depending on guest headcount and estate exclusivity.',
      'Where to Invest: Photography and culinary experience consistently rank as the two factors guests remember for decades. Skimping on lighting and sound frequently compromises emotional atmosphere.',
      'Where to Save: Leverage seasonal South Australian wildflowers, digital RSVP portals through EventSphere, and off-peak Friday vineyard dates which offer up to 25% lower minimum food and beverage spends.',
    ],
  },
  {
    id: 'b3',
    title: 'Best Wedding Vendors in Adelaide: Curated 2026 Guide',
    category: 'Local Spotlight',
    readTime: '7 min read',
    publishedDate: 'November 2026',
    author: 'Sophie Henderson, Adelaide Event Directory Lead',
    summary: 'From heritage stone chapels in North Adelaide to private cellar doors in McLaren Vale, meet the top-rated local artisans elevating weddings this season.',
    content: [
      'Adelaide’s intimate geography gives couples an enviable advantage: world-class wine regions, heritage parklands, and pristine coastal sunsets all within a 45-minute radius.',
      'Our 2026 editorial review spotlights leading vendors who excel in communication speed, inclusive client care, and bespoke artistic execution.',
      'Explore our vetted picks for sustainable floristry, cinematic documentary photography, and authentic Mediterranean banquet kitchens.',
    ],
  },
  {
    id: 'b4',
    title: 'AI Trends in Event Planning: The Future of Celebrations',
    category: 'Technology & Innovation',
    readTime: '4 min read',
    publishedDate: 'November 2026',
    author: 'EventSphere Product Labs',
    summary: 'How predictive modeling, automated dietary routing, and real-time vendor calendar synchronization are transforming the event industry.',
    content: [
      'Gone are the days of keeping 14 fragmented spreadsheets and losing quotes in forgotten email threads.',
      'Artificial intelligence is not replacing human warmth; it is stripping away administrative friction so couples and creators can focus on celebration and human connection.',
      'EventSphere’s latest algorithmic models forecast supply chain fluctuations for imported florals and benchmark fair Adelaide market vendor rates in real time.',
    ],
  },
];

export const adelaideRegions = [
  {
    id: 'cbd',
    name: 'Adelaide CBD & North Adelaide',
    description: 'Heritage sandstone halls, rooftop ballrooms, and botanic garden glasshouses.',
    popularVenues: ['Adelaide Botanic Gardens', 'National Wine Centre', 'Adelaide Town Hall'],
    vendorCount: 180,
  },
  {
    id: 'hills',
    name: 'Adelaide Hills & Stirling',
    description: 'Enchanted forests, rustic apple orchard barns, and cooler climate boutique wineries.',
    popularVenues: ['Mount Lofty House', 'Woodhouse Estate', 'K1 Winery by Geoff Hardy'],
    vendorCount: 145,
  },
  {
    id: 'barossa',
    name: 'Barossa Valley & Eden Valley',
    description: 'Historic vineyard estates, century-old barrel cellars, and culinary banquet halls.',
    popularVenues: ['Seppeltsfield Barossa', 'Château Tanunda', 'St Hugo Wines'],
    vendorCount: 120,
  },
  {
    id: 'coast',
    name: 'Glenelg & McLaren Vale Coast',
    description: 'Dramatic ocean horizon views, contemporary beach pavilions, and coastal olive groves.',
    popularVenues: ['The Grand Glenelg', 'Coriole Vineyards', 'Star of Greece'],
    vendorCount: 95,
  },
];
