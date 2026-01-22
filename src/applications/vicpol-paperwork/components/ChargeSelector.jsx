import { useState } from 'react';
import { CHARGES } from '../constants/charges';
import { uniqueCategories } from '../utils/helpers';

export default function ChargeSelector({ selectedCharges, onChargesChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const toggleCharge = (chargeName) => {
    const newSet = new Set(selectedCharges);
    if (newSet.has(chargeName)) {
      newSet.delete(chargeName);
    } else {
      newSet.add(chargeName);
    }
    onChargesChange(Array.from(newSet));
  };

  const clearAll = () => {
    onChargesChange([]);
  };

  const filteredCharges = CHARGES.filter(charge => {
    if (categoryFilter !== 'all' && charge.cat !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        charge.name.toLowerCase().includes(q) ||
        charge.cat.toLowerCase().includes(q) ||
        (charge.notes || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="grid gap-2.5">
      <div className="grid grid-cols-3 gap-2.5">
        <input
          className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
          placeholder="Search charges"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          {uniqueCategories(CHARGES).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          className="bg-white/10 border border-border text-text rounded-xl px-3 py-2.5 cursor-pointer font-black hover:bg-white/14"
          onClick={clearAll}
        >
          Clear selected
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedCharges.length === 0 ? (
          <div className="text-muted text-xs">No charges selected.</div>
        ) : (
          selectedCharges.map(name => (
            <span
              key={name}
              className="inline-flex gap-2 items-center px-2.5 py-2 rounded-full border border-border bg-black/[0.18] text-xs font-black"
            >
              {name}
              <button
                className="text-white/85 font-black hover:text-white"
                onClick={() => toggleCharge(name)}
              >
                Ã—
              </button>
            </span>
          ))
        )}
      </div>

      <div className="max-h-64 overflow-auto grid gap-2 pr-1.5">
        {filteredCharges.length === 0 ? (
          <div className="text-muted text-xs">No matching charges.</div>
        ) : (
          filteredCharges.map(charge => (
            <div
              key={charge.name}
              className="grid grid-cols-[auto_1fr_auto] gap-2.5 items-center px-2.5 py-2.5 bg-black/[0.18] border border-border rounded-xl"
            >
              <input
                type="checkbox"
                checked={selectedCharges.includes(charge.name)}
                onChange={() => toggleCharge(charge.name)}
              />
              <div>
                <div className="font-black text-xs">{charge.name}</div>
                <div className="text-muted text-xs">
                  {charge.cat} | {charge.sentenceType} | {charge.notes}
                </div>
              </div>
              <div className="px-2.5 py-2 rounded-full border border-border bg-black/[0.18] text-xs">
                {charge.sentenceType}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
