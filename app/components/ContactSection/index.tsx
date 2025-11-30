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
  title?: string;
  text?: string;
  ctas?: CTA[];
  sectionId?: string;
  className?: string;
}

// Helper function to render Markdown content safely
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
  const { openContactModal } = useContactModal();
  const [contactTexts, setContactTexts] = useState({
    contactText: 'Get in touch with us',
    contactCTA: 'Contact Us',
    bookText: 'Schedule a consultation',
    bookCTA: 'Book a free meeting'
  });

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

  // Always use the same two CTAs with default texts from API
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
          window.open('https://outlook.office.com/book/Free30minutemeeting@upwegodigital.com/?ismsaljsauthenabled', '_blank');
        }
      }
    }
  ];

  return (
    <section id={sectionId} className={className}>
      <div className="relative container">
        <div className="flex flex-col justify-between mx-auto gap-8">
          {title && (
            <h2 className="section-title text-4xl medium-large:text-5xl text-center max-h-sm:text-3xl text-brand-primary" dangerouslySetInnerHTML={renderMarkdown(title, true)} />
          )}
          {text && (
            <div className="text-xl text-bodyText text-center max-w-screen-tablet mx-auto" dangerouslySetInnerHTML={renderMarkdown(text)} />
          )}

          <div className="flex flex-col desktop:flex-row justify-center gap-16 mt-12 mx-auto">
            {defaultCTAs.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-4 max-w-screen-mobile-large mx-auto">
                <div className="text-bodyText text-center" dangerouslySetInnerHTML={renderMarkdown(item.text)} />
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

