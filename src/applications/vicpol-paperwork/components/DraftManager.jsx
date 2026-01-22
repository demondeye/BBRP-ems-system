import { useState } from 'react';

export default function DraftManager({ drafts, onSave, onLoad, onDelete }) {
  const [draftName, setDraftName] = useState('');

  const handleSave = () => {
    if (!draftName.trim()) return;
    onSave(draftName.trim());
    setDraftName('');
  };

  return (
    <div>
      <div className="grid grid-cols-[1fr_110px] gap-2.5">
        <input
          className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
          placeholder="Draft name, example Training report 1"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
        />
        <button
          className="bg-white/10 border border-border text-text rounded-xl px-3 py-2.5 cursor-pointer font-black hover:bg-white/14"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      <div className="grid gap-2.5 mt-2.5">
        {Object.keys(drafts).map(name => (
          <div
            key={name}
            className="grid grid-cols-[1fr_auto] gap-2 items-center px-2.5 py-2.5 bg-black/[0.18] border border-border rounded-xl"
          >
            <button
              className="text-left text-text font-black hover:underline"
              onClick={() => onLoad(name)}
            >
              {name}
            </button>
            <button
              className="text-text hover:text-warn"
              onClick={() => onDelete(name)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
