var cacheName = 'converter-v1'


self.addEventListener('install', event => {
    console.log('service worker installed');

    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('opened cache');
            return cache.addAll([
                './',
                './index.html',
                './css/convert.css',
                './javascript/convert.js'
            ]);
        })
    );
});

