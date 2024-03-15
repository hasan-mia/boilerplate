export async function fetchWithAuthorization(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	const token = localStorage.getItem("access-token");
	const headers: HeadersInit = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	};

	const baseUrl = "http://localhost:5000/express/api/v1";
	const apiUrl = baseUrl + url;

	return fetch(apiUrl, { ...options, headers });
}
