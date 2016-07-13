var version="1.0.1";
var cacheName="tarungarg546-github "+version;

self.addEventListener("fetch", function(event){
	console.log("[ServiceWorker] demanding for "+event.request.url);
	event.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(event.request).then(response => {
        if(response) {
                  console.info("Fulfilling " + event.request.url + " from cache.");
                  return response;
        } else {
          var requestURL = event.request.clone();
          return fetch(requestURL).then(response => {
            //Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            } else {
              var responseToCache = response.clone(); //response stream can be consumed only once
              cache.put(requestURL,responseToCache);
              return response;
            }
          })
        }
      })
    }).catch(err => {
      console.error("[ServiceWorker] Error :- "+JSON.stringify(err));
    })
  );
});
self.addEventListener('activate', function(e){
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList){
      return Promise.all(keyList.map(function(key){      
        if (key.startsWith("tarungarg546-github")) {
        	console.log('[ServiceWorker] Removing old cache', key);
          	return caches.delete(key);
        }
      }));
    })
    .then(function(){
    	//this code will cause the new service worker to take over responsibility for the still open pages.
    	return self.clients.claim();
    })
  );
});