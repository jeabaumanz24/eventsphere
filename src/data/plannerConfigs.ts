import { EventTypeTag } from '../types';

export type PlannerCulturalTradition =
  | 'None'
  | 'Filipino-Australian Fusion'
  | 'Greek'
  | 'Indian'
  | 'Chinese'
  | 'Middle Eastern'
  | 'Pacific Islander'
  | 'Other';

export const PLANNER_EVENT_TYPES: EventTypeTag[] = [
  'Weddings',
  'Engagements & Proposals',
  'Elopements',
  'Milestone Birthdays',
  'Diwali & Festival of Lights',
  'Lunar New Year',
  'Eid',
  'Christenings & Baby Showers',
  'Graduations',
  'Community Festivals',
  'Corporate Events',
];

export const PLANNER_CULTURAL_TRADITIONS: PlannerCulturalTradition[] = [
  'None',
  'Filipino-Australian Fusion',
  'Greek',
  'Indian',
  'Chinese',
  'Middle Eastern',
  'Pacific Islander',
  'Other',
];

export interface BudgetAllocationItem {
  key: string;
  label: string;
  pct: number;
  icon: string;
  sampleNote: string;
}

export interface TimelineMilestoneTemplate {
  id: string;
  serviceId: 'venue' | 'catering' | 'styling' | 'entertainment' | 'photo' | 'logistics';
  serviceLabel: string;
  leadDays: number;
  leadLabel: string;
  title: string;
  description: string;
  isCritical?: boolean;
  adelaideTip?: string;
  dayOfTime: string;
}

export interface CulturalLineItem {
  title: string;
  estimateRange: string;
  detail: string;
}

export interface CulturalAdjustment {
  budgetLineItems: CulturalLineItem[];
  milestone: TimelineMilestoneTemplate;
  insightTitle: string;
  insightBody: string;
}

export interface PlannerEventConfig {
  eventType: EventTypeTag;
  defaultBudget: number;
  defaultGuests: number;
  defaultLeadDays: number;
  saAveragePerGuest: number;
  allocations: BudgetAllocationItem[];
  milestones: TimelineMilestoneTemplate[];
  insightCostTitle: string;
  insightCostBody: string;
  insightBaselineTimingTitle: string;
  insightBaselineTimingBody: string;
  buildPrimaryRecommendation: (
    budget: number,
    guests: number,
    tradition: PlannerCulturalTradition
  ) => string;
}

const isWeddingLike = (t: EventTypeTag) => t === 'Weddings' || t === 'Elopements';

export const PLANNER_EVENT_CONFIGS: Record<EventTypeTag, PlannerEventConfig> = {
  Weddings: {
    eventType: 'Weddings',
    defaultBudget: 42000,
    defaultGuests: 160,
    defaultLeadDays: 270,
    saAveragePerGuest: 285,
    allocations: [
      { key: 'venue', label: 'Venue, Furniture & Estate Hire', pct: 0.26, icon: '🏛️', sampleNote: 'Ceremony lawn, wet-weather marquee & reception hall' },
      { key: 'catering', label: 'Banquet Catering & Beverages', pct: 0.34, icon: '🍽️', sampleNote: 'Multi-course seated dinner, dietary plates & SA wines' },
      { key: 'photo', label: 'Photography & Documentary Film', pct: 0.12, icon: '📷', sampleNote: '8–10 hr full coverage from morning prep to reception' },
      { key: 'floral', label: 'Ceremony Arch, Florals & Tablescape', pct: 0.12, icon: '💐', sampleNote: 'Seasonal Adelaide proteas, foliage & candle styling' },
      { key: 'entertainment', label: 'Celebrant, MC, Music & Attire Prep', pct: 0.09, icon: '🎶', sampleNote: 'Registered celebrant, bilingual MC, DJ & hair/makeup' },
      { key: 'buffer', label: 'Overtime & Contingency Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Sample reserve for guest add-ons or late pack-down' },
    ],
    milestones: [
      {
        id: 'wed-venue',
        serviceId: 'venue',
        serviceLabel: 'Venue & Estate',
        leadDays: 300,
        leadLabel: '10 months before',
        title: 'Lock Ceremony Lawn & Reception Venue',
        description: 'Confirm wet-weather pavilion access, external caterer rules, and acoustic curfews.',
        isCritical: true,
        adelaideTip: 'Adelaide Hills and Barossa estates book peak Oct–Apr Saturdays up to 12 months ahead.',
        dayOfTime: '08:30 AM',
      },
      {
        id: 'wed-photo',
        serviceId: 'photo',
        serviceLabel: 'Photo & Film',
        leadDays: 240,
        leadLabel: '8 months before',
        title: 'Book Photographer & Videographer',
        description: 'Secure full-day documentary coverage and agree on portrait travel windows.',
        isCritical: true,
        adelaideTip: 'Share natural light windows and family group portrait lists 4 weeks ahead.',
        dayOfTime: '10:00 AM',
      },
      {
        id: 'wed-catering',
        serviceId: 'catering',
        serviceLabel: 'Banquet Catering',
        leadDays: 180,
        leadLabel: '6 months before',
        title: 'Menu Tasting & Dietary Planning',
        description: 'Finalise seated/shared course counts, Halal/vegetarian plates, and beverage pairings.',
        isCritical: true,
        adelaideTip: 'Local Barossa and McLaren Vale wines often pair neatly with venue BYO corkage options.',
        dayOfTime: '06:30 PM',
      },
      {
        id: 'wed-styling',
        serviceId: 'styling',
        serviceLabel: 'Florals & Styling',
        leadDays: 120,
        leadLabel: '4 months before',
        title: 'Confirm Ceremony Arch & Table Styling',
        description: 'Approve seasonal floral palette, linen swatches, and ceremony seating chart.',
        adelaideTip: 'Native South Australian king proteas and eucalyptus cut air-freight floral premiums.',
        dayOfTime: '11:30 AM',
      },
      {
        id: 'wed-music',
        serviceId: 'entertainment',
        serviceLabel: 'Celebrant & Music',
        leadDays: 90,
        leadLabel: '3 months before',
        title: 'Lodgement of Legal Notice (NOIM) & MC Brief',
        description: 'Submit Notice of Intended Marriage (minimum 1 month prior) and align entrance music cues.',
        isCritical: true,
        adelaideTip: 'Australian law requires the NOIM to be lodged at least 1 calendar month before ceremony day.',
        dayOfTime: '03:00 PM',
      },
      {
        id: 'wed-final',
        serviceId: 'logistics',
        serviceLabel: 'Run-Sheet & Logistics',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Final Headcount, Seating Chart & Vendor Run-Sheet',
        description: 'Distribute bump-in times, dietary roster, and emergency contact sheet to all vendors.',
        adelaideTip: 'Add 45 minutes of transition buffer between ceremony and reception photos.',
        dayOfTime: '05:00 PM',
      },
      {
        id: 'wed-day',
        serviceId: 'entertainment',
        serviceLabel: 'Ceremony & Reception',
        leadDays: 0,
        leadLabel: 'Wedding Day',
        title: 'Ceremony Exchange, Portraits & Evening Banquet',
        description: 'Coordinate family portraits, reception entrance, speeches, and dance floor transitions.',
        dayOfTime: '03:30 PM',
      },
    ],
    insightCostTitle: 'Dry-Hire & Friday Date Savings (Sample Estimate)',
    insightCostBody:
      'Sample data across Adelaide venues shows Friday ceremonies and dry-hire stone halls paired with external caterers frequently trim total venue/hospitality outlay by 18%–25% compared to peak Saturday estate minimums.',
    insightBaselineTimingTitle: 'Buffer Between Ceremony & Reception',
    insightBaselineTimingBody:
      'Allowing 45–60 minutes between ceremony conclusion and dinner seating reduces photography rush and helps avoid late-night venue overtime fees.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-guest Adelaide wedding (${tradition === 'None' ? 'general format' : tradition}): at $${budget.toLocaleString()} AUD, prioritising venue + catering (~60% combined) early preserves room for documentary photography and wet-weather contingencies.`,
  },

  'Engagements & Proposals': {
    eventType: 'Engagements & Proposals',
    defaultBudget: 4500,
    defaultGuests: 24,
    defaultLeadDays: 42,
    saAveragePerGuest: 205,
    allocations: [
      { key: 'venue', label: 'Scenic Spot Permit / Private Dining', pct: 0.24, icon: '🌅', sampleNote: 'Fleurieu cliff permit, rooftop terrace, or cellar dining room' },
      { key: 'catering', label: 'Grazing Menu, Cake & Toast Drinks', pct: 0.28, icon: '🥂', sampleNote: 'Shared platters, Champagne/zero-proof toast & desserts' },
      { key: 'photo', label: 'Candid / Undercover Photography', pct: 0.22, icon: '📷', sampleNote: 'Secret proposal capture + post-yes family/couple portraits' },
      { key: 'decor', label: 'Picnic, Candlelight & Floral Styling', pct: 0.14, icon: '🕯️', sampleNote: 'Low timber tables, cushions, LED lanterns & floral urns' },
      { key: 'entertainment', label: 'Acoustic Musician & Printed Signage', pct: 0.05, icon: '🎸', sampleNote: 'Solo acoustic guitarist/violinist & welcome easel' },
      { key: 'buffer', label: 'Coastal Weather Plan-B Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Reserve for indoor conservatory pivot in windy weather' },
    ],
    milestones: [
      {
        id: 'prop-spot',
        serviceId: 'venue',
        serviceLabel: 'Location & Permits',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Choose Coastal or Winery Location & Check Permits',
        description: 'Confirm South Australian council foreshore rules or reserve a private cellar-door courtyard.',
        isCritical: true,
        adelaideTip: 'Port Willunga, Hallett Cove, and Botanic Garden lawns require permit clearance for styled setups.',
        dayOfTime: '02:00 PM',
      },
      {
        id: 'prop-photo',
        serviceId: 'photo',
        serviceLabel: 'Proposal Photo',
        leadDays: 35,
        leadLabel: '5 weeks before',
        title: 'Book Candid / Undercover Photographer',
        description: 'Coordinate telephoto hiding angles, golden-hour timing, and celebration toast shots.',
        isCritical: true,
        adelaideTip: 'Schedule 35 minutes before coastal sunset for clean warm light without harsh glare.',
        dayOfTime: '04:45 PM',
      },
      {
        id: 'prop-style',
        serviceId: 'styling',
        serviceLabel: 'Picnic & Florals',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Finalise Picnic Styling, Florals & Plan-B Conservatory',
        description: 'Select rug palette, LED candlelight, and an indoor cellar wet-weather backup.',
        adelaideTip: 'Weighted cushions and enclosed LED hurricanes prevent sea-breeze blowouts along Glenelg & Fleurieu.',
        dayOfTime: '03:30 PM',
      },
      {
        id: 'prop-cater',
        serviceId: 'catering',
        serviceLabel: 'Celebration Dining',
        leadDays: 14,
        leadLabel: '2 weeks before',
        title: 'Confirm Surprise Family Dinner or Grazing Boxes',
        description: 'Lock dietary notes and celebration drinks if family or friends are joining after the reveal.',
        dayOfTime: '06:30 PM',
      },
      {
        id: 'prop-cue',
        serviceId: 'logistics',
        serviceLabel: 'Cue & Timing',
        leadDays: 3,
        leadLabel: '3 days before',
        title: 'Rehearse Walk-Up Path & Signal Cue',
        description: 'Share live location pin, parking notes, and exact hand-signal cue with photographer.',
        dayOfTime: '05:15 PM',
      },
      {
        id: 'prop-day',
        serviceId: 'entertainment',
        serviceLabel: 'The Moment & Toast',
        leadDays: 0,
        leadLabel: 'Celebration Day',
        title: 'Sunset Arrival, Reveal & Celebration Toast',
        description: 'Transition calmly from private yes moment into portraits and celebratory dinner.',
        dayOfTime: '05:30 PM',
      },
    ],
    insightCostTitle: 'Bundling Setup + Photographer (Sample Estimate)',
    insightCostBody:
      'Sample SA proposal bundles combining a stylist and undercover photographer typically save $350–$600 AUD versus booking separate coastal bump-in crews.',
    insightBaselineTimingTitle: 'Sunset & Sea-Breeze Window',
    insightBaselineTimingBody:
      'Arriving 30–40 minutes ahead of published Adelaide sunset gives balanced twilight light and time for celebratory photos before dinner reservations.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-person engagement or proposal setup (${tradition === 'None' ? 'Adelaide coastal/winery' : tradition}): at $${budget.toLocaleString()} AUD, keeping ~50% across photography and location styling gives crisp results with an indoor weather backup.`,
  },

  Elopements: {
    eventType: 'Elopements',
    defaultBudget: 6500,
    defaultGuests: 10,
    defaultLeadDays: 84,
    saAveragePerGuest: 680,
    allocations: [
      { key: 'entertainment', label: 'Registered Celebrant & Legal Paperwork', pct: 0.20, icon: '📜', sampleNote: 'NOIM lodgement, ceremony writing & official certificates' },
      { key: 'photo', label: 'Elopement Photography & Short Film', pct: 0.28, icon: '📷', sampleNote: '3–4 hrs portrait adventure across hills or coast' },
      { key: 'catering', label: 'Intimate Chef Dinner & Tasting Wine', pct: 0.24, icon: '🍷', sampleNote: 'Private winery table or chef-prepared celebration meal' },
      { key: 'decor', label: 'Handheld Florals & Micro-Styling', pct: 0.13, icon: '🌿', sampleNote: 'Seasonal native arrangements & toast glassware' },
      { key: 'styling', label: 'Attire Pressing, Hair & Makeup', pct: 0.08, icon: '✨', sampleNote: 'Relaxed studio or mobile morning touch-up' },
      { key: 'buffer', label: 'Location Permit & Weather Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Covers park entry permits or wet-weather veranda switch' },
    ],
    milestones: [
      {
        id: 'elop-noim',
        serviceId: 'logistics',
        serviceLabel: 'Legal & Celebrant',
        leadDays: 84,
        leadLabel: '12 weeks before',
        title: 'Book Celebrant & Lodge Notice of Intended Marriage',
        description: 'Complete identity checks and sign the statutory NOIM (minimum 1 month before ceremony).',
        isCritical: true,
        adelaideTip: 'Weekday Adelaide Hills or McLaren Vale bookings open wider choice of acclaimed photographers.',
        dayOfTime: '11:00 AM',
      },
      {
        id: 'elop-team',
        serviceId: 'photo',
        serviceLabel: 'Photo & Winery',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Lock Elopement Photographer & Private Dining Table',
        description: 'Confirm two scenic photo stops and reserve an intimate post-ceremony tasting menu.',
        isCritical: true,
        adelaideTip: 'Pair Mount Lofty Botanic Garden or Coriole courtyard spots with a private cellar booth.',
        dayOfTime: '03:30 PM',
      },
      {
        id: 'elop-florals',
        serviceId: 'styling',
        serviceLabel: 'Florals & Attire',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Order Native Florals & Confirm Two Witnesses',
        description: 'Confirm native botanical colour tones and lock two adult witnesses (or photographer + coordinator).',
        adelaideTip: 'Australian ceremonies require 2 witnesses aged 18+; many SA photographers happily sign.',
        dayOfTime: '01:30 PM',
      },
      {
        id: 'elop-prep',
        serviceId: 'catering',
        serviceLabel: 'Final Logistics',
        leadDays: 5,
        leadLabel: '5 days before',
        title: 'Check Weather Forecast & Wet-Weather Veranda Plan',
        description: 'Confirm umbrellas, warm wraps, and indoor backup space if Adelaide Hills rain is forecast.',
        dayOfTime: '05:00 PM',
      },
      {
        id: 'elop-day',
        serviceId: 'entertainment',
        serviceLabel: 'Elopement Day',
        leadDays: 0,
        leadLabel: 'Elopement Day',
        title: 'Intimate Ceremony, Portraits & Winery Supper',
        description: 'Relaxed preparation, legal vows exchange with two witnesses, golden-hour stroll, and dinner.',
        dayOfTime: '04:00 PM',
      },
    ],
    insightCostTitle: 'Mid-Week Winery Savings (Sample Estimate)',
    insightCostBody:
      'Monday–Thursday elopements across McLaren Vale and the Adelaide Hills often avoid weekend minimum venue spends, leaving room in a ~$6,500 AUD sample budget for extended film coverage.',
    insightBaselineTimingTitle: '1-Month Legal Lead-Time Reminder',
    insightBaselineTimingBody:
      'Remember Australia’s mandatory 1-calendar-month NOIM lodgement window with your celebrant before setting a firm ceremony date.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-person elopement (${tradition === 'None' ? 'SA micro-ceremony' : tradition}): at $${budget.toLocaleString()} AUD, directing nearly half into celebrant + documentary photography yields timeless memories without large-venue overheads.`,
  },

  'Milestone Birthdays': {
    eventType: 'Milestone Birthdays',
    defaultBudget: 8500,
    defaultGuests: 70,
    defaultLeadDays: 70,
    saAveragePerGuest: 132,
    allocations: [
      { key: 'venue', label: 'Private Dining, Stone Hall or Marquee', pct: 0.24, icon: '🏡', sampleNote: 'Community hall hire, pub private room, or backyard marquee' },
      { key: 'catering', label: 'Shared Banquet & Celebration Cake', pct: 0.36, icon: '🎂', sampleNote: 'Abundant shared platters, drinks tab & custom birthday cake' },
      { key: 'entertainment', label: 'DJ, Karaoke Rig or Live Acoustic Duo', pct: 0.15, icon: '🎤', sampleNote: 'MC speeches mic, karaoke setup & multi-generation playlist' },
      { key: 'decor', label: 'Backdrop Styling, Signage & Florals', pct: 0.11, icon: '✨', sampleNote: 'Custom welcome board, photo arch, lighting & table runners' },
      { key: 'photo', label: 'Event Photographer or Photobooth', pct: 0.07, icon: '📷', sampleNote: '3–4 hrs candid family & friend coverage during speeches' },
      { key: 'buffer', label: 'Overtime & Extra Guest Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Covers late RSVP add-ons or extra bar tab hours' },
    ],
    milestones: [
      {
        id: 'bday-venue',
        serviceId: 'venue',
        serviceLabel: 'Hall or Private Room',
        leadDays: 70,
        leadLabel: '10 weeks before',
        title: 'Reserve Hall, Private Dining Room or Marquee',
        description: 'Confirm seating capacity for elders, parking access, and external caterer kitchen rules.',
        isCritical: true,
        adelaideTip: 'Stirling and suburban stone halls offer affordable dry-hire with commercial kitchen access.',
        dayOfTime: '04:00 PM',
      },
      {
        id: 'bday-cater',
        serviceId: 'catering',
        serviceLabel: 'Feast & Cake',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Book Cultural Caterer, Drinks & Milestone Cake',
        description: 'Lock shared platter menu, dietary notes, and custom bakery cake flavours.',
        isCritical: true,
        adelaideTip: 'Family-style shared banquets stretch a $70–$85/head catering estimate generously across 70 guests.',
        dayOfTime: '07:00 PM',
      },
      {
        id: 'bday-music',
        serviceId: 'entertainment',
        serviceLabel: 'MC, DJ & Karaoke',
        leadDays: 35,
        leadLabel: '5 weeks before',
        title: 'Book DJ, Karaoke System & Speech Microphones',
        description: 'Plan family toast order, childhood photo slideshow screen, and all-ages dance tracks.',
        adelaideTip: 'Test AV projector HDMI cables during bump-in so tribute slideshows play cleanly.',
        dayOfTime: '08:00 PM',
      },
      {
        id: 'bday-style',
        serviceId: 'styling',
        serviceLabel: 'Decor & Photo Wall',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Confirm Backdrop Signage, Table Florals & Photographer',
        description: 'Order milestone number signage, table linen, and lock 3-hour candid photo coverage.',
        dayOfTime: '05:00 PM',
      },
      {
        id: 'bday-rsvp',
        serviceId: 'logistics',
        serviceLabel: 'RSVPs & Cake Pick-up',
        leadDays: 5,
        leadLabel: '5 days before',
        title: 'Finalise Guest Count, Allergies & Cake Collection',
        description: 'Send final headcount to caterer and assign a helper for ice, drinks, and cake delivery.',
        dayOfTime: '05:30 PM',
      },
      {
        id: 'bday-day',
        serviceId: 'entertainment',
        serviceLabel: 'Party Schedule',
        leadDays: 0,
        leadLabel: 'Party Day',
        title: 'Guest Welcome, Dinner Service, Tributes & Cake Cutting',
        description: 'Host warm arrival drinks, seated dinner, tribute speeches, cake moment, and dancing.',
        dayOfTime: '06:30 PM',
      },
    ],
    insightCostTitle: 'Dry-Hire Hall vs Fixed Pub Minimum (Sample Estimate)',
    insightCostBody:
      'Sample Adelaide pricing shows booking a community hall (~$1,200–$1,800 AUD) with a cultural banquet caterer saves roughly 22%–28% over fixed per-head hotel packages for 60+ guests.',
    insightBaselineTimingTitle: 'All-Ages Speech & Karaoke Timing',
    insightBaselineTimingBody:
      'Scheduling family speeches and cake cutting right after main course (before 9:00 PM) captures grandparents and younger guests together for photos.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-guest milestone birthday (${tradition === 'None' ? 'mixed-age gathering' : tradition}): at $${budget.toLocaleString()} AUD (~$${Math.round(budget / guests)} AUD/guest), investing ~60% in food, hall hire, and a warm MC creates an effortless celebration.`,
  },

  'Diwali & Festival of Lights': {
    eventType: 'Diwali & Festival of Lights',
    defaultBudget: 14000,
    defaultGuests: 120,
    defaultLeadDays: 90,
    saAveragePerGuest: 128,
    allocations: [
      { key: 'venue', label: 'Pavilion / Hall & Power Distribution', pct: 0.22, icon: '🏛️', sampleNote: 'Dry-hire civic hall or weighted courtyard marquee' },
      { key: 'catering', label: 'Vegetarian, Chaat & Festive Mithai', pct: 0.34, icon: '🪔', sampleNote: 'Live chaat station, Jain/vegan mains & saffron sweet boxes' },
      { key: 'entertainment', label: 'Dhol Drummers, Bollywood DJ & Audio', pct: 0.16, icon: '🥁', sampleNote: 'Live Dhol entrance, stage mics & dance floor lighting' },
      { key: 'decor', label: 'Floral Rangoli, Marigold & LED Diyas', pct: 0.15, icon: '🌼', sampleNote: 'Hall-safe LED brass urlis, rangoli platters & backdrops' },
      { key: 'photo', label: 'Event Photography & Mithai Favours', pct: 0.06, icon: '📷', sampleNote: '4 hrs vibrant crowd/stage coverage & guest sweet tins' },
      { key: 'buffer', label: 'Safety Compliance & Overtime Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Covers generator/cable mats or extra late clean-up' },
    ],
    milestones: [
      {
        id: 'diw-venue',
        serviceId: 'venue',
        serviceLabel: 'Pavilion & Safety',
        leadDays: 90,
        leadLabel: '3 months before',
        title: 'Book Community Pavilion & Check Fire-Safety Rules',
        description: 'Confirm hall capacity, warm-kitchen access, and LED diya / sparkler policies with management.',
        isCritical: true,
        adelaideTip: 'Most Adelaide civic halls prohibit open-flame oil diyas indoors—ask stylists for weighted LED brass urlis.',
        dayOfTime: '02:00 PM',
      },
      {
        id: 'diw-cater',
        serviceId: 'catering',
        serviceLabel: 'Chaat & Banquet',
        leadDays: 56,
        leadLabel: '8 weeks before',
        title: 'Confirm Vegetarian, Jain & Chaat Catering',
        description: 'Arrange live pani puri / chaat bar, labelled Jain (no onion/garlic) options, and masala chai.',
        isCritical: true,
        adelaideTip: 'Dedicated separate tongs and table labelling keep Jain and vegan dietary guests completely comfortable.',
        dayOfTime: '06:00 PM',
      },
      {
        id: 'diw-perf',
        serviceId: 'entertainment',
        serviceLabel: 'Dhol & DJ',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Lock Dhol Drummers, Cultural Performers & DJ',
        description: 'Book peak Diwali weekend Dhol crew, stage PA system, and dance-floor lighting early.',
        adelaideTip: 'Adelaide Diwali weekends fill up fast—secure performers 6–8 weeks before October/November.',
        dayOfTime: '07:30 PM',
      },
      {
        id: 'diw-decor',
        serviceId: 'styling',
        serviceLabel: 'Rangoli & Marigolds',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Plan Floral Rangoli Entry, Marigolds & Photo Backdrop',
        description: 'Map floor rangoli placement away from high-traffic walkways and confirm fairy-light rigging.',
        dayOfTime: '03:00 PM',
      },
      {
        id: 'diw-brief',
        serviceId: 'logistics',
        serviceLabel: 'Soundcheck & Bump-in',
        leadDays: 5,
        leadLabel: '5 days before',
        title: 'Confirm Chaat Power Circuits & Soundcheck Times',
        description: 'Check hot-plate power draw with venue caretaker and confirm mithai favour box delivery.',
        dayOfTime: '04:30 PM',
      },
      {
        id: 'diw-day',
        serviceId: 'entertainment',
        serviceLabel: 'Diwali Night',
        leadDays: 0,
        leadLabel: 'Diwali Evening',
        title: 'LED Diya Welcome, Chaat Hour, Dhol & Dance Floor',
        description: 'Open with rangoli photos and warm chai, followed by Dhol entrance, performances, and dinner.',
        dayOfTime: '06:00 PM',
      },
    ],
    insightCostTitle: 'Live Chaat + Shared Thali Efficiency (Sample Estimate)',
    insightCostBody:
      'Combining an arrival live chaat cart with buffet vegetarian mains typically reduces plate waste by ~15% while keeping hospitality vibrant inside a $14,000 AUD sample budget.',
    insightBaselineTimingTitle: 'Hall-Safe Lighting & Bump-In Timing',
    insightBaselineTimingBody:
      'Allow 2.5 hours before doors open for marigold backdrops, fairy lights, and rangoli floor layout so entries stay clear when guests arrive.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-guest Diwali celebration (${tradition === 'None' ? 'Festival of Lights' : tradition}): at $${budget.toLocaleString()} AUD, allocating ~50% to festive vegetarian catering + Dhol/DJ entertainment keeps energy high with room for rangoli and LED lighting.`,
  },

  'Lunar New Year': {
    eventType: 'Lunar New Year',
    defaultBudget: 16000,
    defaultGuests: 120,
    defaultLeadDays: 112,
    saAveragePerGuest: 142,
    allocations: [
      { key: 'venue', label: 'Banquet Hall or Private Dining Room', pct: 0.23, icon: '🏮', sampleNote: 'Round-table layout seating 10–12 guests per table' },
      { key: 'catering', label: 'Prosperity Banquet & Tea Service', pct: 0.37, icon: '🥢', sampleNote: 'Yu Sheng toss, whole steamed fish, roast platters & fruit' },
      { key: 'entertainment', label: 'Lion Dance Troupe & Bilingual MC', pct: 0.16, icon: '🦁', sampleNote: 'Live drum percussion, lettuce blessing & MC hosting' },
      { key: 'decor', label: 'Silk Lanterns, Peach Blossoms & Scrolls', pct: 0.11, icon: '🌸', sampleNote: 'Red/gold table runners, calligraphy & floral stands' },
      { key: 'photo', label: 'Photography & Red Envelope Keepsakes', pct: 0.06, icon: '📷', sampleNote: 'Coverage of Lion blessing, banquet toasts & family tables' },
      { key: 'buffer', label: 'Extra Table & Overtime Contingency', pct: 0.07, icon: '🛡️', sampleNote: 'Reserve for late family table additions' },
    ],
    milestones: [
      {
        id: 'lny-lion',
        serviceId: 'entertainment',
        serviceLabel: 'Lion Dance & Hall',
        leadDays: 112,
        leadLabel: '16 weeks before',
        title: 'Book Lion Dance Troupe & Round-Table Banquet Venue',
        description: 'Confirm ceiling clearance for Lion acrobatic lifts, percussion clearance, and hall hold.',
        isCritical: true,
        adelaideTip: 'Adelaide Lion Dance troupes book out months ahead for the 15-day Lunar New Year window.',
        dayOfTime: '06:30 PM',
      },
      {
        id: 'lny-menu',
        serviceId: 'catering',
        serviceLabel: 'Banquet Menu',
        leadDays: 56,
        leadLabel: '8 weeks before',
        title: 'Confirm Multi-Course Auspicious Menu & Vegetarian Tables',
        description: 'Include prosperity Yu Sheng / Yee Sang toss, whole barramundi, longevity noodles, and tea service.',
        isCritical: true,
        adelaideTip: 'Specify dedicated vegetarian/nut-free lazy Susan platters so elders and colleagues dine safely.',
        dayOfTime: '07:15 PM',
      },
      {
        id: 'lny-decor',
        serviceId: 'styling',
        serviceLabel: 'Lanterns & Scrolls',
        leadDays: 28,
        leadLabel: '4 weeks before',
        title: 'Order Silk Lanterns, Peach Blossoms & Red Envelopes',
        description: 'Finalise gold calligraphy welcome banners, table numbers, and Lai See / Hongbao packets.',
        dayOfTime: '03:30 PM',
      },
      {
        id: 'lny-mc',
        serviceId: 'logistics',
        serviceLabel: 'MC & Sound',
        leadDays: 10,
        leadLabel: '10 days before',
        title: 'Confirm Bilingual Greetings, Lettuce Setup & Photographer',
        description: 'Prep fresh lettuce/citrus prop for the Lion blessing and brief bilingual MC on toast order.',
        dayOfTime: '05:30 PM',
      },
      {
        id: 'lny-day',
        serviceId: 'entertainment',
        serviceLabel: 'Banquet Night',
        leadDays: 0,
        leadLabel: 'Banquet Evening',
        title: 'Lion Dance Entrance, Prosperity Toss & Shared Feast',
        description: 'Welcome guests under silk lanterns, cue Lions at 7:00 PM sharp, then begin banquet courses.',
        dayOfTime: '07:00 PM',
      },
    ],
    insightCostTitle: 'Peak 15-Day Window & Weeknight Savings (Sample Estimate)',
    insightCostBody:
      'Hosting your Lunar New Year banquet on a Thursday or Sunday evening rather than Lunar Eve Friday often trims venue/AV minimums by ~15%–20% while keeping Lion Dance availability open.',
    insightBaselineTimingTitle: 'Aisle Space for Lion Dance & Drums',
    insightBaselineTimingBody:
      'Leave at least 2.2 metres of clear centre aisle between round banquet tables so Lion performers and percussionists can weave safely around every table.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-guest Lunar New Year gathering (${tradition === 'None' ? 'prosperity banquet' : tradition}): at $${budget.toLocaleString()} AUD, prioritising an auspicious multi-course menu (~37%) and an early Lion Dance hold secures peak festive impact.`,
  },

  Eid: {
    eventType: 'Eid',
    defaultBudget: 9500,
    defaultGuests: 85,
    defaultLeadDays: 56,
    saAveragePerGuest: 118,
    allocations: [
      { key: 'venue', label: 'Backyard Marquee / Hall & Seating', pct: 0.24, icon: '🌙', sampleNote: 'Weighted clear-span marquee, trestle tables & prayer rug corner' },
      { key: 'catering', label: '100% Halal Feast, Mocktails & Knafeh', pct: 0.38, icon: '🍽️', sampleNote: 'Saffron rice platters, charcoal grills, baklava & chai bar' },
      { key: 'decor', label: 'Crescent Lighting, Lanterns & Linens', pct: 0.13, icon: '✨', sampleNote: 'Warm festoon bulbs, brass lanterns & welcome florals' },
      { key: 'entertainment', label: 'Acoustic Music, Kids Activities & Hosting', pct: 0.11, icon: '🎶', sampleNote: 'Henna corner, kids gift bags & gentle background audio' },
      { key: 'photo', label: 'Family Portraits & Eidi Gift Boxes', pct: 0.07, icon: '📷', sampleNote: 'Candid family photography & sweet takeaway boxes' },
      { key: 'buffer', label: 'Moon-Sighting Date Flexibility Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Allows 24-hour date window shift around Hilal sighting' },
    ],
    milestones: [
      {
        id: 'eid-halal',
        serviceId: 'catering',
        serviceLabel: 'Halal Feast & Hold',
        leadDays: 56,
        leadLabel: '8 weeks before',
        title: 'Book 100% Halal Caterer with Flexible Eid Date Window',
        description: 'Confirm certified Halal kitchen provenance and agree on a ±1 day moon-sighting date clause.',
        isCritical: true,
        adelaideTip: 'Always confirm written ±1 day flexibility in marquee and caterer contracts around moon sighting.',
        dayOfTime: '05:30 PM',
      },
      {
        id: 'eid-venue',
        serviceId: 'venue',
        serviceLabel: 'Marquee or Hall',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Reserve Hall or Weighted Backyard Marquee & Heaters',
        description: 'Plan sheltered seating, separate quiet space for prayer/elders, and outdoor festoon lighting.',
        isCritical: true,
        adelaideTip: 'Weighted marquees with clear side walls handle cool Adelaide evenings without blocking garden light.',
        dayOfTime: '02:00 PM',
      },
      {
        id: 'eid-styling',
        serviceId: 'styling',
        serviceLabel: 'Lanterns & Dessert Bar',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Confirm Warm Lantern Styling, Knafeh & Mocktail Station',
        description: 'Arrange hot knafeh / baklava dessert table, dates platter, and zero-proof rose/mint spritzes.',
        dayOfTime: '04:00 PM',
      },
      {
        id: 'eid-kids',
        serviceId: 'entertainment',
        serviceLabel: 'Portraits & Activities',
        leadDays: 14,
        leadLabel: '2 weeks before',
        title: 'Confirm Henna Artist, Family Photographer & Eidi Boxes',
        description: 'Reserve 2–3 hrs portrait coverage plus kids craft or Eidi favour bags.',
        dayOfTime: '05:00 PM',
      },
      {
        id: 'eid-lock',
        serviceId: 'logistics',
        serviceLabel: 'Date Confirmation',
        leadDays: 2,
        leadLabel: '2 days before',
        title: 'Confirm Exact Moon-Sighting Date & Final Delivery Time',
        description: 'Send confirmation message to caterer, marquee installer, and family arrival group chat.',
        dayOfTime: '03:00 PM',
      },
      {
        id: 'eid-day',
        serviceId: 'catering',
        serviceLabel: 'Eid Gathering',
        leadDays: 0,
        leadLabel: 'Eid Day',
        title: 'Family Photos, Halal Feast Service & Hot Knafeh Bar',
        description: 'Welcome extended family with dates and chai, serve shared platters, then open warm dessert station.',
        dayOfTime: '06:00 PM',
      },
    ],
    insightCostTitle: 'Shared Platter Service & Flexible Clauses (Sample Estimate)',
    insightCostBody:
      'Family-style Halal platters served to long tables stretch budgets up to ~18% further per guest than individual plated dinners while keeping multi-generational warmth central.',
    insightBaselineTimingTitle: 'Building Moon-Sighting Buffer Into Contracts',
    insightBaselineTimingBody:
      'Locking your marquee installation window for a 48-hour weekend window removes stress when the exact Eid date shifts by a single evening.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for an ${guests}-guest Eid gathering (${tradition === 'None' ? '100% Halal family feast' : tradition}): at $${budget.toLocaleString()} AUD, prioritising certified Halal platters (~38%) and weighted marquee shelter with a flexible date clause keeps hosting smooth.`,
  },

  'Christenings & Baby Showers': {
    eventType: 'Christenings & Baby Showers',
    defaultBudget: 5500,
    defaultGuests: 55,
    defaultLeadDays: 56,
    saAveragePerGuest: 105,
    allocations: [
      { key: 'venue', label: 'Sunny Conservatory, Hall or Garden', pct: 0.25, icon: '🌿', sampleNote: 'Daytime hall/courtyard near church or suburban park' },
      { key: 'catering', label: 'Luncheon, Grazing Table & Custom Cake', pct: 0.36, icon: '🧁', sampleNote: 'Fresh seasonal lunch platters, desserts & mocktail bar' },
      { key: 'decor', label: 'Pastel Styling, Florals & Welcome Sign', pct: 0.15, icon: '🎈', sampleNote: 'Biodegradable balloon garland, florals & linen runners' },
      { key: 'photo', label: 'Documentary Daytime Photography', pct: 0.11, icon: '📷', sampleNote: '2–3 hrs capturing elders, baby & godparent portraits' },
      { key: 'entertainment', label: 'Keepsake Favours & Acoustic Background', pct: 0.06, icon: '🎁', sampleNote: 'Custom cookies, bomboniere boxes & soft daytime music' },
      { key: 'buffer', label: 'Pram Space & Guest Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Reserve for extra highchairs or family add-ons' },
    ],
    milestones: [
      {
        id: 'chr-venue',
        serviceId: 'venue',
        serviceLabel: 'Daytime Venue',
        leadDays: 56,
        leadLabel: '8 weeks before',
        title: 'Book Sunny Luncheon Venue & Confirm Accessibility',
        description: 'Ensure step-free pram access, highchairs, baby-change space, and shade/cooling.',
        isCritical: true,
        adelaideTip: 'Look for stone halls or park conservatories within 15 minutes of church or morning ceremony spot.',
        dayOfTime: '11:00 AM',
      },
      {
        id: 'chr-cater',
        serviceId: 'catering',
        serviceLabel: 'Lunch & Cake',
        leadDays: 35,
        leadLabel: '5 weeks before',
        title: 'Confirm Luncheon Grazing Menu & Celebration Cake',
        description: 'Plan light protein platters, kids finger foods, non-alcoholic spritzes, and custom cake.',
        isCritical: true,
        adelaideTip: 'Include nut-free and dairy-free sweet plates clearly labelled for toddlers and grandparents.',
        dayOfTime: '12:30 PM',
      },
      {
        id: 'chr-style',
        serviceId: 'styling',
        serviceLabel: 'Florals & Balloons',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Finalise Pastel Balloon Styling, Florals & Keepsakes',
        description: 'Order biodegradable balloon backdrop, acrylic welcome easel, and guest favour boxes.',
        dayOfTime: '09:30 AM',
      },
      {
        id: 'chr-photo',
        serviceId: 'photo',
        serviceLabel: 'Photography',
        leadDays: 14,
        leadLabel: '2 weeks before',
        title: 'Brief Daytime Photographer on Multi-Gen Family Shots',
        description: 'Schedule calm 20-minute window for grandparents, godparents, and parents right after arrival.',
        dayOfTime: '12:00 PM',
      },
      {
        id: 'chr-final',
        serviceId: 'logistics',
        serviceLabel: 'Final Prep',
        leadDays: 3,
        leadLabel: '3 days before',
        title: 'Confirm Final Headcount, Highchairs & Cake Delivery',
        description: 'Verify dietary plates and ask a relative to help receive floral/cake deliveries.',
        dayOfTime: '10:30 AM',
      },
      {
        id: 'chr-day',
        serviceId: 'catering',
        serviceLabel: 'Celebration Day',
        leadDays: 0,
        leadLabel: 'Celebration Day',
        title: 'Daytime Welcome, Luncheon, Family Photos & Cake',
        description: 'Keep flow relaxed around baby’s nap window with shade, soft music, and early cake cutting.',
        dayOfTime: '11:45 AM',
      },
    ],
    insightCostTitle: 'Daytime Conservatory & Grazing Efficiency (Sample Estimate)',
    insightCostBody:
      'Daytime 11:30 AM–3:30 PM luncheons typically carry 30%–35% lower venue minimums across Adelaide than Saturday evening bookings.',
    insightBaselineTimingTitle: 'Scheduling Around Nap & Feeding Windows',
    insightBaselineTimingBody:
      'Framing key family photos and cake cutting in the first 90 minutes keeps little ones rested and happy.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-guest Christening or Baby Shower (${tradition === 'None' ? 'daytime family gathering' : tradition}): at $${budget.toLocaleString()} AUD, a bright luncheon format preserves ~60% for food and comfortable accessible seating.`,
  },

  Graduations: {
    eventType: 'Graduations',
    defaultBudget: 4200,
    defaultGuests: 35,
    defaultLeadDays: 42,
    saAveragePerGuest: 120,
    allocations: [
      { key: 'venue', label: 'Private Dining Room or Riverbank Venue', pct: 0.24, icon: '🎓', sampleNote: 'CBD, North Terrace, or inner-suburban private room' },
      { key: 'catering', label: 'Shared Celebration Dinner & Cake', pct: 0.38, icon: '🍽️', sampleNote: 'Multi-dish banquet, mocktails/wine & custom grad cake' },
      { key: 'photo', label: 'Graduate & Extended Family Portraits', pct: 0.14, icon: '📷', sampleNote: '90-min campus or restaurant portrait session' },
      { key: 'decor', label: 'Presentation Bouquets & Table Florals', pct: 0.11, icon: '💐', sampleNote: 'Congratulations banner, floral sprigs & table styling' },
      { key: 'entertainment', label: 'Speech Mic & Keepsake Mementos', pct: 0.06, icon: '🥂', sampleNote: 'Printed menu keepsakes & background playlist' },
      { key: 'buffer', label: 'Extra Guests & Overtime Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Flexible reserve if visiting relatives join last minute' },
    ],
    milestones: [
      {
        id: 'grad-venue',
        serviceId: 'venue',
        serviceLabel: 'Dining Room',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Book Private Dining Close to North Terrace / Campus',
        description: 'Reserve before Adelaide Uni / UniSA / Flinders ceremony weeks sell out private group rooms.',
        isCritical: true,
        adelaideTip: 'Adelaide ceremony weeks (April & December) fill CBD private rooms fast—hold a 35-seat room early.',
        dayOfTime: '06:00 PM',
      },
      {
        id: 'grad-cater',
        serviceId: 'catering',
        serviceLabel: 'Dinner & Cake',
        leadDays: 21,
        leadLabel: '3 weeks before',
        title: 'Lock Shared Set Menu, Dietary Notes & Celebration Cake',
        description: 'Select set-price shared platters so ordering stays fast for large extended families.',
        dayOfTime: '07:00 PM',
      },
      {
        id: 'grad-photo',
        serviceId: 'photo',
        serviceLabel: 'Portraits & Bouquets',
        leadDays: 10,
        leadLabel: '10 days before',
        title: 'Schedule Campus Robe Portraits & Order Congratulatory Florals',
        description: 'Book 45-minute lawn/sandstone quad photos before gown return cut-off times.',
        adelaideTip: 'Check official academic gown return deadline—usually 2–3 hours after ceremony finish.',
        dayOfTime: '04:00 PM',
      },
      {
        id: 'grad-day',
        serviceId: 'logistics',
        serviceLabel: 'Graduation Day',
        leadDays: 0,
        leadLabel: 'Graduation Day',
        title: 'Campus Portraits, Gown Return & Family Celebration Dinner',
        description: 'Capture multi-generation photos in regalia first, then relax at celebratory banquet.',
        dayOfTime: '06:15 PM',
      },
    ],
    insightCostTitle: 'Set Shared Menus vs A La Carte (Sample Estimate)',
    insightCostBody:
      'For 25–50 graduation guests, choosing a fixed shared banquet menu ($65–$85/head) keeps kitchen pacing even and prevents bill surprises.',
    insightBaselineTimingTitle: 'Gown Return Window Before Dinner',
    insightBaselineTimingBody:
      'Allowing 60–90 minutes between the university hall exit and dinner seating gives time for campus family photos and robe return without rushing.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-guest graduation celebration (${tradition === 'None' ? 'Adelaide dining & portraits' : tradition}): at $${budget.toLocaleString()} AUD, pairing set group dining (~38%) with focused campus portrait coverage delivers a stress-free milestone evening.`,
  },

  'Community Festivals': {
    eventType: 'Community Festivals',
    defaultBudget: 24000,
    defaultGuests: 250,
    defaultLeadDays: 150,
    saAveragePerGuest: 96,
    allocations: [
      { key: 'venue', label: 'Civic Park, Weighted Marquees & Stage', pct: 0.27, icon: '🎪', sampleNote: 'Council hire, stallholder gazebos, stage & generators' },
      { key: 'catering', label: 'Food Vendors, Water Stations & Permits', pct: 0.24, icon: '🍲', sampleNote: 'Council food notification, power & hospitality vouchers' },
      { key: 'entertainment', label: 'Cultural Troupes, PA Sound & MC', pct: 0.22, icon: '🥁', sampleNote: 'Stage sound engineer, percussionists, dancers & bilingual MC' },
      { key: 'logistics', label: 'Insurance ($20M COI), First Aid & Waste', pct: 0.11, icon: '🦺', sampleNote: 'Event public liability, St John / first aid & bin stations' },
      { key: 'photo', label: 'Festival Signage, Flags & Media Photo', pct: 0.09, icon: '📷', sampleNote: 'Bunting, schedule boards & high-res community gallery' },
      { key: 'buffer', label: 'Council Bond & Weather Contingency', pct: 0.07, icon: '🛡️', sampleNote: 'Supports extra security weights or rain tarps' },
    ],
    milestones: [
      {
        id: 'fest-permit',
        serviceId: 'logistics',
        serviceLabel: 'Council & Insurance',
        leadDays: 150,
        leadLabel: '5 months before',
        title: 'Lodge SA Council Event Permit & $20M Public Liability',
        description: 'Submit site map, noise curfew plan, food-stall registration list, and traffic notes.',
        isCritical: true,
        adelaideTip: 'Adelaide metropolitan councils generally ask for major public park permits 12–16 weeks ahead.',
        dayOfTime: '07:00 AM',
      },
      {
        id: 'fest-infra',
        serviceId: 'venue',
        serviceLabel: 'Marquees & Stage',
        leadDays: 105,
        leadLabel: '3.5 months before',
        title: 'Book Weighted Marquees, Staging & Silent Generators',
        description: 'Use concrete ballasts (not ground pegs where council irrigation runs) and weather-rated cable ramps.',
        isCritical: true,
        adelaideTip: 'Ask council park officers for underground irrigation plans before booking any staked tents.',
        dayOfTime: '07:30 AM',
      },
      {
        id: 'fest-talent',
        serviceId: 'entertainment',
        serviceLabel: 'Performers & AV',
        leadDays: 70,
        leadLabel: '10 weeks before',
        title: 'Lock Cultural Performers, Stage Sound Tech & MCs',
        description: 'Build running order alternating high-energy drummers, community speeches, and dance showcases.',
        dayOfTime: '11:30 AM',
      },
      {
        id: 'fest-food',
        serviceId: 'catering',
        serviceLabel: 'Stalls & Safety',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Verify Stallholder Food Notifications & Volunteer Roster',
        description: 'Collect each food vendor’s council temp-food notification, fire extinguisher check, and allergen signs.',
        isCritical: true,
        dayOfTime: '09:00 AM',
      },
      {
        id: 'fest-sign',
        serviceId: 'photo',
        serviceLabel: 'Signage & Volunteers',
        leadDays: 14,
        leadLabel: '2 weeks before',
        title: 'Print Bilingual Site Maps, Stage Times & Volunteer Briefs',
        description: 'Assign bump-in traffic marshals, accessibility entry guides, and waste-sorting captains.',
        dayOfTime: '08:30 AM',
      },
      {
        id: 'fest-day',
        serviceId: 'entertainment',
        serviceLabel: 'Festival Day',
        leadDays: 0,
        leadLabel: 'Festival Day',
        title: 'Vendor Bump-In, Safety Check & Live Stage Showcase',
        description: 'Open gates smoothly with first aid on site, stage tech running soundchecks, and photographer active.',
        dayOfTime: '10:00 AM',
      },
    ],
    insightCostTitle: 'Council Grant & Multi-Stall Offsets (Sample Estimate)',
    insightCostBody:
      'Many South Australian multicultural community events offset 25%–40% of staging and marquee hire via local council cultural grants and stallholder pitch fees.',
    insightBaselineTimingTitle: 'Staggered Bump-In Prevents Park Gate Bottlenecks',
    insightBaselineTimingBody:
      'Assigning 20-minute bump-in windows (heaviest infrastructure first, food vans second, artisan stalls last) keeps park access calm and compliant.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-attendee community festival (${tradition === 'None' ? 'civic park showcase' : tradition}): at $${budget.toLocaleString()} AUD, reserving ~38% across weighted infrastructure, council safety/COI, and sound prevents surprise compliance costs.`,
  },

  'Corporate Events': {
    eventType: 'Corporate Events',
    defaultBudget: 18000,
    defaultGuests: 100,
    defaultLeadDays: 70,
    saAveragePerGuest: 180,
    allocations: [
      { key: 'venue', label: 'CBD Venue / Dry-Hire Conference Space', pct: 0.28, icon: '🏢', sampleNote: 'Accessible tram-line venue with commercial prep kitchen' },
      { key: 'catering', label: 'Inclusive Catering & Zero-Proof Drinks', pct: 0.34, icon: '🍽️', sampleNote: 'Clearly labelled Halal, vegan, Jain, GF & non-alc pairings' },
      { key: 'av', label: 'AV, Wireless Mics & Stage Screens', pct: 0.15, icon: '🎙️', sampleNote: 'Lectern, presentation slides, ambient wash lighting & tech' },
      { key: 'entertainment', label: 'Cultural Showcase & Bilingual MC', pct: 0.10, icon: '🥁', sampleNote: 'Short cultural opening performance + acoustic duo or DJ' },
      { key: 'photo', label: 'Employer-Brand Photo & Signage', pct: 0.06, icon: '📷', sampleNote: 'Clean high-res event gallery & recyclable welcome boards' },
      { key: 'buffer', label: 'Tax-Invoice & Contingency Buffer', pct: 0.07, icon: '🛡️', sampleNote: 'Covers late exec RSVPs or extended AV tech support' },
    ],
    milestones: [
      {
        id: 'corp-venue',
        serviceId: 'venue',
        serviceLabel: 'Venue & ABN Hold',
        leadDays: 70,
        leadLabel: '10 weeks before',
        title: 'Confirm Accessible CBD Venue, Fire Rules & ABN Quotes',
        description: 'Verify lift access, public transit proximity, LED-only candle rules, and GST tax invoicing.',
        isCritical: true,
        adelaideTip: 'Ask CBD hotels and inner-west pavilions for external Halal/Asian catering buyout waivers early.',
        dayOfTime: '03:00 PM',
      },
      {
        id: 'corp-cater',
        serviceId: 'catering',
        serviceLabel: 'Inclusive Catering',
        leadDays: 42,
        leadLabel: '6 weeks before',
        title: 'Design Inclusive Dietary Menu & Zero-Proof Drinks Bar',
        description: 'Collect anonymous staff dietary needs (Halal, vegan, Jain, coeliac) and pair craft mocktails beside wine.',
        isCritical: true,
        adelaideTip: 'Put allergen-safe and Halal-certified platters clearly labelled on main buffets rather than hidden backstage.',
        dayOfTime: '06:00 PM',
      },
      {
        id: 'corp-av',
        serviceId: 'entertainment',
        serviceLabel: 'AV & Performers',
        leadDays: 28,
        leadLabel: '4 weeks before',
        title: 'Lock AV Technician, Short Cultural Showcase & Performers COI',
        description: 'Collect $20M Public Liability Certificates of Currency from performers and check building sound limits.',
        dayOfTime: '04:30 PM',
      },
      {
        id: 'corp-brief',
        serviceId: 'logistics',
        serviceLabel: 'Run-Sheet & Allergens',
        leadDays: 10,
        leadLabel: '10 days before',
        title: 'Finalise Speaker Notes, Allergen Cards & Loading Dock Pass',
        description: 'Print large-font ingredient cards and share name-pronunciation notes with MC and leadership.',
        dayOfTime: '05:00 PM',
      },
      {
        id: 'corp-day',
        serviceId: 'photo',
        serviceLabel: 'Event Run-Sheet',
        leadDays: 0,
        leadLabel: 'Event Day',
        title: 'AV Soundcheck, Guest Check-In, Showcase & Networking',
        description: 'Run slide & mic check 90 minutes pre-doors, capture candid networking shots, and stay on curfew.',
        dayOfTime: '05:30 PM',
      },
    ],
    insightCostTitle: 'Dry-Hire Pavilion vs CBD Hotel Package (Sample Estimate)',
    insightCostBody:
      'Sample Adelaide corporate data shows pairing an inner-city dry-hire venue with external multicultural caterers lowers per-head hospitality spend ~20%–28% while upgrading menu authenticity.',
    insightBaselineTimingTitle: 'Compact Workplace Timing & Building Fire Rules',
    insightBaselineTimingBody:
      'Mid-week 5:30 PM–8:30 PM slots near tram stops boost attendance, while swapping open flames for LED clusters ensures seamless CBD fire compliance.',
    buildPrimaryRecommendation: (budget, guests, tradition) =>
      `Sample forecast for a ${guests}-person Adelaide corporate event (${tradition === 'None' ? 'inclusive workplace function' : tradition}): at $${budget.toLocaleString()} AUD (~$${Math.round(budget / guests)} AUD/head ex-buffer), allocating ~49% across inclusive catering and reliable AV keeps teams and clients engaged.`,
  },
};

const TRADITION_NOTES: Record<
  Exclude<PlannerCulturalTradition, 'None'>,
  {
    weddingItems: CulturalLineItem[];
    generalItems: CulturalLineItem[];
    weddingMilestone: (leadDays: number) => { title: string; desc: string; tip: string };
    generalMilestone: (eventType: EventTypeTag, leadDays: number) => { title: string; desc: string; tip: string };
    insightTitle: string;
    weddingInsight: string;
    generalInsight: string;
  }
> = {
  'Filipino-Australian Fusion': {
    weddingItems: [
      { title: 'Heirloom Veil, Cord & 13 Arras Coins', estimateRange: '$280 – $550 AUD (sample est.)', detail: 'Includes ceremonial cord, double-veil pins & coin pouch' },
      { title: 'Lechon or Filipino-Australian Banquet Station', estimateRange: '$1,400 – $2,800 AUD (sample est.)', detail: 'Whole crispy roast carving alongside local SA mains' },
      { title: 'Bilingual Tagalog-English MC & Sponsor Briefing', estimateRange: '$950 – $1,650 AUD (sample est.)', detail: 'Guides Ninongs & Ninangs plus English-speaking guests' },
    ],
    generalItems: [
      { title: 'Roast Lechon & Pancit Sharing Station', estimateRange: '$850 – $1,900 AUD (sample est.)', detail: 'Whole crackling centerpiece + lumpia & merienda trays' },
      { title: 'Halo-Halo & Ube Dessert Bar', estimateRange: '$550 – $1,100 AUD (sample est.)', detail: 'Build-your-own shaved ice & Filipino pastry station' },
      { title: 'Tagalog-English Bilingual Host & Karaoke Rig', estimateRange: '$650 – $1,250 AUD (sample est.)', detail: 'Warm multigenerational hosting and song-list setup' },
    ],
    weddingMilestone: () => ({
      title: 'Commission Veil, Cord, Arras Coins & Brief Ninongs/Ninangs',
      desc: 'Confirm principal sponsors, bilingual ceremony booklets, and cord placement timing with celebrant.',
      tip: 'Give elders a brief printed order of rites so both sides of the family follow each Filipino symbol comfortably.',
    }),
    generalMilestone: (eventType) => ({
      title: `Confirm Filipino Feast Dishes & Hosts for ${eventType}`,
      desc: 'Lock lechon carving window, vegetarian/halal side dishes for wider guests, and bilingual host notes.',
      tip: 'Scheduling karaoke or family tributes cleanly after main dishes keeps every generation involved.',
    }),
    insightTitle: 'Filipino-Australian Fusion Insights (Sample Estimate)',
    weddingInsight:
      'Pairing traditional veil, cord & arras blessings with a clean bilingual order-of-service booklet keeps both Filipino elders and local Adelaide guests warmly engaged.',
    generalInsight:
      'A dedicated lechon carving window paired with ube/halo-halo desserts delivers strong visual impact without inflating full-course per-head catering costs.',
  },
  Greek: {
    weddingItems: [
      { title: 'Artisan Stefana Crowns & Koufeta Bomboniere', estimateRange: '$450 – $950 AUD (sample est.)', detail: 'Silver-ribboned crowning set & almond guest keepsakes' },
      { title: 'Live Bouzouki Trio & Circle Dance Lead', estimateRange: '$1,500 – $2,600 AUD (sample est.)', detail: 'Guides Kalamatianos & Zorba floor sets cleanly' },
      { title: 'Slow-Roasted Lamb & Mezze Banquet Upgrade', estimateRange: '$1,300 – $2,400 AUD (sample est.)', detail: 'Charcoal platters, spanakopita & loukoumades cart' },
    ],
    generalItems: [
      { title: 'Live Bouzouki Duo & Circle Dance Hosting', estimateRange: '$950 – $1,800 AUD (sample est.)', detail: 'Welcoming traditional music & group dance sets' },
      { title: 'Greek Charcoal Platter & Loukoumades Bar', estimateRange: '$1,100 – $2,200 AUD (sample est.)', detail: 'Souvlaki/lamb platters, dips & warm honey pastries' },
      { title: 'Artisan Olive-Branch Styling & Bomboniere Favours', estimateRange: '$450 – $950 AUD (sample est.)', detail: 'SA olive foliage tablescapes & guest keepsake boxes' },
    ],
    weddingMilestone: () => ({
      title: 'Prepare Stefana Crowns, Koumbaro Brief & Koufeta Favours',
      desc: 'Confirm church or civil crowning cues with Koumbaro/Koumbara and order sugar-coated almond keepsakes.',
      tip: 'Coordinate live bouzouki entrance timing directly with your reception banquet manager.',
    }),
    generalMilestone: (eventType) => ({
      title: `Coordinate Greek Banquet Platters & Bouzouki Set (${eventType})`,
      desc: 'Confirm long-table mezze pacing, vegetarian dishes, and open floor space for circle dances.',
      tip: 'Confirm venue floor policies (no plate smashing indoors unless approved) ahead of deposits.',
    }),
    insightTitle: 'Greek Cultural Insights (Sample Estimate)',
    weddingInsight:
      'Scheduling live bouzouki sets between dinner courses gives high energy without drowning out early family speeches.',
    generalInsight:
      'Adelaide Hills & Torrensville caterers offering shared Greek mezze + warm loukoumades stations deliver strong value for 50–150 guests.',
  },
  Indian: {
    weddingItems: [
      { title: 'Hall-Safe Floral Mandap, Rangoli & LED Diyas', estimateRange: '$2,200 – $4,800 AUD (sample est.)', detail: 'Marigold garlands, mandap framing & brass LED accents' },
      { title: 'Live Dhol Drummers, Sangeet AV & Bollywood DJ', estimateRange: '$1,400 – $2,800 AUD (sample est.)', detail: 'Baraat percussion arrival + reception dance floor rig' },
      { title: 'Halwai Mithai, Live Chaat & Jain-Friendly Mains', estimateRange: '$1,600 – $3,200 AUD (sample est.)', detail: 'Separate allergen/Jain prep + masala chai bar' },
    ],
    generalItems: [
      { title: 'Floral Rangoli Art, Marigolds & LED Brass Urli Styling', estimateRange: '$850 – $2,100 AUD (sample est.)', detail: 'CBD & civic hall compliant flame-free glow' },
      { title: 'Live Dhol Percussion & Bollywood DJ Showcase', estimateRange: '$900 – $1,950 AUD (sample est.)', detail: 'Short 15-min showcase or full evening dance floor' },
      { title: 'Live Pani Puri Chaat & Labelled Vegetarian/Jain Platter', estimateRange: '$1,050 – $2,300 AUD (sample est.)', detail: 'Fresh chaat station, vegan curries & hot masala chai' },
    ],
    weddingMilestone: () => ({
      title: 'Confirm Mandap Fire Clearance, Mehndi Night & Dhol Entrance',
      desc: 'Verify venue rules for sacred Agni / havan or LED substitute and book Baraat dhol drummers.',
      tip: 'Always check SA venue smoke-detector policies well before deposit payment if considering indoor flame.',
    }),
    generalMilestone: (eventType) => ({
      title: `Confirm LED Diya Rules, Chaat Power & Dhol Cue (${eventType})`,
      desc: 'Lock rangoli entry layout, labelled Jain/vegan/halal trays, and acoustic timing for Dhol sets.',
      tip: 'Weighted LED brass urlis provide authentic warm glow while complying with all Adelaide indoor venues.',
    }),
    insightTitle: 'Indian Cultural Insights (Sample Estimate)',
    weddingInsight:
      'Confirming outdoor courtyard vs indoor mandap rules early saves late re-rigging costs and secures peak Oct–Dec Dhol drummers.',
    generalInsight:
      'Pairing an interactive arrival chaat station with clearly labelled vegetarian/Jain buffet mains satisfies wide workplace and family crowds smoothly.',
  },
  Chinese: {
    weddingItems: [
      { title: 'Morning Tea Ceremony Set, Kneeling Cushions & Red Runners', estimateRange: '$380 – $780 AUD (sample est.)', detail: 'Heirloom teapot setup, Double Happiness accents & robes prep' },
      { title: 'Lion Dance Blessing Troupe & Bilingual Mandarin/Cantonese MC', estimateRange: '$1,500 – $2,750 AUD (sample est.)', detail: 'Entrance percussion blessing + multi-dialect hosting' },
      { title: '9-Course Roast, Whole Barramundi & Banquet Menu Upgrade', estimateRange: '$1,800 – $3,600 AUD (sample est.)', detail: 'Auspicious multi-course seafood & longevity noodle dishes' },
    ],
    generalItems: [
      { title: 'Lion Dance Blessing & Live Drum Percussion', estimateRange: '$900 – $1,850 AUD (sample est.)', detail: '15–20 min auspicious entrance & cabbage/lettuce blessing' },
      { title: 'Cantonese Roast, Barramundi & Longevity Buns Menu', estimateRange: '$1,100 – $2,400 AUD (sample est.)', detail: 'Shared round-table platters & steamed bamboo dim sum' },
      { title: 'Silk Lanterns, Peach Blossoms & Bilingual MC', estimateRange: '$750 – $1,600 AUD (sample est.)', detail: 'Cantonese/Mandarin & English greetings for all tables' },
    ],
    weddingMilestone: () => ({
      title: 'Schedule Morning Tea Ceremony, Red Envelope Prep & Lion Dance',
      desc: 'Allow 60–90 minutes for elders’ tea blessings before changing or transitioning to afternoon vows.',
      tip: 'Keep a tidy red-envelope ledger assigned to a trusted sibling during morning tea blessings.',
    }),
    generalMilestone: (eventType) => ({
      title: `Confirm Lion Dance Clearance & Banquet Table Setup (${eventType})`,
      desc: 'Check venue ceiling height for Lion lifts, prepare fresh lettuce prop, and confirm bilingual MC script.',
      tip: 'Keeping round tables evenly spaced gives Lion performers smooth access across the whole room.',
    }),
    insightTitle: 'Chinese Cultural Insights (Sample Estimate)',
    weddingInsight:
      'Building a 45-minute dress-change buffer between morning tea ceremony and afternoon portraits avoids photographer overtime fees.',
    generalInsight:
      'Local Gouger Street & Adelaide round-table caterers offering seasonal SA barramundi and whole roast platters deliver standout value.',
  },
  'Middle Eastern': {
    weddingItems: [
      { title: 'Zaffeh Drummers & Grand Entrance Horn Crew', estimateRange: '$1,200 – $2,400 AUD (sample est.)', detail: 'Live dabke rhythm percussionists leading couple entrance' },
      { title: '100% Halal Mezze, Lamb Mansaf & Live Knafeh Station', estimateRange: '$1,600 – $3,400 AUD (sample est.)', detail: 'Certified Halal banquet + fresh cheese knafeh trays' },
      { title: 'Bilingual Arabic-English MC & Floral Kosha Stage', estimateRange: '$1,400 – $2,600 AUD (sample est.)', detail: 'Raised head backdrop + energetic floor hosting' },
    ],
    generalItems: [
      { title: '100% Halal Mezze, Charcoal Mashawi & Knafeh Bar', estimateRange: '$1,000 – $2,200 AUD (sample est.)', detail: 'Certified Halal platters, saffron rice & warm syrup pastry' },
      { title: 'Live Oud / Arabic Percussion or Bilingual DJ-MC', estimateRange: '$850 – $1,700 AUD (sample est.)', detail: 'Warm arrival instrumentals + dabke floor sets' },
      { title: 'Brass Lanterns, Zero-Proof Rose Spritz & Tea Cart', estimateRange: '$550 – $1,250 AUD (sample est.)', detail: 'Alcohol-free botanical mocktails & mint tea service' },
    ],
    weddingMilestone: () => ({
      title: 'Book Zaffeh Entrance Drummers, Halal Banquet & Kosha Backdrop',
      desc: 'Confirm Zaffeh noise/courtyard cues with venue and verify written 100% Halal kitchen certification.',
      tip: 'Ask your caterer about separate mocktail glasses so zero-proof mint/rose spritzes match table elegance.',
    }),
    generalMilestone: (eventType) => ({
      title: `Verify Halal Certification & Warm Knafeh Timing (${eventType})`,
      desc: 'Confirm zero-proof beverage station, halal meat sourcing notes, and lantern/seating layout.',
      tip: 'Serving hot cheese knafeh 30 minutes after mains maximises freshness and creates a focal moment.',
    }),
    insightTitle: 'Middle Eastern Cultural Insights (Sample Estimate)',
    weddingInsight:
      'Confirming Zaffeh entrance pathways and dry-hire Halal kitchen buyout terms early avoids costly last-minute venue surcharges.',
    generalInsight:
      'Elevating alcohol-free pairings (rose lassi, pomegranate mint spritz, Arabic coffee) creates genuinely inclusive celebration hospitality.',
  },
  'Pacific Islander': {
    weddingItems: [
      { title: 'Polynesian Siva Entrance Dancers & Log Drummers', estimateRange: '$1,100 – $2,200 AUD (sample est.)', detail: 'Traditional dance escort and celebration floor show' },
      { title: 'Island Roast, Coconut Seafood & Abundant Buffet Upgrade', estimateRange: '$1,500 – $3,100 AUD (sample est.)', detail: 'Umu-inspired platters, oka/palusami & tropical fruit' },
      { title: 'Tropical Foliage, Woven Mats & Garland Styling', estimateRange: '$800 – $1,650 AUD (sample est.)', detail: 'Frangipani, ti leaf accents & woven aisle runners' },
    ],
    generalItems: [
      { title: 'Polynesian Dance Showcase & Island Drum Ensemble', estimateRange: '$850 – $1,650 AUD (sample est.)', detail: 'High-warmth Siva performance and audience welcome' },
      { title: 'Pacific Island Roast & Coconut Cream Platter Menu', estimateRange: '$950 – $2,100 AUD (sample est.)', detail: 'Generous family-style platters & tropical desserts' },
      { title: 'Woven Floor Mats, Tropical Foliage & Lei Keepsakes', estimateRange: '$500 – $1,100 AUD (sample est.)', detail: 'Warm ceremonial garlands and bright foliage accents' },
    ],
    weddingMilestone: () => ({
      title: 'Book Siva Dance Group, Abundant Feast & Tropical Foliage',
      desc: 'Confirm ceiling clearance and stage floor width for Siva dancers and large extended-family headcounts.',
      tip: 'Buffer guest headcounts by +10% on abundant buffet orders so elders and extended kin always dine comfortably.',
    }),
    generalMilestone: (eventType) => ({
      title: `Coordinate Island Feast Portions & Dance Showcase (${eventType})`,
      desc: 'Check venue kitchen warming trays for coconut dishes and assign stage sound cues for drummers.',
      tip: 'Warm welcome garlands (leis) presented to elders/honourees early set an unforgettable family tone.',
    }),
    insightTitle: 'Pacific Islander Cultural Insights (Sample Estimate)',
    weddingInsight:
      'Reserving spacious inner-west civic pavilions gives flexible seating for extended church and family groups without strict per-plate minimums.',
    generalInsight:
      'Shared abundant feast platters paired with a 15-minute live cultural dance set create high warmth across generations.',
  },
  Other: {
    weddingItems: [
      { title: 'Bilingual Officiant or Ceremony Interpreter', estimateRange: '$650 – $1,300 AUD (sample est.)', detail: 'Bridges family elders and local guests smoothly' },
      { title: 'Custom Cultural Ensemble or Folk Performers', estimateRange: '$900 – $1,900 AUD (sample est.)', detail: 'Tailored live acoustic music or heritage dance set' },
      { title: 'Specialty Cultural Catering Menu Add-On', estimateRange: '$950 – $2,100 AUD (sample est.)', detail: 'Signature heritage dishes integrated alongside SA fare' },
    ],
    generalItems: [
      { title: 'Bilingual / Cultural Host & Programme Notes', estimateRange: '$550 – $1,100 AUD (sample est.)', detail: 'Translates greetings and ceremonial context clearly' },
      { title: 'Heritage Music Act or Cultural Performers', estimateRange: '$750 – $1,650 AUD (sample est.)', detail: 'Authentic live musicians or regional performance troupe' },
      { title: 'Signature Heritage Platters & Dietary Cards', estimateRange: '$700 – $1,600 AUD (sample est.)', detail: 'Full ingredient/allergen signage alongside authentic dishes' },
    ],
    weddingMilestone: () => ({
      title: 'Confirm Cultural Ceremony Protocols & Bilingual Programme',
      desc: 'Brief celebrant, venue manager, and photographer on custom heirloom items and ritual timing.',
      tip: 'A concise 1-page pocket guide helps guests from every background understand and enjoy your ceremony.',
    }),
    generalMilestone: (eventType) => ({
      title: `Finalise Heritage Menu, Host Script & Cultural Brief (${eventType})`,
      desc: 'Share pronunciation notes, allergen signage, and room setup needs with your chosen Adelaide vendors.',
      tip: 'Confirm venue dry-hire flexibility upfront before locking external specialty food or music acts.',
    }),
    insightTitle: 'Custom Cultural Planning Insights (Sample Estimate)',
    weddingInsight:
      'Pairing clear vendor run-sheets with a brief bilingual ceremony outline prevents timing misunderstandings on the day.',
    generalInsight:
      'Selecting an Adelaide dry-hire venue gives complete freedom to bring in community caterers, musicians, and decorators tailored to your heritage.',
  },
};

export function getCulturalAdjustment(
  eventType: EventTypeTag,
  tradition: PlannerCulturalTradition
): CulturalAdjustment | null {
  if (tradition === 'None') return null;
  const entry = TRADITION_NOTES[tradition];
  const weddingMode = isWeddingLike(eventType);
  const leadDays = eventType === 'Weddings' ? 120 : eventType === 'Community Festivals' ? 60 : 28;
  const leadLabel =
    leadDays >= 120
      ? '4 months before'
      : leadDays >= 60
      ? '2 months before'
      : '4 weeks before';

  const milestoneData = weddingMode
    ? entry.weddingMilestone(leadDays)
    : entry.generalMilestone(eventType, leadDays);

  return {
    budgetLineItems: weddingMode ? entry.weddingItems : entry.generalItems,
    milestone: {
      id: `cultural-${tradition.toLowerCase().replace(/[^a-z0-9]/g, '')}-${eventType
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')}`,
      serviceId: 'entertainment',
      serviceLabel: `${tradition} Elements`,
      leadDays,
      leadLabel,
      title: milestoneData.title,
      description: milestoneData.desc,
      isCritical: true,
      adelaideTip: milestoneData.tip,
      dayOfTime: weddingMode ? '02:30 PM' : '06:45 PM',
    },
    insightTitle: entry.insightTitle,
    insightBody: weddingMode ? entry.weddingInsight : entry.generalInsight,
  };
}
