// Import necessary libraries and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider from react-query
import { AppContextProvider } from './contexts/AppContext.tsx'; // Import AppContextProvider from custom context
import { SearchContextProvider } from './contexts/SearchContext.tsx'; // Import SearchContextProvider from custom context
import App from './App.tsx'; // Import the main App component

// Create a new instance of QueryClient with custom default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
     retry: 0, // Set the retry option for queries to 0 (no retries)
    },
  },
});

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>
          <App/>
        </SearchContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
export default AppContextProvider; // Export the AppContextProvider component