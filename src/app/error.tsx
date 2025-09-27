"use client";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import LottieHandler from "@/lib/LottieHandler";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="element-center flex-col min-h-[calc(100vh-64px)] px-4 pb-14">
      <div className="w-full max-w-xs">
        <LottieHandler type="error" message={error.message} />

        <div className="flex items-center justify-around mt-7">
          <Button
            onClick={reset}
            className="text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-full "
          >
            Try Again
          </Button>

          <BackButton
            title="Go Back"
            variant="default"
            className="rounded-full w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
