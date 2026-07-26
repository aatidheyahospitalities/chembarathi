'use client';

import { scrollToTop } from '@/app/lib/scroll';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function RouteScrollManager() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    void scrollToTop(true);
  }, [pathname]);

  return null;
}
