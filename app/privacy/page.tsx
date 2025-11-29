'use client';
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../utils/text';
import '../styles/privacy.css';

export default function Privacy() {
  const [content, setContent] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Privacy Policy');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/privacy');
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
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
        setContent('# Privacy Policy\n\nContent coming soon...');
      }
    };
    fetchContent();
  }, []);

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
        <div className="max-w-screen-desktop mx-auto mb-24">
          <h1 className="title text-4xl text-brand-tertiary mb-16 font-bold">{title}</h1>
          <div className="privacy-content text-brand-tertiary" dangerouslySetInnerHTML={renderMarkdown(content)}></div>
        </div>
      </div>
    </section>
  );
}
