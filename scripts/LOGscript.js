import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

var passwordInput = document.getElementById("password");
var themeToggle = document.getElementById("theme-toggle");

function toggleTheme() {
	if (document.body.classList.contains("dark-mode")) {
        	document.body.classList.remove("dark-mode");
        	themeToggle.classList.remove("sun");
        	themeToggle.classList.add("moon");
        	passwordInput.type = "password";
      } else {
        	document.body.classList.add("dark-mode");
        	themeToggle.classList.remove("moon");
        	themeToggle.classList.add("sun");
        	passwordInput.type = "text";
      }

      // Trigger focus on the password input field
      passwordInput.focus();
}

const themeButton = document.getElementById("theme-toggle");
themeButton.addEventListener('click', function() {
        toggleTheme();
});

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener('click', function() {
	var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
                const user = userCredential.user;
                sessionStorage.setItem('authenticated','true');
                //sessionStorage.setItem('uid',user.uid);
		sessionStorage.setItem('username',username);
                sessionStorage.setItem('password',password);
                window.location.href = 'matform.html?source=fulia&picture=\"https://firebasestorage.googleapis.com/v0/b/test1-1e3d0.appspot.com/o/user%2FUtCuILrOuIRKuxAXVa32pVIhqRC2%2FRMSF_bb.png?alt=media&token=2117bf01-29b7-40bd-9c13-72449ea7ebbd\"';
        })
        .catch((error) => {
                alert("Incorrect username or password!\nSession closed!");
                Telegram.WebApp.close();
        });
});

Telegram.WebApp.ready();
Telegram.WebApp.MainButton.setText('Login').show().onClick(function () {
	var username = document.getElementById('username');
	var password = document.getElementById('password');

	const auth = getAuth();
	signInWithEmailAndPassword(auth, username.value, password.value)
        .then((userCredential) => {
		//const user = userCredential.user;
		var uname = username.value;
		var upass = password.value;
		console.log(uname);
		console.log(upass);
		sessionStorage.setItem('authenticated','true');
		sessionStorage.setItem('username',uname);
		sessionStorage.setItem('password',upass);
		//console.log(sessionStorage.getItem('un'));
		window.location.href = 'matform.html'; 
	})
	.catch((error) => {
		alert("Incorrect username or password!\nSession closed!");
    		Telegram.WebApp.close();
  	});

    	//var authString = JSON.stringify(authData);
    	//Telegram.WebApp.sendData(authString);
    	//Telegram.WebApp.close();
    	//console.log(authString);
    	});
