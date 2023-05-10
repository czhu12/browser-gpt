import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";


const Loading = () => {
  return (
    <div className="loading d-flex" style={{justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <ClipLoader
        color="#2980b9"
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
