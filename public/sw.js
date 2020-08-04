const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
  './404.html',
  './js/vendor/modernizr-2.8.3.min.js',
  './js/vendor/jquery-1.12.0.min.js',
  './js/vendor/jquery-3.3.1.min.js',
  './js/bootstrap.min.js',
  './js/plugins.js',
  './js/slick.min.js',
  './js/owl.carousel.min.js',
  './js/waypoints.min.js',
  './js/main.js',
  './js/app.js',
  './css/bootstrap.min.css',
  './css/owl.carousel.min.css',
  './css/owl.theme.default.min.css',
  './css/core.css',
  './css/shortcode/shortcodes.css',
  './style.css',
  './css/responsive.css',
  './css/custom.css',
  './dist/css/lightbox.min.css',
  './css/font-awesome.css',
  './css/material-design-iconic-font.min.css',
  './css/plugins/animate.css',
  './css/plugins/animate-slider.css',
  './css/shortcode/default.css',
  './css/plugins/jquery-ui.css',
  './css/plugins/slick.css',
  './css/plugins/slick-theme.css',
  './css/plugins/meanmenu.css',
  './css/plugins/magnific-popup.css',
  './css/shortcode/header.css',
  './css/shortcode/footer.css',
  './css/shortcode/slider.css',
  './fonts/fontawesome-webfont3e6e.woff2',
  './fonts/fontawesome-webfont3e6e.ttf',
  './fonts/fontawesome-webfont3e6e.woff',
  './fonts/fontawesome-webfontd41d.eot',
  './fonts/glyphicons-halflings-regular.eot',
  './manifest.json',
  './images/logo/green_commercial_logo.png',
  './images/pwa_icons/96px.png',
  'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Raleway:300,400,500,600,700,800|Josefin+Sans:400,600,700',
  'https://myexample.gq/fonts/fontawesome-webfont3e6e.woff2?v=4.7.0',
  'https://fonts.googleapis.com/css?family=Montserrat',
  'https://fonts.gstatic.com/s/raleway/v17/1Ptug8zYS_SKggPNyC0ITw.woff2',




];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('https://myexample.gq/api/v1/reviews/') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('./404.html');
        } 
      })
    );
  }
});