// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL, updateMetadata } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDcHo4rDarasQ6vpTjtVYT0xu8T43AI4B8",
	authDomain: "test1-1e3d0.firebaseapp.com",
	projectId: "test1-1e3d0",
	storageBucket: "test1-1e3d0.appspot.com",
	messagingSenderId: "31521875447",
	appId: "1:31521875447:web:866af9b76ad347441ffaf2",
	measurementId: "G-C2WHYVRCSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
console.log(app)

/*const auth = getAuth();
signInWithEmailAndPassword(auth, 'antant.boutique@gmail.com', 'G9q!6aB@r1S*7t2L')
.then((userCredential) => {
	// Signed in
	const user = userCredential.user;
	console.log(user.uid);
	// ...
})
.catch((error) => {
	const errorCode = error.code;
	const errorMessage = error.message;
	console.log(errorMessage);
});

const storage = getStorage();
const storageRef = ref(storage, 'UtCuILrOuIRKuxAXVa32pVIhqRC2/');
console.log(storageRef)*/


// Global variables
var currentPage = 0;					// current Page number
var form = document.getElementById('materialForm');	// material form
var formData = {};					// form data storage
var isFirstSet = true;					// controls back button visibility


// Function to extract URL parameters
function getURLParameters() {
	var params = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		params[key] = params[key] || [];
		params[key].push(decodeURIComponent(value));
		console.log(params[key]);
	});
	return params;
}

// Function to populate form fields with URL parameter values
function populateFormFields() {
	var urlParams = getURLParameters();
	var inputFields = document.querySelectorAll('input[name]');
	inputFields.forEach(function(inputField) {
		var key = inputField.name;
		var values = urlParams[key];
		if (values && values.length > 0) {
			inputField.value = values[0];
		} else {
  			inputField.value = '';
		}
		inputField.setAttribute('data-values', JSON.stringify(values || []));
	});
}

// Check if any of the input fields is empty
function checkIfEmpty() {
	var formIsEmpty = false;
	var inputFields = document.querySelectorAll('input[data-values]');
	inputFields.forEach(function (inputField) {
		let name = inputField.name;
                let value = inputField.value;
		if (value == '' && name != 'picture') {
			formIsEmpty = true;
		}
	});
	return formIsEmpty;
}

// A function to move to Previous set of inputs when the back button is pressed
function moveToPreviousSet() {
	var inputFields = document.querySelectorAll('input[data-values]');
	var inputImage = document.getElementById('preview');
	var formIsEmpty = checkIfEmpty();
	//currentPage = currentPage - 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
                        var value = inputImage.src;
                } else {
                        var value = inputField.value;
                }
		var currentValue = inputField.value;
		if (formData.hasOwnProperty(key)) {
			var valueIndex = formData[key].indexOf(currentValue);
			if (valueIndex > 0 || valueIndex == -1) {
				try {
				if (inputField.name == 'picture') {
					inputImage.src = formData[key][currentPage-1];
				} else {
					inputField.value = formData[key][currentPage-1];
				}
				} catch(err) {
				if (inputField.name == 'picture') {
                                        inputImage.src = '#';
                                } else {
					inputField.value = '';
				}
				}
				if (!formIsEmpty) {
            			if (currentPage == formData[key].length){
                			formData[key].push(value);
                		} else {
					formData[key][currentPage] = value;
				}
				}
				isFirstSet = false;
          		}
        	}
      	});
	currentPage = currentPage - 1;
	if (currentPage == 0) {
		isFirstSet = true;
	}
	const previewImage = document.getElementById('preview');
        const previewImageVal = formData['picture'][currentPage];
        if (previewImageVal === undefined || previewImageVal == '#' || previewImageVal == '') {
                previewImage.style.display = 'none';
        } else {
                previewImage.style.display = 'block';
        }
      	// Hide the Back button if we are on the first set of entries
      	document.getElementById('backButton').style.display = isFirstSet ? 'none' : 'flex';
}

// A function to move to next set of inputs when the next button is pressed
function moveToNextSet() {
	var formIsEmpty = checkIfEmpty();
	if (!formIsEmpty) {
	var inputFields = document.querySelectorAll('input[data-values]');
	var inputImage = document.getElementById('preview');
	//currentPage = currentPage + 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
			var value = inputImage.src;
		} else {
			var value = inputField.value;
		}
		if (!formData.hasOwnProperty(key)) {
          		formData[key] = [];
        	}
        	if (currentPage == formData[key].length){
          		formData[key].push(value);
        	} else {
          		formData[key][currentPage] = value;
          	}
        	var values = JSON.parse(inputField.getAttribute('data-values'));
        	var currentIndex = values.indexOf(value);
		if (values.length > 0 && currentPage+1 < values.length) {
			if (currentPage+1 == formData[key].length) {
				if (inputField.name == 'picture') {
					inputImage.src = values[currentPage+1] || '#';
				} else {
					inputField.value = values[currentPage+1] || '';
				}
			} else {
				if (inputField.name == 'picture') {
                                        inputImage.src = formData[key][currentPage+1];
                                } else {
					inputField.value = formData[key][currentPage+1];
				}
			}
		} else {
			if (currentPage+1 == formData[key].length) {
				if (inputField.name == 'picture') {
                                        inputImage.src = '#';
                                } else {
					inputField.value = '';
				}
                        } else {
				if (inputField.name == 'picture') {
                                        inputImage.src = formData[key][currentPage+1];
                                } else {
					inputField.value = formData[key][currentPage+1];
				}
                        }
		}
	});
	currentPage = currentPage+1;
	const previewImage = document.getElementById('preview');
	const previewImageVal = formData['picture'][currentPage];
	if (previewImageVal === undefined || previewImageVal == '#' || previewImageVal == '') {
		previewImage.style.display = 'none';
	} else {
		previewImage.style.display = 'block';
	}
	document.getElementById('backButton').style.display = 'flex';
	}
}

// Image input handling
const pictureInput = document.getElementById('picture');
const previewImage = document.getElementById('preview');
var pic_inputField = document.querySelectorAll('input[name="picture"][data-values]');
var touchStarted = false;

pictureInput.addEventListener('change', function() {
	const file = this.files[0];
	if (file) {
		console.log(file)
		const reader = new FileReader();
		reader.addEventListener('load', function() {
			previewImage.src = reader.result;
			previewImage.style.display = 'block';
			//pictureInput.src = reader.result;
                        //pictureInput.style.display = 'block';
		});

		reader.readAsDataURL(file);
	} else {
		previewImage.src = '#';
		previewImage.style.display = 'none';
		pictureInput.src = '';
                //pictureInput.style.display = 'none';
	}
});


// Touch event listeners for mobile devices
pictureInput.addEventListener('touchstart', function(event) {
	touchStarted = true;
	event.stopPropagation();
});

pictureInput.addEventListener('touchend', function(event) {
	if (touchStarted) {
		event.preventDefault();
		touchStarted = false;
		const clickEvent = new MouseEvent('click');
        	pictureInput.dispatchEvent(clickEvent);
      	}
});


// Toggle the clicked class on image input click
const imageInput = document.querySelector('.image-input');
imageInput.addEventListener('click', function(event) {
	const target = event.target;
	if (target.tagName === 'DIV' || target.tagName === 'INPUT') {
		pictureInput.click();
	}
});

document.getElementById('backButton').addEventListener('click', function () {
	moveToPreviousSet();
	console.log(formData.price.length);
});

document.getElementById('nextButton').addEventListener('click', function () {
        moveToNextSet();
	const auth = getAuth();
	signInWithEmailAndPassword(auth, 'antant.boutique@gmail.com', 'G9q!6aB@r1S*7t2L')
	.then((userCredential) => {
        // Signed in
        const user = userCredential.user;
	const storage = getStorage();
	console.log(storage)
	//const message4 = formData.picture[0];
	const message4 = JSON.stringify(formData);
	const storageRef = ref(storage,'user/'+user.uid+'/profile.json');
	uploadString(storageRef, message4).then((snapshot) => {
		
    	// Observe state change events such as progress, pause, and resume
    	// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	console.log(snapshot.bytesTransferred);
	console.log(snapshot.totalBytes);
	
    	const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    	console.log('Upload is ' + progress + '% done');
    	switch (snapshot.state) {
      	case 'paused':
        	console.log('Upload is paused');
        	break;
      	case 'running':
        	console.log('Upload is running');
        	break;
    	}
  	},
  	(error) => {
    	// Handle unsuccessful uploads
  	},
  	() => {
    	// Handle successful uploads on complete
    	// For instance, get the download URL: https://firebasestorage.googleapis.com/...
    	getDownloadURL(snapshot.ref).then((downloadURL) => {
      	console.log('File available at', downloadURL);
    	});

	});
	updateMetadata(storageRef, formData)
  	.then((metadata) => {
    	// Updated metadata for 'images/forest.jpg' is returned in the Promise
  	}).catch((error) => {
    	// Uh-oh, an error occurred!
  	});
        console.log(user.uid);
        // ...
	})
	.catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
	});
});

window.onload = populateFormFields;


Telegram.WebApp.ready();
Telegram.WebApp.MainButton.setText('Finish').show().onClick(function () {
	moveToNextSet();
	const entryLength = formData.price.length;
	for (let i = 0; i < entryLength; i++) {
    		for (let key in formData) {
			if (key=='picture') {
				formData[key][i] = '';
			}
        	}
    	}
	formData['formname'] = 'Material Entry';
	var jsonString = JSON.stringify(formData);
        Telegram.WebApp.sendData(jsonString);
        Telegram.WebApp.close();
});
Telegram.WebApp.expand();
