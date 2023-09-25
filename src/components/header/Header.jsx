import "./header.css";

function Header({ page }) {
  return (
    <div className="header-container">
      <div className="img-logo"></div>
      <h1>{page}</h1>
    </div>
  );
}

export default Header;
