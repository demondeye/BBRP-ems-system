import { jsPDF } from 'jspdf';

export default function Header({ previewText, onToast, user }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(previewText);
    onToast('Copied');
  };

  const handlePDF = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const lines = pdf.splitTextToSize(previewText, 500);
    pdf.text(lines, 40, 40);
    pdf.save('vicpol-report.pdf');
    onToast('PDF exported');
  };

  return (
    <header className="p-6 pb-4 flex justify-between gap-3 items-center flex-wrap border-b border-border/30">
      <div>
        <div className="font-black tracking-wide">VicPol Paperwork</div>
        <div className="text-muted text-xs mt-1">
          One form for Arrest Reports, Warrants, Traffic, Field Contacts, Search and Seizure.
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        {user && (
          <div className="text-right">
            <div className="text-sm font-black">{user.fullName}</div>
            <div className="text-xs text-muted">{user.rank} | {user.unit}</div>
          </div>
        )}
        
        <div className="h-8 w-px bg-border"></div>
        
        <button
          className="bg-white/10 border border-border text-text rounded-xl px-3 py-2.5 cursor-pointer font-black hover:bg-white/14"
          onClick={handleCopy}
        >
          Copy
        </button>
        <button
          className="bg-white/10 border border-border text-text rounded-xl px-3 py-2.5 cursor-pointer font-black hover:bg-white/14"
          onClick={handlePDF}
        >
          Export PDF
        </button>
      </div>
    </header>
  );
}
