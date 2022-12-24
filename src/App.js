import React, { useState } from 'react';
import Login from './components/login';
import image from './components/placeholder';
import add from './icons/add.svg';
import random from './icons/dice.svg';

import { addEntry, bindEntryData, getImage } from './api/firebase';
import './App.css';

const localeCapitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const allLocaleCapitalise = (text) => text.split(' ').map(localeCapitalise).join(' ');

const spltHalf = (arr) => {
	const splt = [...arr];
	return [splt.splice(0, Math.ceil(splt.length / 2)), splt];
};

const selectRandom = (count) => {
	const side = Math.random() > 0.5;
	const spltLength = Math.floor(count / 2) + (count % 2) * !side;
	return [side * 1, Math.floor(Math.random() * spltLength + 1) - 1];
};

const ingredientHandler = (text, index, update, setUpdate) => {
	if (text.length > 0 && text[text.length - 1] === ' ') {
		if (update[index] && update[update.length - 1]) update.push('');
	} else if (text.length === 0 && update.length > 1) {
		update.splice(index, 1);
	} else update[index] = text;

	setUpdate(update);
};

const save = (name, ingredient, image, reset) => {
	if (!name || ingredient.length === 0) return;

	const ingredients = {};
	ingredient.forEach((val, index) => (ingredients[index] = val.toLowerCase()));
	addEntry({ name: name.toLowerCase(), ingredients }, image).then(reset);
};

const imageHandler = (event, setPreview) => {
	const reader = new FileReader();
	reader.onloadend = () => setPreview(reader.result.split(',')[1]);
	reader.readAsDataURL(event.target.files[0]);
};

const Card = ({ data, selected }) => {
	const { key, name, ingredients } = data;
	const [preview, setPreview] = useState(image);
	const [loaded, setLoaded] = useState(false);

	if (!loaded) {
		getImage(key).then((val) => {
			setPreview(val.data);
		});
		setLoaded(true);
	}

	return (
		<div className={'cardRoot ' + (selected ? 'cardSelected' : '')}>
			<p className='cardName'>{allLocaleCapitalise(name)}</p>
			<img className='foodPic' src={`data:image/jpeg;base64,${preview}`} alt='img' />
			<p>Ingredients</p>
			<div className='ingredients'>
				{spltHalf([...ingredients]).map((splt, sIndex) => (
					<div className='ingredientList' key={sIndex}>
						{splt.map((name, index) => (
							<div className='ingredientItem' key={index}>
								<div className='ingredientDot' />
								<p className='ingredientName'>{allLocaleCapitalise(name)}</p>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false);

	const [addBoxOut, setToggleAdd] = useState(false);

	const [newDishName, setNewDishName] = useState('');
	const [newIngredientList, setNewIngredientList] = useState(['']);
	const [preview, setPreview] = useState(image);

	const [selection, setSelection] = useState([-1, -1]);

	const [filters, setFilters] = useState('');
	const [bound, setBound] = useState(false);
	const [data, setData] = useState([]);

	if (!bound) {
		bindEntryData(setData);
		setBound(true);
	}

	let display = data;
	if (filters !== 'all' && filters !== '*') {
		const fltr = filters.split(' ');
		display = data.filter((entry) => {
			if (fltr.length !== entry.ingredients.size) return false;
			return fltr.every((word) => entry.ingredients.has(word));
		});
	}

	if (loggedIn)
		return (
			<div className={'root ' + (filters ? 'rootF' : '')}>
				<div className='inputRow'>
					<div className='searchBar'>
						<input
							className='searchInput'
							type='text'
							placeholder={`What's in the fridge?`}
							onChange={(event) => setFilters(event.target.value)}
						/>
						<button onClick={() => setSelection(selectRandom(data.length))}>
							<img className='iconImg' src={random} alt='search' />
						</button>
					</div>
					<button
						className={'addRecipeButton ' + (addBoxOut ? 'addButtonPressed' : '')}
						onClick={() => setToggleAdd(!addBoxOut)}>
						<img className='iconImg' src={add} alt='add' />
					</button>
				</div>
				{addBoxOut ? (
					<div className='addRecipeRoot'>
						<div className='addTextSide'>
							<input
								className='dishNameInput'
								type='text'
								placeholder='Dish name'
								onChange={(event) => setNewDishName(event.target.value)}
								value={allLocaleCapitalise(newDishName)}
							/>
							<div className='ingredientList'>
								{newIngredientList.map((name, index) => (
									<div className='ingredientItem' key={index}>
										<input
											className='ingredientInput'
											type='text'
											placeholder='Add ingredient ...'
											onChange={(event) =>
												ingredientHandler(
													event.target.value,
													index,
													[...newIngredientList],
													setNewIngredientList,
												)
											}
											value={name}
										/>
									</div>
								))}
							</div>
							<button
								className='saveButton'
								onClick={(event) =>
									save(newDishName, newIngredientList, preview, () => {
										setNewIngredientList(['']);
										setPreview(image);
										setNewDishName('');
									})
								}>
								<p>SAVE</p>
							</button>
						</div>
						<div className='addImageSide'>
							<img className='imagePreview' src={`data:image/jpeg;base64,${preview}`} alt='img' />
							<input
								className='uploadButton'
								type='file'
								accept='image/*'
								onChange={(event) => imageHandler(event, setPreview)}
							/>
						</div>
					</div>
				) : (
					<></>
				)}
				{filters !== '' ? (
					<div className='recipes'>
						{spltHalf(display).map((splt, lrIndex) => (
							<div className='list' key={lrIndex}>
								{splt.map((data, index) => (
									<Card
										data={data}
										key={index}
										selected={lrIndex === selection[0] && index === selection[1]}
									/>
								))}
							</div>
						))}
					</div>
				) : (
					<></>
				)}
			</div>
		);

	return (
		<div className='root'>
			<Login onComplete={() => setLoggedIn(true)} />
		</div>
	);
};

export default App;
