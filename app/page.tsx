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
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-primary">
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

        #home-intro {
        --intro-bottom-offset: 20vh;
        }

        .u-strips-responsive {
          bottom: 20vh;          
        }

        @media (max-height: 500px) {
          .u-strips-responsive {
            bottom: 10vh;          
          }
        }

        @media (min-width: 1440px) and (min-height: 900px) and (min-aspect-ratio: 4/3) {
          .u-strips-responsive {
            bottom: auto;
            top: -400px;
          }
        }
      `}</style>
      <section id="home-intro" className="min-h-[100vh] w-full flex flex-col justify-start items-center relative overflow-hidden">
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
          {blocks && Object.entries(blocks["home-intro"] || {}).map(([blockId, block]: [string, any]) => (
            <div key={blockId} className={`home-intro-content mt-[25vh] ${shouldAnimate ? 'opacity-0 animate-fade-in-delayed' : 'opacity-100'}`}>
              <h1 className="text-5xl medium-large:text-6xl font-bold max-h-sm:text-4xl">{documentToReactComponents(block.title, options)}</h1>
              <div className="mt-8 w-1/3 text-xl medium-large:text-2xl medium-large:min-w-[580px] max-h-sm:text-base">{documentToReactComponents(block.text)}</div>
            </div>
          ))}
        </div>
        <ScrollDownButton />
      </section>

      <section id="home-about" className="min-h-[100vh] w-full flex flex-col justify-center">
        <div className="relative z-10 container flex justify-between items-center">
          {/* <AnimatedLinesAbout 
            className="w-1/3 h-auto absolute top-1/2 left-0 translate-y-[-50%]"
            duration={2.5}
            delay={0.5}
          /> */}
          {/* <img src="/img/u-strips-horizontal.svg" alt="About Us" className="absolute top-1/2 left-12 translate-y-[-50%] w-[40%]" /> */}
          <iframe src='https://outlook.office.com/book/Test@upwegodigital.com/?ismsaljsauthenabled' width='40%' height='100%' scrolling='yes' style={{border: '0'}}></iframe>
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
