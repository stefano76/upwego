/**
 * HOME PAGE COMPONENT
 * 
 * The main landing page of the website. This is the most complex page with multiple
 * sections and sophisticated scroll-based animations.
 * 
 * PAGE STRUCTURE:
 * 1. Intro section - Hero with tagline, animated logo strips, scroll-down button
 * 2. About section - Company logo and description with scale animation
 * 3. Challenge section - Two challenge cards (web/data) with complex animations
 * 4. Services section - Service cards with scroll-triggered animations
 * 5. Process section - Process overview with slide-down animation
 * 6. Contact section - Call-to-action for getting in touch
 * 
 * DATA FLOW:
 * - Fetches content from 3 API endpoints in parallel:
 *   - /api/home - Page content blocks
 *   - /api/tagline - Main tagline text
 *   - /api/generic-texts - Reusable text strings
 * - Content is rendered using renderMarkdown() utility
 * 
 * ANIMATIONS:
 * - Uses multiple custom animation hooks for scroll-based effects
 * - ScrollDisabler prevents scrolling until animations complete
 * - Each section has its own animation trigger and timing
 * 
 * FEATURES:
 * - Complex scroll-based animations using Intersection Observer
 * - Responsive design with mobile/desktop breakpoints
 * - Dynamic content loading from markdown files
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import Logo from './components/Logo';
import ScrollDisabler from './components/ScrollDisabler';
import ScrollDownButton from './components/ScrollDownButton';
import { useAnimation } from './components/AnimationContext';
import { useEffect, useState } from 'react';
import { useSimpleAnimation } from './hooks/useSimpleAnimation';
import { useMultiAnimation } from './hooks/useMultiAnimation';
import { useIndividualBlockAnimation } from './hooks/useIndividualBlockAnimation';
import { useHomeProcessAnimation } from './hooks/useHomeProcessAnimation';
import ContactSection from './components/ContactSection';
import ProcessNumber from './components/ProcessNumber';
import Button from './components/Button';
import { renderMarkdown, parseMarkdownListItems } from './utils/text';
import './styles/home.css';

export default function Home() {
  // State for page content loaded from API
  const [blocks, setBlocks] = useState<any>(null);
  
  // Animation context - controls whether animations should play
  const { shouldAnimate } = useAnimation();
  
  // Main tagline displayed in hero section
  const [tagline, setTagline] = useState<string>('');
  
  // Generic reusable text strings (e.g., "Learn more", "Contact us")
  const [genericTexts, setGenericTexts] = useState<any>({});

  /**
   * ANIMATION HOOKS
   * 
   * Each section uses a custom hook to handle scroll-based animations:
   * - aboutAnimation: Simple scale-in animation for logo
   * - challengeAnimation: Multi-element animations for web/data cards
   * - servicesAnimation: Individual block animations for service cards
   * - homeProcessAnimation: Complex slide-down animation for process section
   */
  const aboutAnimation = useSimpleAnimation('animate-in-scale', 0.3);
  // Lower threshold for mobile compatibility (0.1 = 10% visible triggers animation)
  const challengeAnimation = useMultiAnimation(0.1);
  const servicesAnimation = useIndividualBlockAnimation({ 
    threshold: 0.7,  // Element must be 70% visible to trigger
    animationClass: 'animate-fade-in-down'
  });
  const homeProcessAnimation = useHomeProcessAnimation({
    slideDownThreshold: 0.2,  // Trigger when 20% visible
    blocksLoaded: !!blocks  // Only animate when content is loaded
  });

  /**
   * EFFECT: Load page content from multiple API endpoints
   * 
   * Fetches all required data in parallel for better performance:
   * - Page content blocks (sections, text, images)
   * - Main tagline (hero section headline)
   * - Generic texts (reusable strings like button labels)
   * 
   * All three requests run simultaneously using Promise.all().
   */
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [blocksResponse, taglineResponse, genericTextsResponse] = await Promise.all([
          fetch('/api/home'),
          fetch('/api/tagline'),
          fetch('/api/generic-texts')
        ]);
        
        // Process blocks response
        if (blocksResponse.ok) {
          const data = await blocksResponse.json();
          setBlocks(data);
        } else {
          console.error('Failed to fetch home data');
        }
        
        // Process tagline response
        if (taglineResponse.ok) {
          const taglineData = await taglineResponse.json();
          setTagline(taglineData.tagline);
        }
        
        // Process generic texts response
        if (genericTextsResponse.ok) {
          const textsData = await genericTextsResponse.json();
          setGenericTexts(textsData);
        } else {
          console.error('Failed to fetch generic texts');
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchBlocks();
  }, []);

  // Show loading spinner while content is being fetched
  if (!blocks || !tagline) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      {/* Disables page scrolling until initial animations complete */}
      <ScrollDisabler />
      
      {/* INTRO SECTION - Hero section with tagline and animated logo strips */}
      <section id="home-intro" className="home-section flex flex-col justify-start items-center relative overflow-hidden">
        <div className="absolute h-full w-full top-0 left-1/2 translate-x-[-50%] max-w-screen-large">
          <Image 
            src="/img/u-strips-vertical.svg" 
            alt="Upwego" 
            width={600} 
            height={800} 
            priority
            className="w-[70vw] desktop:w-[30%] absolute u-strips-responsive right-[calc(50%-35vw)] desktop:top-0 desktop:right-[10%] opacity-0 animate-u-intro"
            /* className={`w-[70vw] desktop:w-[30%] absolute u-strips-responsive right-[calc(50%-35vw)] desktop:top-0 desktop:right-[10%] ${shouldAnimate ? 'opacity-0 animate-u-intro' : 'opacity-100'}`} */ 
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-primary from-0% via-brand-primary via-40% to-transparent"></div>
        <div className="relative z-10 container">
          {blocks && blocks["home-intro"] && Object.entries(blocks["home-intro"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className={`home-intro-content mt-[50vw] desktop:mt-[25vh] text-center desktop:text-left ${shouldAnimate ? 'opacity-0 animate-fade-in-delayed' : 'opacity-100'}`}>
              <h1 className="text-5xl medium-large:text-6xl font-bold max-h-sm:text-4xl" dangerouslySetInnerHTML={{ __html: tagline }}></h1>
              <div className="mt-8 w-full max-w-[600px] mx-auto desktop:w-1/3 desktop:mx-0 desktop:max-w-none text-xl medium-large:text-2xl medium-large:min-w-[580px] max-h-sm:text-base" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
            </div>
          ))}
        </div>
        <ScrollDownButton />
      </section>

      {/* ABOUT SECTION - Company logo and description with scale animation */}
      <section ref={aboutAnimation.sectionRef} id="home-about" className="home-section flex flex-col justify-center">
        <div className="relative container flex flex-col desktop:flex-row justify-between items-center gap-[10%]">
          <div className="about-logo-container neon-border-secondary box w-full h-[40vw] desktop:w-1/2 desktop:h-[auto] self-stretch flex items-center justify-center">
            <div 
              ref={aboutAnimation.addElementRef}
              className="opacity-0 w-[60%] h-[auto] desktop:w-[317px] desktop:h-auto"
            >
              <Logo 
                width={317} 
                height={56} 
                className="w-full h-auto"
              />
            </div>
          </div>
          {blocks && blocks["home-about"] && Object.entries(blocks["home-about"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="home-about-content w-full desktop:w-1/2 mt-16 desktop:mt-0">
              <div className="text-xl medium-large:text-2xl max-h-sm:text-base" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              {block.linkText && block.linkUrl && (
                <Button href={block.linkUrl} className="inline-block">
                  {block.linkText}
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGE SECTION - Two challenge cards (web/data) with complex animations */}
      <section ref={challengeAnimation.sectionRef} id="home-challenge" className="home-section flex flex-col justify-center relative overflow-hidden">
        <div className="absolute hidden desktop:block w-full h-full top-0 left-0 background-gradient background-gradient-left"></div>
        <div className="absolute hidden desktop:block w-full h-full top-0 left-0 background-gradient background-gradient-right"></div>
        <div className="relative z-10 container flex flex-col desktop:flex-row justify-between items-center desktop:items-stretch gap-16 desktop:gap-12 medium:gap-16">
          {blocks && blocks["home-challenge"] && Object.entries(blocks["home-challenge"].blocks).map(([blockId, block]: [string, any]) => {

            let animationPage = null;
            let animationItem = null;
            let animationLabel = null;
            
            if (block.label === 'web') {
              animationPage = challengeAnimation.addElementRef('animate-in-to-right');
              animationItem = challengeAnimation.addElementRef('animate-gear-to-left');
              animationLabel = challengeAnimation.addElementRef('animate-fade-in-delayed-web');
            } else if (block.label === 'data') {
              animationPage = challengeAnimation.addElementRef('animate-in-to-left');
              animationItem = challengeAnimation.addElementRef('animate-lens-to-left');
              animationLabel = challengeAnimation.addElementRef('animate-fade-in-delayed-data');
            }

            return (
              <div key={blockId} className="home-challenge-content w-full desktop:w-[calc(50%-1.5rem)] medium:w-[calc(50%-2rem)] desktop:h-auto box bg-brand-primary bg-opacity-60 px-6 py-10 pt-12 tablet:p-20 flex flex-col items-center justify-center">
                <div className={`neon-border-tertiary box box-${block.label} w-[240px] mobile-large:w-[300px] h-[240px] flex flex-col items-center justify-center gap-8 mb-12`}>
                  <h3 ref={animationLabel} className="text-lg text-center tracking-[0.5em] font-light uppercase opacity-0" dangerouslySetInnerHTML={renderMarkdown(block.label)}></h3>
                  <div className="w-[100px] h-[82px] relative">
                    <div ref={animationPage} className="opacity-0">
                      <Image 
                        src={`/img/home-challenge-${block.label}.svg`} 
                        alt={`${block.label} page`}
                        width={100} 
                        height={82}
                        loading="lazy"
                      />
                    </div>
                    <div ref={animationItem} className="item-icon absolute bottom-[-10px] right-[-10px] opacity-0">
                      <Image
                        src={`/img/home-challenge-${block.label}-item.svg`} 
                        alt={`${block.label} item`} 
                        width={50} 
                        height={50}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl text-center medium-large:text-4xl font-bold mb-4" dangerouslySetInnerHTML={renderMarkdown(block.title)}></h2>
                <div className="text-xl text-center medium-large:text-2xl max-h-sm:text-base font-light" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICES SECTION - Service cards with scroll-triggered animations */}
      <section id="home-services" className="home-section bg-brand-tertiary">
        <div className="relative container">
          {blocks && blocks["home-services"] && blocks["home-services"].title && (
            <h2 className="section-title text-4xl medium-large:text-5xl text-center mb-16 max-h-sm:text-3xl text-brand-primary" 
            dangerouslySetInnerHTML={{ __html: blocks["home-services"].title }}></h2>
          )}
          {blocks && blocks["home-services"] && Object.entries(blocks["home-services"].blocks).map(([blockId, block]: [string, any], index: number) => (
            <div key={blockId} className={`home-services-content mt-20 desktop:mt-[120px]`}>
              <div className={`block-${block.label} box border-none flex flex-col justify-between gap-8 desktop:gap-[100px] ${index % 2 === 1 ? 'desktop:flex-row-reverse' : 'desktop:flex-row'}`}>
                <div className="box border-none min-h-[80vw] mobile-large:min-h-[450px] w-full tablet:w-3/4 desktop:w-1/2 bg-blueDark relative overflow-hidden">
                  <Image 
                    ref={servicesAnimation.addBlockRef(index)}
                    src={`/img/box-service-gradient.png`} 
                    alt={`${block.label} service`} 
                    width={800}
                    height={650}
                    loading="lazy"
                    className="gradient absolute top-0 medium-large:top-[-70%] left-0 w-full h-auto opacity-0"
                  />
                  <Image
                    src={`/img/home-services-${block.label}.png`}
                    alt={`${block.title} image`}
                    width={700}
                    height={670}
                    loading="lazy"
                    className={`box-image box-image-service-${block.label} absolute bottom-0 h-full w-auto mobile-large:w-auto mobile-large:h-auto medium-large:h-full opacity-0`}
                  />
                </div>
                <div className="texts w-full desktop:w-1/2">
                  <h3 className={`text-3xl font-semibold mb-6 desktop:mb-8 ${block.label === 'combined' ? 'text-brand-secondary' : 'text-brand-primary'}`} dangerouslySetInnerHTML={{ __html: block.title }}></h3>
                  <div className="text-xl text-bodyText" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                  {block.linkText && block.linkUrl && (
                    <Button href={block.linkUrl} className="services-cta mt-8 desktop:mt-12 inline-block">
                      <span className="hidden mobile-large:inline">{block.linkText}</span>
                      <span className="inline mobile-large:hidden">{genericTexts['cta-generic']}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* PROCESS SECTION - Process overview with slide-down animation */}
      <section 
        id="home-process" 
        ref={homeProcessAnimation.sectionRef}
        className="home-section bg-brand-tertiary relative overflow-hidden"
      >
        <div className="background-gradient absolute top-0 left-0 w-full h-2/3 bg-brand-primary"></div>
        <div className="relative z-10 container">
          {blocks && blocks["home-process"] && blocks["home-process"].title && (
            <h2 
              ref={homeProcessAnimation.sectionTitleRef}
              className="section-title section-title-process text-4xl medium-large:text-5xl text-center mb-16 max-h-sm:text-3xl" 
              dangerouslySetInnerHTML={renderMarkdown(blocks["home-process"].title)}
            ></h2>
          )}
          {blocks && blocks["home-process"] && Object.entries(blocks["home-process"].blocks).map(([blockId, block]: [string, any]) => (
            <div 
              key={blockId} 
              ref={homeProcessAnimation.boxProcessContentRef}
              className="box box-process-content bg-brand-primary p-8 desktop:p-20 max-w-screen-small mx-auto origin-top opacity-0"
            >
              <div 
                ref={homeProcessAnimation.homeProcessContentRef}
                className="home-process-content opacity-0"
              >
                <h3 className="home-process-content-title block-title text-4xl medium-large:text-5xl max-h-sm:text-3xl mb-16" dangerouslySetInnerHTML={renderMarkdown(block.title, true)}></h3>
                <div className="home-process-items-container">
                  <div className="home-process-items flex flex-col gap-12 w-fit mx-auto">
                    {parseMarkdownListItems(block.text).map((item, index) => (
                      <div key={index} className="home-process-item flex items-center gap-4 tablet:text-xl font-medium py-2 px-4 bg-brand-tertiary rounded-full">
                        <ProcessNumber number={index + 1} />
                        <span className="home-process-item-text text-brand-primary w-[calc(100%-3.5rem)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button href={block.linkUrl} className="home-process-content-cta !mt-16 block w-fit pointer-events-none mx-auto opacity-0">
                  <span className="hidden mobile-large:inline">{block.linkText}</span>
                  <span className="inline mobile-large:hidden">{genericTexts['cta-generic']}</span>
                </Button>
                <Logo width={184} height={32.5} className="home-process-content-logo opacity-0 hidden desktop:block mx-auto mt-16" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION - Call-to-action for getting in touch */}
      {blocks && blocks["home-contact"] && (() => {
        const contactBlocks = Object.values(blocks["home-contact"].blocks) as any[];
        
        // Collect title and text from first block
        const firstBlock = contactBlocks[0];
        const title = firstBlock?.title;
        const text = firstBlock?.text;
        
        // Collect all CTAs from all blocks (home page can have multiple CTAs)
        const ctas = contactBlocks
          .filter(block => block.linkText)
          .map(block => ({
            linkText: block.linkText,
            linkUrl: block.linkUrl
          }));
        
        return (
          <ContactSection
            sectionId="home-contact"
            title={title}
            text={text}
            ctas={ctas.length > 0 ? ctas : undefined}
          />
        );
      })()}
    </>
  );
}
