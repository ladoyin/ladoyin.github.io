let staticCacheName = 'converter-v1';

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
    event.respondWith(
        caches.match(event.request).then(response =>{
            if(response){
                return response;
            }

            let requestClone = event.request.clone();

           fetch(requestClone).then(response =>{
               if(!response){
                   return response;
               }

               let responseClone = response.clone();

               caches.open(staticCacheName).then(cache =>{
                   cache.put(event.request, responseClone);
                   return response;
               });
           });

        }).catch(err => console.log(err))
    );
});