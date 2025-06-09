import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            margin: "2rem",
            border: "2px solid #ff6b6b",
            borderRadius: "8px",
            backgroundColor: "#ffe0e0",
          }}
        >
          <h2 style={{ color: "#d63031", marginBottom: "1rem" }}>
            Something went wrong
          </h2>
          <details style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}>
            <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
              Error Details
            </summary>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>
              <strong>Error:</strong>{" "}
              {this.state.error && this.state.error.toString()}
            </div>
            <div
              style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}
            >
              <strong>Stack Trace:</strong>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </div>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0984e3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
