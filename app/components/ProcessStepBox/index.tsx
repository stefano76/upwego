import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { hexToRgba } from '../../utils/colors';
import tailwindConfig from '../../../tailwind.config.mjs';
import ProcessNumber from '../ProcessNumber';
import { renderMarkdown } from '../../utils/text';
import './ProcessStepBox.css';

interface ProcessStepBoxProps {
  number: number;
  step: string;
  title: string;
  text: string;
}

export default function ProcessStepBox({ number, step, title, text }: ProcessStepBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const primary = tailwindConfig.theme.extend.colors.brand.primary;
  const secondary = tailwindConfig.theme.extend.colors.brand.secondary;
  const secondaryHex = tailwindConfig.theme.extend.colors.brand.secondary;
  const tertiary = tailwindConfig.theme.extend.colors.brand.tertiary;
  const secondary30 = hexToRgba(secondaryHex, 0.3);
  const smallBreakpoint = tailwindConfig.theme.extend.screens.small;
  const mediumBreakpoint = tailwindConfig.theme.extend.screens.medium;
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${primary} 25%, ${secondary30} 70%, ${primary} 100%)`
  };

  useEffect(() => {
    const checkVisibility = () => {
      if (!boxRef.current) return;
      
      const rect = boxRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if 100% of the box height is visible in the viewport
      // The top edge must be at or above the viewport top (>= 0)
      // AND the bottom edge must be at or below the viewport bottom (<= windowHeight)
      const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight;
      
      if (isFullyVisible && !boxRef.current.classList.contains('open')) {
        boxRef.current.classList.add('open');
      } else if (!isFullyVisible && boxRef.current.classList.contains('open')) {
        // Optional: remove class if box is no longer fully visible
        // boxRef.current.classList.remove('open');
      }
    };

    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  return (
      <div 
        ref={boxRef}
        className="box box-process-step p-12 mx-auto w-full max-w-[550px] h-fit bg-brand-primary relative mt-16 first:mt-8"
        style={gradientStyle}>
        <div className="number absolute -top-5 left-1/2 -translate-x-1/2">
          <ProcessNumber number={number} />
        </div>
        <div className="content flex flex-col">
          <div className="head flex flex-col tablet:flex-row items-center gap-8">
            <div className="icon">
              <Image src={`/img/process_${number}_${step}.svg`} alt={title} width={70} height={62} style={{ width: 'auto', height: '62px' }} />
            </div>
            <div className="title font-semibold text-2xl text-center tablet:text-left">{title}</div>
          </div>
          <div className="text font-light text-center tablet:text-left" dangerouslySetInnerHTML={renderMarkdown(text)}></div>
        </div>
        <div className="horizontal-line absolute top-1/2 -translate-y-1/2 h-[1px] bg-brand-primary hidden small:block"></div>
      </div>
  );
}