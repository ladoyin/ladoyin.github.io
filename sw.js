let staticCacheName = 'converter-v1';

self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll( [
                '/',
                '/index.html',
                '/javascript/main.js',
                '/style/main.css',
                'https://free.currencyconverterapi.com/api/v5/countries'
            ]);
        }).catch(err =>{
            console.log('Fetch Error -', err);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event =>{
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(thisCacheName =>{
                    if(thisCacheName !== staticCacheName){
                        return caches.delete(thisCacheName);
                    }
                })
        );
        })
    );
});

self.addEventListener('fetch', event =>{
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request);
        }).catch(err => console.log(err))
    );
});