let cacheName = 'converter-v3';

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
    console.log(requestUrl.pathname);
    console.log(location.pathname);
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request);
        }).catch(err => console.log(err))
    )
});

