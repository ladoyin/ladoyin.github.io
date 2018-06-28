let cacheName = 'converter-v2';

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

self.addEventListener('activate', event =>{
    console.log('service worker activating');
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            console.log(cacheNames);
            return Promise.all(cacheNames.map(thisCacheName =>{
                if(thisCacheName !== cacheName){
                    console.log('[service worker] removing cached files from', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            })
        );
        })
    );
});

