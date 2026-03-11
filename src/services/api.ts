const api = {
  async request(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    data: any = null,
    queryParams: any = null,
    headers: any = {}
  ) {
    let url = `${import.meta.env.VITE_API_ENDPOINT}/${endpoint}`;

    if (method === "GET" && queryParams) {
      const queryString = new URLSearchParams(queryParams).toString();
      url += `?${queryString}`;
    }

    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Source": "miniapp",
        ...headers,
      },
    };

    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("access_token");
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (method !== "GET" && data) {
      options.body = JSON.stringify(data);
    }

    if (data instanceof FormData) {
      options.body = data;
      const headersCopy = { ...options.headers };
      delete headersCopy["Content-Type"];
      options.headers = headersCopy;
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error() as ApiError;
        error.status = response.status;
        error.data = responseData;
        error.message =
          responseData.message ||
          `API request failed with status: ${response.status}`;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

export default api;
