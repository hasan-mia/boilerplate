import { useQuery } from "@tanstack/react-query";
import { http } from "./http";

export interface AnyObject {
	[key: string]: any;
}

export type MutationParameters = {
	url: string;
	formData?: FormData;
	id?: string;
	data?: any;
};

//👇🏻 API function call
export const apiCall = async (endpoints: string) => {
	try {
		const response = await fetch(endpoints);
		const data = await response.json();
		return data;
	} catch (err) {
		console.error(err);
	}
};

//👇🏻 API function call
export function apiGet(url: string, key: string) {
	return useQuery({
		queryKey: [key],
		queryFn: async () => {
			const response = await http.get(url);
			return response.data;
		},
	});
}

// CREATE FORM METHOD CONFIGURATION
export function createFormMutationConfig(queryClient: any, key: string) {
	return {
		mutationFn: async ({ url, formData }: MutationParameters) => {
			const response = await http.post(url, formData);
			return response.data;
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({ queryKey: [key] });
			queryClient.setQueryData([key], (oldData: any) => {
				if (!oldData || !oldData[key]) {
					return oldData;
				}
				const newData = [...oldData[key], data.data];
				return { ...oldData, [key]: newData };
			});
		},
	};
}

// CREATE METHOD CONFIGURATION
export function createMutationConfig(queryClient: any, key: string) {
	return {
		mutationFn: async ({ url, data }: MutationParameters) => {
			const response = await http.post(url, data);
			return response.data;
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({ queryKey: [key] });
			queryClient.setQueryData([key], (oldData: any) => {
				if (!oldData || !oldData[key]) {
					return oldData;
				}
				const newData = [...oldData[key], data.data];
				return { ...oldData, [key]: newData };
			});
		},
	};
}

// UPDATE METHOD CONFIGURATION DATA
export function updateMutationConfig(queryClient: any, key: any) {
	return {
		mutationFn: async ({ url, data }: MutationParameters) => {
			const response = await http.put(url, data);
			return response.data;
		},
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({ queryKey: [key] });
			queryClient.setQueryData([key], (oldData: any) => {
				if (!oldData || !oldData[key]) {
					return oldData;
				}
				const filterData = oldData[key].filter(
					(item: any) => item._id !== data.data._id,
				);
				const newData = [...filterData, data.data];
				return { ...oldData, [key]: newData };
			});
		},
	};
}

// DELETE METHOD CONFIGURATION
export function deleteMutationConfig(queryClient: any, key: any) {
	return {
		mutationFn: async (url: string) => {
			const id = url.substring(url.lastIndexOf("/") + 1);
			await http.delete(url);
			return id;
		},
		onSuccess: (id: string) => {
			queryClient.invalidateQueries({ queryKey: [key] });
			queryClient.setQueryData([key], (oldData: any) => {
				if (!oldData || !oldData[key]) {
					return oldData;
				}
				const filterData = oldData[key].filter((item: any) => item._id !== id);

				return { ...oldData, [key]: filterData };
			});
		},
	};
}
