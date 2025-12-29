export const toHumanReadable = (value: any): any => {
  if (typeof value !== "string") {
    return value;
  }

  return value?.replace(/_/g, " ");
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // Optional
    hour12: true, // Use 12-hour format; change to false for 24-hour format
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (seconds < 60) {
    return rtf.format(-seconds, "seconds"); // Negative value to indicate past
  } else if (minutes < 60) {
    return rtf.format(-minutes, "minutes");
  } else if (hours < 24) {
    return rtf.format(-hours, "hours");
  } else {
    return rtf.format(-days, "days");
  }
};

export const compactNotation = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
};

export const cleanUsername = (username: string): string => {
  // Trim whitespace from the start and end
  username = username.trim();

  // Remove any spaces
  username = username.replace(/\s+/g, "");

  // Ensure it starts with '@'
  if (!username.startsWith("@")) {
    username = `@${username}`;
  }

  // Remove invalid characters (you can customize this regex as needed)
  username = username.replace(/[^a-zA-Z0-9@_.]/g, "");

  return username;
};

export const cleanPhoneNumber = (phoneNumber: string): string => {
  // Trim whitespace from the phone number
  let cleanedPhoneNumber = phoneNumber.trim().replace(/\s+/g, "");

  // Check for leading patterns and convert to '2519' or '2517'
  if (cleanedPhoneNumber.startsWith("09")) {
    cleanedPhoneNumber = `2519${cleanedPhoneNumber.slice(2)}`;
  } else if (cleanedPhoneNumber.startsWith("9")) {
    cleanedPhoneNumber = `2519${cleanedPhoneNumber.slice(1)}`;
  } else if (cleanedPhoneNumber.startsWith("07")) {
    cleanedPhoneNumber = `2517${cleanedPhoneNumber.slice(2)}`;
  } else if (cleanedPhoneNumber.startsWith("7")) {
    cleanedPhoneNumber = `2517${cleanedPhoneNumber.slice(1)}`;
  } else if (
    cleanedPhoneNumber.startsWith("2517") ||
    cleanedPhoneNumber.startsWith("2519")
  ) {
    // Already in the correct format
    return cleanedPhoneNumber;
  } else {
    // If it doesn't start with '2519' or '2517', assume it's a valid number and prepend '2519'
    cleanedPhoneNumber = `2519${cleanedPhoneNumber}`;
  }

  // Ensure it starts with '2519' or '2517'
  if (
    !cleanedPhoneNumber.startsWith("2519") &&
    !cleanedPhoneNumber.startsWith("2517")
  ) {
    // If the number doesn't start with either, you could return an error or handle it differently
    throw new Error("Invalid Ethiopian phone number format.");
  }

  return cleanedPhoneNumber;
};
