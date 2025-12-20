import globals from 'globals';
import { jsdoc } from 'eslint-plugin-jsdoc';

export default [
	jsdoc({
		config: 'flat/recommended',
	}),
	{
		languageOptions: {
			globals: globals.builtin,
		},

		rules: {
			'max-len': [
				'warn',
				{
					code: 125,
					ignoreUrls: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
				},
			],
			'operator-linebreak': 'off',
			'no-console': 'error',
		},
	},
];
