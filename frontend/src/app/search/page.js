'use client';
import { useState } from 'react';

export default function SearchDashboardPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch search results.');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fraud Lens BD - Universal Search & Registry</h1>
      <p>Search reported phone numbers, wallet numbers, domains, or scam categories.</p>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ margin: '1.5rem 0', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter phone (+880...), wallet, or domain..."
          style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Search
        </button>
      </form>

      {/* Loading & Error States */}
      {loading && <p>Searching registry...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Results Display */}
      {data && (
        <div style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Results for "{data.query}" ({data.count || 0} found)</h3>
          {Array.isArray(data.results) ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {data.results.map((item) => (
                <li key={item.id} style={{ background: '#fff', margin: '0.5rem 0', padding: '1rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <strong>{item.identifier}</strong> — <em>{item.category}</em>
                  <br />
                  <span style={{ color: item.status === 'Verified Fraud' ? 'red' : 'orange' }}>
                    Status: {item.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{data.results}</p>
          )}
        </div>
      )}
    </main>
  );
}