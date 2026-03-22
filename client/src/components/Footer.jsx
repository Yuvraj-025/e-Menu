import { useSettings } from '../context/SettingsContext';
import '../styles/footer.css';

const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer id="contact" className="site-footer animate-on-scroll is-visible">
      <div className="footer-content">
        <h2 className="logo">{settings?.cafeName || 'Coffee Shop'}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{settings?.address || 'The address of the cafe in question is placed here'}</p>

        <div className="social-links">
          <a href={settings?.socialInstagram || '#'} className="social-btn" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" className="social-btn" aria-label="Telegram"><i className="fab fa-telegram-plane"></i></a>
          <a href={settings?.socialFacebook || '#'} className="social-btn" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href={settings?.socialTwitter || '#'} className="social-btn" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href={`mailto:${settings?.email || ''}`} className="social-btn" aria-label="Email"><i className="fas fa-envelope"></i></a>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} {settings?.cafeName || 'Coffee Shop'}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
