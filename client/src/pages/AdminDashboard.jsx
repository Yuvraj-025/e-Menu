import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { settings: globalSettings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState({});

  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (globalSettings) {
      setLocalSettings(globalSettings);
    }
  }, [globalSettings]);

  const fetchMenu = async () => {
    try {
      const { data } = await api.get('/menu');
      setMenuItems(data);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to load menu' });
    } finally {
      setLoadingMenu(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/order');
      setOrders(data);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to load orders' });
    } finally {
      setLoadingOrders(false);
    }
  };

  const toggleOrderStatus = async (id) => {
    try {
      await api.put(`/order/${id}/pay`);
      fetchOrders();
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update order status' });
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    setMenuItems(updatedItems);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleInputChange(index, 'image', data.imagePath);
      setStatus({ type: 'success', message: 'Image uploaded' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Image upload failed' });
    }
  };

  const handleAddItem = () => {
    setMenuItems([{
      isNew: true, name: 'New Item', category: 'Coffee', description: 'Description', price: 0, image: 'assets/default.png'
    }, ...menuItems]);
  };

  const handleDeleteItem = async (id, index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (!menuItems[index].isNew) await api.delete(`/menu/${id}`);
        setMenuItems(menuItems.filter((_, i) => i !== index));
        setStatus({ type: 'success', message: 'Item deleted' });
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to delete item' });
      }
    }
  };

  const handleSaveMenu = async () => {
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      for (const item of menuItems) {
        item.price = Number(item.price);
        if (item.isNew) {
          const { isNew, ...itemData } = item;
          await api.post('/menu', itemData);
        } else {
          await api.put(`/menu/${item._id}`, item);
        }
      }
      setStatus({ type: 'success', message: 'Menu saved successfully!' });
      fetchMenu();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Error saving menu' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(localSettings);
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Error saving settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleSettingsImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLocalSettings({ ...localSettings, heroImage: data.imagePath });
      setStatus({ type: 'success', message: 'Hero image uploaded' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Hero image upload failed' });
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>🍽 Admin Management Dashboard</h2>
        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu</button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Cafe Settings</button>
        </div>
      </div>

      {status.message && (
        <div className={`admin-status ${status.type}`}>
          {status.message}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="tab-pane">
          <div className="tab-actions">
            <button className="btn btn-add" onClick={handleAddItem}>+ Add New Dish</button>
            <button className="btn btn-save" onClick={handleSaveMenu} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Menu'}
            </button>
          </div>
          {loadingMenu ? <div className="loading">Loading menu data...</div> : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price (₹)</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item, index) => (
                    <tr key={item._id || `new-${index}`}>
                      <td><input type="text" value={item.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)} /></td>
                      <td>
                        <select value={item.category} onChange={(e) => handleInputChange(index, 'category', e.target.value)}>
                          <option value="Coffee">Coffee</option>
                          <option value="Breakfast">Breakfast</option>
                          <option value="Restaurant">Restaurant</option>
                        </select>
                      </td>
                      <td><input type="text" value={item.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} /></td>
                      <td><input type="number" value={item.price} step="0.01" onChange={(e) => handleInputChange(index, 'price', e.target.value)} /></td>
                      <td style={{ minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.image && <img src={getImageUrl(item.image)} alt="preview" className="admin-item-img" />}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e.target.files[0])} style={{ fontSize: '0.8rem' }} />
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn-delete" onClick={() => handleDeleteItem(item._id, index)} title="Delete Item"><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="tab-pane">
          <div className="tab-actions">
            <button className="btn btn-primary" onClick={fetchOrders} style={{ width: 'auto', marginBottom: '1rem' }}><i className="fas fa-sync"></i> Refresh Orders</button>
          </div>
          {loadingOrders ? <div className="loading">Loading orders...</div> : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Items Summary</th>
                    <th>Total (₹)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>{order.orderId}</td>
                      <td>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                      <td>{order.total.toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => toggleOrderStatus(order._id)}
                          className={`btn ${order.isPaid ? 'btn-save' : 'btn-delete'}`}
                          style={{ minWidth: '100px', fontSize: '0.9rem', padding: '0.4rem' }}
                        >
                          {order.isPaid ? 'PAID' : 'UNPAID'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="tab-pane">
          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label>Cafe Name</label>
              <input type="text" value={localSettings.cafeName || ''} onChange={e => setLocalSettings({...localSettings, cafeName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <input type="text" value={localSettings.heroSubtitle || ''} onChange={e => setLocalSettings({...localSettings, heroSubtitle: e.target.value})} required />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>Landing Page Hero Image</label>
              {localSettings.heroImage && (
                <img src={getImageUrl(localSettings.heroImage)} alt="Hero Preview" style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => handleSettingsImageUpload(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Address (Can use multiple lines)</label>
              <textarea rows="3" value={localSettings.address || ''} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" value={localSettings.email || ''} onChange={e => setLocalSettings({...localSettings, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input type="text" value={localSettings.phone || ''} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>About Text</label>
              <textarea rows="4" value={localSettings.aboutText || ''} onChange={e => setLocalSettings({...localSettings, aboutText: e.target.value})} />
            </div>
            <div className="form-group-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Instagram URL</label>
                <input type="text" value={localSettings.socialInstagram || ''} onChange={e => setLocalSettings({...localSettings, socialInstagram: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Facebook URL</label>
                <input type="text" value={localSettings.socialFacebook || ''} onChange={e => setLocalSettings({...localSettings, socialFacebook: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Twitter URL</label>
                <input type="text" value={localSettings.socialTwitter || ''} onChange={e => setLocalSettings({...localSettings, socialTwitter: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-save" disabled={saving} style={{ marginTop: '1rem' }}>
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
