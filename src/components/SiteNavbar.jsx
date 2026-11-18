import { Link } from "react-router-dom";

import Logo from "./Logo";
import { getToken } from "../utils/auth";

// Shared navbar for Subject and Topic pages.
function SiteNavbar() {
  const isLoggedIn = Boolean(getToken());

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#E6E2FA] bg-[#F8F9FF]/95 px-6 py-3 backdrop-blur-md">
      <Logo size={40} />

      <div className="flex items-center gap-3 text-sm font-semibold">
        <Link
          to="/"
          className="px-3 py-2 text-[#6C55F5] transition hover:text-[#8060F5]"
        >
          Home
        </Link>

        <Link
          to={isLoggedIn ? "/dashboard" : "/login"}
          className="rounded-xl bg-[#8060F5] px-4 py-2 text-white transition hover:bg-[#6C55F5]"
        >
          {isLoggedIn ? "Dashboard" : "Login"}
        </Link>
      </div>
    </nav>
  );
}

export default SiteNavbar;
