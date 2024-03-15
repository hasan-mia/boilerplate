import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/express/api/v1";

// request interceptor to add authorization header
axios.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem("access-token");
		config.headers.authorization = `Bearer ${token}`;
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

export { axios as http };
