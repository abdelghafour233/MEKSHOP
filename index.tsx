
import React, { Component, ReactNode } from 'react';
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
// Extending Component with explicit generics ensures this.state and this.props are properly typed
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix for "Property 'state' does not exist": Initialize state in constructor
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Accessing this.state which is now correctly recognized via inheritance from Component
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

    // Accessing this.props which is now correctly recognized via inheritance from Component
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
