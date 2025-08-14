import lightLogo from "../../assets/logo-light.svg";
import darkLogo from "../../assets/logo-dark.svg";
import moon from "../../assets/Moon_fill.svg";
import sun from "../../assets/Sun_fill.svg";
import useTheme from "../../hooks/useTheme.ts";
import "./Header.css";

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="Header">
      <div className="Header-container">
        <img
          src={theme === "light" ? lightLogo : darkLogo}
          alt="imageupload logo"
          className="logo" />
        <button className="theme-container" onClick={toggleTheme}
                aria-label="Toggle theme">
          <img
            src={theme === "light" ? moon : sun}
            alt="theme icon" className="theme-icon"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;