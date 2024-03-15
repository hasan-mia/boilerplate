import { http } from "@/config/http";
import { route } from "@/utils/enpoint";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
	return useMutation({
		mutationFn: async (payload) => {
			const response = await http.post(route.LOGIN, payload);
			return response.data;
		},
	});
}
