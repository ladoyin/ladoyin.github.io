var cacheName = 'converter-v1'


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log(cache, 'opened cache');
            return cache.addAll([
                './',
                './index.html',
                './css/convert.css',
                './javascript/convert.js'
            ]);
        })
    );
});

