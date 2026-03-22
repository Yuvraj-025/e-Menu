const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  cafeName: { type: String, default: 'Coffee Shop' },
  address: { type: String, default: '1912 Harvest Lane\nNew York, NY 12210' },
  phone: { type: String, default: '+1 (555) 123-4567' },
  email: { type: String, default: 'contact@coffeeshop.com' },
  heroImage: { type: String, default: 'assets/hero-bg.webp' },
  aboutText: { type: String, default: 'Artisanal Coffee & Fresh Bites\nExperience the finest coffee blends and freshly baked pastries in a cozy atmosphere.' },
  heroSubtitle: { type: String, default: 'Crafted with passion, served with love' },
  socialFacebook: { type: String, default: '#' },
  socialTwitter: { type: String, default: '#' },
  socialInstagram: { type: String, default: '#' }
});

module.exports = mongoose.model('Settings', SettingsSchema);
