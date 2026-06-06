self.addEventListener("install", () => {
  console.log("PWA 설치 완료");
});

self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});
