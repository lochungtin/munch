import React, { useState } from 'react';
import Login from './components/login';
import add from './icons/add.svg';
import random from './icons/dice.svg';

import './App.css';

const image =
	'iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADXElEQVR4nO2cz2sTQRTHB1FQPIlXRfBSxYNe/BM8+j8I+gf4J+hNrNV/QMi5Uuip9diTgpB2Jtn3Ih405E1UxB9oLR6ssDIJCk2TzWZ30tnZfD/wToFd9n1m5s0k2acUAAAAAAAAAAAAAAAAAADACNvd5LIRfmwskRbeM5bTRQ4tvKctJdrySvt9+9LcBkyz2TxhhJ4Y4f3QD22qGsL7TsRWunXce/K15efBH9DGEVpo06uEwcivwIOZiMLNBJ9rPpYdO6ME4f1W//USRr8NOgselRdgiUJPZxNpuN1RaQFa+GfoBzGRhhba9TADsm+iFhwz7/xAQDYQEBgICAwEBAYCAgMBgYGAwNRSQNJPzmvhNXeQcWEsrXv5XmUO1E5A4pJv+euhU6Xlb+4zVTFqJ0ALr028n/AzVTFqKIB2J9+PfqiKsWgCvquKUTsBxtL65CWIVlXFqJ2AVv/1kiu4h4qw0JeWbZ1TFaN2Ahxut+MKrlvzByG0WsXk11ZATEBAYCAgMBAQGAjIgbadu7pHt9QcgIApmH5y0wj9GfyJtsdXlGcgIIMdSa6P/IObzUdzWnkEAibQ7rUvauFPYxLUUB6BgDG86nfOaqE3k5Ljsx5AwAgvRU4Z4RdZifFZD2ohoCWdO0b4QdnrpGl6LPP3hIPhpR5EL2DHJleNpV/DbzvLSSjwHkNjoQW0e+0z2vLbA9csKMHt9WdMvpd6EK2A4XJBm2OvO6OEf3v9QgJK1oNoBWjL9zOvnVPCmL1+kShcD6IUsNPr3Mg1YiVbQsZev0g0FkLA9ge+YIQ+506MjJcwba9/VPUgKgHdbvekttScOTlyUEKevf5R1YOoBGhLTwsnSIYSZtzrz70eRCPACN8uPUIt3zuid5YbtRKg+3Tt/2ErktA560HlBQwPW/QudELNnOpBpQVkHrbiCJ5WDyotYOphy0YRjWgFLAIGAsICAYGBgMBAQGAgIDAQEBgIqLuA7He2ECYzBx5eKkTLMi480LSldvkZYHkFI50LSqCHpQW4drxoW8lFBPz21l4Bs4CLLD/LyheuDa8R2sBSxPkECG147x/tLjiYCeiim2Y376Zl78kfrQmuI+ygZTt6iqYuB8P29bRc1ZY6AAAAAAAAAAAAAAAAAABQQfkLFj2aNFFQNUoAAAAASUVORK5CYII=';

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
	} else if (text.length === 0) {
		update.splice(index, 1);
	} else update[index] = text;

	setUpdate(update);
};

const imageHandler = (event, setPreview) => {
	const reader = new FileReader();
	reader.onloadend = () => setPreview(reader.result.split(',')[1]);
	reader.readAsDataURL(event.target.files[0]);
};

const Card = ({ data, selected }) => {
	const { key, name, ingredients } = data;
	return (
		<div className={'cardRoot ' + (selected ? 'cardSelected' : '')}>
			<p className='cardName'>{allLocaleCapitalise(name)}</p>
			<img src={`data:image/jpeg;base64,${image}`} alt='img' />
			<p>Ingredients</p>
			<div className='ingredients'>
				{spltHalf([...ingredients]).map((splt) => (
					<div className='ingredientList'>
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
	const [preview, setPreview] = useState(image);
	const [newIngredientList, setNewIngredientList] = useState(['']);
	const [filters, setFilters] = useState('');
	const [selection, setSelection] = useState([-1, -1]);

	let data = [{ name: 'creamy mushroom chicken', ingredients: ['cream', 'mushroom', 'chicken'] }];

	if (loggedIn)
		return (
			<div className='root'>
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
						{spltHalf(data).map((splt, lrIndex) => (
							<div className='list'>
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
