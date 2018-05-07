import firebase from 'firebase';

var config = {
	apiKey: "AIzaSyA6K9x7ji3pTmYR6sReIzSm8gkr_3lbZUs",
	authDomain: "snake-cv.firebaseapp.com",
	databaseURL: "https://snake-cv.firebaseio.com",
	projectId: "snake-cv",
	storageBucket: "",
	messagingSenderId: "367448488328"
};
firebase.initializeApp(config);

export default firebase;
