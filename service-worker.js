var cacheName="tarungarg546-github";
self.addEventListener("install",function(event){
	console.log("[ServiceWorker] installing...");
	event.waitUntill(
						caches.open(cacheName)
											.then(function(cache){
												console.log('[ServiceWorker] Caching files');
        										return cache.addAll(filesToCache);
											})
											.then(function(){
												console.log('[ServiceWorker] installed');
												self.skipWaiting();
											})
					)
});

self.addEventListener("fetch",function(event){
	event.respondWith(
					    caches.match(event.request).then(function(response) {
					    	if(response){
					    		console.info("Fulfilling "+e.request.url+" from cache.");
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
										            	cache.put(event.request, responseToCache);
										            });

						            return response;
						        });
						    }
					    })
  					);
});