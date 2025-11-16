/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import ProcessStepBox from '../components/ProcessStepBox';
import '../styles/process.css';
import ContactSection from '../components/ContactSection';

export default function Process() {
  const [blocks, setBlocks] = useState<any>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const blocksResponse = await fetch('/api/process');
        
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
      <section id="process-intro">
        <div className="background-intro absolute top-0 left-0 w-full h-full bg-[url('/img/process-intro.png')] bg-cover bg-[bottom] bg-no-repeat"></div>
        <div className="container">
          {blocks && blocks["process-intro"] && blocks["process-intro"].title && (
            <h1 className="text-4xl medium:text-5xl text-brand-tertiary" dangerouslySetInnerHTML={renderMarkdown(blocks["process-intro"].title, true)}></h1>
          )}
          {blocks && blocks["process-intro"] && Object.entries(blocks["process-intro"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="mt-8 medium:text-xl w-3/4 mobile-large:w-1/2 max-w-[600px]" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
      </section>

      <section id="process-steps" className="bg-brand-tertiary py-16 relative">
        <div className="process-step-line absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-brand-primary small:z-[6]"></div>
        <div className="container relative">
          <div className="steps-container small:flex small:flex-wrap small:mt-8 overflow-hidden max-w-screen-small mx-auto">
            {blocks && blocks["process-steps"] && Object.entries(blocks["process-steps"].blocks)
              .sort(([, a]: [string, any], [, b]: [string, any]) => (a.number || 0) - (b.number || 0))
              .map(([blockId, block]: [string, any]) => (
                <ProcessStepBox 
                  key={blockId}
                  number={block.number || 1} 
                  step={block.slug} 
                  title={block.title || ''} 
                  text={block.text || ''} 
                />
              ))}
          </div>
        </div>
        <div className="process-separator absolute bottom-0 left-0 w-full h-16 bg-brand-tertiary small:z-10"></div>
      </section>

      {blocks && blocks["process-contact"] && (() => {
        const contactBlocks = Object.values(blocks["process-contact"].blocks) as any[];
        const firstBlock = contactBlocks[0];
        const text = firstBlock?.text;
        const ctas = [{
          linkText: firstBlock.linkText,
          linkUrl: firstBlock.linkUrl
        }];        
        
        return (
          <ContactSection
            sectionId="process-contact"
            text={text}
            ctas={ctas.length > 0 ? ctas : undefined}
          />
        );
      })()}
    </div>
  );
}

