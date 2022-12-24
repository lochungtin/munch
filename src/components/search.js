import React, { useState } from 'react';

import add from '../icons/add.svg';
import random from '../icons/dice.svg';

const rnd = (count) => {
	const side = Math.random() > 0.5;
	const spltLength = Math.floor(count / 2) + (count % 2) * !side;
	return [side * 1, Math.floor(Math.random() * spltLength + 1) - 1];
};

const SearchBar = ({ dataLength, setFilter, setSelect, setShowAdd }) => {
	const [addPressed, setAddPressed] = useState(false);

	return (
		<div className='inputRow'>
			<div className='searchBar'>
				<input
					className='searchInput'
					type='text'
					placeholder={`What's in the fridge?`}
					onChange={(event) => setFilter(event.target.value)}
				/>
				<button onClick={() => setSelect(rnd(dataLength))}>
					<img className='iconImg' src={random} alt='search' />
				</button>
			</div>
			<button
				className={'addRecipeButton ' + (addPressed ? 'addButtonPressed' : '')}
				onClick={() => {
					setAddPressed(!addPressed);
					setShowAdd(!addPressed);
				}}>
				<img className='iconImg' src={add} alt='add' />
			</button>
		</div>
	);
};

export default SearchBar;
