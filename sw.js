const cacheName = 'MustaphaCache';
const ImagesCacheName = 'ImagesCache';



self.addEventListener('install', (event) => {

    event.waitUntil(caches.open(ImagesCacheName).then(cache => {
        cache.addAll([
            '/images/Accupoint.png', 'images/Bankwise_portfolio.png', '/images/Basic_Forum.png', '/images/e2e.png', '/images/Face_Blast.png',
            '/images/Mustapha.jpg.jpg' , '/images/musty.jpg', '/images/nairaland.png', '/images/Nairaland2.png', '/images/Vidd-Call.png'
        ])
    }));
    event.waitUntil(self.skipWaiting())
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim(), caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cache => {
            if (cache != ImagesCacheName) {
                if (cache !== cacheName) {
                    return caches.delete(cache)
                }
            }
        }))
    }))
});


self.addEventListener('fetch', event => {
    const { request } = event;
    var url = request.url;
    var urlOB = new URL(request.url);
    var path = urlOB.pathname;

    if (!path.startsWith('/_next/static') && !path.startsWith('/images') && !path.includes('/favicon')  ) {
        return event
    }


    if (isImg(url)) {

        event.respondWith(caches.match(request).then(cachedResponse => {
            return cachedResponse || fetch(request).then(networkResponse => {
                return caches.open(ImagesCacheName).then(cache => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse
                })
            })
        }))

    } else {

        event.respondWith(caches.match(request).then(cachedResponse => {
            return cachedResponse || fetch(request).then(networkResponse => {
                return caches.open(cacheName).then(cache => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse
                })
            })
        }))
    }
});


//img
function isImg(url) {
    var flag = false;
    if (url.includes('jpg') || url.includes('png') || url.includes('favicon')) {
        flag = true
    }
    return flag
}