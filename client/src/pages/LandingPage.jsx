import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import '../styles/landing.css';

const LandingPage = () => {
  const { settings } = useSettings();
  
  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/') ? path : `/${path}`;
  };

  const heroStyle = settings?.heroImage ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("${getImageUrl(settings.heroImage)}")`
  } : {};

  return (
    <div className="landing-page">
      <header className="hero-section" style={heroStyle}>
        <div className="hero-text">
          <h1>{settings?.aboutText?.split('\n')[0] || 'Artisanal Coffee & Fresh Bites'}</h1>
          <p>{settings?.heroSubtitle || 'Your daily dose of perfection, brewed with passion.'}</p>
          <Link to="/menu" className="btn btn-primary hero-cta">
            View Our Menu
          </Link>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
