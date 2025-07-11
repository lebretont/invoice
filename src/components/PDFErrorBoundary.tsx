import React, { Component, type ReactNode } from 'react';

interface PDFErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface PDFErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class PDFErrorBoundary extends Component<PDFErrorBoundaryProps, PDFErrorBoundaryState> {
  constructor(props: PDFErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): PDFErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PDF rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            color: '#374151'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: '#ef4444'
            }}>
              ⚠️
            </div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Erreur de rendu PDF
            </h3>
            <p style={{
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              Une erreur s'est produite lors de la génération du PDF.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Réessayer
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
