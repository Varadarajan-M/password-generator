import React from 'react';

const Icon = ({ className, onClick, type }) => {
	const classes = `${className} material-symbols-outlined`;
	return (
		<span className={classes} onClick={onClick}>
			{type}
		</span>
	);
};

export default Icon;
