'use client';
import Button from './components/Button';
import './styles/not-found.css';

export default function NotFound() {
  return (
    <section className="not-found-section bg-brand-primary">
      <div className="container">
        <div className="not-found-content max-w-screen-desktop mx-auto">
          <div className="background-image opacity-0"></div>
          <div className="not-found-number"><h1 className="text-brand-secondary text-8xl font-bold">404</h1></div>
          <h2 className="not-found-title text-brand-tertiary">Oops... Page not found</h2>
          <p className="not-found-text text-brand-tertiary italic">The page you're looking for doesn't exist or has been moved.</p>
          <Button href="/" variant="blue" className="cta-back-home w-fit mx-auto !mt-[4vh]">Go Back Home</Button>
        </div>
      </div>
    </section>
  );
}
