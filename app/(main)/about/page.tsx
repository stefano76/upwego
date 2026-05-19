/**
 * ABOUT PAGE COMPONENT
 * 
 * This page displays information about the company/team.
 * Content is loaded dynamically from markdown files via the /api/about endpoint.
 * 
 * PAGE STRUCTURE:
 * 1. Intro section - Hero section with main title and intro text
 * 2. Owners section - Profiles of team members (Stefano, Nadja)
 * 3. Values section - Mission and vision statements
 * 4. Work section - "How we work" with animated image
 * 5. Contact section - Call-to-action for getting in touch
 * 
 * DATA FLOW:
 * - Component fetches from /api/about on mount
 * - API loads content from content/pages/about.md → sections → blocks
 * - Content is rendered using renderMarkdown() utility
 * 
 * ANIMATIONS:
 * - ScrollDownButton appears after 1 second delay
 * - Work section uses scroll-based visibility detection for animations
 */
'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { renderMarkdown } from '@/app/utils/text';
import '@/app/styles/about.css';
import ContactSection from '@/app/components/ContactSection';
import ScrollDownButton from '@/app/components/ScrollDownButton';
import Logo from '@/app/components/Logo';
import { isElementVisible } from '@/app/utils/visibility';

// Type definitions for content structure
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
  // State for page content loaded from API
  const [blocks, setBlocks] = useState<BlocksData | null>(null);
  
  // Controls visibility of scroll-down button (appears after delay)
  const [buttonVisible, setButtonVisible] = useState(false);
  
  // Refs for scroll-based animations in the "work" section
  // These track DOM elements to detect when they become visible
  const boxBackgroundRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /**
   * EFFECT: Load page content from API
   * 
   * Fetches all content blocks for the About page on component mount.
   * The API endpoint loads content from markdown files in the /content directory.
   */
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

  /**
   * EFFECT: Show scroll-down button after delay
   * 
   * The button appears 1 second after page load for a smoother UX.
   * This gives the intro content time to render before showing the CTA.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * EFFECT: Scroll-based animation for "work" section
   * 
   * This creates a scroll-triggered animation effect for the "How we work" section.
   * When the background element becomes fully visible (100% threshold), it adds
   * a 'visible' class that triggers CSS animations.
   * 
   * HOW IT WORKS:
   * - Tracks elements using refs stored in Maps (keyed by blockId)
   * - On scroll, checks if elements are visible using isElementVisible()
   * - Adds 'visible' class when threshold is met, triggering CSS animations
   */
  useEffect(() => {
    const checkVisibility = () => {
      boxBackgroundRefs.current.forEach((boxBackground, blockId) => {
        const container = containerRefs.current.get(blockId);
        if (!boxBackground || !container) return;

        // Check if element is 100% visible (threshold: 1.0)
        // Only add class once (check if already has 'visible' class)
        if (isElementVisible(boxBackground, 1.0) && !container.classList.contains('visible')) {
          container.classList.add('visible');
        }
      });
    };

    // Check immediately on mount (in case elements are already visible)
    checkVisibility();
    
    // Check on scroll events
    window.addEventListener('scroll', checkVisibility);
    
    // Cleanup: remove event listener on unmount
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [blocks]); // Re-run when blocks are loaded (refs need to be set first)

  // Show loading spinner while content is being fetched
  if (!blocks) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      {/* INTRO SECTION - Hero section with main title and intro text */}
      <section id="about-intro" className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
        <div className="container opacity-0 animate-fade-in">
          {/* Render section title if available */}
          {blocks && blocks["about-intro"] && blocks["about-intro"].title && (
            <h1 className="title text-4xl medium:text-5xl large:text-6xl text-brand-tertiary mb-8 text-center" dangerouslySetInnerHTML={renderMarkdown(blocks["about-intro"].title, true)}></h1>
          )}
          {/* Render all blocks in the intro section */}
          {blocks && blocks["about-intro"] && Object.entries(blocks["about-intro"].blocks).map(([blockId, block]: [string, Block]) => (
            <div key={blockId} className="medium:text-xl large:text-2xl max-w-screen-tablet medium:max-w-screen-desktop large:max-w-screen-small mx-auto text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
        {/* Scroll-down button that appears after delay */}
        <ScrollDownButton text="Meet the owners" visible={buttonVisible} targetId="about-owners" />
      </section>

      {/* OWNERS SECTION - Team member profiles */}
      <section id="about-owners" className="py-16">
        <div className="container">
          <div className="flex flex-col tablet:flex-row gap-16 max-w-screen-small mx-auto">
            {/* Render each owner block (typically Stefano and Nadja) */}
            {blocks && blocks["about-owners"] && Object.entries(blocks["about-owners"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className="flex flex-col w-full tablet:w-1/2">
                {/* Image container with hover effect (black & white to color) */}
                <div className="image-container relative w-full cursor-pointer overflow-hidden rounded-3xl mb-8">
                  {/* Black & white base image */}
                  <Image src={`/img/photo-${block.title?.toLowerCase()}-bn.jpg`} alt={block.title || 'Owner image'} width={600} height={600} loading="lazy" className="photo-bn w-full h-full object-cover object-center absolute top-0 left-0" />
                  {/* Color image that appears on hover (CSS handles the transition) */}
                  <Image src={`/img/photo-${block.title?.toLowerCase()}.jpg`} alt={block.title || 'Owner image'} width={600} height={600} loading="lazy" className="photo-color w-full h-full object-cover object-center absolute top-0 left-0 opacity-0" />
                  {/* Brandmark overlay in bottom-right corner */}
                  <svg width="40" height="40" viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="brandmark absolute bottom-4 mobile-large:bottom-8 right-4 mobile-large:right-8 tablet:bottom-4 tablet:right-4 desktop:bottom-8 desktop:right-8">
                    <path d="M159.33 0V79.2097C159.33 122.957 123.624 158.47 79.6395 158.47C57.6471 158.47 37.7374 149.63 23.3129 135.283C12.1898 124.22 4.3681 109.873 1.37146 93.9098C12.9517 104.215 28.2397 110.53 45.0005 110.53C81.4679 110.53 111.13 81.0282 111.13 44.7574V0H159.33Z" className="brandmark-path brandmark-path-external"/>
                    <path d="M90.8133 0V44.7574C90.8133 69.9146 70.294 90.3233 45.0002 90.3233C19.7067 90.3233 0 70.2683 0 45.5657V0H90.8133Z" className="brandmark-path brandmark-path-internal"/>
                    <path d="M229.37 0V113.965C229.37 177.009 177.97 228.183 114.583 228.183C82.9409 228.183 54.2952 215.402 33.5726 194.791C19.6561 180.949 9.34563 163.622 4.01263 144.174C22.3479 165.289 49.4701 178.676 79.6395 178.676C134.798 178.676 179.646 134.07 179.646 79.2097V0H229.37Z" className="brandmark-path brandmark-path-external"/>
                  </svg>
                </div>
                {/* Owner name */}
                <h2 className="text-2xl medium:text-3xl large:text-4xl font-bold text-brand-tertiary mb-4">{block.title}</h2>
                {/* Owner bio text (rendered from markdown) */}
                <div className="w-full" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES SECTION - Mission and vision statements */}
      <section id="about-values" className="py-24 bg-brand-tertiary">
        <div className="container">
          <div className="flex flex-col gap-24">
            {/* Render each value block (typically Mission and Vision) */}
            {blocks && blocks["about-values"] && Object.entries(blocks["about-values"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className="flex flex-col w-full max-w-screen-desktop mx-auto gap-8">
                <h2 className="title text-4xl medium:text-5xl text-brand-primary text-center" dangerouslySetInnerHTML={renderMarkdown(block.title, true)}></h2>
                <div className="w-full text-lg text-bodyText text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK SECTION - "How we work" with animated image */}
      <section id="about-work" className="py-16">
        <div className="container">
          <div className="flex flex-col">
            {blocks && blocks["about-work"] && Object.entries(blocks["about-work"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className="flex flex-col desktop:flex-row gap-16 desktop:gap-24 items-center justify-center">
                {/* Image container with scroll-triggered animation */}
                <div 
                  ref={(el) => {
                    // Store ref for visibility detection (used in useEffect above)
                    if (el) containerRefs.current.set(blockId, el);
                    else containerRefs.current.delete(blockId);
                  }}
                  className="image-work-container relative w-full desktop:w-1/2 max-w-screen-mobile-large"
                >
                  <div className="box absolute top-0 left-0 w-full h-full overflow-hidden">
                    {/* Animated background gradient */}
                    <div 
                      ref={(el) => {
                        // Store ref for visibility detection
                        // When this element becomes visible, the 'visible' class is added to container
                        if (el) boxBackgroundRefs.current.set(blockId, el);
                        else boxBackgroundRefs.current.delete(blockId);
                      }}
                      className="box-background absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blueGradient rounded-full filter blur-3xl mix-blend-plus-lighter opacity-0"></div>
                    {/* Main image that fades in on scroll */}
                    <Image src={`/img/about-how-we-work.png`} alt={`How we work`} width={481} height={481} loading="lazy" className="box-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-plus-lighter opacity-0" />
                  </div>
                </div>
                {/* Text content */}
                <div className="content-container flex flex-col gap-8 justify-center desktop:w-1/2 max-w-screen-mobile-large">
                  {/* Logo (hidden on mobile, shown on desktop) */}
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

      {/* CONTACT SECTION - Call-to-action for getting in touch */}
      {blocks && blocks["about-contact"] && (() => {
        // Get the first (and typically only) block from the contact section
        const contactBlocks = Object.values(blocks["about-contact"].blocks) as Block[];
        const firstBlock = contactBlocks[0];
        const text = firstBlock?.text;
        const title = firstBlock?.title;

        /**
         * PROCESS CTAs (Call-to-Action buttons)
         * 
         * The CTA field can be either:
         * - A single CTA object: { linkText: "...", linkUrl: "...", color: "blue" }
         * - An array of CTAs: [{ linkText: "..." }, { linkText: "..." }]
         * 
         * This code normalizes both formats and handles URL formatting.
         */
        let ctas: Array<{ linkText: string; linkUrl?: string; variant: 'blue' | 'white' }> = [];
        if (firstBlock?.cta) {
          if (Array.isArray(firstBlock.cta)) {
            // Multiple CTAs - map each one
            ctas = firstBlock.cta.map((cta: CTA) => {
              let linkUrl = cta.linkUrl;
              // Normalize URL: if it doesn't start with http, #, or /, prepend /
              // This handles relative URLs like "contact" → "/contact"
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
            // Single CTA object - wrap in array
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
        
        // Render ContactSection component with processed data
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
