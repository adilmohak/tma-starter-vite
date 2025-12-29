type Locale = "en" | "am" | "or" | "ti";

interface ApiError extends Error {
  status?: number;
  data?: any;
}
