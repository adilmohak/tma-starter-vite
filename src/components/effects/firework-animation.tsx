"use client";

import { useShowFirework } from "@/store/ui-store";
import FireworksOverlay from "@/components/fireworks-overlay";
import SunflowerOverlay from "@/components/sunflower-overlay";
import SadEmojisOverlay from "@/components/sad-emojis-overlay";

const FireworkAnimation = () => {
  const { showFireworks, setShowFireworks, currentFireworkOverlayType } =
    useShowFirework();

  if (!showFireworks) return null;

  return (
    <>
      {currentFireworkOverlayType === "confetti" ? (
        <FireworksOverlay
          onStop={() => setShowFireworks(false)}
          withStars={true}
        />
      ) : currentFireworkOverlayType === "sad_emojis" ? (
        <SadEmojisOverlay onStop={() => setShowFireworks(false)} />
      ) : (
        <SunflowerOverlay onStop={() => setShowFireworks(false)} />
      )}
    </>
  );
};

export default FireworkAnimation;

