/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import ScrollDisabler from './components/ScrollDisabler';
import ScrollDownButton from './components/ScrollDownButton';
import { useAnimation } from './components/AnimationContext';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useSimpleAnimation } from './hooks/useSimpleAnimation';
import { useMultiAnimation } from './hooks/useMultiAnimation';
import { useIndividualBlockAnimation } from './hooks/useIndividualBlockAnimation';
import './styles/home.css';

// Helper function to render Markdown content safely
const renderMarkdown = (markdownString?: string) => {
  const safeInput = typeof markdownString === 'string' ? markdownString : '';
  return { __html: marked(safeInput) };
};

export default function Home() {
  const [blocks, setBlocks] = useState<any>(null);
  const { shouldAnimate } = useAnimation();
  const [tagline, setTagline] = useState<string>('');

  // Animation hooks
  const aboutAnimation = useSimpleAnimation('animate-in-scale', 0.3);
  const challengeAnimation = useMultiAnimation(0.3);
  const servicesAnimation = useIndividualBlockAnimation({ 
    threshold: 1, 
    animationClass: 'animate-fade-in-down'
  });

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const [blocksResponse, taglineResponse] = await Promise.all([
          fetch('/api/home'),
          fetch('/api/tagline')
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
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchBlocks();
  }, []);

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
            className={`w-[30%] absolute u-strips-responsive right-[10%] ${shouldAnimate ? 'opacity-0 animate-u-intro' : 'opacity-100'}`} 
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-primary from-0% via-brand-primary via-40% to-transparent"></div>
        <div className="relative z-10 container">
          {blocks && blocks["home-intro"] && Object.entries(blocks["home-intro"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className={`home-intro-content mt-[25vh] ${shouldAnimate ? 'opacity-0 animate-fade-in-delayed' : 'opacity-100'}`}>
              <h1 className="text-5xl medium-large:text-6xl font-bold max-h-sm:text-4xl" dangerouslySetInnerHTML={{ __html: tagline }}></h1>
              <div className="mt-8 w-1/3 text-xl medium-large:text-2xl medium-large:min-w-[580px] max-h-sm:text-base" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
            </div>
          ))}
        </div>
        <ScrollDownButton />
      </section>

      <section ref={aboutAnimation.sectionRef} id="home-about" className="home-section flex flex-col justify-center">
        <div className="relative container flex justify-between items-center gap-[10%]">
          <div className="about-logo-container neon-border-secondary box w-1/2 self-stretch flex items-center justify-center">
            <Image 
              ref={aboutAnimation.addElementRef}
              src="/img/upwego-logo-light.svg" 
              alt="Upwego" 
              width={317} 
              height={56} 
              className="opacity-0"
            />
          </div>
          {blocks && blocks["home-about"] && Object.entries(blocks["home-about"].blocks).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="home-about-content w-1/2">
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
        <div className="absolute w-full h-full top-0 left-0 background-gradient background-gradient-left"></div>
        <div className="absolute w-full h-full top-0 left-0 background-gradient background-gradient-right"></div>
        <div className="relative z-10 container flex justify-between items-center gap-[10%]">
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
              <div key={blockId} className="home-challenge-content w-1/2 box bg-brand-primary bg-opacity-60 p-20 flex flex-col items-center justify-center">
                <div className={`neon-border-tertiary box box-${block.label} w-[300px] h-[240px] flex flex-col items-center justify-center gap-8 mb-12`}>
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
            <div key={blockId} className={`home-services-content mt-[120px]`}>
              <div className={`block-${block.label} box border-none flex justify-between gap-[100px] ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="box border-none min-h-[450px] w-1/2 bg-blueDark relative overflow-hidden">
                  <Image 
                    ref={servicesAnimation.addBlockRef(index)}
                    src={`/img/box-service-gradient.png`} 
                    alt={`${block.label} service`} 
                    width={450}
                    height={0} 
                    className="gradient absolute top-[-70%] left-0 w-full h-auto opacity-0"
                  />
                  <Image
                    src={`/img/home-services-${block.label}.png`}
                    alt={`${block.title} image`}
                    width={450}
                    height={0}
                    className={`box-image box-image-service-${block.label} absolute top-0 w-auto h-full opacity-0`}
                  />
                </div>
                <div className="texts w-1/2">
                  <h3 className="text-3xl text-brand-secondary mb-8" dangerouslySetInnerHTML={{ __html: block.title }}></h3>
                  <div className="text-xl text-brand-primary" dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
                  {block.linkText && block.linkUrl && (
                    <a href={block.linkUrl} className="btn-secondary mt-8 inline-block">
                      {block.linkText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section id="home-process" className="home-section bg-brand-primary relative overflow-hidden">
        <div className="background-gradient absolute top-0 left-0 w-full h-full"></div>
      </section>

      <section id="home-contact" className="home-section bg-brand-tertiary"></section>
    </>
  );

  
}
