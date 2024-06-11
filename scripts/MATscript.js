// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL, updateMetadata } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
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

// Global variables
var currentPage = 0;					// current Page number
var form = document.getElementById('materialForm');	// material form
var formData = {};					// form data storage
var isFirstSet = true;					// controls back button visibility
var uid = 'none';
var username = 'none';
var password = 'none';

if (sessionStorage.getItem('authenticated') == 'true') {
        //uid = sessionStorage.getItem('uid');
        //sessionStorage.removeItem('uid');
	username = sessionStorage.getItem('username');
	password = sessionStorage.getItem('password');
	sessionStorage.removeItem('username');
	sessionStorage.removeItem('password');
} else {
        window.location.href = 'index.html';
}

// Function to extract URL parameters
function getURLParameters() {
	var params = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		params[key] = params[key] || [];
		params[key].push(decodeURIComponent(value));
		////console.log(params[key]);
	});
	return params;
}

// Function to populate form fields with URL parameter values
function populateFormFields() {
	var urlParams = getURLParameters();
	var inputFields = document.querySelectorAll('input[name]');
	var inputImage = document.getElementById('preview');
	////console.log(inputFields)
	inputFields.forEach(function(inputField) {
		var key = inputField.name;
		var values = urlParams[key];
		console.log(key);
		if (values && values.length > 0) {
			if (key != 'picture') {
                                inputField.value = values[0];
                        } else {
                                inputField.setAttribute('src',values[0]);
                                inputImage.setAttribute('src',values[0]);
                        }
			//inputField.value = values[0];
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
		//console.log(name);
		//console.log(value);
		if (value == '' && (name != "picture" && name != "prepic")) {
			formIsEmpty = true;
		}
		//console.log(formIsEmpty);
	});
	return formIsEmpty;
}

function readImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function(event) {
			resolve(event.target.result);
    		};
    		reader.onerror = function(error) {
      			reject(error);
    		};
    		reader.readAsDataURL(file);
  	});
}


// A function to move to Previous set of inputs when the back button is pressed
function moveToPreviousSet() {
	var inputFields = document.querySelectorAll('input[data-values]');
	var inputImage = document.getElementById('preview');
	var formIsEmpty = checkIfEmpty();
	//console.log(inputFields);
	//currentPage = currentPage - 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
                        var value = inputImage.src.toLowerCase().startsWith("http") ? '#' : inputImage.src;
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
	//console.log(inputFields);
	//currentPage = currentPage + 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
			var value = inputImage.src.toLowerCase().startsWith("http") ? '#' : inputImage.src;
			//console.log(value);
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
const prepic = document.getElementById('prepic');
var pic_inputField = document.querySelectorAll('input[name="picture"][data-values]');
var touchStarted = false;

pictureInput.addEventListener('change', function() {
	const file = this.files[0];
	//console.log(file);
	if (file) {
		readImage(file)
    		.then((dataURL) => {
			//console.log(dataURL);
			previewImage.src = dataURL;
			previewImage.style.display = 'block';
			const filePath = pictureInput.value;
			const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
			prepic.value = fileName;
		})
		.catch((error) => {
                        previewImage.src = '#';
			previewImage.style.display = 'none';
			pictureInput.src = '#';
			pictureInput.value = '';
			const filePath = pictureInput.value;
			const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
			prepic.value = fileName;
                });

	} else {
		//console.log('else triggered!')
		previewImage.src = '#';
		previewImage.style.display = 'none';
		pictureInput.src = '#';
		pictureInput.value = '';
		const filePath = pictureInput.value;
                const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
		prepic.value = fileName;
	}

});



document.getElementById('backButton').addEventListener('click', function () {
	moveToPreviousSet();
	//console.log(formData);
});

document.getElementById('nextButton').addEventListener('click', function () {
        moveToNextSet();
	//console.log(formData);
});

window.onload = populateFormFields;

const finishButton = document.getElementById("finishButton");
finishButton.addEventListener('click', function() {
	moveToNextSet();
	document.getElementById('loading-overlay').style.display = 'flex';
	//if (formData.price === undefined) {
	//	console.log('undefined!');
	//}
        formData['formname'] = 'Material Entry';
	console.log(formData.price.length);
	//const entryLength = formData.price.length;
        //var jsonString = JSON.stringify(formData);
	if (formData.price === undefined) {
                //const entryLength = formData.price.length;
		console.log("Session terminated!");
                TW.showPopup({message:"Session terminated!"});
                TW.close();
        } else {
                const entryLength = formData.price.length;
                //TW.showPopup({message:"Session terminated!"});
                //TW.close();
        }
	const entryLength = formData.price.length;
        //const storage = getStorage();
        //var uploaded = false;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
        const user = userCredential.user;
        var count = 0;
        for (let i = 0; i < entryLength; i++) {
                /*for (let key in formData) {
                        if (key=='picture') {
                                formData[key][i] = '';
                        }
                }*/
		console.log(i);
                const picname = formData['prepic'][i];
                //const storageRef = ref(storage,'user/'+user.uid+'/'+picname);
                const picurl = formData['picture'][i];
                if (picurl != '#' && picurl != '') {
                        const storage = getStorage();
                        const storageRef = ref(storage,'user/'+user.uid+'/'+picname);
                        uploadString(storageRef, picurl, 'data_url').then((snapshot) => {
				getDownloadURL(snapshot.ref).then((downloadURL) => {
                                const URLparts = downloadURL.split('token=');
				const token = URLparts.length > 1 ? URLparts[URLparts.length - 1] : null;
				formData['picture'][i] = token;
                                count = count + 1;
				if (count == entryLength) {
					var jsonString = JSON.stringify(formData);
                			console.log(jsonString);
				};
                                })
				.catch((error) => {
					TW.showPopup({message:"Image URL not found!"});
				});
                        })
                        .catch((error) => {
                                //uploaded = false;
                                TW.showPopup({message:"Image not uploaded!\nPlease try again."});
                                //Telegram.WebApp.close();
                        });
                } else {
			count = count + 1;
			if (count == entryLength) {
                        	var jsonString = JSON.stringify(formData);
                                console.log(jsonString);
                        }
		}
        };
        })
        .catch((error) => {
                TW.showPopup({message:"Incorrect username or password!\nSession closed!"});
                TW.close();
        });

});

/*Telegram.WebApp.ready();
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
Telegram.WebApp.expand();*/
