"use client";
import React from "react";
import type { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-brand-primary border-t border-brand-tertiary">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <div className="text-brand-tertiary text-2xl font-bold">
              Upwego
            </div>
            <div className="text-brand-secondary text-sm font-light">
              Digital
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-brand-tertiary">
            <a href="#home-intro" className="hover:text-brand-secondary transition-colors duration-300">
              Home
            </a>
            <a href="#home-about" className="hover:text-brand-secondary transition-colors duration-300">
              About
            </a>
            <a href="#home-challenge" className="hover:text-brand-secondary transition-colors duration-300">
              Challenge
            </a>
            <a href="#home-services" className="hover:text-brand-secondary transition-colors duration-300">
              Services
            </a>
            <a href="#home-process" className="hover:text-brand-secondary transition-colors duration-300">
              Process
            </a>
            <a href="#home-contact" className="hover:text-brand-secondary transition-colors duration-300">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <div className="text-brand-tertiary text-sm font-light text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Upwego Digital</p>
            <p className="text-xs mt-1 opacity-75">Designing momentum. Together.</p>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 pt-8 border-t border-brand-tertiary border-opacity-30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-tertiary opacity-75">
            <p>All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-brand-secondary transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-brand-secondary transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
