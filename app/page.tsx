/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import Image from 'next/image';
import ScrollDisabler from './components/ScrollDisabler';
import ScrollDownButton from './components/ScrollDownButton';
import { useAnimation } from './components/AnimationContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const [blocks, setBlocks] = useState<any>(null);
  const { shouldAnimate } = useAnimation();

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch('/api/home');
        if (response.ok) {
          const data = await response.json();
          setBlocks(data);
          console.log(data);
        } else {
          console.error('Failed to fetch home data');
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchBlocks();
  }, []);

  // Custom renderer to remove <p> tags
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => children,
    },
  };

  if (!blocks) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-brand-primary to-brand-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollDisabler />
      <style>{`
        .home-intro-content b, .home-about-content b {
          color: var(--brand-secondary);
          font-weight: 700;
          
        }
        .home-intro-content b {
          display: block;
        }
      `}</style>
      <section id="home-intro" className="min-h-[100vh] w-full flex flex-col justify-center relative overflow-hidden">
        <Image 
          src="/img/u-strips-vertical.svg" 
          alt="Upwego" 
          width={600} 
          height={800} 
          priority
          className={`w-[30vw] absolute bottom-[30vh] right-[15vw] ${shouldAnimate ? 'opacity-0 animate-u-combined' : 'opacity-100'}`} 
        />
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-primary from-0% via-brand-primary via-40% to-transparent"></div>
        <div className="relative z-10 container-padding">
          {blocks && Object.entries(blocks["home-intro"] || {}).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className={`home-intro-content ${shouldAnimate ? 'opacity-0 animate-fade-in-delayed' : 'opacity-100'}`}>
              <h1 className="text-5xl medium-large:text-6xl font-bold max-h-sm:text-4xl">{documentToReactComponents(block.title, options)}</h1>
              <div className="mt-8 w-1/3 text-xl medium-large:text-2xl medium-large:min-w-[580px] max-h-sm:text-base">{documentToReactComponents(block.text)}</div>
            </div>
          ))}
        </div>
        <ScrollDownButton />
      </section>

      <section id="home-about" className="min-h-[100vh] w-full flex flex-col justify-center">
        <div className="relative z-10 container-padding flex justify-end items-center">
          {/* <AnimatedLinesAbout 
            className="w-1/3 h-auto absolute top-1/2 left-0 translate-y-[-50%]"
            duration={2.5}
            delay={0.5}
          /> */}
          {Object.entries(blocks["home-about"] || {}).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className="home-about-content w-1/2">
              <div className="text-xl medium-large:text-2xl max-h-sm:text-base">{documentToReactComponents(block.text)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  
}
