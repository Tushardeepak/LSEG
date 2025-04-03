import React from "react";
import "./errorBanner.css";

const ErrorBanner = ({ errorMessage, handleRetry }) => {
  return (
    <div className="errorBannerContainer">
      <p>{errorMessage}</p>
      <p className="tryAgainButton" role="button" onClick={handleRetry}>
        Try again
      </p>
    </div>
  );
};

export default ErrorBanner;
