import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<View>{children}</View>;
		</QueryClientProvider>
	);
};

export default Layout;
