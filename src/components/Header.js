import React from "react";
import Logo from "../IMG1.png";
import { Link } from "react-router-dom";

function Header(props) {
  const { address, isConnected, connect, session } = props;

  const handleLogout = () => {
    session.signUserOut()
    window.location.reload();
  };

  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
        <Link to="/chart" className="link">
          <div className="headerItem">Chart</div>
        </Link>
      </div>

      <div className="rightH">
        <div className="connectButton" onClick={(isConnected ?()=> handleLogout():()=>connect())}>
          {isConnected
            ? address.slice(0, 4) + "..." + address.slice(38)
            : "Connect Wallet"}
        </div>
      </div>
    </header>
  );
}

export default Header;
