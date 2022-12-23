import React, { useEffect, useState } from 'react';
import { loginWPswd } from '../api/firebase';
import logo from '../icons/munch.svg';

const empty = {
	0: '-',
	1: '-',
	2: '-',
	3: '-',
	4: '-',
	5: '-',
	6: '-',
	7: '-',
};

const Login = ({ onComplete }) => {
	const [pointer, setPointer] = useState(0);
	const [password, setPassword] = useState(empty);

	useEffect(() => {
		const handleKeyboard = (event) => {
			const parsed = parseInt(event.key);
			if (!isNaN(parsed)) {
				const updated = { ...password };
				updated[pointer] = parsed.toString();

				if (pointer === 7) {
					loginWPswd(
						Object.entries(updated)
							.map(([key, val]) => val)
							.join(''),
						onComplete,
					);

					setPassword(empty);
					setPointer(0);
				} else {
					setPassword(updated);
					setPointer(pointer + 1);
				}
			}
		};

		window.addEventListener('keydown', handleKeyboard);

		return () => window.removeEventListener('keydown', handleKeyboard);
	});

	return (
		<div className='loginContainer'>
			<div className='loginLogoContainer'>
				<img className='loginLogo' src={logo} alt='logo' />
			</div>
			<div className='loginPswdCellContainer'>
				{Object.entries(password).map(([index, cell]) => {
					return (
						<div className='loginPswdCell' key={index}>
							{cell !== '-' ? <p className='loginPswdStar'>*</p> : <></>}
							<div className='loginBar' />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Login;
