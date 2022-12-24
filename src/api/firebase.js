import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { get, getDatabase, onValue, ref, set } from 'firebase/database';

const app = initializeApp({
	apiKey: 'AIzaSyBQFgJ-q7bszU0OPREzr2nxHvrnaC09YH8',
	authDomain: 'munch-62903.firebaseapp.com',
	databaseURL: 'https://munch-62903-default-rtdb.europe-west1.firebasedatabase.app/',
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
	onValue(ref(db, 'recipe'), (snapshot) => {
		let data = snapshot.val();
		setState(
			data !== null
				? Object.entries(data).map(([k, v]) => ({
						key: v.key,
						name: v.name,
						ingredients: new Set(Object.entries(v.ingredients).map(([ki, vi]) => vi)),
				  }))
				: [],
		);
	});
};

export const getImage = (key) => get(ref(db, `image/${key}`)).then((val) => val.val());

export const addEntry = (data, image) => {
	const key = new Date().getTime();
	return Promise.all([
		set(ref(db, `recipe/${key}`), { ...data, key }),
		set(ref(db, `image/${key}`), { data: image }),
	]);
};

export const removeEntry = (key) => {
	set(ref(db, `recipe/${key}`), null);
	set(ref(db, `image/${key}`), null);
};
