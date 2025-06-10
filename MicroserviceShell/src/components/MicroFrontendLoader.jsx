import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const MicroFrontendLoader = ({ url, name, status }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(url);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (status === "offline") {
      setError(true);
      setLoading(false);
    } else {
      // Add auth tokens to URL as fallback
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        const urlWithAuth = new URL(url);
        urlWithAuth.searchParams.set("token", token);
        urlWithAuth.searchParams.set("user", encodeURIComponent(user));
        setIframeUrl(urlWithAuth.toString());
      } else {
        setIframeUrl(url);
      }
    }
  }, [url, status]);
  const handleLoad = () => {
    setLoading(false);
    setError(false);

    // Pass authentication token to the iframe with delay to ensure iframe is ready
    setTimeout(() => {
      const iframe = document.getElementById(`iframe-${name}`);
      if (iframe && iframe.contentWindow) {
        try {
          const token = localStorage.getItem("token");
          const user = localStorage.getItem("user");

          console.log(`Sending auth to ${name}:`, {
            hasToken: !!token,
            hasUser: !!user,
          });

          if (token && user) {
            // Send authentication data to the iframe
            iframe.contentWindow.postMessage(
              {
                type: "AUTH_TOKEN",
                token: token,
                user: JSON.parse(user),
              },
              "*"
            );

            // Also try with specific origin
            iframe.contentWindow.postMessage(
              {
                type: "AUTH_TOKEN",
                token: token,
                user: JSON.parse(user),
              },
              url
            );
          }
        } catch (error) {
          console.warn("Could not pass auth token to iframe:", error);
        }
      }
    }, 500); // Wait 500ms for iframe to be fully loaded
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
      {loading && <LoadingSpinner />}{" "}
      <iframe
        id={`iframe-${name}`}
        src={iframeUrl}
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
