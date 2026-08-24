import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

// Menu presets with fixed prices per restaurant cuisine
const restaurantMenus = {
  'North Indian': [
    { name: 'Paneer Butter Masala', price: 240, description: 'Cottage cheese in rich buttery tomato gravy' },
    { name: 'Dal Makhani Special', price: 200, description: 'Slow cooked black lentils with cream & butter' },
    { name: 'Butter Naan (2 pcs)', price: 80, description: 'Freshly baked tandoori flatbread' },
    { name: 'Chicken Dum Biryani', price: 290, description: 'Fragrant basmati rice layered with spiced chicken' },
    { name: 'Gulab Jamun (2 pcs)', price: 70, description: 'Warm milk dumplings soaked in saffron syrup' },
  ],
  'Italian & Pizza': [
    { name: 'Farmhouse Margherita Pizza', price: 320, description: 'Fresh basil, mozzarella, and san marzano tomato' },
    { name: 'Creamy Alfredo Pasta', price: 260, description: 'Penne tossed in rich parmesan cream sauce' },
    { name: 'Garlic Bread with Cheese', price: 140, description: 'Toasted baguette with garlic herb butter and cheese' },
    { name: 'Tiramisu Classic', price: 190, description: 'Espresso-soaked sponge with mascarpone cream' },
  ],
  'Japanese & Pan-Asian': [
    { name: 'Spicy Hakka Noodles', price: 190, description: 'Wok tossed noodles with crispy vegetables and chilli' },
    { name: 'Veg Dimsums (6 pcs)', price: 220, description: 'Steamed dumplings with spicy dip' },
    { name: 'Teriyaki Rice Bowl', price: 270, description: 'Glazed vegetables and tofu over jasmine rice' },
    { name: 'Spring Rolls (4 pcs)', price: 160, description: 'Crispy rolls filled with shredded Asian veggies' },
  ],
  'Healthy & Continental': [
    { name: 'Greek Avocado Salad', price: 210, description: 'Crisp greens, feta, olives, and citrus vinaigrette' },
    { name: 'Grilled Veg Panini', price: 180, description: 'Artisan sourdough with roasted peppers and pesto' },
    { name: 'Quinoa Power Bowl', price: 250, description: 'Superfood quinoa with grilled zucchini and hummus' },
  ],
  'Mughlai & Biryani': [
    { name: 'Special Chicken Biryani', price: 310, description: 'Authentic Hyderabadi dum biryani with raita' },
    { name: 'Mutton Galouti Kebab', price: 360, description: 'Melt in mouth spiced minced kebabs' },
    { name: 'Mughlai Shahi Paneer', price: 260, description: 'Royal cashew-based aromatic curry' },
    { name: 'Roomali Roti (2 pcs)', price: 60, description: 'Handkerchief-thin delicate flatbread' },
  ],
  'Bakery & Desserts': [
    { name: 'Belgian Chocolate Waffle', price: 220, description: 'Crispy golden waffle drizzled with warm fudge' },
    { name: 'New York Cheesecake', price: 240, description: 'Dense creamy cheesecake with berry compote' },
    { name: 'Fresh Blueberry Muffin', price: 110, description: 'Oven-baked muffin bursting with blueberries' },
    { name: 'Cold Brew Iced Coffee', price: 130, description: 'Smooth 18-hour slow steeped dark roast' },
  ],
  'default': [
    { name: 'Chef Special Main Course', price: 250, description: 'House signature specialty' },
    { name: 'Crispy Veg Burger Meal', price: 180, description: 'Burger with seasoned fries and beverage' },
    { name: 'Loaded French Fries', price: 120, description: 'Golden fries with melted cheese sauce' },
    { name: 'Fresh Fruit Juice', price: 90, description: 'Freshly pressed seasonal juice' },
  ],
};

const OrderPage = () => {
  const { customer } = useAuth();
  const [searchParams] = useSearchParams();

  // Selected Restaurant State (Task 2: useState)
  const [restaurantId, setRestaurantId] = useState(searchParams.get('restaurantId') || '');

  // Cart / Multiple Ordered Dishes State (Task 2: useState for cart items)
  const [orderItems, setOrderItems] = useState([
    { name: 'Paneer Butter Masala', quantity: 1, price: 240 },
  ]);

  // Delivery Address State (Task 2: useState)
  const [deliveryAddress, setDeliveryAddress] = useState(customer?.address || '');

  // Custom Item Input State (if user wants to add an extra custom item)
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState(150);

  // Data & UI State
  const [restaurants, setRestaurants] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch initial restaurants and existing orders
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await api.getRestaurants();
        if (res.success && Array.isArray(res.data)) {
          setRestaurants(res.data);
          if (!restaurantId && res.data.length > 0) {
            const firstOpen = res.data.find((r) => r.isOpen) || res.data[0];
            setRestaurantId(firstOpen._id);
          }
        }

        const ordersRes = await api.getOrders().catch(() => null);
        if (ordersRes && ordersRes.success) {
          setMyOrders(ordersRes.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load ordering data');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Update default address when customer loads
  useEffect(() => {
    if (customer?.address && !deliveryAddress) {
      setDeliveryAddress(customer.address);
    }
  }, [customer]);

  const selectedRestaurant = restaurants.find((r) => r._id === restaurantId);

  // Get fixed menu list for the selected restaurant
  const currentMenu =
    restaurantMenus[selectedRestaurant?.cuisine] || restaurantMenus['default'];

  // Add dish from menu to order items
  const handleAddDishToOrder = (menuItem) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.name === menuItem.name);
      if (existingIndex > -1) {
        // Increment quantity of existing dish
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // Add new dish with fixed menu price
        return [...prev, { name: menuItem.name, quantity: 1, price: menuItem.price }];
      }
    });
  };

  // Add a custom dish with fixed price
  const handleAddCustomDish = (e) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    setOrderItems((prev) => [
      ...prev,
      { name: customItemName.trim(), quantity: 1, price: Number(customItemPrice) || 150 },
    ]);
    setCustomItemName('');
  };

  // Update quantity of a dish in order
  const handleUpdateQuantity = (index, delta) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, idx) => idx !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Remove dish from order
  const handleRemoveDish = (index) => {
    setOrderItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Calculate grand total dynamically from all dishes in order (price * quantity)
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!restaurantId) {
      setError('Please select a restaurant');
      return;
    }

    if (orderItems.length === 0) {
      setError('Your order has no dishes. Please add at least one dish from the menu.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please provide a delivery address');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        restaurantId,
        items: orderItems,
        totalAmount,
        deliveryAddress: deliveryAddress.trim(),
      };

      const res = await api.createOrder(payload);
      if (res.success && res.data) {
        setSuccessMessage(`Order #${res.data._id.slice(-6)} placed successfully for ₹${totalAmount}!`);
        setMyOrders((prev) => [res.data, ...prev]);
        // Reset order items to default first dish
        setOrderItems([{ name: currentMenu[0]?.name || 'Paneer Butter Masala', quantity: 1, price: currentMenu[0]?.price || 240 }]);
      } else {
        setError(res.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading restaurant menus & order catalog..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Place Your Food Order</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Ordering as: <strong>{customer?.name}</strong> ({customer?.email}) • Choose from authentic fixed-price dishes below.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {successMessage && (
        <div
          className="error-container"
          style={{ background: '#d1fae5', borderColor: '#a7f3d0', color: '#065f46' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✅</span>
            <strong>{successMessage}</strong>
          </div>
          <Link to="/admin" className="btn btn-sm btn-secondary" style={{ background: 'white' }}>
            View in Admin Dashboard →
          </Link>
        </div>
      )}

      {/* Restaurant Selector Header */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '1rem' }}>
            🏪 <strong>Select Restaurant:</strong>
          </label>
          <select
            className="form-control"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            style={{ fontSize: '1rem', fontWeight: 600 }}
          >
            {restaurants.map((rest) => (
              <option key={rest._id} value={rest._id}>
                {rest.name} — {rest.cuisine} (★{rest.rating}) {rest.isOpen ? '• [Open Now]' : '• [Closed]'}
              </option>
            ))}
          </select>
          {selectedRestaurant && !selectedRestaurant.isOpen && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              ⚠️ Note: This restaurant is currently marked as closed.
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left Column: Menu to Add Multiple Dishes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>
              🍽️ {selectedRestaurant?.name || 'Restaurant'} Menu
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click to add to your order
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentMenu.map((dish, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {dish.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {dish.description}
                  </p>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    ₹{dish.price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddDishToOrder(dish)}
                  className="btn btn-sm btn-primary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + Add to Order
                </button>
              </div>
            ))}
          </div>

          {/* Optional: Add custom dish */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              + Add Custom Special Request Dish:
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Dish name (e.g. Extra Raita)"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                style={{ flex: 2 }}
              />
              <input
                type="number"
                min="10"
                className="form-control"
                placeholder="Price"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(Math.max(10, Number(e.target.value)))}
                style={{ width: '90px' }}
              />
              <button
                type="button"
                onClick={handleAddCustomDish}
                className="btn btn-sm btn-secondary"
                disabled={!customItemName.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Your Order Summary & Checkout Form */}
        <div>
          <div className="card" style={{ border: '2px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span>🛒</span> Your Order ({orderItems.length} {orderItems.length === 1 ? 'dish' : 'dishes'})
            </h2>

            {orderItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍽️</p>
                <p>No dishes in your order yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Click "+ Add to Order" on any menu item on the left.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ₹{item.price} × {item.quantity} = <strong>₹{item.price * item.quantity}</strong>
                      </div>
                    </div>

                    {/* Quantity Stepper (+ / - / Remove) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(index, -1)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.2rem 0.55rem', fontWeight: 700 }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(index, 1)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.2rem 0.55rem', fontWeight: 700 }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDish(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          marginLeft: '0.4rem',
                          fontSize: '1rem',
                        }}
                        title="Remove dish"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Address */}
            <div className="form-group">
              <label className="form-label">📍 Delivery Address *</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Enter complete delivery address with landmark"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Dynamic Price Calculation Summary (Task 2 Requirement: Display value as state changes) */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                <span>Subtotal ({orderItems.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                <span>₹{totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Delivery Partner Fee:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>FREE</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}
              >
                <span>Grand Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              className="btn btn-primary btn-block btn-lg"
              disabled={submitting || orderItems.length === 0}
            >
              {submitting ? 'Placing Order...' : `Confirm & Place Order (₹${totalAmount})`}
            </button>
          </div>

          {/* Recent Orders List */}
          {myOrders.length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                📦 Recent Order History ({myOrders.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
                {myOrders.slice(0, 5).map((ord) => {
                  let dishesSummary = '';
                  if (Array.isArray(ord.items)) {
                    dishesSummary = ord.items.map((i) => `${i.name} (x${i.quantity || i.qty || 1})`).join(', ');
                  } else {
                    dishesSummary = JSON.stringify(ord.items);
                  }

                  return (
                    <div
                      key={ord._id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong>{ord.restaurantId?.name || 'QuickBite Partner'}</strong>
                        <span className={`status-badge ${ord.status || 'pending'}`}>
                          {ord.status}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        🍲 {dishesSummary}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 600 }}>
                        <span>Total: ₹{ord.totalAmount}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: #{ord._id?.slice(-6)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
