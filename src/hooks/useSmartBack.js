import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Go back in real browser history when the user arrived from inside the app;
// otherwise (deep link / new tab / refresh) go to a sensible parent page.
export default function useSmartBack(fallbackPath = "/") {
  const navigate = useNavigate();

  return useCallback(() => {
    // React Router (BrowserRouter) stores a position index in history.state
    const position = window.history.state?.idx;

    if (typeof position === "number" && position > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  }, [navigate, fallbackPath]);
}
