import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";

import App from "./app";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, staleTime: Infinity, cacheTime: 0 },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
