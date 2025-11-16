'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import '../styles/services.css';
import Image from 'next/image';
import ContactSection from '../components/ContactSection';

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
  slug?: string;
  features?: Feature[];
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
  const [blocks, setBlocks] = useState<BlocksData | null>(null);

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

  if (!blocks) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <section id="services-intro" className="min-h-screen flex flex-col items-center py-16 relative overflow-hidden">
        <div className="image-intro-container absolute bottom-0 left-0 w-full h-[30vh] mobile-large:h-[40vh] translate-y-full opacity-0">
          <div className="image-intro"></div>
        </div>
        <div className="container">
          {blocks && blocks["services-intro"] && blocks["services-intro"].title && (
            <h1 className="text-4xl medium:text-5xl large:text-6xl text-brand-tertiary text-center mb-8 mt-[15vh]" dangerouslySetInnerHTML={renderMarkdown(blocks["services-intro"].title, true)}></h1>
          )}
          {blocks && blocks["services-intro"] && Object.entries(blocks["services-intro"].blocks).map(([blockId, block]: [string, Block]) => (
            <div key={blockId} className="medium:text-xl large:text-2xl max-w-[600px] large:max-w-screen-tablet large:leading-relaxed mx-auto text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
      </section>

        <section id="services-areas" className="relative">
          <div className="absolute bottom-0 left-0 w-full h-24 bg-brand-tertiary z-0"></div>
          <div className="container relative z-1">
            {blocks && blocks["services-areas"] && Object.entries(blocks["services-areas"].blocks).map(([blockId, block]: [string, Block]) => (
              <div key={blockId} className={`box box-${block.slug} p-8 desktop:p-12 mb-10 max-w-screen-small mx-auto ${block.slug === 'combined' ? 'neon-border-secondary' : ''}`}>
                <div className="content flex flex-col desktop:flex-row gap-12 justify-between">
                  <div className="intro desktop:w-1/3 relative pt-20 desktop:pt-0">
                    <h2 className="text-4xl medium-large:text-5xl font-bold text-brand-secondary mb-8" 
                    dangerouslySetInnerHTML={{ __html: block.title || '' }}></h2>
                    <div className="text text-xl text-bodyText" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                    <Image src={`/img/services-${block.slug}-icon.svg`} alt={block.title || 'Service icon'} width={86} height={70} className="absolute top-0 desktop:top-auto desktop:bottom-[-10px] left-0" />
                  </div>
                  <div className="features desktop:w-[50%]">
                    <ul>
                      {block.features && block.features.map((feature: Feature, index: number) => (
                        <li key={feature.title || `feature-${index}`} className="mb-10 pl-10 desktop:pl-12 relative">
                          <h3 className="text-xl text-brand-primary font-bold mb-3" dangerouslySetInnerHTML={{ __html: feature.title }}></h3>
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

        {blocks && blocks["services-contact"] && (() => {
          const contactBlocks = Object.values(blocks["services-contact"].blocks) as Block[];
          const firstBlock = contactBlocks[0];
          const text = firstBlock?.text;
          
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
              sectionId="services-contact"
              text={text}
              ctas={ctas.length > 0 ? ctas : undefined}
            />
          );
        })()}
    </div>
  )
}

