import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, onValue, ref, set } from 'firebase/database';

const app = initializeApp({
	apiKey: 'AIzaSyBQFgJ-q7bszU0OPREzr2nxHvrnaC09YH8',
	authDomain: 'munch-62903.firebaseapp.com',
	projectId: 'munch-62903',
	storageBucket: 'munch-62903.appspot.com',
	messagingSenderId: '1023096051872',
	appId: '1:1023096051872:web:579b9644c223a89aec91c5',
	measurementId: 'G-TNR0GKZ4JH',
});

const auth = getAuth(app);
const db = getDatabase(app);

export const loginWPswd = (pswd, onComplete) => {
	signInWithEmailAndPassword(auth, 'default@defau.lt', pswd)
		.then(
			(success) => onComplete(),
			(rej) => console.log(rej),
		)
		.catch((err) => console.log(err));
};

export const bindEntryData = (setState) => {
	onValue(ref(db, 'entryData'), (snapshot) => {
		let data = snapshot.val();
		setState(data !== null ? data : {});
	});
};

export const addEntry = (entry) => {
	const key = new Date().getTime();
	set(ref(db, `entryData/${key}`), { ...entry, key });
};

export const removeEntry = (entry) => {
	set(ref(db, `entryData/${entry.key}`), null);
};
