let cacheName = 'converter-v1';

let urlsToCache = [
    '/',
    '/index.html',
    '/javascript/convert.js',
    '/css/convert.css'
];
self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(urlsToCache);
        }).catch(err =>{
            console.log('Fetch Error -', err);
        })
    );
});

self.addEventListener('activate', event =>{
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            console.log(cacheNames);
            return Promise.all(cacheNames.map(thisCacheName =>{
                if(thisCacheName !== cacheName){
                    return caches.delete(thisCacheName);
                }
            })
        );
        })
    );
});

self.addEventListener('fetch', event =>{
    let requestUrl = new URL(event.request.url);
    if(requestUrl.origin === location.origin){
        console.log(requestUrl);
        console.log(requestUrl.origin);
        console.log(location.origin);
    }
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request);
        })
    )
});

