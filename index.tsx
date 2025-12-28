

import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  // Making children optional to fix inference errors when used in JSX
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Error Boundary Component to catch runtime errors
// Fix: Extending React.Component with explicit generics ensures this.state and this.props are properly typed
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Initialize state in constructor with correct typing from React.Component
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Fix: Accessing this.state which is now correctly recognized via inheritance from React.Component
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#f9fafb',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '10px' }}>عذراً، حدث خطأ غير متوقع.</h1>
          <p style={{ color: '#4b5563', marginBottom: '20px' }}>يرجى تحديث الصفحة أو المحاولة لاحقاً.</p>
          <div style={{ 
            textAlign: 'left', 
            direction: 'ltr', 
            background: '#e5e7eb', 
            padding: '15px', 
            borderRadius: '8px', 
            overflow: 'auto', 
            maxWidth: '100%',
            fontSize: '12px',
            color: '#374151'
          }}>
            <strong>Error Details:</strong>
            {/* Fix: state.error access is now valid via React.Component */}
            <pre style={{ margin: 0 }}>{this.state.error?.toString()}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#1e3a8a',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    // Fix: Accessing this.props which is now correctly recognized via inheritance from React.Component
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Wrapping app in ErrorBoundary; optional children prop definition fixes TS reporting missing children here */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);