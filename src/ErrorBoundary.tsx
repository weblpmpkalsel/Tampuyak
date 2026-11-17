import React, { Component, ErrorInfo, ReactNode } from "react";
interface Props {  children?: ReactNode;}
interface State {  hasError: boolean;  error: Error | null;}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 m-8 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Sistem Mengalami Kendala (Crash)</h1>
          <p className="text-red-700 mb-4">
            Aplikasi mengalami kesalahan yang tidak terduga. Silakan muat ulang halaman.
          </p>
          <div className="bg-white p-4 border border-red-100 rounded overflow-x-auto">
             <pre className="text-sm text-red-600 font-mono">
               {this.state.error?.toString()}
             </pre>
          </div>
          <button
             onClick={() => window.location.reload()}
             className="mt-6 px-4 py-2 bg-red-600 text-white font-medium rounded shadow hover:bg-red-700"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}
