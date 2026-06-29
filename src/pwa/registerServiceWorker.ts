export type ServiceWorkerUiState = {
    supported: boolean;
    enabled: boolean;
    registered: boolean;
    updateAvailable: boolean;
    registration?: ServiceWorkerRegistration;
    error?: string;
  };
  
  const initialState: ServiceWorkerUiState = {
    supported: 'serviceWorker' in navigator,
    enabled: false,
    registered: false,
    updateAvailable: false,
  };
  
  const BASE_APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/icons/logo.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/maskable-icon-512.png',
  ];
  
  function shouldRegister() {
    const localOverride = new URLSearchParams(window.location.search).get('sw') === '1';
    return import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === 'true' || localOverride;
  }
  
  function collectCurrentAppShellUrls() {
    const urls = new Set(BASE_APP_SHELL);
    const assets = document.querySelectorAll<HTMLLinkElement | HTMLScriptElement>(
      'script[src], link[rel="stylesheet"][href], link[rel="manifest"][href], link[rel~="icon"][href], link[rel="apple-touch-icon"][href]',
    );
  
    assets.forEach((asset) => {
      const rawUrl = 'src' in asset ? asset.src : asset.href;
      const url = new URL(rawUrl, window.location.origin);
      if (url.origin === window.location.origin) {
        urls.add(`${url.pathname}${url.search}`);
      }
    });
  
    return [...urls];
  }
  
  async function cacheCurrentAppShell() {
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: 'CACHE_URLS', urls: collectCurrentAppShellUrls() });
  }
  
  export function registerServiceWorker(onChange: (state: ServiceWorkerUiState) => void) {
    if (!initialState.supported) {
      onChange(initialState);
      return () => undefined;
    }
  
    const enabled = shouldRegister();
    if (!enabled) {
      onChange({ ...initialState, supported: true, enabled: false });
      return () => undefined;
    }
  
    let reloadedForUpdate = false;
    const onControllerChange = () => {
      if (reloadedForUpdate) {
        return;
      }
      reloadedForUpdate = true;
      window.location.reload();
    };
  
    const runRegistration = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        onChange({ supported: true, enabled: true, registered: true, updateAvailable: false, registration });
        void cacheCurrentAppShell();
  
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) {
            return;
          }
  
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              onChange({ supported: true, enabled: true, registered: true, updateAvailable: true, registration });
            }
          });
        });
      } catch (error) {
        onChange({
          supported: true,
          enabled: true,
          registered: false,
          updateAvailable: false,
          error: error instanceof Error ? error.message : '서비스 워커 등록에 실패했습니다.',
        });
      }
    };
  
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    if (document.readyState === 'complete') {
      void runRegistration();
    } else {
      window.addEventListener('load', runRegistration, { once: true });
    }
  
    return () => {
      window.removeEventListener('load', runRegistration);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }
  