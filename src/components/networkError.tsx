import type React from "react";

interface NetworkErrorProps {
  errorType: string;
  onRetry: () => void;
}

const NetworkError: React.FC<NetworkErrorProps> = ({ errorType, onRetry }) => {
  let errorMessage = "An error occurred. Please try again.";

  switch (errorType) {
    case "network":
      errorMessage =
        "Unable to connect to the server. Please check your internet connection.";
      break;
    case "timeout":
      errorMessage = "The request timed out. Please try again.";
      break;
    case "server":
      errorMessage =
        "There was a problem with the server. Please try again later.";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4 text-black">Error !!</h1>
      <p className="text-xl mb-8  text-black">{errorMessage}</p>
      <button
        onClick={onRetry}
        className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Try Again
      </button>
    </div>
  );
};

export default NetworkError;
