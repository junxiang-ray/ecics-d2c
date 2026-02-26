'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export default function CrispChat() {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = 'a8481348-1a81-4614-822c-2d2317c76269';

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
