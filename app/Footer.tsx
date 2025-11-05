"use client";
import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import Image from "next/image";
import Logo from "./components/Logo";

type MenuItem = {
  title: string;
  slug: string;
  order: number;
};

type ContactLink = {
  svg: string;
  alt: string;
  label: string;
  url: string;
};

// Helper function to strip HTML tags using DOMParser
const stripHtmlTags = (html: string): string => {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  // Fallback for server-side rendering
  return html.replace(/<[^>]*>/g, '');
};

type FooterProps = {
  onContactClick?: () => void;
};

export default function Footer({ onContactClick }: FooterProps): JSX.Element {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tagline, setTagline] = useState<string>('');
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, taglineResponse, contactResponse] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/tagline'),
          fetch('/api/contact')
        ]);
        
        if (menuResponse.ok) {
          const items = await menuResponse.json();
          setMenuItems(items);
        }
        
        if (taglineResponse.ok) {
          const taglineData = await taglineResponse.json();
          setTagline(taglineData.tagline);
        }
        
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          setContactLinks(contactData);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="w-full bg-brand-primary border-t border-brand-tertiary">
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="top-section flex flex-col md:flex-row justify-between items-stretch gap-8">
          
          {/* Left Side */}
          <div className="flex flex-col gap-10"> 
            {/* Logo/Brand */}
            <div className="section-logo flex flex-col gap-3">
              <Logo width={180} height={31} className="w-[180px] h-[31px]" />
              <p className="text-base text-blueExtraLight">{stripHtmlTags(tagline)}</p>
            </div>

            {/* Navigation Links */}
            <nav className="section-menu flex flex-col mobile-large:flex-row flex-wrap justify-center items-center gap-12 tablet:gap-6 text-brand-tertiary">
              {menuItems.map((item) => {
                  // Determine href based on slug type
                  const href = item.slug;
                  const target = undefined;
                  const rel = undefined;
                  let className = "";
                  const hiddenItems = item.title === "Linkedin" || item.slug === '/' || item.slug === '';

                  // Hide LinkedIn link in footer
                  if (hiddenItems) {
                    className = "hidden";
                  }

                  // Handle contact link specially
                  if (item.slug === '#contact' && onContactClick) {
                    return (
                      <button
                        key={item.slug}
                        onClick={onContactClick}
                        className={`menu-item-footer w-fit ${className}`}
                      >
                        {item.title}
                      </button>
                    );
                  }

                  return (
                    <a
                      key={item.slug}
                      href={href}
                      target={target}
                      rel={rel}
                      className={`menu-item-footer w-fit ${className}`}
                    >
                      {item.title}
                    </a>
                  );
                })}
            </nav>
          </div>


          {/* Contact Links */}
          <div className="section-contacts text-brand-tertiary text-sm font-light text-center md:text-right flex flex-col justify-end">
            <div className="flex flex-col gap-6">
              {contactLinks.map((contact, index) => (
                <div key={index} className="text-base font-light text-brand-tertiary">
                  <a href={contact.url} target="_blank" className="contact-item flex gap-4 items-center">
                    <Image src={contact.svg} alt={contact.alt} width={20} height={20} />
                    <span>{contact.label}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="bottom-section mt-6 pt-6 border-t border-brand-tertiary border-opacity-30">
          <div className="flex flex-col mobile-large:flex-row justify-center items-center gap-6 mobile-large:gap-2 text-xs text-brand-tertiary">
            <p>&copy; {new Date().getFullYear()} Upwego Digital Limited. All rights reserved.</p>
            <div className="separator hidden mobile-large:block">-</div>
            <a href="#" className="item-privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
