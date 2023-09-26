import "./header.css";

function Header({ page }) {
  return (
    <div className="header-container">
      <div className="img-logo"></div>
      <h2>{page}</h2>
    </div>
  );
}

export default Header;
