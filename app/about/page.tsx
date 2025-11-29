'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { renderMarkdown } from '../utils/text';
import '../styles/about.css';
import ContactSection from '../components/ContactSection';
import ScrollDownButton from '../components/ScrollDownButton';
import Logo from '../components/Logo';
import { isElementVisible } from '../utils/visibility';

interface CTA {
  linkText: string;
  linkUrl?: string;
  color?: 'blue' | 'white';
}

interface Block {
  title?: string;
  text?: string;
  label?: string;
  linkText?: string;
  linkUrl?: string;
  number?: number;
  slug?: string;
  img?: string;
  features?: Array<{ title: string; text: string }>;
  cta?: CTA | CTA[];
}

interface Section {
  title?: string;
  blocks: Record<string, Block>;
}

interface BlocksData {
  [sectionId: string]: Section;
}

export default function About() {
  const [blocks, setBlocks] = useState<BlocksData | null>(null);
  const [buttonVisible, setButtonVisible] = useState(false);
  const boxBackgroundRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const blocksResponse = await fetch('/api/about');
        
        if (blocksResponse.ok) {
          const data = await blocksResponse.json();
          setBlocks(data);
        } else {
          console.error('Failed to fetch about data');
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchBlocks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simple scroll-based visibility check (same method as home page)
  useEffect(() => {
    const checkVisibility = () => {
      boxBackgroundRefs.current.forEach((boxBackground, blockId) => {
        const container = containerRefs.current.get(blockId);
        if (!boxBackground || !container) return;

        // Check if element is 100% visible (threshold: 1.0)
        if (isElementVisible(boxBackground, 1.0) && !container.classList.contains('visible')) {
          container.classList.add('visible');
        }
      });
    };

    // Check immediately
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [blocks]);

  if (!blocks) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <section id="about-intro" className="min-h-screen flex flex-col items-center pt-[10vh] relative overflow-hidden">
        <div className="container opacity-0 animate-fade-in">
          {blocks && blocks["about-intro"] && blocks["about-intro"].title && (
            <h1 className="title text-4xl medium:text-5xl large:text-6xl text-brand-tertiary text-center mb-8 mt-[15vh]" dangerouslySetInnerHTML={renderMarkdown(blocks["about-intro"].title, true)}></h1>
          )}
          {blocks && blocks["about-intro"] && Object.entries(blocks["about-intro"].blocks).map(([blockId, block]: [string, Block]) => (
            <div key={blockId} className="medium:text-xl large:text-2xl max-w-[600px] large:max-w-screen-tablet large:leading-relaxed mx-auto text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
        <ScrollDownButton text="Meet the owners" visible={buttonVisible} targetId="about-owners" />
      </section>

      <section id="about-owners" className="py-16">
        <div className="container">
          <div className="flex flex-col tablet:flex-row gap-16">
            {blocks && blocks["about-owners"] && Object.entries(blocks["about-owners"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className="flex flex-col w-full tablet:w-1/2">
                <div className="image-container relative w-full cursor-pointer overflow-hidden rounded-3xl mb-8">
                  <Image src={`/img/photo-${block.title?.toLowerCase()}-bn.jpg`} alt={block.title || 'Owner image'} width={600} height={600} className="photo-bn w-full h-full object-cover object-center absolute top-0 left-0" />
                  <Image src={`/img/photo-${block.title?.toLowerCase()}.jpg`} alt={block.title || 'Owner image'} width={600} height={600} className="photo-color w-full h-full object-cover object-center absolute top-0 left-0 opacity-0" />
                  <svg width="40" height="40" viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="brandmark absolute bottom-4 mobile-large:bottom-8 right-4 mobile-large:right-8 tablet:bottom-4 tablet:right-4 desktop:bottom-8 desktop:right-8">
                    <path d="M159.33 0V79.2097C159.33 122.957 123.624 158.47 79.6395 158.47C57.6471 158.47 37.7374 149.63 23.3129 135.283C12.1898 124.22 4.3681 109.873 1.37146 93.9098C12.9517 104.215 28.2397 110.53 45.0005 110.53C81.4679 110.53 111.13 81.0282 111.13 44.7574V0H159.33Z" className="brandmark-path brandmark-path-external"/>
                    <path d="M90.8133 0V44.7574C90.8133 69.9146 70.294 90.3233 45.0002 90.3233C19.7067 90.3233 0 70.2683 0 45.5657V0H90.8133Z" className="brandmark-path brandmark-path-internal"/>
                    <path d="M229.37 0V113.965C229.37 177.009 177.97 228.183 114.583 228.183C82.9409 228.183 54.2952 215.402 33.5726 194.791C19.6561 180.949 9.34563 163.622 4.01263 144.174C22.3479 165.289 49.4701 178.676 79.6395 178.676C134.798 178.676 179.646 134.07 179.646 79.2097V0H229.37Z" className="brandmark-path brandmark-path-external"/>
                  </svg>
                </div>
                <h2 className="text-2xl medium:text-3xl large:text-4xl font-bold text-brand-tertiary mb-4">{block.title}</h2>
                <div className="w-full" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-values" className="py-24 bg-brand-tertiary">
        <div className="container">
          <div className="flex flex-col gap-24">
            {blocks && blocks["about-values"] && Object.entries(blocks["about-values"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className="flex flex-col w-full max-w-screen-desktop mx-auto gap-8">
                <h2 className="title text-4xl medium:text-5xl text-brand-primary text-center" dangerouslySetInnerHTML={renderMarkdown(block.title, true)}></h2>
                <div className="w-full text-lg text-bodyText text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-work" className="py-16">
        <div className="container">
          <div className="flex flex-col">
            {blocks && blocks["about-work"] && Object.entries(blocks["about-work"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className="flex flex-col desktop:flex-row gap-16 desktop:gap-24 items-center justify-center">
                <div 
                  ref={(el) => {
                    if (el) containerRefs.current.set(blockId, el);
                    else containerRefs.current.delete(blockId);
                  }}
                  className="image-work-container relative w-full desktop:w-1/2 max-w-screen-mobile-large"
                >
                  <div className="box absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div 
                      ref={(el) => {
                        if (el) boxBackgroundRefs.current.set(blockId, el);
                        else boxBackgroundRefs.current.delete(blockId);
                      }}
                      className="box-background absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blueGradient rounded-full filter blur-3xl mix-blend-plus-lighter opacity-0"></div>
                    <Image src={`/img/about-how-we-work.png`} alt={`How we work`} width={481} height={481} className="box-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-plus-lighter opacity-0" />
                  </div>
                </div>
                <div className="content-container flex flex-col gap-8 justify-center desktop:w-1/2 max-w-screen-mobile-large">
                  <div className="hidden desktop:block">
                    <Logo width={184} height={32.5} className="w-[184px] h-[32.5px]" />
                  </div>
                  <h2 className="title text-4xl medium:text-5xl text-brand-tertiary" dangerouslySetInnerHTML={renderMarkdown(block.title, true)}></h2>
                  <div className="w-full" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {blocks && blocks["about-contact"] && (() => {
        const contactBlocks = Object.values(blocks["about-contact"].blocks) as Block[];
        const firstBlock = contactBlocks[0];
        const text = firstBlock?.text;
        const title = firstBlock?.title;

        // Extract CTAs from the cta field (can be array or single object)
        let ctas: Array<{ linkText: string; linkUrl?: string; variant: 'blue' | 'white' }> = [];
        if (firstBlock?.cta) {
          if (Array.isArray(firstBlock.cta)) {
            ctas = firstBlock.cta.map((cta: CTA) => {
              let linkUrl = cta.linkUrl;
              // If linkUrl doesn't start with http or #, prepend /
              if (linkUrl && !linkUrl.startsWith('http') && !linkUrl.startsWith('#') && !linkUrl.startsWith('/')) {
                linkUrl = `/${linkUrl}`;
              }
              return {
                linkText: cta.linkText,
                linkUrl: linkUrl,
                variant: cta.color === 'white' ? 'white' : 'blue'
              };
            });
          } else {
            // Single CTA object
            let linkUrl = firstBlock.cta.linkUrl;
            if (linkUrl && !linkUrl.startsWith('http') && !linkUrl.startsWith('#') && !linkUrl.startsWith('/')) {
              linkUrl = `/${linkUrl}`;
            }
            ctas = [{
              linkText: firstBlock.cta.linkText,
              linkUrl: linkUrl,
              variant: firstBlock.cta.color === 'white' ? 'white' : 'blue'
            }];
          }
        }
        
        return (
          <ContactSection
            sectionId="about-contact"
            title={title}
            text={text}
            ctas={ctas.length > 0 ? ctas : undefined}
          />
        );
      })()}
    </div>
  )
}
