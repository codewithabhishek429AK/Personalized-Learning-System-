import Logo from "./Logo";

function SiteFooter({ id }) {
  return (
    <footer
      id={id}
      className="border-t border-[#E6E2FA] bg-[#F8F9FF] px-6 py-10 text-center"
    >
      <div className="flex justify-center">
        <Logo size={36} to={null} />
      </div>

      <p className="mt-3 text-[#615F75]">Learn Smarter. Prepare Better.</p>

      <p className="mt-4 text-sm text-[#615F75]/70">
        © 2026 LearnCraft | Personalized Learning System
      </p>
    </footer>
  );
}

export default SiteFooter;
