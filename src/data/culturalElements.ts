import { CulturalTradition, EventTypeTag } from '../types';

const GENERAL_ELEMENTS: string[] = [
  'Cultural catering & dietary menu',
  'Bilingual MC & hosting',
  'Custom ceremony decor & styling',
  'Traditional music or live performers',
  'Photography & heritage coverage',
  'Timeline & family protocol coordination',
];

const TRADITION_DEFAULT_ELEMENTS: Record<CulturalTradition, string[]> = {
  Filipino: [
    'Veil, cord & arras ceremony rites',
    'Lechon & Filipino banquet feast',
    'Money dance & Pinoy party MC',
    'Barong & Filipiniana attire protocols',
    '18 Roses, Candles & Treasures debut',
    'Pamamanhikan family gathering',
  ],
  Greek: [
    'Stefana crowning ceremony',
    'Koumbaro & koumbara coordination',
    'Greek bouzouki & folk dancing',
    'Lamb spit & Greek mezze banquet',
    'Orthodox church & reception timing',
    'Bilingual Greek / English MC',
  ],
  Indian: [
    'Rangoli & diya lighting decor',
    'Baraat procession & dhol drummers',
    'Mehndi / henna styling',
    'Sangeet & Bollywood DJ',
    'Pheras, Mandap & marigold florals',
    'Vegetarian, Jain or chaat catering',
  ],
  Chinese: [
    'Traditional Chinese tea ceremony',
    'Lion dance & gong drumming',
    'Cantonese 8-course banquet menu',
    'Red & gold lantern styling',
    'Auspicious timing & red envelopes',
    'Cantonese / Mandarin bilingual MC',
  ],
  Italian: [
    'Porchetta, antipasti & pasta feast',
    'Bomboniere & confetti table',
    'Vineyard or courtyard long-table setup',
    'Italian classics DJ & tarantella',
    'Cannoli & espresso dessert bar',
    'Bilingual Italian / English hosting',
  ],
  'Middle Eastern or Muslim': [
    'Certified halal lamb & mezze banquet',
    'Nikah ceremony & modest styling',
    'Zaffe drummers & Dabke entrance',
    'Crescent, lantern & Majlis lounge decor',
    'Dedicated prayer space & family seating',
    'Arabic & English bilingual MC',
  ],
  'Pacific Islander': [
    'Polynesian blessing & Karakia',
    'Umu / Hāngi island feast catering',
    'Siva, Taualuga & log drumming troupe',
    'Tropical floral garlands & lei styling',
    'Multigenerational family MC & song',
    'Outdoor garden or marquee gathering',
  ],
  Vietnamese: [
    'Đám Hỏi & ancestral altar tea ceremony',
    'Áo Dài styling & family portraits',
    'Roast pork & Vietnamese banquet feast',
    'Silk lantern & calligraphy decor',
    'Lion dance & festive percussion',
    'Bilingual Vietnamese / English MC',
  ],
  Korean: [
    'Pyebaek traditional bowing ceremony',
    'Hanbok styling & portrait direction',
    'Korean banquet, BBQ & rice cakes',
    'Doljabi / Baek-il milestone table',
    'Samulnori drumming or acoustic set',
    'Bilingual Korean / English MC',
  ],
};

const EVENT_SPECIFIC_ELEMENTS: Partial<
  Record<EventTypeTag, Partial<Record<CulturalTradition, string[]>>>
> = {
  Weddings: {
    Filipino: [
      'Veil and cord rites',
      'Money dance',
      'Lechon & Filipino feast',
      'Barong & Filipiniana protocols',
      'Principal sponsor (Ninong / Ninang) seating',
      'Bilingual Tagalog / English MC',
    ],
    Greek: [
      'Stefana crowning',
      'Koumbaro & koumbara coordination',
      'Greek bouzouki & Kalamatiano dancing',
      'Lamb spit & Greek mezze catering',
      'Orthodox ceremony timing',
      'Loukoumades & dessert station',
    ],
    Indian: [
      'Baraat procession & dhol',
      'Mehndi night & henna',
      'Sangeet & Bollywood DJ',
      'Pheras & Mandap floral stage',
      'Vegetarian / Jain wedding catering',
      'Bridal dupatta & lehenga draping',
    ],
    Chinese: [
      'Morning tea ceremony',
      'Lion dance entrance',
      'Cantonese multi-course banquet',
      'Red envelope & auspicious customs',
      'Double Happiness & silk decor',
      'Cantonese / Mandarin MC',
    ],
    Italian: [
      'Porchetta & antipasti banquet',
      'Bomboniere & confetti table',
      'Vineyard long-table venue styling',
      'Italian classics DJ & MC',
      'Cannoli & gelato cart',
      'Olive branch & citrus florals',
    ],
    'Middle Eastern or Muslim': [
      'Nikah ceremony & modest styling',
      'Halal lamb & mezze banquet',
      'Zaffe drummers & Dabke troupe',
      'Henna night & bridal glam',
      'Family-friendly & prayer space setup',
      'Knafeh & Arabic coffee station',
    ],
    'Pacific Islander': [
      'Polynesian blessing & Karakia',
      'Umu island feast',
      'Siva & log drumming troupe',
      'Floral garlands & lei welcome',
      'Family speeches & waiata',
      'Coastal or garden ceremony styling',
    ],
    Vietnamese: [
      'Đám Hỏi & tea ceremony',
      'Áo Dài bridal & family styling',
      'Vietnamese roast banquet',
      'Silk lantern & floral backdrop',
      'Table-to-table toast coordination',
      'Bilingual Vietnamese / English MC',
    ],
    Korean: [
      'Pyebaek ceremony & table setup',
      'Hanbok bridal & family styling',
      'Korean banquet & fusion menu',
      'Floral arch & modern styling',
      'Bilingual Korean / English MC',
      'Candid documentary photography',
    ],
  },
  'Diwali & Festival of Lights': {
    Indian: [
      'Rangoli entrance & diya lighting',
      'Marigold garlands & floral torans',
      'Live chaat, tandoor & mithai sweets',
      'Bollywood DJ & dhol performers',
      'Festive lighting & stage backdrop',
      'Family & community photo coverage',
    ],
  },
  'Lunar New Year': {
    Chinese: [
      'Lion dance & cai qing blessing',
      'Red & gold lantern ceiling canopy',
      'Cantonese yum cha & prosperity banquet',
      'Calligraphy & auspicious banner decor',
      'Mandarin / Cantonese festive MC',
      'Family reunion photography',
    ],
    Vietnamese: [
      'Tết lion dance & drumming',
      'Yellow apricot & peach blossom florals',
      'Traditional Tết feast & bánh chưng',
      'Silk lantern & scroll backdrop',
      'Bilingual Vietnamese / English MC',
      'Áo Dài family portraits',
    ],
    Korean: [
      'Seollal traditional feast & rice cake soup',
      'Hanbok family portraits',
      'Samulnori percussion & cultural music',
      'Festive lantern & table styling',
      'Bilingual Korean / English MC',
    ],
  },
  Eid: {
    'Middle Eastern or Muslim': [
      'Certified halal Eid banquet & mezze',
      'Crescent moon & lantern styling',
      'Majlis lounge & family seating',
      'Live knafeh & Arabic coffee station',
      'Dedicated prayer area coordination',
      'Zaffe / acoustic Oud entertainment',
    ],
    Indian: [
      'Halal biryani, kebab & sheer khurma feast',
      'Festive lantern & floral decor',
      'Henna / mehndi artist corner',
      'Family portrait photography',
      'Modest glam hair & makeup',
    ],
  },
  'Milestone Birthdays': {
    Filipino: [
      '18 Roses, 18 Candles & 18 Treasures debut',
      'Lechon, pancit & halo-halo buffet',
      'Cotillion dance & debutante styling',
      'Karaoke & Pinoy party DJ / MC',
      'Milestone portrait & video coverage',
    ],
    Chinese: [
      'Longevity noodles & peach buns banquet',
      'Red & gold longevity banner decor',
      'Lion dance blessing',
      'Cantonese roast banquet menu',
      'Multigenerational family portraits',
    ],
    Greek: [
      'Greek spit roast & mezze banquet',
      'Live bouzouki & plate-free folk dancing',
      'Mediterranean table styling',
      'Bilingual Greek / English MC',
    ],
    Indian: [
      'Chaat & Indian banquet feast',
      'Bollywood DJ & dhol entrance',
      'Marigold & festive photo backdrop',
      'Henna artist & glam styling',
    ],
    Italian: [
      'Long-table antipasti & pasta feast',
      'Cannoli tower & espresso bar',
      'Vineyard or courtyard styling',
      'Italian classics DJ & live music',
    ],
    'Middle Eastern or Muslim': [
      'Halal mezze, grill & knafeh feast',
      'Dabke & festive Arabic DJ',
      'Lantern & floral table styling',
      'Family-friendly venue setup',
    ],
    'Pacific Islander': [
      '21st key ceremony & family speeches',
      'Umu island feast & dessert table',
      'Siva dance & log drumming',
      'Tropical floral garlands & lei',
    ],
    Vietnamese: [
      'Roast pork & Vietnamese banquet',
      'Silk lantern & floral backdrop',
      'Bilingual Vietnamese MC & karaoke',
      'Family milestone photography',
    ],
    Korean: [
      'Hwangap / 60th or 1st birthday feast',
      'Traditional rice cakes & Doljabi table',
      'Hanbok family portraits',
      'Bilingual Korean / English MC',
    ],
  },
  'Christenings & Baby Showers': {
    Filipino: [
      'Binyag reception & lechon lunch',
      'Ninong & Ninang sponsor favours',
      'Pastel floral & welcome signage',
      'Family & church photography',
    ],
    Greek: [
      'Orthodox christening coordination',
      'Martyrika & bomboniere table',
      'Greek family feast & loukoumades',
      'Church & reception photography',
    ],
    Italian: [
      'Battesimo family long lunch',
      'Bomboniere & sugared almond table',
      'Pastel floral & olive styling',
      'Church & family photography',
    ],
    Indian: [
      'Namkaran / baby blessing setup',
      'Vegetarian Indian lunch & mithai',
      'Marigold & pastel floral backdrop',
      'Family candid photography',
    ],
    Chinese: [
      'Red egg & ginger 100-day banquet',
      'Auspicious red & gold table accents',
      'Cantonese family lunch menu',
      'Multigenerational portraits',
    ],
    'Middle Eastern or Muslim': [
      'Aqiqah halal family feast',
      'Modest floral & balloon styling',
      'Quiet hall or marquee setup',
      'Arabic sweets & coffee table',
    ],
    'Pacific Islander': [
      'Polynesian baby blessing & Karakia',
      'Island umu family lunch',
      'Floral garlands & pastel arch',
      'Family portrait coverage',
    ],
    Vietnamese: [
      'Đầy Tháng Vietnamese family feast',
      'Silk lantern & pastel backdrop',
      'Vietnamese MC & acoustic music',
      'Family milestone photography',
    ],
    Korean: [
      'Baek-il / Doljabi rice cakes & feast',
      'Doljabi traditional table & photo wall',
      'Hanbok family portraits',
      'Bilingual Korean / English MC',
    ],
  },
  'Engagements & Proposals': {
    Filipino: [
      'Pamamanhikan family dinner',
      'Cliffside or garden proposal setup',
      'Undercover proposal photography',
      'Filipino feast & dessert table',
    ],
    Greek: [
      'Mediterranean engagement feast',
      'Greek bouzouki or coastal styling',
      'Koumbaro family toast setup',
      'Candid engagement photography',
    ],
    Indian: [
      'Roka floral & marigold stage',
      'Chaat & Indian canapé feast',
      'Dhol welcome & bridal glam',
      'Candid engagement photography',
    ],
    Chinese: [
      'Engagement tea & moon gate arch',
      'Cantonese banquet dinner',
      'Mandarin / Cantonese photographer',
      'Red & gold floral accents',
    ],
    Italian: [
      'Italian engagement long lunch',
      'Vineyard or coastal proposal styling',
      'Antipasti & cannoli station',
      'Candid editorial photography',
    ],
    'Middle Eastern or Muslim': [
      'Tulba / engagement floral arch',
      'Halal mezze & knafeh feast',
      'Zaffe entrance & Arabic music',
      'Modest glam hair & makeup',
    ],
    'Pacific Islander': [
      'Coastal blessing & floral garlands',
      'Island family dinner setup',
      'Acoustic island music',
      'Sunset proposal photography',
    ],
    Vietnamese: [
      'Lễ Dạm Ngõ intimate family tea',
      'Floral & silk backdrop styling',
      'Vietnamese family banquet',
      'Engagement portrait coverage',
    ],
    Korean: [
      'Sanggyeonrye family dinner styling',
      'Minimalist floral proposal arch',
      'Korean fusion tasting menu',
      'Candid editorial photography',
    ],
  },
};

export function getProposalCulturalElements(
  tradition: CulturalTradition | 'All Traditions',
  eventType: EventTypeTag | 'All Events' = 'All Events'
): string[] {
  if (tradition === 'All Traditions') {
    return GENERAL_ELEMENTS;
  }

  if (eventType !== 'All Events') {
    const specific = EVENT_SPECIFIC_ELEMENTS[eventType]?.[tradition];
    if (specific && specific.length > 0) {
      return specific;
    }
  }

  return TRADITION_DEFAULT_ELEMENTS[tradition] || GENERAL_ELEMENTS;
}
