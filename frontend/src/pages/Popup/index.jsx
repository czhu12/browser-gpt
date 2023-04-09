import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

import Popup from './Popup';
import 'bootstrap/dist/css/bootstrap.css';
import 'animate.css/animate.min.css';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import './index.css';

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const queryClient = new QueryClient();
root.render(
  <QueryClientProvider client={queryClient}>
    <Popup />
  </QueryClientProvider>
);
