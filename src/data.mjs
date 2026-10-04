// Single source of truth for company details and repeated content.
// Everything here comes from the client's existing website — edit here, then run `npm run build`.

export const site = {
  // Production origin, no trailing slash — used for canonical URLs, sitemap, Open Graph and structured data.
  url: 'https://www.taxsafs.com',
  // Paste the Google Search Console "HTML tag" verification code here (content value only).
  googleVerification: '',
  keywords: 'accounting services UAE, bookkeeping, VAT registration and filing, corporate tax UAE, audit and assurance, tax residency certificate, transfer pricing, customs registration, business consultancy, Ajman Free Zone',
  name: 'Smart Ample Financial Services',
  shortName: 'SMFS',
  nameAr: 'سمارت أمبل للخدمات المالية',
  legalName: 'Smart Ample Financial Services',
  tagline: 'Empowering businesses with expert accounting, tax, and consultancy solutions.',
  // One number for calls and WhatsApp.
  phone: '+971 54 599 5623',
  phoneHref: 'tel:+971545995623',
  email: 'smartamplefs@gmail.com',
  // Recipient for consultation requests from the contact form.
  formEmail: 'smartamplefs@gmail.com',
  whatsapp: 'https://wa.me/971545995623',
  whatsappDisplay: '+971 54 599 5623', // same as phone
  address: ['B.C. 1307715, C1 Building', 'Ajman Free Zone', 'United Arab Emirates'],
  hours: 'Mon – Sat, 9:00 AM – 6:00 PM',
  mapQuery: 'Ajman Free Zone C1 Building, Ajman, United Arab Emirates',
  // TODO: dummy links (platform home pages) — replace with the firm's real profile URLs.
  social: [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'X', href: 'https://x.com/' },
    { name: 'Facebook', href: 'https://www.facebook.com/' },
  ],
};

export const nav = [
  { key: 'about', label: 'About', href: 'about.html' },
  { key: 'services', label: 'Services', href: 'services.html' },
  { key: 'insights', label: 'Insights', href: 'insights.html' },
  { key: 'contact', label: 'Contact', href: 'contact.html' },
];

export const services = [
  {
    slug: 'accounting-bookkeeping',
    title: 'Accounting & Bookkeeping',
    short: 'Accounting',
    summary: 'Managing financial records, payroll, and statements with accuracy and compliance.',
    detail: 'Complete bookkeeping, payroll processing, and preparation of financial statements as per international standards.',
    scope: ['Bookkeeping', 'Payroll processing', 'Financial statements'],
    img: 'analytics.jpg',
    alt: 'Financial performance analytics displayed on a laptop screen',
  },
  {
    slug: 'vat-services',
    title: 'VAT Services',
    short: 'VAT',
    summary: 'VAT registration, filing, compliance, and advisory services for businesses.',
    detail: 'VAT registration, return filing, advisory, deregistration, and compliance support for smooth operations.',
    scope: ['Registration', 'Return filing', 'Advisory', 'Deregistration'],
    img: 'facade-night.jpg',
    alt: 'Modern office facade with illuminated windows at night',
  },
  {
    slug: 'corporate-tax',
    title: 'Corporate Tax',
    short: 'Corporate Tax',
    summary: 'Strategic tax planning, filing, and compliance to minimize corporate liabilities.',
    detail: 'Corporate tax planning, registration, filing, and advisory ensuring full regulatory compliance.',
    scope: ['Tax planning', 'Registration', 'Filing', 'Advisory'],
    img: 'glass-dusk.jpg',
    alt: 'Glass office building reflecting the sky at dusk',
  },
  {
    slug: 'audit-assurance',
    title: 'Audit & Assurance',
    short: 'Audit',
    summary: 'Financial audits, internal controls review, and regulatory compliance.',
    detail: 'Independent audits and assurance services to enhance transparency and stakeholder confidence.',
    scope: ['Financial audits', 'Internal controls review', 'Regulatory compliance'],
    img: 'late-office.jpg',
    alt: 'Professionals reviewing work in a dimly lit office',
  },
  {
    slug: 'tax-residency',
    title: 'Tax Residency',
    short: 'Tax Residency',
    summary: 'Complete assistance in obtaining tax residency certificates legally.',
    detail: 'End-to-end assistance for tax residency certification for individuals and businesses.',
    scope: ['Individuals', 'Businesses', 'End-to-end certification support'],
    img: 'airport.jpg',
    alt: 'Traveller standing at an airport window at sunrise',
  },
  {
    slug: 'business-consultancy',
    title: 'Business Consultancy',
    short: 'Business Advisory',
    summary: 'Expert guidance for business structuring, compliance, and sustainable growth.',
    detail: 'Strategic advisory, financial planning, compliance, and sustainable growth strategies.',
    scope: ['Strategic advisory', 'Financial planning', 'Business structuring'],
    img: 'boardroom.jpg',
    alt: 'Boardroom with a long conference table overlooking the city',
  },
  {
    slug: 'transfer-pricing',
    title: 'Transfer Pricing',
    short: 'Transfer Pricing',
    summary: 'Transfer pricing documentation, benchmarking analysis, and compliance aligned with international standards.',
    detail: 'Transfer pricing documentation, benchmarking analysis, and compliance aligned with international standards.',
    scope: ['Documentation', 'Benchmarking analysis', 'Compliance'],
    img: 'charts.jpg',
    alt: 'Monitor displaying comparative financial charts',
  },
  {
    slug: 'customs-registration',
    title: 'Customs Registration',
    short: 'Customs',
    summary: 'Customs registration, documentation, and compliance support for smooth import and export operations.',
    detail: 'Customs registration, documentation, and compliance support for smooth import and export operations.',
    scope: ['Registration', 'Documentation', 'Import & export compliance'],
    img: 'port.jpg',
    alt: 'Container port with loading cranes at dusk',
  },
];

// `value` animates on scroll; `text` is rendered as-is.
export const stats = [
  { value: 500, suffix: '+', label: 'Clients Served', note: 'Startups, SMEs and established enterprises.' },
  { value: 5, suffix: '+', label: 'Years Experience', note: 'Across the UAE and international markets.' },
  { value: 99, suffix: '%', label: 'Compliance Focus', note: 'Accuracy in every filing and report.' },
  { value: 24, suffix: '/7', label: 'Client Support', note: 'Clear communication, whenever you need it.' },
];

export const principles = [
  {
    title: 'Expertise',
    text: 'Our team consists of qualified professionals with deep expertise in accounting standards, VAT laws, and corporate taxation frameworks.',
    brief: 'Experienced accountants and tax consultants with deep regulatory knowledge.',
  },
  {
    title: 'Compliance',
    text: 'We ensure full regulatory compliance, minimizing risks and protecting your business from penalties and legal exposure.',
    brief: 'We ensure all services meet legal and statutory requirements.',
  },
  {
    title: 'Confidentiality',
    text: 'We maintain strict confidentiality protocols and data security standards to safeguard your financial information.',
    brief: 'Your financial data is handled with strict confidentiality.',
  },
  {
    title: 'Client Partnership',
    aboutTitle: 'Client-Centric Service',
    text: 'Every client receives tailored solutions based on business size, industry requirements, and growth objectives.',
    brief: 'Customized solutions aligned with your business goals.',
  },
];

export const process = [
  { title: 'Understand', text: 'We begin with your business: its objectives, industry challenges and compliance needs.' },
  { title: 'Analyze', text: 'We review your financial position to identify requirements, risks and opportunities.' },
  { title: 'Execute', text: 'We deliver accurate, timely work in line with UAE laws and international standards.' },
  { title: 'Advise', text: 'We stay alongside you with clear guidance as your business and the rules evolve.' },
];

// Only genuine client testimonials belong here. Navigation arrows appear automatically once there are two or more.
export const testimonials = [
  {
    quote: 'Smart Ample Financial Services provided outstanding support for audits, bookkeeping, and tax filing. Their professionalism and accuracy helped my business maintain compliance without any financial stress.',
    name: 'Call My Doctor LLC',
    role: 'Client',
  },
];

export const consultationPoints = [
  'Professional assessment of your accounting & tax needs',
  'Guidance on VAT, corporate tax, and compliance',
  'Risk identification and compliance insights',
  'Customized recommendations for your business',
  'Confidential and obligation-free discussion',
];
