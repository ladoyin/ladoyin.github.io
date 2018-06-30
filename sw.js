let cacheName = 'converter-v5';
let currencyCache = 'currency-v1';
let allCache = [
    cacheName,
    currencyCache
];

self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll( [
                '/',
                '/index.html',
                '/javascript/main.js',
                '/style/main.css'
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
                        !allCache.includes(cacheName);
                }).map(cacheName =>{
                    return caches.delete(CacheName);
                })
        );
        })
    );
});

self.addEventListener('fetch', event =>{
    let requestUrl = new URL(event.request.url);
    if(requestUrl.origin === location.origin){
        if(requestUrl.pathname.startsWith('/api/')){
            event.respondWith(serveCurrency(event.request));
        }
    }
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request);
        }).catch(err => console.log(err))
    )
});

function serveCurrency(request){
    let storageUrl = request.url;
    return caches.open(currencyCache).then(cache =>{
        return cache.match(storageUrl).then(response =>{
            let networkFetch = fetch(request).then(networkResponse =>{
                cache.put(storageUrl, networkResponse.clone());
                return networkResponse;
            });
            return response || networkFetch;
        });
    });
}

