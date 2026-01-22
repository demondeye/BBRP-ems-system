import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Window from '../../components/Window';
import Header from '../../components/Header';
import OffenderFields from './components/OffenderFields';
import OCRUpload from './components/OCRUpload';
import ChargeSelector from './components/ChargeSelector';
import DraftManager from './components/DraftManager';
import ReportPreview from './components/ReportPreview';
import Modal from '../../components/Modal';
import { loadDrafts, saveDrafts, saveAutosave } from './utils/helpers';

export default function VicPolApp({ user, onClose, onMinimize, isMinimized }) {
  const [state, setState] = useState({
    reportType: 'arrest',
    enteredBy: user?.fullName || '',
    reportDateTime: '',
    enteredUnit: user ? `${user.unit} | ${user.rank} ${user.fullName}` : '',
    offender: { name: '', dob: '', sex: '', address: '', phone: '' },
    mdtPaste: '',
    selectedCharges: [],
    itemsList: '',
    officersList: '',
    sentence: '',
    evidenceLocker: '',
    pins: '',
    prelim: '',
    summary: '',
    evidence: '',
    evidenceOutstanding: '',
    interviewQs: '',
    sigName: user?.fullName || '',
    sigRank: user ? `${user.rank} | ${user.unit}` : '',
    sigDivision: user?.division || '',
    drafts: loadDrafts()
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeSection, setActiveSection] = useState('reportType');
  
  const [showMDTModal, setShowMDTModal] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);

  useEffect(() => {
    const loadUserDrafts = async () => {
      if (user?.uid) {
        try {
          const draftsDoc = await getDoc(doc(db, 'drafts', user.uid));
          if (draftsDoc.exists()) {
            setState(prev => ({ ...prev, drafts: draftsDoc.data().userDrafts || {} }));
          }
        } catch (error) {
          console.error('Error loading drafts:', error);
        }
      }
    };
    loadUserDrafts();
  }, [user]);

  useEffect(() => {
    saveAutosave(state);
  }, [state]);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleOCRComplete = (parsed) => {
    setState(prev => ({
      ...prev,
      offender: {
        name: parsed.name || prev.offender.name,
        dob: parsed.dob || prev.offender.dob,
        sex: parsed.sex || prev.offender.sex,
        address: parsed.address || prev.offender.address,
        phone: parsed.phone || prev.offender.phone
      }
    }));
    setShowOCRModal(false);
    showToastMessage('MDT data imported');
  };

  const handleSaveDraft = async (name) => {
    const newDraft = { ...state, savedAt: new Date().toISOString() };
    const newDrafts = { ...state.drafts, [name]: newDraft };
    setState(prev => ({ ...prev, drafts: newDrafts }));
    saveDrafts(newDrafts);
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'drafts', user.uid), { userDrafts: newDrafts, updatedAt: new Date() });
        showToastMessage(`Draft "${name}" saved`);
      } catch (error) {
        showToastMessage('Failed to save draft');
      }
    }
  };

  const handleLoadDraft = (name) => {
    const draft = state.drafts[name];
    if (draft) {
      setState({ ...draft, drafts: state.drafts });
      showToastMessage(`Draft "${name}" loaded`);
    }
  };

  const handleDeleteDraft = async (name) => {
    const { [name]: deleted, ...remainingDrafts } = state.drafts;
    setState(prev => ({ ...prev, drafts: remainingDrafts }));
    saveDrafts(remainingDrafts);
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'drafts', user.uid), { userDrafts: remainingDrafts, updatedAt: new Date() });
        showToastMessage(`Draft "${name}" deleted`);
      } catch (error) {
        showToastMessage('Failed to delete');
      }
    }
  };

  const navButtons = [
    { id: 'reportType', label: 'Report Type', icon: '📝' },
    { id: 'offender', label: 'Offender Details', icon: '👤' },
    { id: 'charges', label: 'Charges', icon: '⚖️' },
    { id: 'items', label: 'Items', icon: '📦' },
    { id: 'officers', label: 'Officers', icon: '👮' },
    { id: 'sentence', label: 'Sentence', icon: '⚖️' },
    { id: 'evidence', label: 'Evidence Locker', icon: '🗄️' },
    { id: 'pins', label: 'PINs', icon: '🔢' },
    { id: 'preliminary', label: 'Preliminary', icon: '📋' },
    { id: 'summary', label: 'Summary', icon: '📄' },
    { id: 'evidenceDetails', label: 'Evidence', icon: '🔍' },
    { id: 'outstanding', label: 'Outstanding', icon: '⏳' },
    { id: 'interview', label: 'Interview', icon: '❓' },
    { id: 'signature', label: 'Signature', icon: '✍️' },
    { id: 'drafts', label: 'Drafts', icon: '💾' },
  ];

  // Generate preview text for Header
  const generatePreviewText = (state) => {
    const { reportType, enteredBy, reportDateTime, enteredUnit, offender, selectedCharges, 
            itemsList, officersList, sentence, evidenceLocker, pins, prelim, summary, 
            evidence, evidenceOutstanding, interviewQs, sigName, sigRank, sigDivision } = state;

    let text = `--- ${reportType.toUpperCase()} REPORT ---\n\n`;
    text += `Entered By: ${enteredBy}\n`;
    text += `Date/Time: ${reportDateTime}\n`;
    text += `Unit: ${enteredUnit}\n\n`;
    
    text += `--- OFFENDER INFORMATION ---\n`;
    text += `Name: ${offender.name}\n`;
    text += `DOB: ${offender.dob}\n`;
    text += `Sex: ${offender.sex}\n`;
    text += `Address: ${offender.address}\n`;
    text += `Phone: ${offender.phone}\n\n`;
    
    if (selectedCharges.length > 0) {
      text += `--- CHARGES ---\n`;
      selectedCharges.forEach((charge, i) => {
        text += `${i + 1}. ${charge}\n`;
      });
      text += '\n';
    }
    
    if (itemsList) text += `--- ITEMS ---\n${itemsList}\n\n`;
    if (officersList) text += `--- OFFICERS ---\n${officersList}\n\n`;
    if (sentence) text += `--- SENTENCE ---\n${sentence}\n\n`;
    if (evidenceLocker) text += `--- EVIDENCE LOCKER ---\n${evidenceLocker}\n\n`;
    if (pins) text += `--- PINS ---\n${pins}\n\n`;
    if (prelim) text += `--- PRELIMINARY DETAILS ---\n${prelim}\n\n`;
    if (summary) text += `--- SUMMARY OF FACTS ---\n${summary}\n\n`;
    if (evidence) text += `--- EVIDENCE ---\n${evidence}\n\n`;
    if (evidenceOutstanding) text += `--- OUTSTANDING EVIDENCE ---\n${evidenceOutstanding}\n\n`;
    if (interviewQs) text += `--- INTERVIEW QUESTIONS ---\n${interviewQs}\n\n`;
    
    text += `--- SIGNATURE ---\n`;
    text += `Name: ${sigName}\n`;
    text += `Rank: ${sigRank}\n`;
    text += `Division: ${sigDivision}\n`;
    
    return text;
  };

  const renderMiddleSection = () => {
    switch (activeSection) {
      case 'reportType':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Report Type</h2>
            <div className="grid grid-cols-2 gap-4">
              <label>
                <div className="text-xs text-muted mb-2">Report Type</div>
                <select className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" value={state.reportType} onChange={(e) => updateState({ reportType: e.target.value })}>
                  <option value="arrest">Arrest Report</option>
                  <option value="criminal_warrant">Criminal Warrant</option>
                  <option value="traffic_warrant">Traffic Warrant</option>
                  <option value="field_contact">Field Contact</option>
                  <option value="search_seizure">Search and Seizure</option>
                </select>
              </label>
              <label>
                <div className="text-xs text-muted mb-2">Entered By</div>
                <input className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" value={state.enteredBy} onChange={(e) => updateState({ enteredBy: e.target.value })} />
              </label>
              <label>
                <div className="text-xs text-muted mb-2">Date and Time</div>
                <input className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" placeholder="DD/MM/YYYY HH:MM AM" value={state.reportDateTime} onChange={(e) => updateState({ reportDateTime: e.target.value })} />
              </label>
              <label>
                <div className="text-xs text-muted mb-2">Unit / Callsign</div>
                <input className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" value={state.enteredUnit} onChange={(e) => updateState({ enteredUnit: e.target.value })} />
              </label>
            </div>
          </div>
        );
      case 'offender':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Offender Details</h2>
              <button onClick={() => setShowMDTModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Import MDT</button>
            </div>
            <OffenderFields offender={state.offender} onChange={(offender) => updateState({ offender })} />
          </div>
        );
      case 'charges':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Charges</h2>
              <button onClick={() => setShowChargesModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Select Charges</button>
            </div>
            {state.selectedCharges.length > 0 ? (
              <div className="space-y-2">
                {state.selectedCharges.map((charge, idx) => (
                  <div key={idx} className="bg-black/25 border border-border rounded-lg px-4 py-3 text-text">{charge}</div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-12">No charges selected</div>
            )}
          </div>
        );
      case 'items':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Items List</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" placeholder="List items..." value={state.itemsList} onChange={(e) => updateState({ itemsList: e.target.value })} />
          </div>
        );
      case 'officers':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Officers List</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" placeholder="List officers..." value={state.officersList} onChange={(e) => updateState({ officersList: e.target.value })} />
          </div>
        );
      case 'sentence':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Sentence / Citation</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.sentence} onChange={(e) => updateState({ sentence: e.target.value })} />
          </div>
        );
      case 'evidence':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Evidence Locker</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.evidenceLocker} onChange={(e) => updateState({ evidenceLocker: e.target.value })} />
          </div>
        );
      case 'pins':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">PINs</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.pins} onChange={(e) => updateState({ pins: e.target.value })} />
          </div>
        );
      case 'preliminary':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Preliminary Details</h2>
            <textarea className="w-full h-96 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.prelim} onChange={(e) => updateState({ prelim: e.target.value })} />
          </div>
        );
      case 'summary':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Summary of Facts</h2>
            <textarea className="w-full h-96 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.summary} onChange={(e) => updateState({ summary: e.target.value })} />
          </div>
        );
      case 'evidenceDetails':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Evidence</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.evidence} onChange={(e) => updateState({ evidence: e.target.value })} />
          </div>
        );
      case 'outstanding':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Outstanding Evidence</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.evidenceOutstanding} onChange={(e) => updateState({ evidenceOutstanding: e.target.value })} />
          </div>
        );
      case 'interview':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Interview Questions</h2>
            <textarea className="w-full h-64 bg-black/25 border border-border text-text rounded-xl px-3 py-3 resize-none" value={state.interviewQs} onChange={(e) => updateState({ interviewQs: e.target.value })} />
          </div>
        );
      case 'signature':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Signature</h2>
            <label>
              <div className="text-xs text-muted mb-2">Name</div>
              <input className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" value={state.sigName} onChange={(e) => updateState({ sigName: e.target.value })} />
            </label>
            <label>
              <div className="text-xs text-muted mb-2">Rank</div>
              <input className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" value={state.sigRank} onChange={(e) => updateState({ sigRank: e.target.value })} />
            </label>
            <label>
              <div className="text-xs text-muted mb-2">Division</div>
              <input className="w-full bg-black/25 border border-border text-text rounded-xl px-3 py-3" value={state.sigDivision} onChange={(e) => updateState({ sigDivision: e.target.value })} />
            </label>
          </div>
        );
      case 'drafts':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Drafts</h2>
            <DraftManager drafts={state.drafts} onSave={handleSaveDraft} onLoad={handleLoadDraft} onDelete={handleDeleteDraft} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Window title="VicPol Paperwork" icon="📋" onClose={onClose} onMinimize={onMinimize} isMinimized={isMinimized} defaultWidth={1400} defaultHeight={900} startMaximized={true}>
        <div className="h-full flex flex-col bg-[#0a0a0a]">
          <Header previewText={generatePreviewText(state)} onToast={showToastMessage} user={user} />
          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/6 bg-gradient-to-b from-card2 to-card border-r border-border overflow-y-auto">
              <div className="p-2 space-y-1">
                {navButtons.map(btn => (
                  <button key={btn.id} onClick={() => setActiveSection(btn.id)} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeSection === btn.id ? 'bg-blue-600 text-white font-semibold' : 'text-white/70 hover:bg-white/10'}`}>
                    <span className="text-xl">{btn.icon}</span>
                    <span className="text-sm">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-b from-card2 to-card overflow-y-auto p-6">
              {renderMiddleSection()}
            </div>
            <div className="w-1/3 bg-gradient-to-b from-card2 to-card border-l border-border overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-bold text-white">Report Preview</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ReportPreview state={state} />
              </div>
            </div>
          </div>
        </div>
      </Window>
      {showMDTModal && (
        <Modal onClose={() => setShowMDTModal(false)} title="Import from MDT">
          <textarea className="w-full h-64 p-3 border rounded-lg font-mono text-sm" value={state.mdtPaste} onChange={(e) => updateState({ mdtPaste: e.target.value })} />
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => { handleOCRComplete({ name: state.mdtPaste }); setShowMDTModal(false); }}>Import</button>
        </Modal>
      )}
      {showOCRModal && (
        <Modal onClose={() => setShowOCRModal(false)} title="Upload Document">
          <OCRUpload onComplete={handleOCRComplete} />
        </Modal>
      )}
      {showChargesModal && (
        <Modal onClose={() => setShowChargesModal(false)} title="Select Charges">
          <ChargeSelector selectedCharges={state.selectedCharges} onChargesChange={(charges) => updateState({ selectedCharges: charges })} />
        </Modal>
      )}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">{toastMessage}</div>
      )}
    </>
  );
}
