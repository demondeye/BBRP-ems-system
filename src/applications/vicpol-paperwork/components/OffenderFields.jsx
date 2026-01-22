export default function OffenderFields({ offender, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...offender, [field]: value });
  };

  return (
    <div className="grid gap-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <label>
          <div className="text-xs text-muted mb-1.5 ml-0.5">Name (SURNAME, GIVEN)</div>
          <input
            className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
            placeholder="Example TOBERT, BOBBY"
            value={offender.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </label>
        <label>
          <div className="text-xs text-muted mb-1.5 ml-0.5">DOB</div>
          <input
            className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
            placeholder="YYYY-MM-DD"
            value={offender.dob || ''}
            onChange={(e) => handleChange('dob', e.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <label>
          <div className="text-xs text-muted mb-1.5 ml-0.5">Sex</div>
          <input
            className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
            placeholder="M/F"
            value={offender.sex || ''}
            onChange={(e) => handleChange('sex', e.target.value)}
          />
        </label>
        <label>
          <div className="text-xs text-muted mb-1.5 ml-0.5">Phone No</div>
          <input
            className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
            placeholder="Example 941101"
            value={offender.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </label>
      </div>

      <label>
        <div className="text-xs text-muted mb-1.5 ml-0.5">Home Address</div>
        <input
          className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
          placeholder="Example VESPUCCI CANALS, LOS SANTOS"
          value={offender.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </label>
    </div>
  );
}
