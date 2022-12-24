import React, { useState } from 'react';

import { bindEntryData } from './api/firebase';
import Card from './components/card';
import EntryModal from './components/entry';
import { spltHalf } from './components/layoutUtils';
import Login from './components/login';
import SearchBar from './components/search';

import './App.css';

const Recipes = ({ display, select }) => {
	return (
		<div className='recipes'>
			{spltHalf(display).map((splt, lrIndex) => (
				<div className='list' key={lrIndex}>
					{splt.map((data, index) => (
						<Card data={data} key={index} selected={lrIndex === select[0] && index === select[1]} />
					))}
				</div>
			))}
		</div>
	);
};

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [filters, setFilter] = useState('');
	const [select, setSelect] = useState([-1, -1]);
	const [bound, setBound] = useState(false);
	const [data, setData] = useState([]);

	if (!bound) {
		bindEntryData(setData);
		setBound(true);
	}

	const fltr = new Set(filters.split(' '));
	let display = data;
	if (filters !== 'all' && filters !== '*')
		display = data.filter((entry) => entry.ingredients.every((word) => fltr.has(word)));

	if (loggedIn)
		return (
			<div className={'root ' + (filters ? 'rootF' : '')}>
				<SearchBar
					datLength={data.length}
					setFilter={setFilter}
					setSelection={setSelect}
					setShowAdd={setShowAdd}
				/>
				{showAdd ? <EntryModal /> : <></>}
				{filters !== '' ? <Recipes display={display} select={select} /> : <></>}
			</div>
		);

	return (
		<div className='root'>
			<Login onComplete={() => setLoggedIn(true)} />
		</div>
	);
};

export default App;
