let staticCacheName = 'converter-v2';

self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll( [
                '/',
                '/index.html',
                '/javascript/main.js',
                '/style/main.css',
            ]);
        }).catch(err =>{
            console.log('Fetch Error -', err);
        })
    );
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
    let eventRequestUrl = new URL(event.request.url);

    if(eventRequestUrl.origin === location.origin){
        if(eventRequestUrl.pathname.startsWith('/api/')){
            event.respondWith(getCurrency(event.request));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request).then(response =>{
            return response || fetch(event.request);
        }).catch(err => console.log(err))
    );
});

function getCurrency(request){
    console.log(request.url);
}