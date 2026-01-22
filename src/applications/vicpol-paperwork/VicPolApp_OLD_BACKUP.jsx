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
import { loadDrafts, saveDrafts, saveAutosave, loadAutosave } from './utils/helpers';

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
  
  // Modal states
  const [showMDTModal, setShowMDTModal] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showOfficersModal, setShowOfficersModal] = useState(false);

  // Load user's drafts from Firestore on mount
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

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      saveAutosave(state);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [state]);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
    showToastMessage('MDT data has been imported successfully');
  };

  const handleSaveDraft = async (name) => {
    const newDraft = {
      ...state,
      savedAt: new Date().toISOString()
    };
    
    const newDrafts = {
      ...state.drafts,
      [name]: newDraft
    };

    setState(prev => ({ ...prev, drafts: newDrafts }));
    saveDrafts(newDrafts);

    // Save to Firestore
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'drafts', user.uid), {
          userDrafts: newDrafts,
          updatedAt: new Date()
        });
        showToastMessage(`Draft "${name}" saved successfully`);
      } catch (error) {
        console.error('Error saving draft:', error);
        showToastMessage('Failed to save draft to cloud');
      }
    } else {
      showToastMessage(`Draft "${name}" saved locally`);
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

    // Delete from Firestore
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'drafts', user.uid), {
          userDrafts: remainingDrafts,
          updatedAt: new Date()
        });
        showToastMessage(`Draft "${name}" deleted`);
      } catch (error) {
        console.error('Error deleting draft:', error);
        showToastMessage('Failed to delete draft from cloud');
      }
    } else {
      showToastMessage(`Draft "${name}" deleted`);
    }
  };

  const generatePreviewText = () => {
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
    
    if (itemsList) {
      text += `--- ITEMS ---\n${itemsList}\n\n`;
    }
    
    if (officersList) {
      text += `--- OFFICERS ---\n${officersList}\n\n`;
    }
    
    if (sentence) {
      text += `--- SENTENCE ---\n${sentence}\n\n`;
    }
    
    if (evidenceLocker) {
      text += `--- EVIDENCE LOCKER ---\n${evidenceLocker}\n\n`;
    }
    
    if (pins) {
      text += `--- PINS ---\n${pins}\n\n`;
    }
    
    if (prelim) {
      text += `--- PRELIMINARY DETAILS ---\n${prelim}\n\n`;
    }
    
    if (summary) {
      text += `--- SUMMARY OF FACTS ---\n${summary}\n\n`;
    }
    
    if (evidence) {
      text += `--- EVIDENCE ---\n${evidence}\n\n`;
    }
    
    if (evidenceOutstanding) {
      text += `--- OUTSTANDING EVIDENCE ---\n${evidenceOutstanding}\n\n`;
    }
    
    if (interviewQs) {
      text += `--- INTERVIEW QUESTIONS ---\n${interviewQs}\n\n`;
    }
    
    text += `--- SIGNATURE ---\n`;
    text += `Name: ${sigName}\n`;
    text += `Rank: ${sigRank}\n`;
    text += `Division: ${sigDivision}\n`;
    
    return text;
  };

  return (
    <>
      <Window
        title="VicPol Paperwork"
        icon="📋"
        onClose={onClose}
        onMinimize={onMinimize}
        isMinimized={isMinimized}
      >
        <div className="flex flex-col h-full bg-white">
          <Header
            previewText={generatePreviewText()}
            onToast={showToastMessage}
            user={user}
          />

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <OffenderFields
                offender={state.offender}
                onChange={(offender) => updateState({ offender })}
                onOpenCharges={() => setShowChargesModal(true)}
                onOpenItems={() => setShowItemsModal(true)}
                onOpenOfficers={() => setShowOfficersModal(true)}
              />
            </div>

            <div className="w-80 border-l border-gray-200 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <DraftManager
                  drafts={state.drafts}
                  onSave={handleSaveDraft}
                  onLoad={handleLoadDraft}
                  onDelete={handleDeleteDraft}
                />
              </div>
              <div className="border-t border-gray-200">
                <ReportPreview state={state} />
              </div>
            </div>
          </div>
        </div>
      </Window>

      {/* Modals */}
      {showMDTModal && (
        <Modal onClose={() => setShowMDTModal(false)} title="Import from MDT">
          <textarea
            className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
            placeholder="Paste MDT content here..."
            value={state.mdtPaste}
            onChange={(e) => updateState({ mdtPaste: e.target.value })}
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => {
              handleOCRComplete(state.mdtPaste);
              setShowMDTModal(false);
            }}
          >
            Import
          </button>
        </Modal>
      )}

      {showOCRModal && (
        <Modal onClose={() => setShowOCRModal(false)} title="Upload Document">
          <OCRUpload onComplete={handleOCRComplete} />
        </Modal>
      )}

      {showChargesModal && (
        <Modal onClose={() => setShowChargesModal(false)} title="Select Charges">
          <ChargeSelector
            selectedCharges={state.selectedCharges}
            onChargesChange={(charges) => updateState({ selectedCharges: charges })}
          />
        </Modal>
      )}

      {showItemsModal && (
        <Modal onClose={() => setShowItemsModal(false)} title="Items List">
          <textarea
            className="w-full h-64 p-3 border rounded-lg"
            placeholder="List items here..."
            value={state.itemsList}
            onChange={(e) => updateState({ itemsList: e.target.value })}
          />
        </Modal>
      )}

      {showOfficersModal && (
        <Modal onClose={() => setShowOfficersModal(false)} title="Officers List">
          <textarea
            className="w-full h-64 p-3 border rounded-lg"
            placeholder="List officers here..."
            value={state.officersList}
            onChange={(e) => updateState({ officersList: e.target.value })}
          />
        </Modal>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </>
  );
}
