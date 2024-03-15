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

// GET METHOD CONFIGURATION
export function useGet(url: string, key: string) {
	return useQuery({
		queryKey: [key],
		queryFn: async () => {
			const response = await http.get(url);
			return response.data;
		},
	});
}

// CREATE METHOD CONFIGURATION
export function createMutationConfig(queryClient: any, key: string) {
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

// UPDATE METHOD CONFIGURATION FORM DATA
export function updateFormMutationConfig(queryClient: any, key: string) {
	return {
		mutationFn: async ({ url, formData }: MutationParameters) => {
			const response = await http.put(url, formData);
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

// UPDATE METHOD CONFIGURATION JSON DATA
export function updateJosnMutationConfig(queryClient: any, key: any) {
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
