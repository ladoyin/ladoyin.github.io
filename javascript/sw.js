var cacheName = 'converter-v1';
var urlsToCache = [
    './',
    './css/convert.css',
    './javascript/convert.js',
    './index.html'
];
self.addEventListener('install', function(event){
    console.log('service worker installing');
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log(cache, 'opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

