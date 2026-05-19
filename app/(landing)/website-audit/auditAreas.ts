export interface AuditArea {
  title: string;
  icon: string;
  iconAlt: string;
  problem: string;
  text: string;
  width?: number; // Just for over desktop breakpoint
}

const auditAreas: AuditArea[] = [
  {
    title: 'Performance',
    icon: '/img/landing/icon-bolt.svg',
    iconAlt: 'Bolt icon',
    problem: 'A slow website loses visitors before they’ve even read a word.',
    text: 'We measure how fast your site loads and identify what’s slowing it down.',
  },
  {
    title: 'Mobile experience',
    icon: '/img/landing/icon-mobile.svg',
    iconAlt: 'Mobile icon',
    problem: 'Probably, people’s first look at your website is on their phone. \nWhat does it look like?',
    text: 'We test how your site looks on mobile devices. Layout, usability and readability.',
    /* width: 260, */
  },
  {
    title: 'Google visibility (SEO)',
    icon: '/img/landing/icon-magnifying-glass.svg',
    iconAlt: 'Magnifying glass icon',
    problem: 'If Google can’t read your site correctly, your customers can’t find you.',
    text: 'We check whether Google can find, read and rank your pages correctly.',
  },
  {
    title: 'Security',
    icon: '/img/landing/icon-padlock.svg',
    iconAlt: 'Padlock icon',
    problem: 'An insecure site damages trust and puts your visitors at risk.',
    text: 'We verify your site has correct security settings, and isn’t exposing sensitive information.',
  },
  {
    title: 'Navigation and usability',
    icon: '/img/landing/icon-pointer.svg',
    iconAlt: 'Pointer icon',
    problem: 'If visitors can’t find what they’re looking for quickly, they leave.',
    text: 'We review how easy it is to find information and move through your site.',
  },
  {
    title: 'Content and copy',
    icon: '/img/landing/icon-document.svg',
    iconAlt: 'Document icon',
    problem: 'Unclear messaging loses customers before they’ve had a chance to contact you.',
    text: 'We assess whether your messaging is clear, accurate and easy to read.',
  },
  {
    title: 'Cookie Compliance',
    icon: '/img/landing/icon-cookie.svg',
    iconAlt: 'Cookie icon',
    problem: 'Privacy laws apply to your website too, and non-compliance carries real risk.',
    text: 'We check whether your site meets current privacy and cookie law requirements.',
  },
  {
    title: 'Accessibility',
    icon: '/img/landing/icon-accessibility.svg',
    iconAlt: 'Accessibility icon',
    problem: 'An inaccessible site excludes users and can expose you to legal liability.',
    text: 'We test whether your site can be used by people with visual or motor impairments.',
  },
];

export default auditAreas;
