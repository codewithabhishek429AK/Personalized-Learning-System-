import { getToken } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  // Get JWT token (localStorage or sessionStorage)
  const token = getToken();

  // Prepare request headers
  const headers = {
    "Content-Type": "application/json",

    // Attach JWT token if available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),

    // Allow custom headers to override defaults
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    const networkError = new Error(
      "Unable to reach the server. Please check your connection and try again."
    );
    networkError.status = 0;
    throw networkError;
  }

  // Read API response (server may return non-JSON on proxy/gateway errors)
  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Handle API errors
  if (!response.ok) {
    const apiError = new Error(data.message || "Something went wrong.");
    apiError.status = response.status;
    throw apiError;
  }

  return data;
}
