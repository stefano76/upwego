/**
 * PROCESS PAGE COMPONENT
 * 
 * Displays the company's process/workflow in a step-by-step format.
 * Content is loaded dynamically from markdown files via the /api/process endpoint.
 * 
 * PAGE STRUCTURE:
 * 1. Intro section - Hero section with background image and intro text
 * 2. Process steps section - Sequential steps displayed in boxes with connecting line
 * 3. Contact section - Call-to-action for getting in touch
 * 
 * DATA FLOW:
 * - Component fetches from /api/process on mount
 * - API loads content from content/pages/process.md → sections → blocks
 * - Steps are sorted by their "number" field to ensure correct order
 * - Content is rendered using renderMarkdown() utility
 * 
 * VISUAL FEATURES:
 * - Background image in intro section
 * - Vertical connecting line between process steps
 * - ProcessStepBox components for each step
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import ProcessStepBox from '../components/ProcessStepBox';
import '../styles/process.css';
import ContactSection from '../components/ContactSection';

export default function Process() {
  // State for page content loaded from API
  const [blocks, setBlocks] = useState<any>(null);

  /**
   * EFFECT: Load page content from API
   * 
   * Fetches all content blocks for the Process page on component mount.
   * The API endpoint loads content from markdown files in the /content directory.
   */
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
      {/* INTRO SECTION - Hero section with background image */}
      <section id="process-intro">
        {/* Background image overlay */}
        <div className="background-intro absolute top-0 left-0 w-full h-full bg-[url('/img/process-intro.png')] bg-cover bg-[bottom] bg-no-repeat"></div>
        <div className="container">
          {/* Render section title if available */}
          {blocks && blocks["process-intro"] && blocks["process-intro"].title && (
            <h1 className="text-4xl medium:text-5xl text-brand-tertiary" dangerouslySetInnerHTML={renderMarkdown(blocks["process-intro"].title, true)}></h1>
          )}
          {/* Render all blocks in the intro section */}
          {blocks && blocks["process-intro"] && Object.entries(blocks["process-intro"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="mt-8 medium:text-xl w-3/4 mobile-large:w-1/2 max-w-[600px]" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
          ))}
        </div>
      </section>

      {/* PROCESS STEPS SECTION - Sequential workflow steps */}
      <section id="process-steps" className="bg-brand-tertiary py-16 relative">
        {/* Vertical connecting line between steps (centered) */}
        <div className="process-step-line absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-brand-primary small:z-[6]"></div>
        <div className="container relative">
          <div className="steps-container small:flex small:flex-wrap small:mt-8 overflow-hidden max-w-screen-small mx-auto">
            {/* Render process steps, sorted by number field */}
            {blocks && blocks["process-steps"] && Object.entries(blocks["process-steps"].blocks)
              // Sort steps by their "number" field to ensure correct order
              .sort(([, a]: [string, any], [, b]: [string, any]) => (a.number || 0) - (b.number || 0))
              .map(([blockId, block]: [string, any]) => (
                <ProcessStepBox 
                  key={blockId}
                  number={block.number || 1}  // Step number (1, 2, 3, etc.)
                  step={block.slug}  // Step identifier (e.g., "onboarding", "planning")
                  title={block.title || ''}  // Step title
                  text={block.text || ''}  // Step description
                />
              ))}
          </div>
        </div>
        {/* Separator at bottom of section */}
        <div className="process-separator absolute bottom-0 left-0 w-full h-16 bg-brand-tertiary small:z-10"></div>
      </section>

      {/* CONTACT SECTION - Call-to-action for getting in touch */}
      {blocks && blocks["process-contact"] && (() => {
        // Get the first (and typically only) block from the contact section
        const contactBlocks = Object.values(blocks["process-contact"].blocks) as any[];
        const firstBlock = contactBlocks[0];
        const text = firstBlock?.text;
        
        // Extract CTA from block (linkText and linkUrl)
        const ctas = [{
          linkText: firstBlock.linkText,
          linkUrl: firstBlock.linkUrl
        }];        
        
        // Render ContactSection component with processed data
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

