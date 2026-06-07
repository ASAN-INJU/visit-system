const CACHE_NAME = "asan-inju-v1";

// 캐시에 저장할 기본 파일
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// 설치 시 캐시 저장
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 요청이 있을 때 캐시 우선 사용
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
