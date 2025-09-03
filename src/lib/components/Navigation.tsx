"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useColorSchemeContext } from "@/lib/contexts/ColorSchemeContext";
import { LightModeIcon, DarkModeIcon } from "@/lib/components/Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useColorSchemeContext();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 text-xl font-semibold text-gray-900 hover:text-gray-700">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                <Image src="/img/logo.png" alt="teddav" width={32} height={32} className="rounded-full" />
              </div>
              <span className="text-xl font-semibold text-gray-900 hover:text-gray-700">teddav</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 hover:underline px-3 py-2 rounded-md text-base font-medium transition-all duration-150 active:scale-95"
              >
                {link.label}
              </Link>
            ))}

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle dark mode"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="Toggle dark mode"
              >
                <span className="mr-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
