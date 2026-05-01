import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl text-center space-y-6 border border-red-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-slate-900">Academic System Error</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl bg-pst-blue py-6 font-bold"
            >
              <RefreshCcw className="mr-2" size={20} />
              Reload Application
            </Button>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              If this persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
