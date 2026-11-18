// Place settings for the location template. Norwich is the original city page;
// "uk" is the national launch page (/lp/uk/). Add a city by adding an entry here
// and a page folder under pages/lp/<slug>/.
//
// Rules for every entry: the firm is fully remote and its only office is in Hethersett,
// Norwich. City pages say "working with businesses across <city>"; never imply a local office.

const remote =
  'Through video calls, phone conversations and cloud accounting software, you can share information and get answers wherever your working day takes you. We bring together accounts, tax, payroll and practical business support, with one point of contact. Already have a bookkeeper or finance team? We can work alongside them, fill the gaps and help turn your figures into useful decisions.';

const sharedFaqs = [
  ['What happens on the free discovery call?', 'We talk about your business, your current challenges and the support you need. It’s an opportunity to ask questions and understand how we could help, with no obligation.'],
  ['Which motor trade businesses do you support?', 'Independent dealers, small dealer groups, garages, workshops, body shops and specialist businesses, from start-ups to businesses turning over around £15 million.'],
  ['Can you work with our existing bookkeeper?', 'Yes. We can work alongside your existing team, filling gaps and providing specialist support where it’s needed.'],
  ['Can you review our current tax and accounts?', 'Yes. A business health check can identify issues in your systems, accounts and tax position. Any recommendations depend on your individual circumstances.'],
];

export const places = {
  norwich: {
    slug: 'norwich',
    city: 'Norwich',
    titlePlace: 'Norwich',
    metaDescription: 'Specialist motor trade accountants for Norwich dealers, garages and body shops. Book a free discovery call.',
    eyebrow: 'NORWICH & NORFOLK · MOTOR TRADE SPECIALISTS',
    h1Place: 'in Norwich.',
    sectorLine: 'Working with independent motor trade businesses across Norwich and Norfolk. Practical support that fits the way you work.',
    localEyebrow: 'NORWICH ROOTS. SPECIALIST SUPPORT.',
    localMiddle: 'Your city.',
    localIntro: 'Running an independent motor trade business in Norwich means keeping your attention on customers, stock and the next job through the workshop. Your accounts need to keep pace. Whether you sell used vehicles, run a garage or manage a body shop, we help you see where your business stands and plan what comes next.',
    localWhere: 'We’re based at Park Farm Business Park in Hethersett, Norwich. We work with businesses across the city and surrounding Norfolk towns, including Wymondham, Dereham and Great Yarmouth. Our service is fully remote, so there’s no need to leave your forecourt or close the workshop for an appointment.',
    localRemote: remote,
    chips: ['Norwich', 'Hethersett', 'Wymondham', 'Dereham', 'Great Yarmouth'],
    faqs: [
      ...sharedFaqs,
      ['Do I need to visit your Norwich office?', 'No. Although we are based in Hethersett, Norwich, our service is fully remote. We work with you by phone, video call and cloud accounting software, without office appointments or client visits.'],
      ['Can you take over from my current Norwich accountant mid-year?', 'We can discuss a mid-year switch and help plan a practical handover. The timing depends on your records, upcoming deadlines and existing arrangements.'],
    ],
    variants: ['motor-trade', 'automotive'],
  },
  uk: {
    slug: 'uk',
    city: 'UK',
    titlePlace: 'UK',
    metaDescription: 'Specialist motor trade accountants for independent dealers, garages and body shops across the UK. Fully remote. Book a free discovery call.',
    eyebrow: 'UK-WIDE · MOTOR TRADE SPECIALISTS',
    h1Place: 'across the UK.',
    sectorLine: 'Working with independent motor trade businesses across the UK. Practical support that fits the way you work.',
    localEyebrow: 'NORFOLK ROOTS. UK-WIDE SUPPORT.',
    localMiddle: 'Wherever you are.',
    localIntro: 'Running an independent motor trade business means keeping your attention on customers, stock and the next job through the workshop. Your accounts need to keep pace. Whether you sell used vehicles, run a garage or manage a body shop, we help you see where your business stands and plan what comes next.',
    localWhere: 'We’re based at Park Farm Business Park in Hethersett, Norwich, and work with motor trade businesses across England, Scotland and Wales. Our service is fully remote, so wherever you are, there’s no need to leave your forecourt or close the workshop for an appointment.',
    localRemote: remote,
    chips: ['UK-wide', 'Fully remote', 'Phone & video calls', 'Cloud accounting', 'One point of contact'],
    faqs: [
      ...sharedFaqs,
      ['Does it matter where in the UK we are?', 'No. Our office is in Hethersett, Norwich, but our service is fully remote. We work with you by phone, video call and cloud accounting software, without office appointments or client visits.'],
      ['Can you take over from my current accountant mid-year?', 'We can discuss a mid-year switch and help plan a practical handover. The timing depends on your records, upcoming deadlines and existing arrangements.'],
    ],
    variants: ['motor-trade', 'automotive', 'dealership', 'used-car'],
  },
};

const keywordWords = { 'motor-trade': 'Motor Trade', automotive: 'Automotive', dealership: 'Dealership', 'used-car': 'Used Car Dealer' };
const formHeadings = {
  'motor-trade': 'Book your free discovery call',
  automotive: 'Your free automotive discovery call',
  dealership: 'Your free dealership discovery call',
  'used-car': 'Your free used car dealer discovery call',
};

export function placeProps(slug, value) {
  const place = places[slug];
  const kw = place.variants.includes(value) ? value : 'motor-trade';
  return { kw, keyword: keywordWords[kw], formHeading: formHeadings[kw], place };
}
