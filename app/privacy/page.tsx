/**
 * PRIVACY POLICY PAGE COMPONENT
 * 
 * Displays the privacy policy content loaded from markdown files.
 * This is a simple page that shows legal/privacy information.
 * 
 * DATA FLOW:
 * - Component fetches content from /api/privacy on mount
 * - API loads content from content/pages/privacy.md
 * - Content is rendered as markdown using renderMarkdown() utility
 * 
 * FEATURES:
 * - Fallback content if API fails (shows "Content coming soon...")
 * - Loading spinner while content is being fetched
 * - Responsive layout with max-width constraint
 */
'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import '../styles/privacy.css';

export default function Privacy() {
  // State for privacy policy content (markdown text)
  const [content, setContent] = useState<string | null>(null);
  
  // State for page title (defaults to "Privacy Policy")
  const [title, setTitle] = useState<string>('Privacy Policy');

  /**
   * EFFECT: Load privacy policy content from API
   * 
   * Fetches the privacy policy content from /api/privacy endpoint.
   * The API loads content from content/pages/privacy.md markdown file.
   * 
   * ERROR HANDLING:
   * - If API fails, shows fallback "Content coming soon..." message
   * - This ensures the page always displays something, even if content file is missing
   */
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/privacy');
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
          // Update title if provided by API
          if (data.title) {
            setTitle(data.title);
          }
        } else {
          console.error('Failed to fetch privacy policy content');
          // Set default content if API fails
          setContent('# Privacy Policy\n\nContent coming soon...');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        // Fallback content on network error
        setContent('# Privacy Policy\n\nContent coming soon...');
      }
    };
    fetchContent();
  }, []);

  // Show loading spinner while content is being fetched
  if (!content) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <section className="bg-brand-primary">
      <div className="container">
        {/* Main content area with max-width constraint for readability */}
        <div className="max-w-screen-desktop mx-auto mb-24">
          {/* Page title */}
          <h1 className="title text-4xl text-brand-tertiary mb-16 font-bold">{title}</h1>
          
          {/* Privacy policy content rendered from markdown */}
          {/* The content includes all sections, paragraphs, lists, etc. from the markdown file */}
          <div className="privacy-content text-brand-tertiary" dangerouslySetInnerHTML={renderMarkdown(content)}></div>
        </div>
      </div>
    </section>
  );
}
