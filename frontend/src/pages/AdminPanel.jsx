import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const statusOptions = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setError('Unable to load orders from backend');
      }
    } catch (err) {
      setError(err.message || 'Error fetching orders list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setNotification('');
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        setNotification(`Order #${orderId.slice(-6)} updated to '${newStatus}'`);
        setTimeout(() => setNotification(''), 4000);
      } else {
        setError(res.message || 'Failed to update order status');
      }
    } catch (err) {
      setError(err.message || 'Status update error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'all') return true;
    return ord.status === statusFilter;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
            ⚙️ Admin Order Management Panel
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Lazy-loaded with <code>React.lazy()</code> & <code>Suspense</code> • Populated Mongoose Customer & Restaurant Relations
          </p>
        </div>
        <button onClick={fetchOrders} className="btn btn-secondary btn-sm">
          🔄 Refresh Orders
        </button>
      </div>

      {notification && (
        <div className="error-container" style={{ background: '#d1fae5', borderColor: '#a7f3d0', color: '#065f46' }}>
          <div>✅ {notification}</div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchOrders} />}

      {/* Metrics Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</p>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>{orders.length}</h3>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Orders</p>
          <h3 style={{ fontSize: '1.75rem', color: '#d97706' }}>{pendingCount}</h3>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Delivered Orders</p>
          <h3 style={{ fontSize: '1.75rem', color: '#059669' }}>{deliveredCount}</h3>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Value</p>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>₹{totalRevenue}</h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Filter by Status:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loading message="Loading populated orders from database..." />
      ) : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No orders found for this status filter.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer (Populated)</th>
                <th>Restaurant (Populated)</th>
                <th>Items Ordered</th>
                <th>Total (₹)</th>
                <th>Status & Update Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => {
                const customerData = ord.customerId || {};
                const restaurantData = ord.restaurantId || {};

                let itemsSummary = '';
                if (Array.isArray(ord.items)) {
                  itemsSummary = ord.items.map((i) => `${i.name} (x${i.quantity || i.qty || 1})`).join(', ');
                } else if (typeof ord.items === 'object') {
                  itemsSummary = JSON.stringify(ord.items);
                } else {
                  itemsSummary = String(ord.items);
                }

                return (
                  <tr key={ord._id}>
                    <td>
                      <strong>#{ord._id?.slice(-6)}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(ord.createdAt || Date.now()).toLocaleDateString()}{' '}
                        {new Date(ord.createdAt || Date.now()).toLocaleTimeString()}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{customerData.name || 'Guest User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customerData.email || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {customerData.phone || 'N/A'}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{restaurantData.name || 'Partner Kitchen'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {restaurantData.cuisine || 'Cuisine N/A'} • ★{restaurantData.rating || 4.0}
                      </div>
                    </td>

                    <td style={{ maxWidth: '220px' }}>
                      <div style={{ fontSize: '0.85rem' }}>{itemsSummary}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        📍 {ord.deliveryAddress || 'Standard Address'}
                      </div>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>₹{ord.totalAmount}</strong>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span className={`status-badge ${ord.status || 'pending'}`}>
                          {ord.status}
                        </span>

                        <select
                          className="form-control"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                          value={ord.status}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st}>
                              Set: {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
