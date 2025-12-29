"use client";

import LoadingOverlay from "./loading-overlay";

interface SplashScreenProps {
  isLoaded: boolean;
}

const SplashScreen = ({ isLoaded }: SplashScreenProps) => {
  return <LoadingOverlay loaded={isLoaded} />;
};

export default SplashScreen;
