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

/**
 * 기본적으로 오프라인에서도 필요한 파일
 *
 * 실제 public 폴더의 경로와 반드시 일치해야 한다.
 */
const BASE_APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/logo.svg',
  '/icon/192x192.png',
  '/icon/512x512.png',
];

/**
 * Service Worker를 활성화할 환경인지 확인한다.
 *
 * 1. Production 환경
 * 2. VITE_ENABLE_SW=true
 * 3. URL에 ?sw=1이 있는 경우
 */
function shouldRegister() {
  const localOverride =
    new URLSearchParams(window.location.search).get('sw') === '1';

  return (
    import.meta.env.PROD ||
    import.meta.env.VITE_ENABLE_SW === 'true' ||
    localOverride
  );
}

/**
 * 현재 HTML에서 사용 중인
 * JS / CSS / manifest / icon 경로를 찾는다.
 *
 * Vite production build에서는 JS 파일명이
 * index-AbCd1234.js처럼 해시가 붙기 때문에
 * 직접 파일명을 작성하지 않고 DOM에서 찾아낸다.
 */
function collectCurrentAppShellUrls() {
  const urls = new Set(BASE_APP_SHELL);

  const assets = document.querySelectorAll<
    HTMLLinkElement | HTMLScriptElement
  >(
    [
      'script[src]',
      'link[rel="stylesheet"][href]',
      'link[rel="modulepreload"][href]',
      'link[rel="manifest"][href]',
      'link[rel~="icon"][href]',
      'link[rel="apple-touch-icon"][href]',
    ].join(', '),
  );

  assets.forEach((asset) => {
    const rawUrl =
      asset instanceof HTMLScriptElement
        ? asset.getAttribute('src')
        : asset.getAttribute('href');

    if (!rawUrl) {
      return;
    }

    const url = new URL(rawUrl, window.location.origin);

    if (url.origin !== window.location.origin) {
      return;
    }

    urls.add(`${url.pathname}${url.search}`);
  });

  return [...urls];
}

/**
 * 현재 앱에서 사용하는 JS / CSS 등의 URL을
 * Service Worker에게 전달한다.
 */
async function cacheCurrentAppShell() {
  await navigator.serviceWorker.ready;

  const worker = navigator.serviceWorker.controller;

  if (!worker) {
    console.warn(
      '[Service Worker] 현재 페이지를 제어하는 Service Worker가 없습니다.',
    );
    return;
  }

  const urls = collectCurrentAppShellUrls();

  console.log('[Service Worker] CACHE_URLS:', urls);

  worker.postMessage({
    type: 'CACHE_URLS',
    urls,
  });
}

/**
 * Blankit Service Worker 등록
 */
export function registerServiceWorker(
  onChange: (state: ServiceWorkerUiState) => void,
) {
  /**
   * 브라우저가 Service Worker를 지원하지 않는 경우
   */
  if (!initialState.supported) {
    onChange(initialState);

    return () => undefined;
  }

  const enabled = shouldRegister();

  /**
   * 개발 환경 등에서 Service Worker가 비활성화된 경우
   */
  if (!enabled) {
    onChange({
      ...initialState,
      supported: true,
      enabled: false,
    });

    return () => undefined;
  }

  /**
   * Service Worker가 교체될 때
   * 페이지가 여러 번 reload되는 것을 방지한다.
   */
  let reloadedForUpdate = false;

  const onControllerChange = () => {
    if (reloadedForUpdate) {
      return;
    }

    reloadedForUpdate = true;

    window.location.reload();
  };

  /**
   * 실제 Service Worker 등록
   */
  const runRegistration = async () => {
    try {
      const registration =
        await navigator.serviceWorker.register(
          '/service-worker.js',
          {
            scope: '/',
          },
        );

      onChange({
        supported: true,
        enabled: true,
        registered: true,
        updateAvailable: false,
        registration,
      });

      /**
       * Service Worker가 준비된 후
       * 현재 build에서 사용 중인 JS / CSS를 캐싱한다.
       */
      try {
        await cacheCurrentAppShell();
      } catch (error) {
        console.warn(
          '[Service Worker] 앱 셸 캐싱 실패',
          error,
        );
      }

      /**
       * 새로운 service-worker.js가 발견됐는지 감시
       */
      registration.addEventListener(
        'updatefound',
        () => {
          const installing =
            registration.installing;

          if (!installing) {
            return;
          }

          installing.addEventListener(
            'statechange',
            () => {
              /**
               * 새 Service Worker 설치 완료 +
               * 기존 Service Worker가 이미 페이지를 제어 중
               *
               * → 업데이트 가능한 상태
               */
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                onChange({
                  supported: true,
                  enabled: true,
                  registered: true,
                  updateAvailable: true,
                  registration,
                });
              }
            },
          );
        },
      );
    } catch (error) {
      onChange({
        supported: true,
        enabled: true,
        registered: false,
        updateAvailable: false,

        error:
          error instanceof Error
            ? error.message
            : '서비스 워커 등록에 실패했습니다.',
      });
    }
  };

  navigator.serviceWorker.addEventListener(
    'controllerchange',
    onControllerChange,
  );

  /**
   * HTML 로딩이 이미 끝났다면 바로 등록
   */
  if (document.readyState === 'complete') {
    void runRegistration();
  } else {
    /**
     * 아직 로딩 중이라면 load 이후 등록
     */
    window.addEventListener(
      'load',
      runRegistration,
      {
        once: true,
      },
    );
  }

  /**
   * React 컴포넌트가 unmount될 때
   * 이벤트 리스너 정리
   */
  return () => {
    window.removeEventListener(
      'load',
      runRegistration,
    );

    navigator.serviceWorker.removeEventListener(
      'controllerchange',
      onControllerChange,
    );
  };
}
