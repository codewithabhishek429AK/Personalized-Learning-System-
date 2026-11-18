import { Link } from "react-router-dom";

// The brand image is a wide 3:2 artwork on a dark background.
// The emblem is cropped from the centre so it stays readable at small sizes.
// Source: public/Images/LearnCraft-Logo.png (exact filename / capitalisation).
export const LOGO_SRC = "/Images/LearnCraft-Logo.png";

function Logo({ size = 44, showText = true, to = "/", className = "" }) {
  const emblem = (
    <span
      className="relative block shrink-0 overflow-hidden rounded-xl bg-black"
      style={{ width: size, height: size }}
    >
      <img
        src={LOGO_SRC}
        alt={showText ? "" : "LearnCraft"}
        className="absolute max-w-none"
        style={{ width: "219%", left: "-63%", top: "-7%" }}
        draggable="false"
      />
    </span>
  );

  const content = (
    <>
      {emblem}
      {showText && (
        <span className="text-2xl font-extrabold tracking-tight text-[#6C55F5]">
          LearnCraft
        </span>
      )}
    </>
  );

  if (!to) {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-label="LearnCraft home"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      {content}
    </Link>
  );
}

export default Logo;
