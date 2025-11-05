/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import ScrollDisabler from './components/ScrollDisabler';
import ScrollDownButton from './components/ScrollDownButton';
import { useAnimation } from './components/AnimationContext';
import { useContactModal } from './components/ContactModalContext';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useSimpleAnimation } from './hooks/useSimpleAnimation';
import { useMultiAnimation } from './hooks/useMultiAnimation';
import { useIndividualBlockAnimation } from './hooks/useIndividualBlockAnimation';
import './styles/home.css';

// Helper function to render Markdown content safely
const renderMarkdown = (markdownString?: string) => {
  const safeInput = typeof markdownString === 'string' ? markdownString : '';
  
  // Create a custom renderer to replace <strong> with <b>
  const renderer = new marked.Renderer();
  renderer.strong = function(text) {
    // Extract text from the object if it's not a string
    const textContent = typeof text === 'string' ? text : text.text || String(text);
    return '<b>' + textContent + '</b>';
  };
  
  const html = marked.parse(safeInput, { renderer, async: false });
  return { __html: html };
};

export default function Home() {
  const [blocks, setBlocks] = useState<any>(null);
  const { shouldAnimate } = useAnimation();
  const [tagline, setTagline] = useState<string>('');
  const [genericTexts, setGenericTexts] = useState<any>({});
  const { openContactModal } = useContactModal();

  // Animation hooks
  const aboutAnimation = useSimpleAnimation('animate-in-scale', 0.3);
  const challengeAnimation = useMultiAnimation(0.3);
  const servicesAnimation = useIndividualBlockAnimation({ 
    threshold: 0.6, 
    animationClass: 'animate-fade-in-down'
  });

  // Scroll-based scaling animation for home-process section
  useEffect(() => {
    const handleScroll = () => {
      // Only apply on desktop (≥1280px)
      if (window.innerWidth < 1280) return;
      
      const processSection = document.getElementById('home-process');
      if (!processSection) return;
      
      const boxProcessContent = processSection.querySelector('.box-process-content');
      const sectionTitleProcess = processSection.querySelector('.section-title-process');
      if (!boxProcessContent || !sectionTitleProcess) return;
      
      const sectionRect = processSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress within the section
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      
      // Start animation when section is 10% visible
      const startPoint = windowHeight * 0.9; // Start when section just enters viewport
      // Complete animation when section is 80% visible (a bit before fully visible)
      const endPoint = -sectionHeight + windowHeight;
      
      const progress = Math.max(0, Math.min(1, (startPoint - sectionTop) / (startPoint - endPoint)));
      
      // Calculate scale: start from 1.2 (120%), animate to 1.0 (100%)
      const startScale = 1.2;
      const endScale = 1.0;
      const currentScale = startScale - (startScale - endScale) * progress;
      
      // Apply the scale with center bottom origin
      (boxProcessContent as HTMLElement).style.transform = `scale(${currentScale})`;
      
      // Add 'visible' class when animation reaches 50% progress
      if (progress >= 0.5) {
        sectionTitleProcess.classList.add('visible');
      } else {
        sectionTitleProcess.classList.remove('visible');
      }
    };
    
    // Initial call
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const [blocksResponse, taglineResponse, genericTextsResponse] = await Promise.all([
          fetch('/api/home'),
          fetch('/api/tagline'),
          fetch('/api/generic-texts')
        ]);
        
        if (blocksResponse.ok) {
          const data = await blocksResponse.json();
          setBlocks(data);
        } else {
          console.error('Failed to fetch home data');
        }
        
        if (taglineResponse.ok) {
          const taglineData = await taglineResponse.json();
          setTagline(taglineData.tagline);
        }
        
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

  // List animation effect
  useEffect(() => {
    const section = document.getElementById('home-process');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const listItems = entry.target.querySelectorAll('ul li');
            
            listItems.forEach((item, index) => {
              setTimeout(() => {
                const htmlItem = item as HTMLElement;
                htmlItem.classList.add('animate-fade-in-slide-right');
                
                // If this is the last item, animate the button
                if (index === listItems.length - 1) {
                  const button = entry.target.querySelector('.home-process-content-cta');
                  if (button) {
                    setTimeout(() => {
                      button.classList.add('animate-fade-in');
                    }, 1500); // Small delay after the last list item
                  }
                }
              }, 500 + (index * 1500));
            });
          }
        });
      },
      { threshold: 0.8 }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, [blocks]);

  if (!blocks || !tagline) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollDisabler />
      <section id="home-intro" className="home-section flex flex-col justify-start items-center relative overflow-hidden">
        <div className="absolute h-full w-full top-0 left-1/2 translate-x-[-50%] max-w-screen-large">
          <Image 
            src="/img/u-strips-vertical.svg" 
            alt="Upwego" 
            width={600} 
            height={800} 
            priority
            className={`w-[70vw] desktop:w-[30%] absolute u-strips-responsive right-[calc(50%-35vw)] desktop:top-0 desktop:right-[10%] ${shouldAnimate ? 'opacity-0 animate-u-intro' : 'opacity-100'}`} 
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

      <section ref={aboutAnimation.sectionRef} id="home-about" className="home-section flex flex-col justify-center">
        <div className="relative container flex flex-col desktop:flex-row justify-between items-center gap-[10%]">
          <div className="about-logo-container neon-border-secondary box w-full h-[40vw] desktop:w-1/2 desktop:h-[auto] self-stretch flex items-center justify-center">
            <Image 
              ref={aboutAnimation.addElementRef}
              src="/img/upwego-logo-light.svg" 
              alt="Upwego" 
              width={317} 
              height={56} 
              className="opacity-0 w-[60%] h-[auto] desktop:w-[317px] desktop:h-auto"
            />
          </div>
          {blocks && blocks["home-about"] && Object.entries(blocks["home-about"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="home-about-content w-full desktop:w-1/2 mt-16 desktop:mt-0">
              <div className="text-xl medium-large:text-2xl max-h-sm:text-base" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              {block.linkText && block.linkUrl && (
                <a href={block.linkUrl} className="btn-secondary inline-block">
                  {block.linkText}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section ref={challengeAnimation.sectionRef} id="home-challenge" className="home-section flex flex-col justify-center relative overflow-hidden">
        <div className="absolute hidden desktop:block w-full h-full top-0 left-0 background-gradient background-gradient-left"></div>
        <div className="absolute hidden desktop:block w-full h-full top-0 left-0 background-gradient background-gradient-right"></div>
        <div className="relative z-10 container flex flex-col desktop:flex-row justify-between items-center gap-16 desktop:gap-[10%]">
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
              <div key={blockId} className="home-challenge-content w-full desktop:w-1/2 box bg-brand-primary bg-opacity-60 px-6 py-10 pt-12 tablet:p-20 flex flex-col items-center justify-center">
                <div className={`neon-border-tertiary box box-${block.label} w-[240px] mobile-large:w-[300px] h-[240px] flex flex-col items-center justify-center gap-8 mb-12`}>
                  <h3 ref={animationLabel} className="text-lg text-center tracking-[0.5em] font-light uppercase opacity-0" dangerouslySetInnerHTML={renderMarkdown(block.label)}></h3>
                  <div className="w-[100px] h-[82px] relative">
                    <Image 
                      ref={animationPage}
                      src={`/img/home-challenge-${block.label}.svg`} 
                      alt={`${block.label} page`}
                      width={100} 
                      height={82} 
                      className="opacity-0"
                    />
                    <Image
                      ref={animationItem}
                      src={`/img/home-challenge-${block.label}-item.svg`} 
                      alt={`${block.label} item`} 
                      className="item-icon absolute bottom-[-10px] right-[-10px] opacity-0" 
                      width={50} 
                      height={50} 
                    />
                  </div>
                </div>
                <h2 className="text-3xl text-center medium-large:text-4xl font-bold mb-4" dangerouslySetInnerHTML={renderMarkdown(block.title)}></h2>
                <div className="text-xl text-center medium-large:text-2xl max-h-sm:text-base font-light" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              </div>
            );
          })}
        </div>
      </section>

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
                    width={450}
                    height={0} 
                    className="gradient absolute top-0 medium-large:top-[-70%] left-0 w-full h-auto opacity-0"
                  />
                  <Image
                    src={`/img/home-services-${block.label}.png`}
                    alt={`${block.title} image`}
                    width={450}
                    height={0}
                    className={`box-image box-image-service-${block.label} absolute bottom-0 w-full mobile-large:w-auto h-auto medium-large:h-full opacity-0`}
                  />
                </div>
                <div className="texts w-full desktop:w-1/2">
                  <h3 className={`text-3xl font-semibold mb-6 desktop:mb-8 ${block.label === 'combined' ? 'text-brand-secondary' : 'text-brand-primary'}`} dangerouslySetInnerHTML={{ __html: block.title }}></h3>
                  <div className="text-xl text-bodyText" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                  {block.linkText && block.linkUrl && (
                    <a href={block.linkUrl} className="btn-secondary services-cta mt-8 desktop:mt-12 inline-block">
                      <span className="hidden mobile-large:inline">{block.linkText}</span>
                      <span className="inline mobile-large:hidden">{genericTexts['cta-generic']}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section id="home-process" className="home-section bg-brand-tertiary relative overflow-hidden">
        <div className="background-gradient absolute top-0 left-0 w-full h-2/3 bg-brand-primary"></div>
        <div className="relative z-10 container">
          {blocks && blocks["home-process"] && blocks["home-process"].title && (
            <h2 className="section-title section-title-process text-4xl medium-large:text-5xl text-center mb-16 max-h-sm:text-3xl" 
            dangerouslySetInnerHTML={renderMarkdown(blocks["home-process"].title)}></h2>
          )}
          {blocks && blocks["home-process"] && Object.entries(blocks["home-process"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="flex flex-col desktop:flex-row gap-10 desktop:gap-0 justify-between box box-process-content bg-brand-primary p-8 desktop:p-20 max-w-screen-small mx-auto">
              <div className="w-full desktop:w-1/2 flex flex-col justify-between">
                <h3 className="home-process-content-title block-title text-4xl medium-large:text-5xl max-h-sm:text-3xl" dangerouslySetInnerHTML={renderMarkdown(block.title)}></h3>
                <Image src="/img/upwego-logo-light.svg" alt="Upwego Digital" width={184} height={32.5} className="hidden desktop:block" />
              </div>
              <div className="w-full desktop:w-1/2 flex flex-col justify-between items-end">
                 <div className="home-process-content w-fit mx-auto">
                  <div className="text-2xl text-brand-tertiary home-process-items" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                  <a href={block.linkUrl} className="home-process-content-cta btn-secondary mt-8 inline-block w-fit opacity-0 pointer-events-none mx-auto desktop:mx-0">
                    <span className="hidden mobile-large:inline">{block.linkText}</span>
                    <span className="inline mobile-large:hidden">{genericTexts['cta-generic']}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="home-contact" className="home-section bg-brand-tertiary">
        {blocks && blocks["home-contact"] && Object.entries(blocks["home-contact"].blocks).map(([blockId, block]: [string, any]) => (
          <div key={blockId} className="relative container">
            <div className="flex flex-col justify-between">
              <h2 className="section-title text-4xl medium-large:text-5xl text-center mb-8 max-h-sm:text-3xl text-brand-primary" 
                dangerouslySetInnerHTML={renderMarkdown(block.title)}></h2>
              <div className="text-xl text-bodyText text-center mb-4" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
              {block.linkText && (
                <button 
                  onClick={() => {
                    console.log('Contact button clicked!');
                    openContactModal();
                  }} 
                  className="btn-secondary inline-block w-fit mx-auto">
                  {block.linkText}
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </>
  );

  
}
