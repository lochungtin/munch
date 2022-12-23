import React, { useState } from 'react';
import Login from './components/login';

import './App.css';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	if (loggedIn)
		return (
			<div className='root'>
				<div></div>
			</div>
		);

	return (
		<div className='loginRoot'>
			<Login onComplete={() => setLoggedIn(true)} />
		</div>
	);
}

export default App;
