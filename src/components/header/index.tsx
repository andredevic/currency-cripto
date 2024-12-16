import { Link } from "react-router";
import Styles from "./header.module.css"

const Header = () => {
  return (
    <header className="flex items-center justify-center h-[120px] max-w-[1080px]">
      {/*LOGO*/}
      <Link to="/">
      <h1 className={Styles.logoname}>
          Currency
          <span className={Styles.spanlogo}> crypto </span>
        </h1>
      </Link>
    </header>
  );
};

export default Header;
