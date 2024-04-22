import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Set base URL
axios.defaults.baseURL = "http://localhost:5000/express/api/v1";

// Request interceptor
axios.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem("access-token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export { axios as http };
