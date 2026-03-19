'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const activeAlertKeys = new Set<string>();

export default function SaveSuccessAlert() {
  const searchParams = useSearchParams();
  const message = searchParams.get('success');

  useEffect(() => {
    if (!message) {
      return;
    }

    const cleanupSuccessQuery = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.toString());
    };

    const alertKey = `${window.location.pathname}:${message}`;

    if (activeAlertKeys.has(alertKey)) {
      cleanupSuccessQuery();
      return;
    }

    activeAlertKeys.add(alertKey);

    window.alert(message);

    cleanupSuccessQuery();

    const timer = window.setTimeout(() => {
      activeAlertKeys.delete(alertKey);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message]);

  return null;
}
