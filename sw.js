let cacheName = 'converter-v7';

self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(cacheName).then(cache => {
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
});

self.addEventListener('activate', event =>{
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            console.log(cacheNames);
            return Promise.all(
                cacheNames.filter(CacheName =>{
                return cacheName.startsWith('converter') && 
                        cacheName != cacheName;
                }).map(cacheName =>{
                    return caches.delete(CacheName);
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
    )
});