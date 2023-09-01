const escapeStringRegexp = (string: string) =>
	string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');

export default escapeStringRegexp;