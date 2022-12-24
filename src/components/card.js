import React, { useState } from 'react';

import { getImage } from '../api/firebase';
import { spltHalf } from './layoutUtils';
import image from './placeholder';
import { allLocaleCapitalise } from './textUtils';

const Card = ({ data, selected }) => {
	const { key, name, ingredients } = data;
	const [preview, setPreview] = useState(image);
	const [loaded, setLoaded] = useState(false);

	if (!loaded) {
		getImage(key).then((val) => setPreview(val.data));
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

export default Card;
