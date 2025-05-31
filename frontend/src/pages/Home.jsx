import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-content">
        <h1>Welcome to Excel Analytics Platform</h1>
        <p>Transform your Excel data into powerful visual insights.</p>
        <div className="home-buttons">
          <Link to="/register" className="btn">Get Started</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </div>
    </div>
  );
}
