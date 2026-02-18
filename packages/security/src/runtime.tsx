"use client"; 
import React, { useEffect } from 'react';
import { useSessionStore } from '@eumetise/state';

export const SecurityRuntime = () => {
  const { user } = useSessionStore();

  useEffect(() => {
    // 1. DOM Guard: Prevent tampering with critical UI
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement && mutation.target.id === 'eumetise-watermark') {
           // In prod: log audit event, force reload, or block screen
           console.warn("Security Alert: Watermark tampering detected.");
           document.body.innerHTML = "<h1>Security Violation Detected</h1>";
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, []);

  if (!user) return null;

  return null;
  /* (Watermark disabled by user request)
  return (
    <div 
      id="eumetise-watermark"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden opacity-[0.03] select-none"
      aria-hidden="true"
    >
      <div className="flex flex-wrap content-start">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="m-12 rotate-[-45deg] whitespace-nowrap text-xl font-bold">
            {user.orgId} • {user.id} • CONFIDENTIAL
          </div>
        ))}
      </div>
    </div>
  );
  */
};