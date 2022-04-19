import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";

import App from "./app";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, staleTime: Infinity, cacheTime: 0 },
    },
});

const container = document.getElementById('app');

if (!container) {
    throw new Error('Failed to find root elements');
}

const root = createRoot(container)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
