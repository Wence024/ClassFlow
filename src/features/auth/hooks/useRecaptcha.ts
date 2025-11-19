import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Google reCAPTCHA v3 integration.
 * Loads the reCAPTCHA script and provides methods to execute verification.
 *
 * @param siteKey - Google reCAPTCHA site key
 * @returns Object containing recaptcha instance, loading state, and execute function
 */
export function useRecaptcha(siteKey: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    // Check if script already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        recaptchaRef.current = window.grecaptcha;
        setIsLoaded(true);
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }
    };
  }, [siteKey]);

  /**
   * Executes reCAPTCHA verification and returns token.
   *
   * @param action - Action name for this verification
   * @returns Promise resolving to verification token
   */
  const executeRecaptcha = async (action: string = 'login'): Promise<string | null> => {
    if (!isLoaded || !recaptchaRef.current) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await recaptchaRef.current.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  };

  return {
    isLoaded,
    executeRecaptcha,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}
