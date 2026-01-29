'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-md border-b border-border">
      <div className="container-main">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">DM</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-text-primary">
              Dental<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ürün, marka veya kategori ara..."
                className="w-full h-10 pl-4 pr-12 rounded-lg bg-background-card border border-border text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link 
              href="/sepet" 
              className="relative p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-background-deep text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Account */}
            <Link 
              href="/hesabim" 
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200 lg:hidden"
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

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <input
              type="text"
              placeholder="Ürün, marka veya kategori ara..."
              className="w-full h-10 px-4 rounded-lg bg-background-card border border-border text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-all duration-200"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background-deep animate-fade-in">
          <nav className="container-main py-4 space-y-2">
            <Link href="/kategoriler" className="block px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200">
              Kategoriler
            </Link>
            <Link href="/markalar" className="block px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200">
              Markalar
            </Link>
            <Link href="/urunler" className="block px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200">
              Tüm Ürünler
            </Link>
            <Link href="/kampanyalar" className="block px-4 py-3 rounded-lg text-accent hover:bg-background-card transition-all duration-200">
              Kampanyalar
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
