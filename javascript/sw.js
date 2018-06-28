var cacheName = 'converter-v2';

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
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

