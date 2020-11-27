module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2020': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 11
	},
	'globals': {
		'process': 'readonly',
		'describe': 'readonly',
		'it': 'readonly',
		'expect': 'readonly',
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'quotes': [
			'error',
			'single'
		],
		'camelcase': [
			'error'
		],
		'prefer-arrow-callback': [
			'error'
		],
		'arrow-spacing': [
			'error'
		],
		'semi': [
			'error',
			'always'
		],
		'no-unused-vars': [
			'error', { 'args': 'none' }
		],
		'eol-last': [
			'error',
			'always'
		]
	}
};
