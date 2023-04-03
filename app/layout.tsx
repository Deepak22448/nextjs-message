"use client";

import Navbar from "@/components/Navbar";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import RootProvider from "@/components/providers/RootProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="container px-2 sm:mx-auto bg-slate-200">
        <Provider store={store}>
          <RootProvider>
            <Navbar />
            {children}
          </RootProvider>
        </Provider>
      </body>
    </html>
  );
}
