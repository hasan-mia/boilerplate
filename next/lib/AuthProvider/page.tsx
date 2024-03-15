import { createContext, useContext, useReducer } from "react";

export const AuthContext = createContext({
	user: null,
	loading: true,
	login: async (payload: any) => {},
	logout: () => {},
	setUser: (user: any) => {},
});

const authReducer = (state: any, action: any) => {
	switch (action.type) {
		case "SET_USER":
			return {
				...state,
				user: action.payload,
				loading: false,
			};
		case "LOGOUT":
			return {
				...state,
				user: null,
				loading: false,
			};
		default:
			return state;
	}
};

const AuthProvider = ({ children }: any) => {
	const initialState = {
		user: null,
		loading: true,
	};

	const [state, dispatch] = useReducer(authReducer, initialState);

	const login = async (response: any): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				localStorage.setItem("access-token", response.token);
				resolve({
					isAuthenticated: true,
					user: response.user,
					message: "Login Successful",
				});
			} catch (error) {
				resolve({
					isAuthenticated: false,
					message: "Login Failed",
				});
			}
		});
	};

	const logout = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			localStorage.removeItem("access-token");
			dispatch({ type: "LOGOUT" });
			resolve();
		});
	};

	const setUser = (user: any) => {
		dispatch({ type: "SET_USER", payload: user });
	};

	const authContextValue = {
		user: state.user,
		loading: state.loading,
		login,
		logout,
		setUser,
	};

	// if (!state.user && state.loading) {
	// 	return (
	// 		<div className="flex justify-center items-center h-screen">
	// 			<div className="flex justify-center flex-col items-center text-xl font-bold">
	// 				Loading....
	// 			</div>
	// 		</div>
	// 	);
	// }

	// if (!state.user) {
	// 	return <Login />;
	// }

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const authContext = useContext(AuthContext);
	if (!authContext) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return authContext;
};

export { AuthProvider, useAuth };
