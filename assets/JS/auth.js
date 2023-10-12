import { auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut  } from './firebase.js'; // Import the auth instance from firebase.js
// let mapInitialized = false;

// function initializeMapAndProceed() {
//   if (!mapInitialized) {
//     initializeMap(() => {
//       mapInitialized = true; 
//       fetchDataFromFirebase();
//     });
//   }
// }


function showAlert(div, type, msg) {
  var putInDiv = document.getElementById(div);
  putInDiv.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible fade show" role = "alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
}


onAuthStateChanged(auth, (user) => {
  console.log('User State Changed'); // Add this line
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    window.currentUserEmail = user.email;        
    document.getElementById('LogoutLink').style.display = 'block';
    document.getElementById('notLoggedIn').style.display = 'none';
    document.getElementById('loggedIn').style.display = 'block';


    initializeMap();
    fetchDataFromFirebase();
    

    
  } else {
    // User is signed out
    document.getElementById('LogoutLink').style.display = 'none';
    document.getElementById('notLoggedIn').style.display = 'block';
    document.getElementById('loggedIn').style.display = 'none';
  }
});


$('#SignupForm').submit(function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    var email = document.querySelector('#SignupEmail').value
    var SignupPwd = document.querySelector('#SignupPassword').value
    var ConfirmPwd = document.querySelector('#ConfirmPassword').value

    
    if (SignupPwd === ConfirmPwd) {
      createUserWithEmailAndPassword(auth, email, SignupPwd)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          showAlert('signupalert', 'warnings', errorMessage);
          // ..
        });
    } else {
      showAlert('signupalert', 'warnings', 'Passwords do not match');
    }
});

$('#SigninForm').submit(function(event) {
  event.preventDefault(); // Prevents the default form submission behavior

  var email = document.querySelector('#SigninEmail').value
  var SigninPwd = document.querySelector('#SigninPassword').value
  signInWithEmailAndPassword(auth, email, SigninPwd)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    showAlert('signinalert', 'warnings', errorMessage);
  });
});

document.getElementById('logoutBtn').addEventListener('click', function() {
  logoutUser();
});

function logoutUser() {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

  
    // // Sign in with email and password
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     var user = userCredential.user;
    //     console.log('User logged in:', user);
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     console.error('Error:', errorCode, errorMessage);
    //   });