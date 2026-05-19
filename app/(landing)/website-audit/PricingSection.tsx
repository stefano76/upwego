'use client';

import { useState } from 'react';
import Button from '../components/Button';

type Currency = 'NZD' | 'USD';

const prices: Record<Currency, { launch: number; full: number }> = {
  NZD: { launch: 600, full: 900 },
  USD: { launch: 400, full: 600 },
};

export default function PricingSection({ initialCurrency }: { initialCurrency: Currency }) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);

  const handleSwitch = (c: Currency) => {
    setCurrency(c);
    document.cookie = `preferred-currency=${c};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  };

  const { launch, full } = prices[currency];

  return (
    <div className="pricing-box max-w-[--size-inner-container] mx-auto mt-10 p-8 pb-24 tablet:p-12 rounded-3xl gradient white relative">
      <div className="offer flex flex-col tablet:flex-row gap-x-10 gap-y-6">
        <div className="offer-price text-center border-b border-brand-tertiary/50 pb-6 tablet:border-0 tablet:pb-0 tablet:text-left tablet:w-1/2 flex flex-col items-start justify-between gap-6">
          <div className="flex flex-col desktop:flex-row gap-y-4 w-full items-center justify-between">
            <h4 className="text-3xl font-semibold tablet:self-start">Launch offer</h4>
            <div className="flex items-center gap-2 text-sm font-semibold select-none tablet:self-start desktop:self-auto">
              <button
                onClick={() => handleSwitch('NZD')}
                className={`transition-colors ${currency === 'NZD' ? 'text-[#11A4F4]' : 'text-white/40 hover:text-white/60'}`}
              >
                NZD
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => handleSwitch('USD')}
                className={`transition-colors ${currency === 'USD' ? 'text-[#11A4F4]' : 'text-white/40 hover:text-white/60'}`}
              >
                USD
              </button>
            </div>
          </div>
          <div className="prices w-full">
            <div className="relative px-2 w-fit mx-auto tablet:mx-0">
              <h5 className="text-4xl font-bold text-yellow">
                <span className="font-light text-2xl">$</span>{full}<span className="asterisk"></span>
              </h5>
              <div className="bar absolute w-full h-1 bg-red-500 left-0 top-1/2 -translate-y-1/2"></div>
            </div>
            <h5 className="text-7xl font-bold">
              <span className="font-light text-3xl">$</span>{launch}
              <span className="font-light text-3xl">&nbsp;{currency}<span className="asterisk"></span></span>
            </h5>
            <div className="info mt-3">
              <p className="text-xl">Limited offer for the first <b className="text-2xl">10</b>&nbsp;clients</p>
              <p className="text-xl">Full price $<b className="text-2xl">{full}<span className="asterisk"></span></b> {currency}<span className="hidden sm:inline"> after that</span></p>
            </div>
          </div>
        </div>
        <div className="offer-included tablet:w-1/2">
          <h4 className="text-xl font-semibold">What&apos;s included</h4>
          <ul className="list-disc pl-3 mt-4 text-lg leading-relaxed">
            <li>Review of 8 key areas of your website</li>
            <li>Carried out by a real person, not an automated tool</li>
            <li>Plain language report, no jargon</li>
            <li>Prioritised list of issues by severity</li>
            <li>Actionable recommendations, not just a list of problems</li>
          </ul>
        </div>
      </div>
      <div className="cta">
        <Button className="mt-10 mx-auto"></Button>
      </div>
      <h6 className="disclaimer text-sm font-light text-white absolute bottom-8 left-8 tablet:bottom-12 tablet:left-12">
        * plus GST if applicable.
      </h6>
    </div>
  );
}
