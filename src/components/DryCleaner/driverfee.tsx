import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  History,
  RefreshCw,
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Types
interface GlobalPricing {
  _id: string;
  pricePerKm: number;
  effectiveFrom: string;
  setBy: string;
  reason?: string;
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: any;
  message: string;
}

const GlobalPricingManagement = () => {
  // State Management
  const [currentPricing, setCurrentPricing] = useState<GlobalPricing | null>(
    null
  );
  const [pricePerKm, setPricePerKm] = useState<string>('');
  const [effectiveFrom, setEffectiveFrom] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdmin] = useState(true);

  // Fetch current pricing
  const fetchCurrentPricing = async () => {
    try {
      setFetching(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/users/admin/get-global-pricing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pricing');
      }

      setCurrentPricing(data.data);
      setPricePerKm(data.data.pricePerKm.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
      console.error('Fetch pricing error:', err);
    } finally {
      setFetching(false);
    }
  };

  // Set new global pricing
  const handleSetPricing = async () => {
    const price = parseFloat(pricePerKm);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    if (price > 1000) {
      setError('Price per km cannot exceed ₹1000');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');

      const payload: any = {
        pricePerKm: price,
      };

      if (effectiveFrom) {
        payload.effectiveFrom = effectiveFrom;
      }

      if (reason.trim()) {
        payload.reason = reason.trim();
      }

      const response = await fetch(
        `${API_BASE_URL}/users/admin/get-current-price-per-km`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to set pricing');
      }

      setSuccess(`Global pricing successfully set to ₹${price}/km`);
      setCurrentPricing(data.data.pricing);

      setEffectiveFrom('');
      setReason('');

      setTimeout(() => fetchCurrentPricing(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set pricing');
      console.error('Set pricing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchCurrentPricing();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <AlertCircle
            style={{
              width: '4rem',
              height: '4rem',
              color: '#ef4444',
              margin: '0 auto 1rem',
            }}
          />
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            Access Denied
          </h2>
          <p style={{ color: '#6b7280' }}>
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            Global Pricing Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            Set and manage pricing for all drivers in the system
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <AlertCircle
              style={{
                width: '1.25rem',
                height: '1.25rem',
                color: '#dc2626',
                flexShrink: 0,
                marginTop: '0.125rem',
              }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontWeight: 600,
                  color: '#7f1d1d',
                  marginBottom: '0.25rem',
                }}
              >
                Error
              </h3>
              <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: '1.5rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.5rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <CheckCircle
              style={{
                width: '1.25rem',
                height: '1.25rem',
                color: '#16a34a',
                flexShrink: 0,
                marginTop: '0.125rem',
              }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontWeight: 600,
                  color: '#14532d',
                  marginBottom: '0.25rem',
                }}
              >
                Success
              </h3>
              <p style={{ color: '#15803d', fontSize: '0.875rem' }}>
                {success}
              </p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              style={{
                color: '#16a34a',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Current Pricing Card */}
          <div
            style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#111827',
                }}
              >
                Current Pricing
              </h2>
              <button
                onClick={fetchCurrentPricing}
                disabled={fetching}
                style={{
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: fetching ? 'not-allowed' : 'pointer',
                }}
                title="Refresh"
              >
                <RefreshCw
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                  }}
                  className={fetching ? 'spin' : ''}
                />
              </button>
            </div>

            {fetching ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem 0',
                }}
              >
                <RefreshCw
                  style={{ width: '2rem', height: '2rem', color: '#3b82f6' }}
                  className="spin"
                />
              </div>
            ) : currentPricing ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    background:
                      'linear-gradient(to bottom right, #3b82f6, #6366f1)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    color: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        opacity: 0.9,
                      }}
                    >
                      Price per KM
                    </span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
                    ₹{currentPricing.pricePerKm}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
                    <Calendar
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        color: '#9ca3af',
                        marginTop: '0.125rem',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#111827',
                        }}
                      >
                        Effective From
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatDate(currentPricing.effectiveFrom)}
                      </p>
                    </div>
                  </div>

                  {currentPricing.reason && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                    >
                      <TrendingUp
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          color: '#9ca3af',
                          marginTop: '0.125rem',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#111827',
                          }}
                        >
                          Reason
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {currentPricing.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      paddingTop: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        background: '#10b981',
                        borderRadius: '50%',
                      }}
                    ></div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Active for all drivers
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <AlertCircle
                  style={{
                    width: '3rem',
                    height: '3rem',
                    color: '#9ca3af',
                    margin: '0 auto 0.75rem',
                  }}
                />
                <p style={{ color: '#6b7280' }}>No active pricing found</p>
              </div>
            )}
          </div>

          {/* Set New Pricing Form */}
          <div
            style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1.5rem',
              }}
            >
              Set New Pricing
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Price Input */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Price per KM (₹) *
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      paddingLeft: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ color: '#6b7280' }}>₹</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000"
                    value={pricePerKm}
                    onChange={(e) => setPricePerKm(e.target.value)}
                    required
                    style={{
                      display: 'block',
                      width: '100%',
                      paddingLeft: '2rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                    }}
                    placeholder="Enter price"
                  />
                </div>
                <p
                  style={{
                    marginTop: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  Must be between ₹0.01 and ₹1000
                </p>
              </div>

              {/* Effective From */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Effective From (Optional)
                </label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  min={getMinDate()}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                  }}
                />
                <p
                  style={{
                    marginTop: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  Leave empty to apply immediately
                </p>
              </div>

              {/* Reason */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Reason for Change (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                  placeholder="e.g., Fuel price increase, Market adjustment"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSetPricing}
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw
                      style={{ width: '1.25rem', height: '1.25rem' }}
                      className="spin"
                    />
                    Setting Pricing...
                  </>
                ) : (
                  <>
                    <Save style={{ width: '1.25rem', height: '1.25rem' }} />
                    Set Global Pricing
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div
              style={{
                marginTop: '1.5rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <AlertCircle
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#2563eb',
                    flexShrink: 0,
                    marginTop: '0.125rem',
                  }}
                />
                <div style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    Important:
                  </p>
                  <ul
                    style={{
                      listStyleType: 'disc',
                      paddingLeft: '1.25rem',
                      color: '#1d4ed8',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <li>This will apply to all drivers system-wide</li>
                    <li>Previous pricing will be automatically deactivated</li>
                    <li>Changes take effect immediately unless scheduled</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div
          style={{
            marginTop: '1.5rem',
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            padding: '1.5rem',
          }}
        >
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#374151',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <History style={{ width: '1.25rem', height: '1.25rem' }} />
            Pricing History
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              {showHistory ? 'Hide' : 'Show'}
            </span>
          </button>

          {showHistory && (
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  color: '#6b7280',
                  textAlign: 'center',
                  padding: '2rem 0',
                }}
              >
                Pricing history feature coming soon...
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input:focus, textarea:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default GlobalPricingManagement;
