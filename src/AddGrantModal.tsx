import React, { useState } from 'react';
import { Grant } from './data';

interface AddGrantModalProps {
  onAdd: (grant: Omit<Grant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

const APPLICATION_STATUSES = [
  'Researching',
  'Active',
  'Submitted',
  'Awarded',
  'Declined',
];

const emptyForm = {
  name: '',
  url: '',
  geographicEligibility: '',
  typicalAward: '',
  applicationStatus: 'Researching',
  contactEmail: '',
  nextDeadline: '',
  eligibilityRequirements: '',
  bloomPowerFitNotes: '',
};

// Defined outside the modal so React doesn't treat it as a new component type on every render
interface FieldProps {
  label: string;
  field: keyof typeof emptyForm;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

const Field: React.FC<FieldProps> = ({ label, field, value, onChange, error, required, placeholder, hint }) => (
  <div className="modal-field">
    <label className="modal-label">
      {label}{required && <span className="modal-required"> *</span>}
    </label>
    {hint && <p className="modal-hint">{hint}</p>}
    <input
      className={`modal-input${error ? ' modal-input-error' : ''}`}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <p className="modal-error">{error}</p>}
  </div>
);

const AddGrantModal: React.FC<AddGrantModalProps> = ({ onAdd, onClose, isSubmitting, submitError }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) errs.name = 'Grant name is required.';
    if (!form.url.trim()) errs.url = 'Website URL is required.';
    if (!form.geographicEligibility.trim()) errs.geographicEligibility = 'Geographic eligibility is required.';
    if (!form.typicalAward.trim()) errs.typicalAward = 'Typical award amount is required.';
    if (!form.eligibilityRequirements.trim()) errs.eligibilityRequirements = 'Eligibility requirements are required.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const newGrant: Omit<Grant, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.name.trim(),
      url: form.url.trim(),
      geographicEligibility: form.geographicEligibility.trim(),
      typicalAward: form.typicalAward.trim(),
      applicationStatus: form.applicationStatus,
      contactEmail: form.contactEmail.trim() || 'TBD',
      nextDeadline: form.nextDeadline.trim() || 'TBD',
      eligibilityRequirements: form.eligibilityRequirements.trim(),
      bloomPowerFitNotes: form.bloomPowerFitNotes.trim() || '—',
    };
    onAdd(newGrant);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Grant</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <Field
            label="Grant Name"
            field="name"
            value={form.name}
            onChange={set('name') as React.ChangeEventHandler<HTMLInputElement>}
            error={errors.name}
            required
            placeholder="e.g. W.K. Kellogg Foundation"
          />
          <Field
            label="Website URL"
            field="url"
            value={form.url}
            onChange={set('url') as React.ChangeEventHandler<HTMLInputElement>}
            error={errors.url}
            required
            placeholder="https://..."
            hint="The grant's application or info page."
          />
          <Field
            label="Geographic Eligibility"
            field="geographicEligibility"
            value={form.geographicEligibility}
            onChange={set('geographicEligibility') as React.ChangeEventHandler<HTMLInputElement>}
            error={errors.geographicEligibility}
            required
            placeholder="e.g. National, Florida, Broward County FL"
          />
          <Field
            label="Typical Award Amount"
            field="typicalAward"
            value={form.typicalAward}
            onChange={set('typicalAward') as React.ChangeEventHandler<HTMLInputElement>}
            error={errors.typicalAward}
            required
            placeholder="e.g. $10k–$50k"
          />

          <div className="modal-field">
            <label className="modal-label">Application Status</label>
            <select
              className="modal-input"
              value={form.applicationStatus}
              onChange={set('applicationStatus')}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <Field
            label="Contact Email"
            field="contactEmail"
            value={form.contactEmail}
            onChange={set('contactEmail') as React.ChangeEventHandler<HTMLInputElement>}
            placeholder="grants@example.org (leave blank if TBD)"
          />
          <Field
            label="Next Deadline"
            field="nextDeadline"
            value={form.nextDeadline}
            onChange={set('nextDeadline') as React.ChangeEventHandler<HTMLInputElement>}
            placeholder="e.g. 2026-11-01 or Rolling / TBD"
            hint="Use YYYY-MM-DD format for date filtering to work."
          />

          <div className="modal-field">
            <label className="modal-label">
              Eligibility Requirements <span className="modal-required">*</span>
            </label>
            <textarea
              className={`modal-input modal-textarea${errors.eligibilityRequirements ? ' modal-input-error' : ''}`}
              value={form.eligibilityRequirements}
              onChange={set('eligibilityRequirements')}
              placeholder="e.g. 501(c)(3); must serve youth ages 12–18; must have 2+ years operating history."
              rows={3}
            />
            {errors.eligibilityRequirements && (
              <p className="modal-error">{errors.eligibilityRequirements}</p>
            )}
          </div>

          <div className="modal-field">
            <label className="modal-label">Bloom Power Fit Notes</label>
            <p className="modal-hint">Why is this grant a good match for Bloom Power?</p>
            <textarea
              className="modal-input modal-textarea"
              value={form.bloomPowerFitNotes}
              onChange={set('bloomPowerFitNotes')}
              placeholder="e.g. Strong fit for youth leadership and financial literacy programming."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : '+ Add Grant'}
            </button>
          </div>
          {submitError && (
            <p className="modal-submit-error" role="alert">{submitError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddGrantModal;
