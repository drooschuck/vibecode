import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

interface ErrorBoundaryProps {
  // Fix: Make children optional to prevent TS error when using ErrorBoundary as a wrapper
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly declare state and props to resolve "Property does not exist" errors
  public state: ErrorBoundaryState = { hasError: false, error: null };
  declare props: Readonly<ErrorBoundaryProps>;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center font-sans">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong.</h1>
          <p className="text-slate-600 mb-4">The application encountered an unexpected error.</p>
          <pre className="bg-red-50 text-red-600 p-4 rounded text-left text-sm overflow-auto max-w-2xl mx-auto">
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);