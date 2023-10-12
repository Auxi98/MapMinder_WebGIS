
import { storage, ref, uploadBytes, getDownloadURL} from './firebase.js'; // Import the auth instance from firebase.js


document.getElementById('add-marker-button').addEventListener('click', function() {
    $('#journalModal').modal('show');
    // Set focus to the modal
    $('#journalModal').focus();
    console.log("Journal modal clicked")
});

document.getElementById('journalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('journalDate').value;
    const notes = document.getElementById('journalNotes').value;
    const image = document.getElementById('journalImage').files[0];
    const markerColor = document.getElementById('markerColor').value;
    const markerImage = document.getElementById('markerImage').value;
    const useGPS = document.getElementById('useGPS').checked;

    let locationData;

    if (useGPS && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            
            saveJournalEntry(date, notes, image, locationData, markerColor, markerImage);
            $('#journalModal').modal('hide');
        }, function(error) {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Please enable GPS for location tracking or uncheck the 'Use GPS' option.");
            }
        });
    } else {
        locationData = null; // User chose not to use GPS
        addMarkerToMap(locationData, markerColor, markerImage);
        saveJournalEntry(date, notes, image, locationData, markerColor, markerImage);
        $('#journalModal').modal('hide');
    }
});


function saveJournalEntry(date, notes, image, locationData, markerColor, markerImage) {
    var file = document.getElementById('journalImage').files[0];
    var imageRef = ref(storage, 'feed/' + file.name);

    // Display the progress bar when the upload starts
    document.getElementById('upload-progress').style.display = 'block';

    // Upload the file
    uploadBytes(imageRef, file).then((snapshot) => {
        // Track the upload progress
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

        // Update the progress bar
        document.getElementById('upload-progress').querySelector('.progress-bar').style.width = progress + '%';

        console.log('Uploaded a blob or file!');

        // Get the download URL
        getDownloadURL(imageRef).then((downloadURL) => {
            console.log('File available at', downloadURL);

            // Prepare the data to send to the server
            const data = {
                Email:currentUserEmail,
                date: date,
                notes: notes,
                ImageURL: downloadURL, 
                locationData: locationData,
                markerColor: markerColor,
                markerImage: markerImage
                
            };

        // Make a fetch POST request
            fetch('https://map-minder-default-rtdb.asia-southeast1.firebasedatabase.app/feed.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        }).catch((error) => {
            console.error('Error getting download URL:', error);
        });

    }).catch((error) => {
        console.error('Error uploading file:', error);
    });
}

