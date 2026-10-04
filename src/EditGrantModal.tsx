import React, { useRef, useState } from 'react';
import { Grant } from './data';

interface EditGrantModalProps {
  grant: Grant;
  onSave: (id: string, updated: Partial<Omit<Grant, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

const APPLICATION_STATUSES = ['Researching', 'Active', 'Submitted', 'Awarded', 'Declined'];

const EditGrantModal: React.FC<EditGrantModalProps> = ({ grant, onSave, onClose, isSubmitting, submitError }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const geoRef = useRef<HTMLInputElement>(null);
  const awardRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const eligibilityRef = useRef<HTMLTextAreaElement>(null);
  const fitNotesRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!nameRef.current?.value.trim()) errs.name = 'Grant name is required.';
    if (!urlRef.current?.value.trim()) errs.url = 'Website URL is required.';
    if (!geoRef.current?.value.trim()) errs.geo = 'Geographic eligibility is required.';
    if (!awardRef.current?.value.trim()) errs.award = 'Typical award amount is required.';
    if (!eligibilityRef.current?.value.trim()) errs.eligibility = 'Eligibility requirements are required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave(grant.id, {
      name: nameRef.current!.value.trim(),
      url: urlRef.current!.value.trim(),
      geographicEligibility: geoRef.current!.value.trim(),
      typicalAward: awardRef.current!.value.trim(),
      applicationStatus: statusRef.current!.value,
      contactEmail: emailRef.current!.value.trim() || 'TBD',
      nextDeadline: deadlineRef.current!.value.trim() || 'TBD',
      eligibilityRequirements: eligibilityRef.current!.value.trim(),
      bloomPowerFitNotes: fitNotesRef.current!.value.trim() || '—',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Grant</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-field">
            <label className="modal-label">Grant Name <span className="modal-required">*</span></label>
            <input ref={nameRef} className={`modal-input${errors.name ? ' modal-input-error' : ''}`} type="text" defaultValue={grant.name} />
            {errors.name && <p className="modal-error">{errors.name}</p>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Website URL <span className="modal-required">*</span></label>
            <p className="modal-hint">The grant's application or info page.</p>
            <input ref={urlRef} className={`modal-input${errors.url ? ' modal-input-error' : ''}`} type="text" defaultValue={grant.url} />
            {errors.url && <p className="modal-error">{errors.url}</p>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Geographic Eligibility <span className="modal-required">*</span></label>
            <input ref={geoRef} className={`modal-input${errors.geo ? ' modal-input-error' : ''}`} type="text" defaultValue={grant.geographicEligibility} />
            {errors.geo && <p className="modal-error">{errors.geo}</p>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Typical Award Amount <span className="modal-required">*</span></label>
            <input ref={awardRef} className={`modal-input${errors.award ? ' modal-input-error' : ''}`} type="text" defaultValue={grant.typicalAward} />
            {errors.award && <p className="modal-error">{errors.award}</p>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Application Status</label>
            <select ref={statusRef} className="modal-input" defaultValue={grant.applicationStatus}>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">Contact Email</label>
            <input ref={emailRef} className="modal-input" type="text" defaultValue={grant.contactEmail} />
          </div>

          <div className="modal-field">
            <label className="modal-label">Next Deadline</label>
            <p className="modal-hint">Use YYYY-MM-DD format for date filtering to work.</p>
            <input ref={deadlineRef} className="modal-input" type="text" defaultValue={grant.nextDeadline} />
          </div>

          <div className="modal-field">
            <label className="modal-label">Eligibility Requirements <span className="modal-required">*</span></label>
            <textarea ref={eligibilityRef} className={`modal-input modal-textarea${errors.eligibility ? ' modal-input-error' : ''}`} defaultValue={grant.eligibilityRequirements} rows={3} />
            {errors.eligibility && <p className="modal-error">{errors.eligibility}</p>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Bloom Power Fit Notes</label>
            <p className="modal-hint">Why is this grant a good match for Bloom Power?</p>
            <textarea ref={fitNotesRef} className="modal-input modal-textarea" defaultValue={grant.bloomPowerFitNotes} rows={3} />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
          {submitError && <p className="modal-submit-error" role="alert">{submitError}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditGrantModal;
