import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));


const BASE_URL = "https://opportune-x.vercel.app"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({queryKey, type='get'}) => {
        if (type === 'get'){
          return axios.get(`${BASE_URL}${queryKey}`).then(response => response.data);
        }
      }
        
    }
  }
})

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <ChakraProvider>
    <App />
    </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
