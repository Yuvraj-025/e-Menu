import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings', error);
      // Fallback defaults
      setSettings({
        cafeName: 'Coffee Shop',
        address: '1912 Harvest Lane\nNew York, NY 12210',
        phone: '+1 (555) 123-4567',
        email: 'contact@coffeeshop.com',
        heroImage: 'assets/hero-bg.webp',
        aboutText: 'Artisanal Coffee & Fresh Bites',
        heroSubtitle: 'Crafted with passion',
        socialFacebook: '#',
        socialTwitter: '#',
        socialInstagram: '#'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    const { data } = await api.put('/settings', newSettings);
    setSettings(data);
    return data;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
