/**
 * SERVICES PAGE COMPONENT
 * 
 * Displays the company's services and offerings.
 * Content is loaded dynamically from markdown files via the /api/services endpoint.
 * 
 * PAGE STRUCTURE:
 * 1. Intro section - Hero section with title and description
 * 2. Services areas section - Service cards with features lists
 * 3. Contact section - Call-to-action for getting in touch
 * 
 * DATA FLOW:
 * - Component fetches from /api/services on mount
 * - API loads content from content/pages/services.md → sections → blocks
 * - Content is rendered using renderMarkdown() utility
 * 
 * FEATURES:
 * - Service cards display title, description, and feature lists
 * - Icons for each service type (data, web, combined)
 * - Special styling for "combined" service (neon border)
 * - CTA buttons in contact section
 */
'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import '../styles/services.css';
import Image from 'next/image';
import ContactSection from '../components/ContactSection';

// Type definitions for content structure
interface Feature {
  title: string;
  text: string;
}

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
  slug?: string;  // Service identifier: "data", "web", or "combined"
  features?: Feature[];  // List of features for this service
  cta?: CTA | CTA[];
}

interface Section {
  title?: string;
  blocks: Record<string, Block>;
}

interface BlocksData {
  [sectionId: string]: Section;
}

export default function Services() {
  // State for page content loaded from API
  const [blocks, setBlocks] = useState<BlocksData | null>(null);

  /**
   * EFFECT: Load page content from API
   * 
   * Fetches all content blocks for the Services page on component mount.
   * The API endpoint loads content from markdown files in the /content directory.
   */
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const blocksResponse = await fetch('/api/services');
        
        if (blocksResponse.ok) {
          const data = await blocksResponse.json();
          setBlocks(data);
        } else {
          console.error('Failed to fetch process data');
        }
      } catch (error) {
        console.error('Error fetching process data:', error);
      }
    };
    fetchBlocks();
  }, []);

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
      {/* INTRO SECTION - Hero section with title and description */}
      <section id="services-intro" className="min-h-screen flex flex-col items-center py-16 relative overflow-hidden">
        {/* Background image container (animated, positioned at bottom) */}
        <div className="image-intro-container absolute bottom-0 left-0 w-full h-[30vh] mobile-large:h-[40vh] translate-y-full opacity-0">
          <div className="image-intro"></div>
        </div>
        <div className="container">
          {/* Render section title if available */}
          {blocks && blocks["services-intro"] && blocks["services-intro"].title && (
            <h1 className="text-4xl medium:text-5xl large:text-6xl text-brand-tertiary text-center mb-8 mt-[15vh]" dangerouslySetInnerHTML={renderMarkdown(blocks["services-intro"].title, true)}></h1>
          )}
          {/* Render all blocks in the intro section */}
          {blocks && blocks["services-intro"] && Object.entries(blocks["services-intro"].blocks).map(([blockId, block]: [string, Block]) => (
            <div key={blockId} className="medium:text-xl large:text-2xl max-w-[600px] large:max-w-screen-tablet large:leading-relaxed mx-auto text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
      </section>

      {/* SERVICES AREAS SECTION - Service cards with features */}
      <section id="services-areas" className="relative">
        {/* Background color overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-brand-tertiary z-0"></div>
        <div className="container relative z-1">
          {/* Render each service block (typically: data, web, combined) */}
          {blocks && blocks["services-areas"] && Object.entries(blocks["services-areas"].blocks).map(([blockId, block]: [string, Block]) => (
            <div key={blockId} className={`box box-${block.slug} p-8 desktop:p-12 mb-10 max-w-screen-small mx-auto ${block.slug === 'combined' ? 'neon-border-secondary' : ''}`}>
              <div className="content flex flex-col desktop:flex-row gap-12 justify-between">
                {/* Left side: Service intro (title, description, icon) */}
                <div className={`intro desktop:w-1/3 relative ${block.slug === 'combined' ? 'pt-24' : 'pt-20'} desktop:pt-0`}>
                  {/* Service title */}
                  <h2 className="text-4xl medium-large:text-5xl font-bold text-brand-secondary mb-8" 
                  dangerouslySetInnerHTML={{ __html: block.title || '' }}></h2>
                  {/* Service description */}
                  <div className="text text-xl text-bodyText" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                  
                  {/* Service icon(s) */}
                  {block.slug === 'combined' ? (
                    // Combined service shows both icons (data + web)
                    <div className="absolute top-0 desktop:top-auto desktop:bottom-[-10px] left-0 flex gap-4 items-start">
                      <Image src={`/img/services-combined-icon-data.svg`} alt="Data Solutions" width={82} height={71} loading="lazy" className="" />
                      <Image src={`/img/services-combined-icon-web.svg`} alt="Web and App Development" width={67} height={62} loading="lazy" className="" />
                    </div>
                  ) : (
                    // Individual service shows single icon
                    <Image src={`/img/services-${block.slug}-icon.svg`} alt={block.title || 'Service icon'} width={86} height={70} loading="lazy" className="absolute top-0 desktop:top-auto desktop:bottom-[-10px] left-0" />
                  )}
                </div>
                
                {/* Right side: Features list */}
                <div className="features desktop:w-[50%]">
                  <ul>
                    {/* Render each feature in the list */}
                    {block.features && block.features.map((feature: Feature, index: number) => (
                      <li key={feature.title || `feature-${index}`} className="mb-10 pl-10 desktop:pl-12 relative">
                        {/* Feature title */}
                        <h3 className="text-xl text-brand-primary font-bold mb-3" dangerouslySetInnerHTML={{ __html: feature.title }}></h3>
                        {/* Feature description */}
                        <div className="text-lg text-bodyText" dangerouslySetInnerHTML={renderMarkdown(feature.text)}></div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION - Call-to-action for getting in touch */}
      {blocks && blocks["services-contact"] && (() => {
        // Get the first (and typically only) block from the contact section
        const contactBlocks = Object.values(blocks["services-contact"].blocks) as Block[];
        const firstBlock = contactBlocks[0];
        const text = firstBlock?.text;
        
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
            sectionId="services-contact"
            text={text}
            ctas={ctas.length > 0 ? ctas : undefined}
          />
        );
      })()}
    </div>
  )
}

