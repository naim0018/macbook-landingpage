import CommonWrapper from "@/common/CommonWrapper";

const legalLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];

const Footer = () => {
  return (
    <footer className="w-full bg-black py-8 md:py-10 text-xs sm:text-sm text-[#86868b]">
      <CommonWrapper className="px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
          <p className="text-xs sm:text-sm text-[#86868b]">
            More ways to shop:{" "}
            <a href="#" className="text-[#2997ff] underline hover:no-underline">
              Find an Apple Store
            </a>{" "}
            or{" "}
            <a href="#" className="text-[#2997ff] underline hover:no-underline">
              other retailer
            </a>{" "}
            near you. Or call 000800 040 1966.
          </p>
          <img
            src="/logo.svg"
            alt="Apple logo"
            className="h-5 sm:h-6 w-auto opacity-75 sm:ml-auto"
          />
        </div>

        <div className="w-full border-t border-[#424245] my-4" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          <p className="text-xs sm:text-sm text-[#86868b]">
            Copyright © 2025 Apple Inc. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-[#86868b]">
            {legalLinks.map((link, index) => (
              <li key={link} className="flex items-center gap-3">
                <a href="#" className="hover:text-white transition-colors">
                  {link}
                </a>
                {index < legalLinks.length - 1 && (
                  <span className="text-[#424245] select-none">|</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </CommonWrapper>
    </footer>
  );
};

export default Footer;