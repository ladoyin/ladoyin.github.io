let cacheName = 'converter-v1';

let urlsToCache = [
    '/',
    '/css/convert.css',
    '/javascript/convert.js',
    '/index.html'
];
self.addEventListener('install', event =>{
    console.log('service worker installing');
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log(cache, 'opened cache');
            return cache.addAll(urlsToCache);
        }).catch(err =>{
            console.log('Fetch Error -', err);
        })
    );
});

