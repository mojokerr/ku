import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  children, 
  fallback = <LoadingSpinner size="lg" /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Lazy load heavy components
export const LazyServicesShowcase = lazy(() => 
  import('./ServicesShowcase').then(module => ({ default: module.default }))
);

export const LazyAdvancedTestimonials = lazy(() => 
  import('./AdvancedTestimonials').then(module => ({ default: module.default }))
);

export const LazyFeatureShowcase = lazy(() => 
  import('./FeatureShowcase').then(module => ({ default: module.default }))
);

export const LazyContactSection = lazy(() => 
  import('./ContactSection').then(module => ({ default: module.default }))
);

export const LazyAnimatedBackground = lazy(() => 
  import('./AnimatedBackground').then(module => ({ default: module.default }))
);

export const LazyAdminPanel = lazy(() => 
  import('./AdminPanel').then(module => ({ default: module.default }))
);

export default LazyLoadWrapper;
