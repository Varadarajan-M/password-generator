export const passwordSource = {
	uppercase: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
	lowercase: `abcdefghijklmnopqrstuvwxyz`,
	numbers: `1234567890`,
	symbols: `~!@#$%^&*()_+{}[]|\:;"',<.>/?`,
};

const hasCharacterValidator = (str, fn) => str.split('').some(fn);

const hasLowercase = (s) => passwordSource.lowercase.includes(s);

const hasUppercase = (s) => passwordSource.uppercase.includes(s);

const hasNumbers = (s) => passwordSource.numbers.includes(s);

const hasSymbols = (s) => passwordSource.symbols.includes(s);

const uppercaseValidator = (str) => hasCharacterValidator(str, hasUppercase);

const lowercaseValidator = (str) => hasCharacterValidator(str, hasLowercase);

const numbersValidator = (str) => hasCharacterValidator(str, hasNumbers);

const symbolsValidator = (str) => hasCharacterValidator(str, hasSymbols);

export const validators = {
	uppercase: uppercaseValidator,
	lowercase: lowercaseValidator,
	numbers: numbersValidator,
	symbols: symbolsValidator,
};

export const generatePassword = (len, source, validators) => {
	const pw = [...new Array(len)]
		.map((_) => source.charAt(Math.floor(Math.random() * source.length)))
		.join('');
	const ok = validators.every((v) => v(pw));
	if (len >= validators.length && !ok)
		return generatePassword(len, source, validators);
	return pw;
};

export const getPasswordStrength = (passwordLen, passwordControls) => {
	const validPasswordControls =
		Object.values(passwordControls).filter(Boolean).length;
	if (passwordLen < 3) {
		return 'Too Weak!';
	}
	if (passwordLen <= 3 && validPasswordControls < 2) {
		return 'Weak!';
	} else if (passwordLen <= 5 && validPasswordControls > 2) {
		return 'Too Weak!';
	} else if (passwordLen > 11 && validPasswordControls >= 3) {
		return 'Strong!';
	} else if (passwordLen > 7 && validPasswordControls >= 2) {
		return 'Medium!';
	} else {
		return 'Weak!';
	}
};

export const styles = {
	tooweak: {
		backgroundColor: '#f64a4a',
	},
	weak: {
		backgroundColor: '#fb7c58',
	},
	medium: {
		backgroundColor: '#f8cd65',
	},
	strong: {
		backgroundColor: '#e6e5ea',
	},
};

export const passwordControlOptions = [
	{
		name: 'uppercase',
		text: 'Include Uppercase Letters',
	},
	{
		name: 'lowercase',
		text: 'Include Lowercase Letters',
	},
	{
		name: 'numbers',
		text: 'Include Numbers',
	},
	{
		name: 'symbols',
		text: 'Include Symbols',
	},
];

export const indicatorStyles = [
	{
		validator: () => true,
	},
	{
		validator: (strength) => strength !== 'tooweak',
	},
	{
		validator: (strength) => strength === 'medium' || strength === 'strong',
	},
	{
		validator: (strength) => strength === 'strong',
	},
];
