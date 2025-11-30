/**
 * CONTACT SECTION COMPONENT
 * 
 * A reusable section component that displays contact information and CTAs.
 * Used at the bottom of pages (About, Services, Process, Home) to encourage contact.
 * 
 * FEATURES:
 * - Displays title and text (both support markdown)
 * - Two default CTAs: "Contact Us" (opens modal) and "Book a meeting" (external link)
 * - Dynamic text content loaded from API
 * - Can accept custom CTAs via props (overrides defaults)
 * 
 * USAGE:
 * Used on multiple pages with consistent styling and behavior.
 * The "Contact Us" button opens a modal with the contact form.
 */
'use client';

import { useEffect, useState } from 'react';
import { useContactModal } from '../ContactModalContext';
import { marked } from 'marked';
import Button from '../Button';
import './ContactSection.css';

interface CTA {
  linkText: string;
  linkUrl?: string;
  onClick?: () => void;
  variant?: 'blue' | 'white';
}

interface ContactSectionProps {
  title?: string;  // Section title (supports markdown)
  text?: string;  // Section description text (supports markdown)
  ctas?: CTA[];  // Custom CTAs (if provided, overrides defaults)
  sectionId?: string;  // HTML id for the section
  className?: string;  // Additional CSS classes
}

/**
 * Helper function to render Markdown content safely
 * 
 * Same as the utility function in app/utils/text.ts, but duplicated here
 * to avoid import dependencies. Converts markdown to HTML for React rendering.
 */
const renderMarkdown = (markdownString?: string, noParagraphs: boolean = false) => {
  const safeInput = typeof markdownString === 'string' ? markdownString : '';
  
  // Create a custom renderer to replace <strong> with <b>
  const renderer = new marked.Renderer();
  renderer.strong = function(text) {
    // Extract text from the object if it's not a string
    const textContent = typeof text === 'string' ? text : text.text || String(text);
    return '<b>' + textContent + '</b>';
  };
  
  // If noParagraphs is true, use inline parsing to avoid <p> tags
  let html: string;
  if (noParagraphs) {
    // Use parseInline for content that shouldn't be wrapped in paragraphs
    html = marked.parseInline(safeInput, { renderer, async: false });
  } else {
    html = marked.parse(safeInput, { renderer, async: false });
  }
  
  return { __html: html };
};

export default function ContactSection({ 
  title, 
  text, 
  sectionId = 'contact',
  className = 'contact-section bg-brand-tertiary'
}: ContactSectionProps) {
  // Access the contact modal context to open the form modal
  const { openContactModal } = useContactModal();
  
  // State for dynamic text content (loaded from API)
  const [contactTexts, setContactTexts] = useState({
    contactText: 'Get in touch with us',
    contactCTA: 'Contact Us',
    bookText: 'Schedule a consultation',
    bookCTA: 'Book a free meeting'
  });

  /**
   * EFFECT: Load contact section text content from API
   * 
   * Fetches dynamic text for the CTAs (allows content to be managed in markdown files).
   */
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await fetch('/api/contact-section-texts');
        if (response.ok) {
          const data = await response.json();
          setContactTexts(data);
        }
      } catch (error) {
        console.error('Error fetching contact section texts:', error);
      }
    };
    fetchTexts();
  }, []);

  /**
   * DEFAULT CTAs - Used if no custom CTAs are provided via props
   * 
   * These two buttons appear on every contact section:
   * 1. "Contact Us" (blue) - Opens the contact form modal
   * 2. "Book a free meeting" (white) - Opens Outlook booking page in new tab
   */
  const defaultCTAs: Array<{ text: string; cta: CTA }> = [
    {
      text: contactTexts.contactText,
      cta: {
        linkText: contactTexts.contactCTA,
        variant: 'blue',
        onClick: () => {
          openContactModal();
        }
      }
    },
    {
      text: contactTexts.bookText,
      cta: {
        linkText: contactTexts.bookCTA,
        variant: 'white',
        onClick: () => {
          // Opens Outlook calendar booking page in new tab
          window.open('https://outlook.office.com/book/Free30minutemeeting@upwegodigital.com/?ismsaljsauthenabled', '_blank');
        }
      }
    }
  ];

  return (
    <section id={sectionId} className={className}>
      <div className="relative container">
        <div className="flex flex-col justify-between mx-auto gap-8">
          {/* Section title (rendered from markdown, no paragraph tags) */}
          {title && (
            <h2 className="section-title text-4xl medium-large:text-5xl text-center max-h-sm:text-3xl text-brand-primary" dangerouslySetInnerHTML={renderMarkdown(title, true)} />
          )}
          
          {/* Section description text (rendered from markdown) */}
          {text && (
            <div className="text-xl text-bodyText text-center max-w-screen-tablet mx-auto" dangerouslySetInnerHTML={renderMarkdown(text)} />
          )}

          {/* CTA buttons - Two buttons side by side on desktop, stacked on mobile */}
          <div className="flex flex-col desktop:flex-row justify-center gap-16 mt-12 mx-auto">
            {defaultCTAs.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-4 max-w-screen-mobile-large mx-auto">
                {/* Text above button (e.g., "Get in touch with us") */}
                <div className="text-bodyText text-center" dangerouslySetInnerHTML={renderMarkdown(item.text)} />
                {/* CTA button */}
                <Button variant={item.cta.variant || 'blue'} onClick={item.cta.onClick} className="w-60 contact-section-cta">
                  {item.cta.linkText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

