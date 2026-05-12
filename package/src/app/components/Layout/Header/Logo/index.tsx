import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img
        src="/images/logo/cropped-PHLogo300dpi.webp"
        alt="logo"
        width={151}
        height={56}
        className="lg:w-80 sm:w-48 block dark:hidden"
      />
      <img
        src="/images/logo/cropped-PHLogo300dpi.webp"
        alt="logo"
        width={151}
        height={56}
        className="lg:w-80 sm:w-48 hidden dark:block"
      />
    </Link>
  );
};

export default Logo;
