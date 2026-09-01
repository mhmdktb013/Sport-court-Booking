import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { VenueProvider } from './context/VenueContext';
import './styles/main.css';
import './styles/booking-grid.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VenueProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </VenueProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
