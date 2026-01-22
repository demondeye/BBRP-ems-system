import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { parseOCR } from '../utils/helpers';

export default function OCRUpload({ onOCRComplete, onToast }) {
  const [ocrStatus, setOcrStatus] = useState('OCR idle');
  const [ocrText, setOcrText] = useState('');
  const fileInputRef = useRef(null);

  const runOCR = async (blob) => {
    setOcrStatus('OCR running...');
    try {
      const result = await Tesseract.recognize(blob, 'eng');
      const text = result.data.text || '';
      setOcrText(text);
      setOcrStatus('OCR complete');

      const parsed = parseOCR(text);
      onOCRComplete(parsed);
      onToast('OCR fields applied');
    } catch (error) {
      setOcrStatus('OCR failed');
      console.error(error);
    }
  };

  const handlePaste = (e) => {
    const item = [...e.clipboardData.items].find(i => i.type.startsWith('image/'));
    if (item) {
      e.preventDefault();
      runOCR(item.getAsFile());
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      runOCR(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setOcrText('');
    setOcrStatus('OCR idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="grid gap-2.5">
      <div className="flex gap-2 items-start text-muted text-xs">
        <div>How:</div>
        <div>
          Click the box then press <span className="font-black bg-white/[0.08] border border-border px-1.5 py-0.5 rounded-lg text-white/85">Ctrl</span> + <span className="font-black bg-white/[0.08] border border-border px-1.5 py-0.5 rounded-lg text-white/85">V</span>, or drag and drop an image, or pick a file. OCR text will appear below. If it finds NAME, DOB, SEX, HOME ADDR, PHONE NO it will auto-fill fields.
        </div>
      </div>

      <div
        className="bg-black/[0.18] border border-border rounded-2xl p-4"
        onPaste={handlePaste}
        tabIndex={0}
      >
        <div className="font-black text-sm mb-1">Paste or drop image here</div>
        <div className="text-muted text-xs">
          Works best with clear screenshots of MDT profiles, licences, fingerprints, pockets, GSR, serials.
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-xs text-muted"
      />

      <div className="grid grid-cols-[1fr_110px] gap-2.5 items-center">
        <input
          className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none"
          value={ocrStatus}
          readOnly
        />
        <button
          className="bg-white/10 border border-border text-text rounded-xl px-3 py-2.5 cursor-pointer font-black hover:bg-white/14"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      <textarea
        className="w-full bg-black/25 border border-border text-text rounded-xl px-2.5 py-2.5 outline-none resize-y"
        rows="10"
        placeholder="OCR text appears here"
        value={ocrText}
        readOnly
      />
    </div>
  );
}
