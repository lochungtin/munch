export const spltHalf = (arr) => {
	const splt = [...arr];
	return [splt.splice(0, Math.ceil(splt.length / 2)), splt];
};
