"use client";

import Image from "next/image";
import React, { useState } from "react";
// import loginImage from "";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthProvider/page";
import { useLogin } from "./useLogin";

const Login = () => {
	const router = useRouter();
	const { setUser } = useAuth();
	const { mutate, isPending } = useLogin();
	const [error, setError] = useState("");

	// console.log('my user', login);

	const handleLogin = async (e: any) => {
		e.preventDefault();

		const email = e.target.email.value;
		const password = e.target.password.value;
		const payload = { email, password };

		mutate(payload as any, {
			onSuccess: (data) => {
				localStorage.setItem("user", JSON.stringify(data?.user));
				localStorage.setItem("access-token", data?.token);
				setUser(data);
				// router.push('/');
				router.refresh();
				if (typeof window !== "undefined") {
					window.location.reload();
				}
			},
			onError: (error: any) => {
				setError(error?.response.data?.message);
			},
		});
	};

	return (
		<div className="flex justify-center mt-10">
			<div style={{ minWidth: "30%" }}>
				<div className="flex rounded-lg min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-lg">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<div className="flex justify-center">
							<Image src={"/login.gif"} width={100} height={100} alt="logo" />
						</div>
						<h2 className="mt-5 text-black text-center text-2xl font-bold leading-9 tracking-tight">
							Sign in to your account
						</h2>
					</div>

					{error && (
						<div
							className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
							role="alert"
						>
							{error}
						</div>
					)}

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form onSubmit={handleLogin} className="space-y-6">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium leading-6 text-black"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-black"
									>
										Password
									</label>
									<div className="text-sm">
										<a
											href="#"
											className="font-semibold text-indigo-600 hover:text-indigo-500"
										>
											Forgot password?
										</a>
									</div>
								</div>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										required
										className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									disabled={isPending}
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									{isPending ? "Authenticating..." : "Sign in"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
