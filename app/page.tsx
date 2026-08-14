'use client';

import Image from "next/image";

export default function Home() {
  return (
    <div 
      className="flex flex-col flex-1 items-center justify-center min-h-screen font-sans"
      style={{ backgroundColor: 'var(--color-background-light)' }}
    >
      {/* Header Navigation */}
      <header 
        className="w-full py-4 px-6 shadow-sm"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-navy-dark)' }}>
            🏥 Albarkat Lab
          </h1>
          <nav className="flex gap-6">
            <a href="#" style={{ color: 'var(--color-text-dark)' }} className="hover:font-semibold transition">
              Home
            </a>
            <a href="#" style={{ color: 'var(--color-text-gray)' }} className="hover:font-semibold transition">
              Services
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 w-full max-w-6xl flex-col items-center justify-between py-16 px-6 sm:px-12">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-8 text-center w-full mb-12">
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-accent-blue-light)' }}
          >
            <p style={{ color: 'var(--color-accent-blue)' }} className="font-semibold text-sm">
              ✨ Welcome to Your Healthcare Solution
            </p>
          </div>

          <h2 
            className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight"
            style={{ color: 'var(--color-navy-dark)' }}
          >
            Professional Lab Testing & Home Sampling Services
          </h2>

          <p 
            className="max-w-xl text-lg leading-8"
            style={{ color: 'var(--color-text-gray)' }}
          >
            Get trusted lab results delivered to your door. Book your appointment today and experience convenient healthcare at your fingertips.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {/* Card 1 */}
          <div 
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div 
              className="text-3xl mb-4"
              style={{ color: 'var(--color-green)' }}
            >
              ✓
            </div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-navy-dark)' }}
            >
              Home Sampling
            </h3>
            <p style={{ color: 'var(--color-text-gray)' }}>
              Convenient sample collection from the comfort of your home.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div 
              className="text-3xl mb-4"
              style={{ color: 'var(--color-green)' }}
            >
              ✓
            </div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-navy-dark)' }}
            >
              Trusted Results
            </h3>
            <p style={{ color: 'var(--color-text-gray)' }}>
              Certified lab with years of experience and accuracy.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div 
              className="text-3xl mb-4"
              style={{ color: 'var(--color-green)' }}
            >
              ✓
            </div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-navy-dark)' }}
            >
              Quick Reports
            </h3>
            <p style={{ color: 'var(--color-text-gray)' }}>
              Fast turnaround time for all your test results.
            </p>
          </div>
        </div>

        {/* CTA Buttons Section */}
        <div className="flex flex-col gap-4 w-full sm:flex-row justify-center">
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full px-8 font-medium transition-all duration-300"
            href="#"
            style={{ 
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-surface)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-green-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-green)'}
          >
            📅 Book Appointment
          </a>

          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full px-8 font-medium transition-all duration-300 border-2"
            href="#"
            style={{ 
              borderColor: 'var(--color-accent-blue)',
              color: 'var(--color-accent-blue)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-blue-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            📱 WhatsApp Us
          </a>

          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full px-8 font-medium transition-all duration-300 border-2"
            href="#"
            style={{ 
              borderColor: 'var(--color-text-gray)',
              color: 'var(--color-navy-dark)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-background-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Learn More
          </a>
        </div>

        {/* Info Banner */}
        <div 
          className="mt-16 w-full p-6 rounded-lg flex items-center gap-4"
          style={{ backgroundColor: 'var(--color-green-light)' }}
        >
          <div className="text-3xl">🎖️</div>
          <div>
            <h4 
              className="font-semibold"
              style={{ color: 'var(--color-green)' }}
            >
              Serving with Trusted Badge
            </h4>
            <p 
              style={{ color: 'var(--color-text-dark)' }}
              className="text-sm"
            >
              Certified by health authorities and trusted by thousands of patients.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="w-full py-8 px-6 mt-auto border-t"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p style={{ color: 'var(--color-text-gray)' }}>
            © 2026 Albarkat Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
