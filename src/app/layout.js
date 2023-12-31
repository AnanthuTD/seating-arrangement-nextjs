import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

import StyledComponentsRegistry from "@/lib/AntdRegistry";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Seating Arrangement",
};

import { AccountProvider } from "@/context/accountContext";

const RootLayout = ({ children }) => {
	return (
		<html lang="en">
			{/* <link rel="manifest" href="/manifest.json" /> */}
			<link rel="apple-touch-icon" href="/next.svg"></link>
			<meta name="theme-color" content="#fff" />
			<body className={[inter.className, "h-screen"].join(" ")}>
				<StyledComponentsRegistry>
					<AccountProvider>
						{children} <Analytics />
					</AccountProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
};

export default RootLayout;
