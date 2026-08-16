const CACHE_NAME = 'blankit-v4';

console.log('[SW] 현재 Service Worker 실행:', CACHE_NAME);

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/logo.svg',
  '/icon/192x192.png',
  '/icon/512x512.png',
];

function sameOriginUrl(value) {
  try {
    const url = new URL(value, self.location.origin);

    if (url.origin !== self.location.origin) {
      return null;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

self.addEventListener('install', (event) => {
  console.log('[SW] install:', CACHE_NAME);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] activate:', CACHE_NAME);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] 이전 캐시 삭제:', cacheName);

              return caches.delete(cacheName);
            }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING');

    self.skipWaiting();
    return;
  }

  if (
    event.data?.type === 'CACHE_URLS' &&
    Array.isArray(event.data.urls)
  ) {
    const urls = [
      ...new Set(
        event.data.urls
          .map(sameOriginUrl)
          .filter(Boolean),
      ),
    ];

    console.log('[SW] CACHE_URLS 수신:', urls);

    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        await Promise.all(
          urls.map(async (url) => {
            try {
              /**
               * 1. 이미 캐시에 있으면
               * 네트워크 요청을 다시 하지 않는다.
               */
              const cached = await cache.match(url);

              if (cached) {
                console.log('[SW] 이미 캐시됨:', url);
                return;
              }

              /**
               * 2. 캐시에 없을 때만 네트워크에서 가져온다.
               */
              const response = await fetch(url);

              if (!response.ok) {
                console.warn(
                  '[SW] 캐시 요청 실패:',
                  url,
                  response.status,
                );

                return;
              }

              /**
               * 3. 정상 응답이면 캐시에 저장한다.
               */
              await cache.put(
                url,
                response.clone(),
              );

              console.log('[SW] 캐시 성공:', url);
            } catch {
              /**
               * 오프라인이면 fetch가 실패할 수 있다.
               * 이미 앱 실행에 필요한 파일은 캐시에 있으므로
               * 오류로 처리하지 않고 건너뛴다.
               */
              console.warn(
                '[SW] 오프라인이라 새 리소스를 캐시하지 못함:',
                url,
              );
            }
          }),
        );
      }),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  /**
   * React Router 같은 SPA navigation 요청
   */
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          /**
           * 온라인일 때는 네트워크 우선
           */
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);

            /**
             * 최신 HTML을 index.html로 저장
             */
            await cache.put(
              '/index.html',
              response.clone(),
            );
          }

          console.log(
            '[SW] navigation network:',
            request.url,
          );

          return response;
        } catch {
          /**
           * 오프라인이면 캐시된 index.html 사용
           */
          console.log(
            '[SW] offline navigation fallback:',
            request.url,
          );

          const cache = await caches.open(CACHE_NAME);

          const cachedIndex =
            await cache.match('/index.html');

          if (cachedIndex) {
            console.log(
              '[SW] ✅ index.html cache hit',
            );

            return cachedIndex;
          }

          /**
           * index.html이 없으면 /도 확인
           */
          const cachedRoot =
            await cache.match('/');

          if (cachedRoot) {
            console.log('[SW] ✅ / cache hit');

            return cachedRoot;
          }

          console.error(
            '[SW] ❌ navigation fallback 없음',
          );

          return new Response(
            '아직 오프라인 페이지가 캐시되지 않았습니다.',
            {
              status: 503,
              headers: {
                'Content-Type':
                  'text/plain; charset=utf-8',
              },
            },
          );
        }
      })(),
    );

    return;
  }

  const url = new URL(request.url);

  /**
   * 외부 API나 CDN 요청은 이 Service Worker에서 캐시하지 않는다.
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  /**
   * JS / CSS / 이미지 등의 정적 리소스
   */
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      /**
       * 1차:
       * 브라우저의 원래 Request 객체로 검색
       */
      let cachedResponse =
        await cache.match(request);

      /**
       * 2차:
       * pathname + querystring으로 다시 검색
       *
       * 예:
       * http://localhost:4173/assets/index.js
       *
       * →
       *
       * /assets/index.js
       */
      if (!cachedResponse) {
        cachedResponse = await cache.match(
          `${url.pathname}${url.search}`,
        );
      }

      if (cachedResponse) {
        console.log(
          '[SW] ✅ cache hit:',
          request.url,
        );

        return cachedResponse;
      }

      console.log(
        '[SW] ❌ cache miss:',
        request.url,
      );

      /**
       * 캐시에 없으면 네트워크 요청
       */
      try {
        const networkResponse =
          await fetch(request);

        /**
         * 정상 응답이면 다음 오프라인 사용을 위해 저장
         */
        if (networkResponse.ok) {
          await cache.put(
            request,
            networkResponse.clone(),
          );

          console.log(
            '[SW] network → cache 저장:',
            request.url,
          );
        }

        return networkResponse;
      } catch {
        console.warn(
          '[SW] network 실패 + cache 없음:',
          request.url,
        );

        return new Response(
          '이 리소스는 아직 오프라인용으로 캐시되지 않았습니다.',
          {
            status: 503,
            headers: {
              'Content-Type':
                'text/plain; charset=utf-8',
            },
          },
        );
      }
    })(),
  );
});

self.addEventListener(
  'notificationclick',
  (event) => {
    event.notification.close();

    const notificationData = event.notification.data;
    const requestedUrl =
      notificationData?.url ??
      notificationData?.FCM_MSG?.data?.url ??
      notificationData?.FCM_MSG?.fcmOptions?.link ??
      '/';
    const targetUrl = sameOriginUrl(requestedUrl) ?? '/';

    event.waitUntil(
      self.clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then(async (clientList) => {
          /**
           * 이미 Blankit이 열려 있으면
           * 기존 창을 사용한다.
           */
          for (const client of clientList) {
            if ('focus' in client) {
              if ('navigate' in client) {
                await client.navigate(targetUrl);
              }

              return client.focus();
            }
          }

          /**
           * 열려 있는 창이 없으면 새로 연다.
           */
          return self.clients.openWindow(
            targetUrl,
          );
        }),
    );
  },
);

/**
 * Firebase Cloud Messaging
 *
 * 기존 notificationclick 리스너보다 뒤에서 Firebase SDK를 불러와야
 * 알림 클릭 처리를 Blankit에서 제어할 수 있다.
 */
importScripts(
  'https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyCmTMPAhXxMFjL6gG1mKY2TUzC6PPbt-dA',
  authDomain: 'blankit-96be7.firebaseapp.com',
  projectId: 'blankit-96be7',
  storageBucket: 'blankit-96be7.firebasestorage.app',
  messagingSenderId: '195901607938',
  appId: '1:195901607938:web:25c039bd4a9768907c171b',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  /**
   * notification payload는 FCM SDK가 자동으로 표시한다.
   * 여기서 다시 표시하면 동일 알림이 두 번 나타날 수 있다.
   */
  if (payload.notification) {
    return;
  }

  const title = payload.data?.title ?? 'Blankit';
  const options = {
    body: payload.data?.body ?? '',
    icon: '/icon/192x192.png',
    badge: '/icon/192x192.png',
    data: {
      url: sameOriginUrl(payload.data?.url ?? '/') ?? '/',
    },
  };

  return self.registration.showNotification(title, options);
});
