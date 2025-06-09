import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const MicroFrontendLoader = ({ url, name, status }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (status === "offline") {
      setError(true);
      setLoading(false);
    }
  }, [url, status]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    // Force iframe reload
    const iframe = document.getElementById(`iframe-${name}`);
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (status === "offline" || error) {
    return (
      <div className="microfrontend-error">
        <h3>Service Unavailable</h3>
        <p>{name} is currently offline or unreachable.</p>
        <p>Please check if the service is running on {url}</p>
        <button className="retry-button" onClick={handleRetry}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="microfrontend-container">
      {loading && <LoadingSpinner />}
      <iframe
        id={`iframe-${name}`}
        src={url}
        className="microfrontend-iframe"
        onLoad={handleLoad}
        onError={handleError}
        title={name}
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};

export default MicroFrontendLoader;
