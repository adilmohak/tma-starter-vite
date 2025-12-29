// types/telegram-webapp.d.ts
declare global {
  interface Window {
    Telegram?: TelegramWebApp;
  }
}

interface TelegramWebApp {
  WebApp: WebApp;
}

interface WebApp {
  version: string; // Telegram WebApp version
  shareToStory: any;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  isFullscreen: boolean;
  contentSafeAreaInset: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  expand: () => void;
  close: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (
    message: string,
    callback?: (confirmed: boolean) => void
  ) => void;
  requestContact: (callback: (success: boolean, response: any) => void) => void;
  onEvent: (eventType: "safeAreaChanged", callback: () => void) => void;
  offEvent: (eventType: "safeAreaChanged", callback: () => void) => void;
  checkHomeScreenStatus: (
    callback: (status: "missed" | "added" | "unknown" | "unsupported") => void
  ) => void;
  addToHomeScreen: () => void;
  shareMessage: (
    prepared_message_id: string,
    callback: (success: boolean) => void
  ) => void;
  initData: string;
  // ...other methods and properties
}

/*

StoryShareParams
This object describes additional sharing settings for the native story editor.

Field	Type	Description
text	String	Optional. The caption to be added to the media, 0-200 characters for regular users and 0-2048 characters for premium subscribers.
widget_link	StoryWidgetLink	Optional. An object that describes a widget link to be included in the story. Note that only premium subscribers can post stories with links.
StoryWidgetLink
This object describes a widget link to be included in the story.

Field	Type	Description
url	String	The URL to be included in the story.
name	String	Optional. The name to be displayed for the widget link, 0-48 characters.

*/

interface StorySticker {
  // Define sticker properties based on Telegram's API
  type: string;
  // ...other sticker properties
}

interface ShareToStoryResult {
  success: boolean;
  error?: string;
  // ...other result properties if any
}
