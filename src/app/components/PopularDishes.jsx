import { useState, useEffect } from 'react';

const API_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

export default function PopularDishes({ restaurantId, restaurantName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    setLoading(true);
    fetch(`${API_URL}/api/restaurants/${restaurantId}/popular-dishes?name=${encodeURIComponent(restaurantName || '')}`)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [restaurantId, restaurantName]);

  if (loading) {
    return (
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '13px', color: '#999' }}>Analyzing diner sentiment...</div>
      </div>
    );
  }

  if (!data || !data.dishes || data.dishes.length === 0) {
    return null;
  }

  // Subtitle adapts to data source
  const subtitle =
    data.source === 'reviews'
      ? `From ${data.review_count_analyzed} real reviews`
      : data.source === 'inferred'
      ? 'AI-inferred from cuisine type'
      : '';

  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#2C1A0E' }}>
          What people order
        </h3>
        {subtitle && (
          <span style={{ fontSize: '11px', color: '#999' }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {data.dishes.map((dish, idx) => (
          <div key={idx} style={{
            padding: '6px 12px',
            borderRadius: '16px',
            background: dish.sentiment === 'positive' ? '#FDEEE6' : '#F5F5F5',
            border: `1px solid ${dish.sentiment === 'positive' ? '#E84B2B' : '#DDD'}`,
            fontSize: '13px',
            color: dish.sentiment === 'positive' ? '#C13A1F' : '#555',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontWeight: 500 }}>{dish.name}</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>{dish.mentions}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}
