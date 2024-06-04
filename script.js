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
		console.log(name);
		console.log(value);
		if (value == '' && (name != "picture" && name != "prepic")) {
			formIsEmpty = true;
		}
		console.log(formIsEmpty);
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
	console.log(inputFields);
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
	console.log(inputFields)
	//currentPage = currentPage + 1;
	inputFields.forEach(function (inputField) {
		var key = inputField.name;
		if (key == 'picture') {
			var value = inputImage.src.toLowerCase().startsWith("http") ? '#' : inputImage.src;
			console.log(value);
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
	console.log(file);
	if (file) {
		readImage(file)
    		.then((dataURL) => {
			console.log(dataURL);
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
		console.log('else triggered!')
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
	console.log(formData);
});

document.getElementById('nextButton').addEventListener('click', function () {
        moveToNextSet();
	console.log(formData);
});

window.onload = populateFormFields;

const finishButton = document.getElementById("finishButton");
finishButton.addEventListener('click', function() {
	moveToNextSet();
        formData['formname'] = 'Material Entry';
        var jsonString = JSON.stringify(formData);
	console.log(jsonString)
	alert('Button was clicked!!');
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
