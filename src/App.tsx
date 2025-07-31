import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import { LazyAdminPanel } from './components/LazyLoadWrapper';
import LoadingSpinner from './components/LoadingSpinner';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomizationProvider } from './context/CustomizationContext';

function App() {
  return (
    <ThemeProvider>
      <CustomizationProvider>
        <DataProvider>
          <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<LoadingSpinner size="lg" text="جاري تحميل لوحة التحكم..." />}>
                      <LazyAdminPanel />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: 'Cairo, system-ui, sans-serif'
                },
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </div>
        </DataProvider>
      </CustomizationProvider>
    </ThemeProvider>
  );
}

export default App;
