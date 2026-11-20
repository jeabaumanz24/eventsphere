import {
  christeningTableImg,
  communityFestivalImg,
  culturalFeastImg,
  diwaliDecorImg,
  eidFeastImg,
  elopementHillsImg,
  heritageMarqueeImg,
  heroWeddingImg,
  lunarNewYearImg,
  milestoneBirthdayImg,
  proposalFleurieuImg,
} from './mockData';
import {
  getEssentialCategoriesForEvent,
  getNiceToHaveCategoriesForEvent,
} from './eventEssentialCategories';
import { EventTypeTag, VendorCategory } from '../types';
import { EVENT_SLUG_MAP, VENDOR_CATEGORY_SLUGS } from '../utils/plannerMatching';
import { SITE_BASE_PATH, SITE_ORIGIN } from '../utils/navigation';

export interface ChecklistVendorItem {
  category: VendorCategory;
  categorySlug: string;
  label: string;
  note: string;
}

export interface CelebrationChecklistConfig {
  eventType: EventTypeTag;
  slug: string;
  displayName: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  tileDescription: string;
  image: string;
  imageAlt: string;
  intro: string;
  essentials: ChecklistVendorItem[];
  niceToHave: ChecklistVendorItem[];
  typicalLeadTimes: string[];
  practicalTip: string;
  relatedSlugs: string[];
}

export const CHECKLISTS_HUB_SEO = {
  urlPath: `${SITE_BASE_PATH}checklists/`,
  canonicalUrl: `${SITE_ORIGIN}${SITE_BASE_PATH}checklists/`,
  ogImage: `${SITE_ORIGIN}${SITE_BASE_PATH}assets/og/eventsphere-checklists.jpg`,
  title: 'Celebration Vendor Checklists | EventSphere',
  description:
    'Browse vendor checklists for 11 celebrations in Adelaide. See which suppliers to book first, typical lead times, and direct marketplace links.',
};

interface CategoryCopyOverride {
  label?: string;
  note?: string;
}

const DEFAULT_CATEGORY_COPY: Record<VendorCategory, { label: string; note: string }> = {
  Photographers: {
    label: 'Photographer',
    note: 'Captures candid family moments, ceremony highlights, and formal portraits.',
  },
  Caterers: {
    label: 'Caterer',
    note: 'Plans menus, dietary needs, and serving style suited to your guest list.',
  },
  'Venues & Marquees': {
    label: 'Venue or Marquee',
    note: 'Confirms guest capacity, layout, kitchen access, and wet-weather plans.',
  },
  'Cultural Specialists': {
    label: 'Celebrant or Cultural Specialist',
    note: 'Guides vows, legal paperwork, and any family or ceremonial customs.',
  },
  'Proposal & Elopement': {
    label: 'Proposal Specialist',
    note: 'Coordinates discreet location timing, styling setup, and surprise logistics.',
  },
  Florists: {
    label: 'Florist',
    note: 'Supplies seasonal blooms, bouquets, garlands, and ceremony or table arrangements.',
  },
  'Decor & Styling': {
    label: 'Decor & Styling',
    note: 'Shapes table settings, lighting, signage, and focal backdrops for the space.',
  },
  'Makeup Artists': {
    label: 'Makeup Artist',
    note: 'Provides long-wear hair and makeup suited to indoor and outdoor lighting.',
  },
  'Entertainment & DJs': {
    label: 'Entertainment & DJ',
    note: 'Manages music, microphones, live performances, and celebration pacing.',
  },
  Planners: {
    label: 'Event Planner',
    note: 'Coordinates supplier run-sheets, venue bump-in, and on-the-day timing.',
  },
};

function buildVendorItems(
  categories: VendorCategory[],
  overrides: Partial<Record<VendorCategory, CategoryCopyOverride>> = {}
): ChecklistVendorItem[] {
  return categories.map((category) => {
    const defaults = DEFAULT_CATEGORY_COPY[category];
    const override = overrides[category];
    return {
      category,
      categorySlug: VENDOR_CATEGORY_SLUGS[category],
      label: override?.label ?? defaults.label,
      note: override?.note ?? defaults.note,
    };
  });
}

function createChecklist(params: {
  eventType: EventTypeTag;
  displayName: string;
  seoTitle: string;
  metaDescription: string;
  tileDescription: string;
  image: string;
  imageAlt: string;
  intro: string;
  categoryOverrides?: Partial<Record<VendorCategory, CategoryCopyOverride>>;
  typicalLeadTimes: string[];
  practicalTip: string;
  relatedSlugs: string[];
}): CelebrationChecklistConfig {
  const slug = EVENT_SLUG_MAP[params.eventType];
  const essentialCats = getEssentialCategoriesForEvent(params.eventType);
  const niceToHaveCats = getNiceToHaveCategoriesForEvent(params.eventType);

  return {
    eventType: params.eventType,
    slug,
    displayName: params.displayName,
    h1: `${params.displayName} Vendor Checklist`,
    seoTitle: params.seoTitle,
    metaDescription: params.metaDescription,
    tileDescription: params.tileDescription,
    image: params.image,
    imageAlt: params.imageAlt,
    intro: params.intro,
    essentials: buildVendorItems(essentialCats, params.categoryOverrides),
    niceToHave: buildVendorItems(niceToHaveCats, params.categoryOverrides),
    typicalLeadTimes: params.typicalLeadTimes,
    practicalTip: params.practicalTip,
    relatedSlugs: params.relatedSlugs,
  };
}

export const CELEBRATION_CHECKLISTS: CelebrationChecklistConfig[] = [
  createChecklist({
    eventType: 'Weddings',
    displayName: 'Weddings',
    seoTitle: 'Wedding Vendor Checklist | EventSphere',
    metaDescription:
      'Plan your Adelaide wedding with our vendor checklist covering photographers, caterers, venues, celebrants, florists, makeup artists, and DJs.',
    tileDescription: 'Multi-ceremony or single-day weddings across Adelaide and regional SA.',
    image: heroWeddingImg,
    imageAlt:
      'Smiling newlywed couple walking together in warm afternoon sunlight during an Adelaide wedding reception',
    intro:
      'Weddings bring together several suppliers who work closely on the same schedule. Locking in your venue, food, photography, and ceremony lead early gives every other booking a clear date and location to work around.',
    categoryOverrides: {
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Sets your celebration date, guest capacity, ceremony space, and catering rules.',
      },
      'Cultural Specialists': {
        label: 'Celebrant or Cultural Specialist',
        note: 'Handles legal vows, bilingual guidance, or ceremonial customs alongside family elders.',
      },
      'Entertainment & DJs': {
        label: 'DJ or Live Music',
        note: 'Guides grand entrances, speeches audio, and evening dance-floor energy.',
      },
    },
    typicalLeadTimes: [
      'Venues and marquees are typically booked 9 to 18 months ahead for peak spring and autumn weekends.',
      'Photographers, caterers, and celebrants are typically secured 6 to 12 months before the wedding.',
      'Florists, makeup artists, and DJs are typically confirmed 4 to 8 months out once your ceremony timing is set.',
    ],
    practicalTip:
      'Before paying a venue deposit, confirm whether external catering, ceremonial elements, or late music curfews are permitted. Ask each vendor about experience with your traditions and share a draft timeline so ceremony transitions feel unhurried.',
    relatedSlugs: ['engagements-and-proposals', 'elopements', 'milestone-birthdays'],
  }),
  createChecklist({
    eventType: 'Engagements & Proposals',
    displayName: 'Engagements and Proposals',
    seoTitle: 'Engagement & Proposal Vendor Checklist | EventSphere',
    metaDescription:
      'Organise your Adelaide engagement or proposal with our vendor checklist for photographers, proposal specialists, florists, caterers, and styling.',
    tileDescription: 'Surprise proposals, scenic coastal setups, and engagement gatherings.',
    image: proposalFleurieuImg,
    imageAlt:
      'Romantic sunset proposal setup overlooking the Fleurieu coast in South Australia',
    intro:
      'Whether you are planning a quiet surprise proposal or a lively engagement party with both families, timing and secrecy matter most. Start with the people who capture the moment and manage the setup before adding styling and refreshments.',
    categoryOverrides: {
      'Proposal & Elopement': {
        label: 'Proposal Specialist',
        note: 'Plans discreet location scouting, setup timing, and backup plans for coastal or hills spots.',
      },
      Florists: {
        label: 'Florist',
        note: 'Prepares a fresh bouquet, aisle petals, or table florals ready right before arrival.',
      },
      'Decor & Styling': {
        label: 'Decor & Styling',
        note: 'Creates intimate lighting, picnic rugs, signage, or an engagement dinner tablescape.',
      },
    },
    typicalLeadTimes: [
      'Photographers and proposal specialists are typically booked 4 to 10 weeks ahead, or earlier for summer sunset weekends.',
      'Florists, styling teams, and caterers are typically arranged 3 to 6 weeks before the date.',
      'Hair and makeup bookings are typically lined up 2 to 4 weeks ahead for engagement portraits or parties.',
    ],
    practicalTip:
      'Check sunset times and local council rules for public parks, beaches, or lookouts before choosing your spot. If family traditions or an engagement blessing are part of the gathering, ask each vendor about experience with your traditions early so setup flows naturally.',
    relatedSlugs: ['elopements', 'weddings', 'milestone-birthdays'],
  }),
  createChecklist({
    eventType: 'Elopements',
    displayName: 'Elopements',
    seoTitle: 'Elopement Vendor Checklist | EventSphere',
    metaDescription:
      'Use our Adelaide elopement vendor checklist to book your celebrant and photographer first, plus optional florists and intimate venues.',
    tileDescription: 'Intimate vows for two or a small circle in the Hills, vines, or coast.',
    image: elopementHillsImg,
    imageAlt:
      'Intimate elopement ceremony surrounded by eucalyptus trees in the Adelaide Hills',
    intro:
      'Elopements keep the supplier list intentionally small so the day feels personal and relaxed. Once your legal paperwork and photography are covered, you can choose whether to add fresh florals or a private venue for a celebratory meal.',
    categoryOverrides: {
      'Cultural Specialists': {
        label: 'Celebrant',
        note: 'Completes Australian legal marriage notice paperwork and crafts an intimate vow ceremony.',
      },
      'Venues & Marquees': {
        label: 'Intimate Venue',
        note: 'Offers a private garden, vineyard nook, or dining room if you prefer a booked space over public grounds.',
      },
    },
    typicalLeadTimes: [
      'Celebrants are typically booked at least 6 to 8 weeks ahead so Australian Notice of Intended Marriage lodgement is comfortably met.',
      'Photographers are typically secured 2 to 4 months ahead for popular weekday or golden-hour dates.',
      'Florists and private dining venues are typically confirmed 3 to 6 weeks prior.',
    ],
    practicalTip:
      'Mid-week dates in the Adelaide Hills, Barossa, or Fleurieu Peninsula typically give you quieter scenery and more supplier flexibility. Share any family readings or cultural gestures you want to include and ask each vendor about experience with your traditions.',
    relatedSlugs: ['engagements-and-proposals', 'weddings', 'christenings-and-baby-showers'],
  }),
  createChecklist({
    eventType: 'Milestone Birthdays',
    displayName: 'Milestone Birthdays',
    seoTitle: 'Milestone Birthday Vendor Checklist | EventSphere',
    metaDescription:
      'Plan a milestone birthday in Adelaide with our vendor checklist for caterers, venues, decor, entertainment, and photography, plus typical lead times.',
    tileDescription: '18ths, 21sts, 30ths, 50ths, 60ths, and multi-generational family dinners.',
    image: milestoneBirthdayImg,
    imageAlt:
      'Friends and family raising a toast around a candlelit dinner table for an Adelaide milestone birthday',
    intro:
      'Milestone birthdays often bring several generations together in one room, from toddlers to grandparents. Confirming a comfortable venue and generous catering first ensures everyone is well hosted before layering in decor, music, and photography.',
    categoryOverrides: {
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Provides accessible seating, room for speeches, and suitable kitchen or bar facilities.',
      },
      'Entertainment & DJs': {
        label: 'Entertainment',
        note: 'Sets background playlists for dinner and lively music or speeches audio later in the night.',
      },
    },
    typicalLeadTimes: [
      'Venues and marquee hire are typically booked 3 to 6 months ahead for Saturday evenings.',
      'Caterers are typically locked in 2 to 4 months out once you have a rough guest range.',
      'Decor stylists, DJs, and photographers are typically booked 4 to 10 weeks before the party.',
    ],
    practicalTip:
      'Check venue accessibility, parking, and noise levels if older relatives or young children are attending. When honouring family dishes, toasts, or birthday customs, ask each vendor about experience with your traditions and confirm dietary labelling upfront.',
    relatedSlugs: ['christenings-and-baby-showers', 'graduations', 'eid'],
  }),
  createChecklist({
    eventType: 'Diwali & Festival of Lights',
    displayName: 'Diwali and Festival of Lights',
    seoTitle: 'Diwali Vendor Checklist | EventSphere',
    metaDescription:
      'Prepare your Adelaide Diwali celebration with our vendor checklist covering caterers, decor, entertainment, venues, and photographers.',
    tileDescription: 'Warm evening feasts, glowing lighting, music, and community nights.',
    image: diwaliDecorImg,
    imageAlt:
      'Vibrant marigold florals and brass lamps arranged for a Diwali celebration in Adelaide',
    intro:
      'Diwali celebrations shine through shared food, luminous styling, and joyful music or dance. Because many families and community groups host events across the same festive week, booking catering, decor, and entertainment early avoids last-minute compromises.',
    categoryOverrides: {
      'Decor & Styling': {
        label: 'Decor & Styling',
        note: 'Designs entrance arrangements, warm lighting, backdrops, and flame-safe lamp displays.',
      },
      'Entertainment & DJs': {
        label: 'Entertainment',
        note: 'Covers live percussion, cultural performances, sound systems, and festive dance sets.',
      },
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Helpful for larger gatherings needing dry-hire halls, dance floors, or outdoor lighting space.',
      },
    },
    typicalLeadTimes: [
      'Caterers and entertainment groups are typically booked 2 to 4 months ahead of the festival week.',
      'Decor and lighting teams are typically reserved 6 to 10 weeks out as festive stock fills quickly.',
      'Community halls, marquees, and photographers are typically confirmed 2 to 4 months before the event.',
    ],
    practicalTip:
      'Confirm venue rules around open flames, incense, and external vegetarian or sweet-table catering early in your planning. Ask each vendor about experience with your traditions so prayer timings, food service, and music cues run smoothly.',
    relatedSlugs: ['lunar-new-year', 'eid', 'community-festivals'],
  }),
  createChecklist({
    eventType: 'Lunar New Year',
    displayName: 'Lunar New Year',
    seoTitle: 'Lunar New Year Vendor Checklist | EventSphere',
    metaDescription:
      'Organise an Adelaide Lunar New Year gathering with our vendor checklist for caterers, festive decor, entertainment, venues, and photographers.',
    tileDescription: 'Family reunion banquets, festive lantern styling, and cultural performances.',
    image: lunarNewYearImg,
    imageAlt:
      'Festive red lanterns and round family banquet table set for a Lunar New Year gathering in Adelaide',
    intro:
      'Lunar New Year events centre on abundant shared banquets, festive visual atmosphere, and lively performances that welcome good fortune. Securing food, styling, and entertainment first keeps your reunion or community celebration running smoothly during peak seasonal demand.',
    categoryOverrides: {
      'Decor & Styling': {
        label: 'Decor & Styling',
        note: 'Arranges lanterns, auspicious floral accents, welcome signage, and banquet table styling.',
      },
      'Entertainment & DJs': {
        label: 'Entertainment',
        note: 'Provides traditional performances, live musicians, or bilingual hosting and sound.',
      },
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Suits larger reunion banquets needing round-table layouts and clear floor space for performances.',
      },
    },
    typicalLeadTimes: [
      'Banquet caterers and traditional performance troupes are typically booked 2 to 4 months ahead of the New Year fortnight.',
      'Festive decor and styling suppliers are typically secured 6 to 10 weeks prior.',
      'Function venues and photographers are typically confirmed 2 to 3 months in advance.',
    ],
    practicalTip:
      'If you are hosting live performances or multi-course shared banquets, check ceiling clearance, sound rules, and kitchen prep space with your venue first. Ask each vendor about experience with your traditions so seating order and meal pacing suit your guests.',
    relatedSlugs: ['diwali-and-festival-of-lights', 'community-festivals', 'milestone-birthdays'],
  }),
  createChecklist({
    eventType: 'Eid',
    displayName: 'Eid',
    seoTitle: 'Eid Vendor Checklist | EventSphere',
    metaDescription:
      'Plan an Adelaide Eid gathering with our vendor checklist covering caterers and venues first, plus optional decor and photography.',
    tileDescription: 'Family feasts, community lunches, and warm celebratory gatherings.',
    image: eidFeastImg,
    imageAlt:
      'Warm candlelit celebratory table laid with shared platters for an Adelaide Eid family feast',
    intro:
      'Eid gatherings bring extended family and neighbours together around generous hospitality and shared meals. Confirming a reliable caterer and welcoming venue first makes it easy to flex around moon-sighting dates and guest numbers.',
    categoryOverrides: {
      Caterers: {
        label: 'Caterer',
        note: 'Delivers halal-certified menus, shared feast platters, and dessert or tea stations.',
      },
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Offers family-friendly seating, quiet prayer space if needed, and external catering access.',
      },
    },
    typicalLeadTimes: [
      'Halal caterers and family venues are typically booked 6 to 12 weeks ahead, especially for weekend Eid receptions.',
      'Decor stylists and photographers are typically confirmed 4 to 8 weeks before the celebration.',
    ],
    practicalTip:
      'Discuss date flexibility around lunar-calendar confirmation with your caterer and venue before signing, and confirm halal preparation practices clearly. Ask each vendor about experience with your traditions, including family seating preferences or alcohol-free service.',
    relatedSlugs: ['diwali-and-festival-of-lights', 'milestone-birthdays', 'christenings-and-baby-showers'],
  }),
  createChecklist({
    eventType: 'Christenings & Baby Showers',
    displayName: 'Christenings and Baby Showers',
    seoTitle: 'Christening & Baby Shower Vendor Checklist | EventSphere',
    metaDescription:
      'Plan an Adelaide christening or baby shower with our vendor checklist for caterers, venues, photographers, and optional styling.',
    tileDescription: 'Daytime family luncheons, naming celebrations, and baby welcome teas.',
    image: christeningTableImg,
    imageAlt:
      'Soft pastel florals and keepsake luncheon table styled for an Adelaide christening celebration',
    intro:
      'Christenings, naming ceremonies, and baby showers are usually warm daytime gatherings with young children and extended family. Securing catering, a comfortable venue, and a gentle documentary photographer first lets hosts stay present with loved ones.',
    categoryOverrides: {
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Provides pram access, shaded outdoor or indoor seating, and easy midday parking.',
      },
      'Decor & Styling': {
        label: 'Decor & Styling',
        note: 'Adds welcome signage, soft table florals, cake plinths, and favour displays.',
      },
    },
    typicalLeadTimes: [
      'Daytime venues and private dining spaces are typically booked 2 to 4 months ahead for Sunday lunches.',
      'Caterers and photographers are typically reserved 6 to 10 weeks before the event.',
      'Table styling and backdrop hire are typically organised 4 to 6 weeks prior.',
    ],
    practicalTip:
      'Schedule photography and lunch service around feeding and nap routines, and check that the venue has high chairs and quiet change facilities. Ask each vendor about experience with your traditions if you are moving from a morning ceremony straight into a family reception.',
    relatedSlugs: ['milestone-birthdays', 'elopements', 'graduations'],
  }),
  createChecklist({
    eventType: 'Graduations',
    displayName: 'Graduations',
    seoTitle: 'Graduation Vendor Checklist | EventSphere',
    metaDescription:
      'Coordinate an Adelaide graduation celebration with our vendor checklist covering venues, caterers, photographers, and optional decor.',
    tileDescription: 'University milestone dinners, family lunches, and portrait sessions.',
    image: culturalFeastImg,
    imageAlt:
      'Celebratory shared lunch spread set for an Adelaide graduation family gathering',
    intro:
      'Graduation ceremonies cluster around the same university weeks each autumn and spring, so local dining spaces and photographers book out quickly. Locking in your venue, food, and photographer early leaves plenty of breathing room for academic gown portraits.',
    categoryOverrides: {
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Conveniently located near the ceremony precinct or family suburbs for easy group travel.',
      },
      Photographers: {
        label: 'Photographer',
        note: 'Captures campus or garden portraits in regalia plus candid dinner celebrations.',
      },
    },
    typicalLeadTimes: [
      'Private rooms and family venues are typically booked 6 to 12 weeks ahead once ceremony dates are released.',
      'Caterers and portrait photographers are typically secured 4 to 8 weeks before graduation week.',
      'Custom signage or table decor is typically arranged 2 to 4 weeks prior.',
    ],
    practicalTip:
      'Allow buffer time between ceremony exit, gown return deadlines, and dinner seating so portraits feel relaxed. If family members are travelling from interstate or overseas, ask each vendor about experience with your traditions and preferred menu styles.',
    relatedSlugs: ['milestone-birthdays', 'christenings-and-baby-showers', 'corporate-events'],
  }),
  createChecklist({
    eventType: 'Community Festivals',
    displayName: 'Community Festivals',
    seoTitle: 'Community Festival Vendor Checklist | EventSphere',
    metaDescription:
      'Plan an Adelaide community festival with our vendor checklist for entertainment, venues or marquees, caterers, and optional decor.',
    tileDescription: 'Cultural showcases, parklands fairs, and neighbourhood celebrations.',
    image: communityFestivalImg,
    imageAlt:
      'Community hosts and cultural performers gathered under string lights at an Adelaide festival showcase',
    intro:
      'Community festivals rely on strong staging, weather-ready spaces, and high-capacity food service to keep large crowds comfortable and engaged. Securing entertainment, venue or marquee infrastructure, and catering first establishes your core site plan.',
    categoryOverrides: {
      'Entertainment & DJs': {
        label: 'Entertainment & Stage Audio',
        note: 'Coordinates cultural troupes, MCs, live bands, and outdoor public-address sound.',
      },
      'Venues & Marquees': {
        label: 'Venue or Marquee',
        note: 'Provides community halls, parklands marquees, shade structures, and power access.',
      },
      Caterers: {
        label: 'Caterer',
        note: 'Handles high-volume service, food-safety compliance, and diverse dietary stalls.',
      },
    },
    typicalLeadTimes: [
      'Venues, marquees, and council-permitted park sites are typically arranged 4 to 9 months ahead.',
      'Performers, stage audio teams, and high-volume caterers are typically booked 3 to 6 months out.',
      'Signage, entryway decor, and zone styling are typically finalised 6 to 10 weeks before festival day.',
    ],
    practicalTip:
      'Confirm public liability insurance certificates, council permit deadlines, and power distribution maps with your venue or marquee supplier early. Ask each vendor about experience with your traditions and high-foot-traffic community crowds.',
    relatedSlugs: ['diwali-and-festival-of-lights', 'lunar-new-year', 'corporate-events'],
  }),
  createChecklist({
    eventType: 'Corporate Events',
    displayName: 'Corporate Events',
    seoTitle: 'Corporate Event Vendor Checklist | EventSphere',
    metaDescription:
      'Organise an Adelaide corporate event with our vendor checklist covering venues, caterers, entertainment or AV, and optional photography.',
    tileDescription: 'Workplace galas, cultural recognition dinners, and team launches.',
    image: heritageMarqueeImg,
    imageAlt:
      'Contemporary Adelaide pavilion styled with banquet tables and lighting for a corporate dinner',
    intro:
      'Corporate events run on punctual schedules, clear presentations, and inclusive hospitality for diverse teams and clients. Confirming your venue, catering, and AV or entertainment setup first keeps speeches, networking, and dining on track.',
    categoryOverrides: {
      'Venues & Marquees': {
        label: 'Venue',
        note: 'Supports boardroom, theatre, or gala seating with reliable accessibility and transport links.',
      },
      'Entertainment & DJs': {
        label: 'Entertainment or AV',
        note: 'Delivers presentation microphones, background music, lighting, and evening entertainment.',
      },
      Photographers: {
        label: 'Photographer',
        note: 'Documents keynote speakers, award moments, and natural networking coverage for internal comms.',
      },
    },
    typicalLeadTimes: [
      'Function venues and city pavilions are typically booked 3 to 6 months ahead, especially for end-of-year functions.',
      'Caterers and AV or entertainment teams are typically confirmed 6 to 12 weeks before the event.',
      'Event photographers are typically booked 4 to 8 weeks out with a clear shot brief.',
    ],
    practicalTip:
      'Collect dietary requirements and accessibility notes on your RSVP form so your caterer and venue can plan seamlessly. If your workplace is hosting a cultural recognition evening, ask each vendor about experience with your traditions and inclusive menu labelling.',
    relatedSlugs: ['community-festivals', 'graduations', 'milestone-birthdays'],
  }),
];

export function getChecklistBySlug(slug: string | null | undefined): CelebrationChecklistConfig | null {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  return CELEBRATION_CHECKLISTS.find((item) => item.slug === normalized) ?? null;
}

export function getChecklistAbsoluteUrl(slug: string): string {
  return `${SITE_ORIGIN}${SITE_BASE_PATH}checklists/${slug}/`;
}
