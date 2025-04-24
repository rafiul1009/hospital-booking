"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          We apologize for the inconvenience. Please try again or return to the home page.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}