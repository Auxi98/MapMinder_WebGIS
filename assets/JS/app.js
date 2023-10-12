if ('serviceWorker' in navigator) {
    console.log('sw can be installed');
    navigator.serviceWorker
        .register('./sw.js') 
        .then(function() {
            console.log('ServiceWorker is registered');
        })
        .catch(function(error) {
            console.log('Error while registering SW', error);
        });
    }