import React, { useState } from 'react';
import { Grant } from './data';

type SortField = 'name' | 'contactEmail' | 'nextDeadline' | 'eligibilityRequirements' | 'bloomPowerFitNotes' | 'geographicEligibility' | 'typicalAward' | 'applicationStatus';
type SortDirection = 'asc' | 'desc';

const APPLICATION_STATUSES = ['Researching', 'Active', 'Submitted', 'Awarded', 'Declined'];

interface GrantsTableProps {
  grants: Grant[];
  editMode?: boolean;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

const GrantsTable: React.FC<GrantsTableProps> = ({ grants, editMode, onStatusChange, onDelete }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGrants = [...grants].sort((a, b) => {
    const aValue = (a[sortField] ?? '').toLowerCase();
    const bValue = (b[sortField] ?? '').toLowerCase();
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const indicator = (field: SortField): string => {
    if (sortField !== field) return ' ↕';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="grants-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('name')}>
                Grant Name{indicator('name')}
              </th>
              <th className="sortable" onClick={() => handleSort('geographicEligibility')}>
                Geographic Eligibility{indicator('geographicEligibility')}
              </th>
              <th className="sortable" onClick={() => handleSort('typicalAward')}>
                Typical Award{indicator('typicalAward')}
              </th>
              <th className="sortable" onClick={() => handleSort('applicationStatus')}>
                Application Status{indicator('applicationStatus')}
              </th>
              <th className="sortable" onClick={() => handleSort('contactEmail')}>
                Contact Email{indicator('contactEmail')}
              </th>
              <th className="sortable" onClick={() => handleSort('nextDeadline')}>
                Next Deadline{indicator('nextDeadline')}
              </th>
              <th className="sortable" onClick={() => handleSort('eligibilityRequirements')}>
                Eligibility Requirements{indicator('eligibilityRequirements')}
              </th>
              <th className="sortable" onClick={() => handleSort('bloomPowerFitNotes')}>
                Bloom Power Fit Notes{indicator('bloomPowerFitNotes')}
              </th>
              {editMode && onDelete && <th className="col-delete"></th>}
            </tr>
          </thead>
          <tbody>
            {sortedGrants.length === 0 ? (
              <tr>
                <td colSpan={editMode && onDelete ? 9 : 8} className="empty-state">
                  No grants match the selected date range.
                </td>
              </tr>
            ) : (
              sortedGrants.map((grant) => (
                <tr
                  key={grant.id}
                  onClick={() => handleRowClick(grant.url)}
                  className="clickable-row"
                  title={`Click to open: ${grant.url}`}
                >
                  <td className="col-name">{grant.name}</td>
                  <td className="col-geo">{grant.geographicEligibility}</td>
                  <td className="col-award">{grant.typicalAward}</td>
                  <td>
                    {editMode ? (
                      <div className="status-edit-cell">
                        <span className={`status-badge status-${grant.applicationStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                          {grant.applicationStatus}
                        </span>
                        <select
                          className="status-inline-select"
                          value={grant.applicationStatus}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange?.(grant.id, e.target.value);
                          }}
                        >
                          {APPLICATION_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className={`status-badge status-${grant.applicationStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                        {grant.applicationStatus}
                      </span>
                    )}
                  </td>
                  <td className="col-email">
                    {grant.contactEmail !== 'TBD' ? (
                      <a
                        href={`mailto:${grant.contactEmail}`}
                        onClick={(e) => e.stopPropagation()}
                        className="email-link"
                      >
                        {grant.contactEmail}
                      </a>
                    ) : (
                      <span className="tbd">TBD</span>
                    )}
                  </td>
                  <td className="col-deadline">{grant.nextDeadline || '—'}</td>
                  <td className="col-notes">{grant.eligibilityRequirements}</td>
                  <td className="col-fit">{grant.bloomPowerFitNotes}</td>
                  {editMode && onDelete && (
                    <td className="col-delete">
                      <button
                        className="delete-btn"
                        title="Delete this grant"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this grant?')) {
                            onDelete(grant.id);
                          }
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrantsTable;
