"use client"

interface ErrorMessageProps {
  message?: string;
  error?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, error, onRetry }: ErrorMessageProps) {
  const errorText = message || error;
  
  return (
    <div className="text-center">
      <p className="text-red-500 mb-4">{errorText}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      )}
    </div>
  );
}