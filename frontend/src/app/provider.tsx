"use client";
import { store } from "@/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
    children: ReactNode;
}

const NextProvider = ({ children }: ProviderProps) => {
    return (
        <Provider store={store}>
            <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
                {children}
            </SessionProvider>
        </Provider>
    );
};

export default NextProvider;
