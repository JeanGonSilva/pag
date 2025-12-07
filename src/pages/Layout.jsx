
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Layout({ children }) {
  useEffect(() => {
    // Prevent translation and set language
    document.documentElement.lang = "pt-BR";
    document.documentElement.setAttribute('translate', 'no');
    
    // Add meta google notranslate
    const meta = document.createElement('meta');
    meta.name = "google";
    meta.content = "notranslate";
    document.head.appendChild(meta);
    
    // Add class notranslate to body just in case
    document.body.classList.add('notranslate');

    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-900">
      {/* Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        `}
      </style>
      {children}
    </div>
  );
}
