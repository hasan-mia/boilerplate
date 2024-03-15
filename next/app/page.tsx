"use client";

import { useAuth } from "@/lib/AuthProvider/page";

export default function Home() {
	const { user, loading, login, logout, setUser } = useAuth();

	console.log(user, loading, login, logout, setUser);
	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-24">
			Home
		</div>
	);
}
