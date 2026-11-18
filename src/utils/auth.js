const TOKEN_KEY = "learncraft-token";
const PROGRESS_KEY = "learncraft-progress";
const LAST_TOPIC_KEY = "learncraft-last-topic";

// Token lives in localStorage when "Remember me" is checked,
// otherwise in sessionStorage (cleared when the browser tab closes).
export function getToken() {
  try {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY)
    );
  } catch {
    return null;
  }
}

export function setToken(token, remember = true) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);

    // Progress cache belongs to the previous user; never reuse it.
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(LAST_TOPIC_KEY);

    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode etc.)
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(LAST_TOPIC_KEY);
  } catch {
    // Storage unavailable
  }
}
