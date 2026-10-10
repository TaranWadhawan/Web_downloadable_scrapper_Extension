(() => {
  const urls = new Set();

  // 1. Scan for specific media tags
  document.querySelectorAll('img, video, audio, source').forEach(el => {
    const src = el.src || el.currentSrc;
    if (src && src.startsWith('http')) {
      urls.add(src);
    }
  });

  // 2. Scan anchor tags for downloadable file extensions
  const fileExtensions = /\.(mp3|mp4|webm|ogg|wav|pdf|zip|rar|tar|gz|jpg|jpeg|png|gif|svg|webp)$/i;
  document.querySelectorAll('a').forEach(el => {
    const href = el.href;
    if (href && href.startsWith('http') && fileExtensions.test(href)) {
      urls.add(href);
    }
  });

  // Convert Set back to an Array for transmission to popup.js
  return Array.from(urls);
})();