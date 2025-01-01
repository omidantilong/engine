export default {
	trailingComma: "es5",
	tabWidth: 2,
	semi: false,
	singleQuote: false,
	printWidth: 100,
	overrides: [
		{
			files: [".*", "*.md", "*.toml", "*.yml"],
			options: {
				useTabs: false,
			},
		},
		{
			files: ["**/*.astro"],
			options: {
				parser: "astro",
			},
		},
	],
};
