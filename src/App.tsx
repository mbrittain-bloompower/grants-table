import React, { useState } from 'react';
import GrantsTable from './GrantsTable';
import { grants } from './data';
import './styles.css';

// @ts-ignore
import bloomLogo from '../public/Bloom-Logo-Final-transparent-white-words_box.png';

const App: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  // Only filter grants that have a parseable ISO date in nextDeadline
  const filteredGrants = grants.filter((grant) => {
    const iso = grant.nextDeadline.match(/\d{4}-\d{2}-\d{2}/)?.[0]
              || (grant.nextDeadline === 'August 5, 2026' ? '2026-08-05' : null);
    if (!iso) return true; // TBD entries always show
    if (fromDate && iso < fromDate) return false;
    if (toDate && iso > toDate) return false;
    return true;
  });

  const handleClear = () => {
    setFromDate('');
    setToDate('');
  };

  return (
    <div className={`app${editMode ? ' edit-mode' : ''}`}>
      <header className="header">
        <div className="header-content">
          {editMode && (
            <button className="done-btn" onClick={() => setEditMode(false)}>
              ✓ Done
            </button>
          )}
          {!editMode && (
            <button className="edit-btn" onClick={() => setEditMode(true)} title="Edit mode">
              ✏️
            </button>
          )}
          <div className="header-logo-wrap">
            <img
              src={bloomLogo}
              alt="Bloom Power logo"
              className="header-logo"
            />
          </div>
          <p className="header-subtitle">Grant Opportunities Directory</p>
        </div>
      </header>

      <main className="main">
        <div className="page-intro">
          <h2 className="section-title">Available Grants</h2>
          <p className="section-description">
            Click any column header to sort. Click a row to view full grant details.
          </p>
        </div>

        {/* Date Range Filter */}
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

        <GrantsTable grants={filteredGrants} />
      </main>

      <footer className="footer">
        <p>© 2026 Bloom Grant Directory · Click any row to learn more</p>
      </footer>
    </div>
  );
};

export default App;
