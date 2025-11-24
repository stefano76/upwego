'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import '../styles/about.css';
import ContactSection from '../components/ContactSection';

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

  if (!blocks) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <section id="about-intro" className="min-h-screen flex flex-col items-center py-16 relative overflow-hidden">
        <div className="container">
          {blocks && blocks["about-intro"] && blocks["about-intro"].title && (
            <h1 className="text-4xl medium:text-5xl large:text-6xl text-brand-tertiary text-center mb-8 mt-[15vh]" dangerouslySetInnerHTML={renderMarkdown(blocks["about-intro"].title, true)}></h1>
          )}
          {blocks && blocks["about-intro"] && Object.entries(blocks["about-intro"].blocks).map(([blockId, block]: [string, Block]) => (
            <div key={blockId} className="medium:text-xl large:text-2xl max-w-[600px] large:max-w-screen-tablet large:leading-relaxed mx-auto text-center" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
      </section>

      <section id="about-owners"></section>

      {blocks && blocks["about-contact"] && (() => {
        const contactBlocks = Object.values(blocks["about-contact"].blocks) as Block[];
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
            sectionId="about-contact"
            text={text}
            ctas={ctas.length > 0 ? ctas : undefined}
          />
        );
      })()}
    </div>
  )
}
