'use client';

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
  ctas, 
  sectionId = 'contact',
  className = 'contact-section bg-brand-tertiary'
}: ContactSectionProps) {
  const { openContactModal } = useContactModal();

  const handleCTAClick = (cta: CTA) => {
    if (cta.onClick) {
      cta.onClick();
    } else if (cta.linkUrl === '#contact' || !cta.linkUrl) {
      openContactModal();
    }
    // If linkUrl is provided and it's not #contact, it could be handled by a link wrapper
  };

  return (
    <section id={sectionId} className={className}>
      <div className="relative container">
        <div className="flex flex-col justify-between max-w-screen-small mx-auto gap-16">
          {title && (
            <h2 
              className="section-title text-4xl medium-large:text-5xl text-center mb-8 max-h-sm:text-3xl text-brand-primary" 
              dangerouslySetInnerHTML={renderMarkdown(title)}
            />
          )}
          {text && (
            <div 
              className="text-xl text-bodyText text-center" 
              dangerouslySetInnerHTML={renderMarkdown(text)}
            />
          )}

          {ctas && ctas.length > 0 && (
            <div className="flex flex-col items-center gap-8 w-fit mx-auto">
              {ctas.map((cta, index) => (
                <Button
                  key={index}
                  variant={cta.variant || 'blue'}
                  href={cta.linkUrl && cta.linkUrl !== '#contact' ? cta.linkUrl : undefined}
                  onClick={cta.linkUrl === '#contact' || !cta.linkUrl ? () => handleCTAClick(cta) : undefined}
                  className="w-full contact-section-cta"
                >
                  <span dangerouslySetInnerHTML={renderMarkdown(cta.linkText, true)}></span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

