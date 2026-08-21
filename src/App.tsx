import React, { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import GrantsTable from './GrantsTable';
import AddGrantModal from './AddGrantModal';
import { Grant } from './data';
import { client } from './amplifyClient';
import './styles.css';

// @ts-ignore
import bloomLogo from '../public/Bloom-Logo-Final-transparent-white-words_box.png';

const AppContent: React.FC = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);

  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch all grants on mount
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await client.models.Grant.list();
        setGrants((result.data ?? []) as unknown as Grant[]);
      } catch (err) {
        setError('Failed to load grants. Please refresh the page.');
        console.error('Error fetching grants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  const filteredGrants = grants.filter((grant) => {
    const iso = grant.nextDeadline?.match(/\d{4}-\d{2}-\d{2}/)?.[0]
              || (grant.nextDeadline === 'August 5, 2026' ? '2026-08-05' : null);
    if (!iso) return true;
    if (fromDate && iso < fromDate) return false;
    if (toDate && iso > toDate) return false;
    return true;
  });

  const handleClear = () => {
    setFromDate('');
    setToDate('');
  };

  const handleAddGrant = async (grantData: Omit<Grant, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await client.models.Grant.create(grantData);
      if (result.data) {
        setGrants((prev) => [...prev, result.data as unknown as Grant]);
        setShowAddModal(false);
      }
    } catch (err) {
      setSubmitError('Failed to save grant. Please try again.');
      console.error('Error creating grant:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    // Optimistic update
    const prev = grants.find((g) => g.id === id);
    setGrants((all) => all.map((g) => g.id === id ? { ...g, applicationStatus: status } : g));
    try {
      await client.models.Grant.update({ id, applicationStatus: status });
    } catch (err) {
      // Revert on failure
      if (prev) {
        setGrants((all) => all.map((g) => g.id === id ? { ...g, applicationStatus: prev.applicationStatus } : g));
      }
      setError('Failed to update status. Please try again.');
      console.error('Error updating grant status:', err);
    }
  };

  const handleDeleteGrant = async (id: string) => {
    try {
      await client.models.Grant.delete({ id });
      setGrants((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError('Failed to delete grant. Please try again.');
      console.error('Error deleting grant:', err);
    }
  };

  return (
    <div className={`app${editMode ? ' edit-mode' : ''}`}>
      <header className="header">
        {editMode ? (
          <button className="done-btn" onClick={() => setEditMode(false)}>
            ✓ Done
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setEditMode(true)} title="Edit mode">
            ✏️
          </button>
        )}
        <div className="header-content">
          <div className="header-logo-wrap">
            <img
              src={bloomLogo}
              alt="Bloom Power logo"
              className="header-logo"
            />
          </div>
          <p className="header-subtitle">Grant Opportunities Directory</p>
        </div>
        <button className="sign-out-btn" onClick={signOut}>
          Sign out
        </button>
      </header>

      <main className="main">
        <div className="page-intro">
          <h2 className="section-title">Available Grants</h2>
          <p className="section-description">
            Click any column header to sort. Click a row to view full grant details.
          </p>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button
              className="error-dismiss"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="filter-bar">
          <span className="filter-label">Filter by due date</span>
          <div className="filter-inputs">
            <div className="filter-field">
              <label htmlFor="from-date">From</label>
              <input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="filter-field">
              <label htmlFor="to-date">To</label>
              <input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            {(fromDate || toDate) && (
              <button className="clear-btn" onClick={handleClear}>
                Clear
              </button>
            )}
          </div>
          {(fromDate || toDate) && (
            <span className="filter-count">
              Showing {filteredGrants.length} of {grants.length} grants
            </span>
          )}
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p className="loading-state">Loading grants…</p>
          ) : (
            <GrantsTable
              grants={filteredGrants}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteGrant}
            />
          )}
        </div>

        {editMode && (
          <button className="add-grant-btn" onClick={() => setShowAddModal(true)}>
            +
          </button>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Bloom Grant Directory · Click any row to learn more</p>
      </footer>

      {showAddModal && (
        <AddGrantModal
          onAdd={handleAddGrant}
          onClose={() => {
            setShowAddModal(false);
            setSubmitError(null);
          }}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Authenticator hideSignUp>
      <AppContent />
    </Authenticator>
  );
};

export default App;
