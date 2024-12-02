import React from "react";

function Loader({ progress }) {
  return (
    <div className="loading-container">
      <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      <p>Loading... {Math.round(progress)}%</p>
    </div>
  );
}

export default Loader;
