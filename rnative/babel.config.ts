module.exports = function (api: any) {
	api.cache(true);
	return {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"@babel/preset-typescript",
		],
		plugins: [
			"nativewind/babel",
			"expo-router/babel",
			"react-native-reanimated/plugin",
		],
	};
};
