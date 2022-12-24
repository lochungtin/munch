import React, { useState } from 'react';

import { addEntry } from '../api/firebase';
import image from './placeholder';
import { allLocaleCapitalise } from './textUtils';

const foodHandler = (index, text, update, updateFn) => {
	const tLength = text.length;
	const uLength = update.length;

	if (tLength > 0 && text[tLength - 1] === ' ') {
		if (update[index] && update[uLength - 1]) update.push('');
	} else if (tLength === 0 && uLength > 1) {
		update.splice(index, 1);
	} else update[index] = text;

	updateFn(update);
};

const imgHandler = (file, setImg) => {
	const reader = new FileReader();
	reader.onloadend = () => setImg(reader.result.split(',')[1]);
	reader.readAsDataURL(file);
};

const save = (dName, iList, img, reset) => {
	if (!dName || iList.length === 0) return;

	const ingredients = {};
	iList.forEach((val, index) => (ingredients[index] = val.toLowerCase()));
	addEntry({ name: dName.toLowerCase(), ingredients }, img).then(reset);
};

const IngredientInput = ({ index, name, iNames, setINames }) => {
	return (
		<div className='ingredientItem'>
			<input
				className='ingredientInput'
				type='text'
				placeholder='Add ingredient ...'
				onChange={(event) => foodHandler(index, event.target.value, iNames, setINames)}
				value={name}
			/>
		</div>
	);
};

const EntryModal = () => {
	const [dName, setDName] = useState('');
	const [iNames, setINames] = useState(['']);
	const [img, setImg] = useState(image);

	return (
		<div className='addRecipeRoot'>
			<div className='addTextSide'>
				<input
					className='dishNameInput'
					type='text'
					placeholder='Dish name'
					onChange={(event) => setDName(event.target.value)}
					value={allLocaleCapitalise(dName)}
				/>
				<div className='ingredientList'>
					{iNames.map((name, index) => (
						<IngredientInput
							key={index}
							index={index}
							name={name}
							iNames={[...iNames]}
							setINames={setINames}
						/>
					))}
				</div>
				<button
					className='saveButton'
					onClick={(event) =>
						save(dName, iNames, img, () => {
							setDName('');
							setINames(['']);
							setImg(image);
						})
					}>
					<p>SAVE</p>
				</button>
			</div>
			<div className='addImageSide'>
				<img className='imagePreview' src={`data:image/jpeg;base64,${img}`} alt='img' />
				<input
					className='uploadButton'
					type='file'
					accept='image/*'
					onChange={(event) => imgHandler(event.target.files[0], setImg)}
				/>
			</div>
		</div>
	);
};

export default EntryModal;
