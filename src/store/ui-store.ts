import { create } from "zustand";
import { useCallback } from "react";

type DrawerController = {
  onClose: () => void;
  id: string;
};

export type FireworkOverlayType = "confetti" | "sunflower" | "sad_emojis";

type GeneralStateProps = {
  showFireworks: boolean;
  setShowFireworks: (input: boolean, overlayType?: FireworkOverlayType) => void;
  currentFireworkOverlayType: FireworkOverlayType;
  setFireworkOverlayType: (type: FireworkOverlayType) => void;
  showEmbeddedView: boolean;
  setShowEmbeddedView: (input: boolean) => void;
  webViewUrl: string | null;
  setWebViewUrl: (input: string | null) => void;
  currentEmbeddedGame: string | null;
  setCurrentEmbeddedGame: (game: string | null) => void;
  loadingAnimationUrl: string;
  setLoadingAnimationUrl: (input: string) => void;
  // Drawer state management
  openDrawers: DrawerController[];
  registerDrawer: (id: string, onClose: () => void) => void;
  unregisterDrawer: (id: string) => void;
  closeTopDrawer: () => boolean;
  // Modal state for animation pausing
  hasOpenModal: boolean;
  setHasOpenModal: (input: boolean) => void;
};

const useGeneralStore = create<GeneralStateProps>((set, get) => ({
  showFireworks: false,
  setShowFireworks: (input, overlayType) =>
    set(() => ({
      showFireworks: input,
      currentFireworkOverlayType: overlayType || "confetti",
    })),
  currentFireworkOverlayType: "confetti" as FireworkOverlayType,
  setFireworkOverlayType: (type) =>
    set(() => ({ currentFireworkOverlayType: type })),
  showEmbeddedView: false,
  setShowEmbeddedView: (input) => set(() => ({ showEmbeddedView: input })),
  webViewUrl: null,
  setWebViewUrl: (input) => set(() => ({ webViewUrl: input })),
  currentEmbeddedGame: null,
  setCurrentEmbeddedGame: (game) => set(() => ({ currentEmbeddedGame: game })),
  loadingAnimationUrl: "/lottie/trophy.lottie",
  setLoadingAnimationUrl: (input) =>
    set(() => ({ loadingAnimationUrl: input })),
  // Drawer state management
  openDrawers: [],
  registerDrawer: (id, onClose) =>
    set((state) => {
      const newDrawers = [
        ...state.openDrawers.filter((d) => d.id !== id),
        { id, onClose },
      ];
      return {
        openDrawers: newDrawers,
        hasOpenModal: newDrawers.length > 0,
      };
    }),
  unregisterDrawer: (id) =>
    set((state) => {
      const newDrawers = state.openDrawers.filter((d) => d.id !== id);
      return {
        openDrawers: newDrawers,
        hasOpenModal: newDrawers.length > 0,
      };
    }),
  closeTopDrawer: () => {
    const { openDrawers } = get();
    if (openDrawers.length > 0) {
      const topDrawer = openDrawers[openDrawers.length - 1];
      topDrawer.onClose();
      return true;
    }
    return false;
  },
  // Modal state for animation pausing
  hasOpenModal: false,
  setHasOpenModal: (input) => set(() => ({ hasOpenModal: input })),
}));

export const useShowFirework = () =>
  useGeneralStore((state) => ({
    showFireworks: state.showFireworks,
    setShowFireworks: state.setShowFireworks,
    currentFireworkOverlayType: state.currentFireworkOverlayType,
    setFireworkOverlayType: state.setFireworkOverlayType,
  }));

export const useShowEmbeddedView = () => {
  const webViewUrl = useGeneralStore((state) => state.webViewUrl);
  const setWebViewUrl = useGeneralStore((state) => state.setWebViewUrl);
  const currentEmbeddedGame = useGeneralStore(
    (state) => state.currentEmbeddedGame
  );
  const setCurrentEmbeddedGame = useGeneralStore(
    (state) => state.setCurrentEmbeddedGame
  );
  const loadingAnimationUrl = useGeneralStore(
    (state) => state.loadingAnimationUrl
  );
  const setLoadingAnimationUrl = useGeneralStore(
    (state) => state.setLoadingAnimationUrl
  );
  const { setHasOpenModal } = useModalState();

  const enhancedSetWebViewUrl = useCallback(
    (url: string | null) => {
      setWebViewUrl(url);
      setHasOpenModal(!!url);
      if (!url) {
        setCurrentEmbeddedGame(null);
      }
    },
    [setWebViewUrl, setHasOpenModal, setCurrentEmbeddedGame]
  );

  return useGeneralStore((state) => ({
    webViewUrl,
    setWebViewUrl: enhancedSetWebViewUrl,
    currentEmbeddedGame,
    setCurrentEmbeddedGame,
    loadingAnimationUrl,
    setLoadingAnimationUrl,
    showEmbeddedView: state.showEmbeddedView,
    setShowEmbeddedView: state.setShowEmbeddedView,
  }));
};

export const useDrawerState = () =>
  useGeneralStore((state) => ({
    openDrawers: state.openDrawers,
    registerDrawer: state.registerDrawer,
    unregisterDrawer: state.unregisterDrawer,
    closeTopDrawer: state.closeTopDrawer,
  }));

export const useModalState = () =>
  useGeneralStore((state) => ({
    hasOpenModal: state.hasOpenModal,
    setHasOpenModal: state.setHasOpenModal,
  }));
