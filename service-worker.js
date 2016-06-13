var version="1.0.0";
var cacheName="tarungarg546-github "+version;
self.addEventListener("install",function(){
	console.log("[ServiceWorker] installed!");
});

self.addEventListener("fetch",function(event){
	console.log("[ServiceWorker] demanding for "+event.request.url);
	event.respondWith(
					    caches.match(event.request).then(function(response) {
					    	if(response){
					    		console.info("Fulfilling "+event.request.url+" from cache.");
					    		return response;
					    	} else {
					    		var fetchRequest = event.request.clone();
						        return fetch(fetchRequest).then(function(response){
						        	//Check if we received a valid response
						        	if(!response || response.status !== 200 || response.type !== 'basic') {
              							return response;
            						}
            						var responseToCache = response.clone();
						            caches.open(cacheName)
						              				.then(function(cache) {
						              					console.log("caching..");
										            	cache.put(event.request, responseToCache);
										            });

						            return response;
						        })
						        .catch(function(err){
						        	console.log("[ServiceWorker] Error :- "+err);
						        })
						    }
					    })
					    .catch(function(err){
					    	console.log("[ServiceWorker] Error :- "+err);
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
    	self.clients.claim();
    })
  );
});