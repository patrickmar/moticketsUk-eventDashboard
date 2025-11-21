"use client";

import "./globals.css";
import { Providers } from "./providers"; // your combined providers file
import { PersistGate } from "redux-persist/integration/react";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            {children}
            <Toaster />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
