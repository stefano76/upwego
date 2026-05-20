import type { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';
import Button from '../components/Button';

export const metadata: Metadata = {
  title: "Most websites have problems their owners never find out about | Upwego Digital",
  description: "Get a clear picture of what’s holding your website back, and a straightforward plan to put it right.",
  alternates: {
    canonical: '/website-audit',
  },
  openGraph: {
    images: ['/img/landing/website-audit.png'],
  },
};
import AuditCard from '../components/AuditCard';
import auditAreas from './auditAreas';
import AuditStepCard from '../components/AuditStep';
import auditSteps from './auditSteps';
import PricingSection from './PricingSection';
import AuditFaq from '../components/AuditFaq';
import auditFaqs from './auditFaqs';
import AuditContactForm from '../components/AuditContactForm';

export default async function AuditPage() {
  const headerStore = await headers();
  const rawCurrency = headerStore.get('x-preferred-currency');
  const initialCurrency = rawCurrency === 'NZD' ? 'NZD' : 'USD';
  return (
    <main>
      <section id="hero" className="section-block relative overflow-hidden">
        <div className="container relative z-10">
          <div className="u-strip absolute z-0 top-0 left-1/2 w-11/12 max-w-80 -translate-x-1/2 -translate-y-[calc(100%-5rem)] desktop:w-96 desktop:max-w-none desktop:-translate-y-[calc(100%-7rem)] small:-translate-y-[calc(100%-8rem)] opacity-30 pointer-events-none">
            <Image
              src="/img/u-strips-vertical.svg"
              alt=""
              aria-hidden={true}
              width={465}
              height={910}
            />
          </div>
          <div className="group grid gap-8 relative order-1 tablet:grid-cols-2">
            <Image
              src="/img/upwego-logo-light.svg"
              alt="Upwego Digital logo"
              width={180}
              height={32}
              className="logo d-block mx-auto tablet:mx-0 mb-8"
            />
            <div className="texts small:w-[520px] order-3 flex flex-col gap-y-8 justify-start self-end">
              <h1 className="text-3xl text-center tablet:text-left desktop:text-[40px] desktop:leading-[1.2] font-semibold white">Most websites have problems their owners never find out about</h1>
              <h2 className="text-lg font-light white text-center tablet:text-left">Get a clear picture of what’s holding your website back, and a straightforward plan to put it right.</h2>
              <Button className="justify-self-end"></Button>
            </div>
            <div className="image w-full flex items-start tablet:items-center justify-center tablet:justify-end order-2 row-span-2">
              <Image
                src="/img/landing/hero-areas.svg"
                alt="Areas of focus for our audit services"
                width={471}
                height={425}
                priority
                className="w-10/12 tablet:w-full max-w-[420px] small:max-w-[470px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="what-you-get" className="section-block gradient-section">
        <div className="container">
          <h3 className="section-title white">What the audit covers</h3>
          <h4 className="section-subtitle white">Every area is reviewed by a real person, with findings written in plain language. <br />No jargon, no automated reports.</h4>
          <div className="cards-grid mt-10 desktop:mt-12 gap-8 grid tablet:grid-cols-2">
            {auditAreas.map((area) => (
              <AuditCard key={area.title} {...area} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-block bg-brand-tertiary">
          <div className="container">
            <h3 className="section-title">How it works</h3>
            <div className="steps mt-16 desktop:mt-12 gap-y-16 gap-x-10 small:gap-x-16 flex flex-col desktop:flex-row items-center desktop:items-stretch">
              {auditSteps.map((step) => (
                <AuditStepCard key={step.title} {...step} />
              ))}
            </div>
          </div>
      </section>

      <section id="pricing" className="section-block bg-[--light-grey]">
        <div className="container">
          <h3 className="section-title">Simple, transparent pricing</h3>
          <PricingSection initialCurrency={initialCurrency} />
        </div>
      </section>

      <section id="about" className="section-block gradient-section">
        <div className="container">
          <div className="inner-about flex flex-col desktop:flex-row items-center desktop:items-stretch justify-between gap-y-10">
            <div className="image max-w-80 desktop:max-w-none desktop:w-5/12">
              <div className="relative group w-fit">
                <Image
                  src="/img/landing/photo-stefano.jpg"
                  alt="Stefano Bonuccelli"
                  width={960}
                  height={960}
                  sizes="(max-width: 1023px) 320px, 480px"
                  className="rounded-2xl"
                />
                <Image
                  src="/img/landing/photo-stefano-bn.jpg"
                  alt=""
                  aria-hidden
                  width={960}
                  height={960}
                  sizes="(max-width: 1023px) 320px, 480px"
                  className="absolute inset-0 rounded-2xl transition-opacity duration-500 group-hover:opacity-0"
                />
              </div>
              <h4 className='white font-light text-sm text-center mt-2'>Stefano Bonuccelli <br />Co-Founder and Web Solutions Lead</h4>
            </div>
            <div className="texts desktop:w-6/12 flex flex-col items-center desktop:items-start text-center desktop:text-left gap-y-8 justify-between">
              <Image
                src="/img/upwego-logo-light.svg"
                alt="Upwego Digital logo"
                width={220}
                height={39}
                className="logo d-block mx-auto tablet:mx-0 small:w-72 small:h-auto"
              />
              <div className="paragraphs white">
                <p className="text-lg mb-6">Upwego Digital is a digital agency focused on helping small and medium-sized businesses get the best from their online presence.</p>
                <p className="text-lg mb-6">With 15 years of hands-on web development experience across different industries and roles, I know what makes a website work and what holds it back.</p>
                <p className="text-lg mb-6">This audit is our way of giving business owners a clear, honest picture of where their website stands, without unnecessary upselling, and without further obligation.</p>
                <ul className="trust-signals list-none text-lg w-fit mx-auto desktop:mx-0 mt-10">
                  <li>Real person, not an automated tool</li>
                  <li>Plain language, no technical jargon</li>
                  <li>Clear, actionable recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-block bg-[--light-grey]">
        <div className="container">
          <h3 className="section-title">Your questions, answered</h3>
          <div className="faqs mt-10 flex flex-col gap-6 max-w-[--size-inner-container] mx-auto">
            {auditFaqs.map((item, index) => (
              <AuditFaq key={item.question} {...item} initialOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section id="final-cta" className="section-block bg-brand-tertiary">
        <div className="container">
          <h3 className="section-title">Find out what’s holding your website back</h3>
          <h4 className="section-subtitle">Fill in the form and we’ll take it from there.</h4>
          <div className="inner-container gradient mt-10 rounded-3xl px-6 pt-6 pb-10 desktop:p-12">
            <AuditContactForm />
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-brand-primary pt-8 pb-4">
        <div className="container text-center">
          <div className="upper-side flex flex-col items-center gap-y-4 tablet:flex-row tablet:justify-between tablet:items-end">
            <Image
              src="/img/upwego-logo-light.svg"
              alt="Upwego Digital logo"
              width={180}
              height={32}
              className="logo"
            />
            <h3 className="tagline text-brand-tertiary/60 font-medium tablet:relative tablet:-bottom-1 text-sm">Designing Momentum. Together.</h3>
          </div>
          <div className="lower-side pt-6 tablet:pt-3 mt-6 border-t border-brand-tertiary/30">
            <p className="text-xs text-brand-tertiary font-light flex flex-col tablet:flex-row items-center justify-center">
              <span>&copy; {new Date().getFullYear()} Upwego Digital Limited. All rights reserved.</span>
              <span className="links">
                <span className="hidden tablet:inline-block text-3xl align-middle mx-2">·</span> 
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <span className="inline-block text-3xl align-middle mx-2">·</span>
                <a href="/cookies" className="hover:underline">Cookie Policy</a>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
