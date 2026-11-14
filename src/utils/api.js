
const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  // Get JWT token from localStorage
  const token = localStorage.getItem("learncraft-token");

  // Prepare request headers
  const headers = {
    "Content-Type": "application/json",

    // Attach JWT token if available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),

    // Allow custom headers to override defaults
    ...options.headers,
  };

  // Send API request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Read API response
  const data = await response.json();

  // Handle API errors
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
