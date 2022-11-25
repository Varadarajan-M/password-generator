import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Icon from './components/Icon';
import {
	generatePassword,
	getPasswordStrength,
	indicatorStyles,
	passwordControlOptions,
	passwordSource,
	styles,
	validators,
} from './helper';

function App() {
	const [copied, setCopied] = useState(false);
	const [passwordLength, setPasswordLength] = useState(0);
	const [passwordControls, setPasswordControls] = useState({});
	const [generatedPassword, setGeneratedPassword] = useState('');
	const sliderRef = useRef(null);

	const passwordStrength = useMemo(
		() => getPasswordStrength(passwordLength, passwordControls),
		[passwordLength, passwordControls],
	);

	const passwordStrengthClass = passwordStrength
		.toLowerCase()
		.replace('!', '')
		.replace(' ', '');

	useEffect(() => {
		if (sliderRef.current) {
			var value =
				((passwordLength - sliderRef.current.min) /
					(sliderRef.current.max - sliderRef.current.min)) *
				100;
			sliderRef.current.style.background =
				'linear-gradient(to right, #a4ffaf 0%, #a4ffaf ' +
				value +
				'%, #18171f ' +
				value +
				'%, #18171f 100%)';
		}
	}, [passwordLength]);

	const onCheckboxClick = (e) => {
		const { name, checked } = e.target;
		setPasswordControls((p) => ({ ...p, [name]: checked }));
	};

	const onGeneratePassword = () => {
		if (passwordLength <= 0) return;

		const userPasswordControls = Object.entries(passwordControls)
			.filter((d) => Boolean(d[1]))
			.map((d) => d[0]);
		const source = userPasswordControls.map((d) => passwordSource[d]).join('');
		const validator = userPasswordControls.map((d) => validators[d]);

		setGeneratedPassword(generatePassword(passwordLength, source, validator));
	};

	const copyPassword = () => {
		let timer;

		clearTimeout(timer);
		if (!generatedPassword.trim().length > 0) return;
		navigator.clipboard.writeText(generatedPassword).then(() => {
			setCopied(true);
		});

		timer = setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<div className='App'>
			<Header />

			<main>
				<div className='password-display-wrapper'>
					<input readOnly placeholder='P@ssword' value={generatedPassword} />
					<div className='copy-container'>
						<Icon
							className='copy-icon'
							onClick={copyPassword}
							type={'file_copy'}
						/>
						<span className={`copy-popover ${copied ? 'show' : 'hide'}`}>
							Copied!!
						</span>
					</div>
				</div>

				<div className='password-controls-wrapper'>
					<div className='character-length'>
						<span>Character Length</span>
						<span>{passwordLength}</span>
					</div>
					<div className='slider'>
						<input
							type='range'
							ref={sliderRef}
							min={0}
							max={15}
							value={passwordLength}
							onChange={(e) => setPasswordLength(() => +e.target.value)}
						/>
					</div>

					{passwordControlOptions.map(({ text, name }) => (
						<div
							key={name}
							className={`password-controls ${
								+passwordLength === 0 ? 'disabled' : ''
							}`}
						>
							<input onChange={onCheckboxClick} type='checkbox' name={name} />
							<span>{text}</span>
						</div>
					))}

					<div className='password-strength'>
						<h3>STRENGTH</h3>

						<div className='strength-indicator'>
							<h3>{passwordStrength}</h3>
							{indicatorStyles.map((indicator, idx) => (
								<span
									key={idx}
									className={`indicator-charge`}
									style={
										indicator.validator(passwordStrengthClass)
											? styles[passwordStrengthClass]
											: {}
									}
								/>
							))}
						</div>
					</div>

					<button
						disabled={
							+passwordLength === 0 ||
							Object.values(passwordControls).filter(Boolean).length === 0
						}
						onClick={onGeneratePassword}
						className='generate-btn'
					>
						{' '}
						{'Generate ->'}{' '}
					</button>
				</div>
			</main>
		</div>
	);
}

export default App;
