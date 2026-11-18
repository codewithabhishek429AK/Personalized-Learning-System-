const KEY = "learncraft-last-topic";

// Remember the topic the student opened last so the tree can highlight it.
export function setLastOpened(code, topicId) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ code, topicId }));
  } catch {
    // Storage unavailable
  }
}

export function getLastOpened() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));

    return value && value.code && value.topicId ? value : null;
  } catch {
    return null;
  }
}

export function clearLastOpened() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable
  }
}
