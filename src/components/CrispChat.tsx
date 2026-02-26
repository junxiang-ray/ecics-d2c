'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = 'a8481348-1a81-4614-822c-2d2317c76269';

      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div>Testing Crisp...</div>;
}
