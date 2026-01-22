import { REPORT_TYPE_LABEL } from '../constants/charges';
import { norm, splitToBullets } from '../utils/helpers';

export default function ReportPreview({ state }) {
  const generatePreview = () => {
    const lines = [];
    const add = (s = "") => lines.push(s);

    add(`DATE: ${norm(state.reportDateTime)}`);
    add(`${REPORT_TYPE_LABEL[state.reportType] || "REPORT"}`);
    add(`Entered by: ${norm(state.enteredBy)}`);
    add("");

    add("(1) Offender Details");
    add(`Name: ${norm(state.offender.name)}`);
    add(`DOB: ${norm(state.offender.dob)}`);
    add(`Sex: ${norm(state.offender.sex)}`);
    add(`Home Address: ${norm(state.offender.address)}`);
    if (state.offender.phone) add(`Phone No: ${norm(state.offender.phone)}`);
    add("");

    if (state.selectedCharges.length) {
      add("(2) List of Charges");
      state.selectedCharges.forEach(c => add(c));
      add("");
    }

    if (state.itemsList) {
      add("(3) Confiscated Items");
      add(splitToBullets(state.itemsList));
      add("");
    }

    if (state.officersList) {
      add("(4) Officers Involved");
      add(splitToBullets(state.officersList));
      add("");
    }

    if (state.sentence) {
      add("(5) Sentence");
      add(state.sentence);
      add("");
    }

    if (state.evidenceLocker) {
      add("(6) Evidence Locker Number");
      add(state.evidenceLocker);
      add("");
    }

    add("REPORT");
    if (state.prelim) {
      add("(1) Preliminary Details");
      add(state.prelim);
      add("");
    }

    if (state.summary) {
      add("(2) Summary of Events");
      add(state.summary);
      add("");
    }

    if (state.evidence) {
      add("(3) Evidence");
      add(state.evidence);
      add("");
    }

    if (state.evidenceOutstanding) {
      add("(4) Evidence Outstanding");
      add(state.evidenceOutstanding);
      add("");
    }

    if (state.interviewQs) {
      add("(5) Interview Questions");
      add(state.interviewQs);
      add("");
    }

    add("Signed,");
    add(state.sigName);
    add(state.sigRank);
    add(state.sigDivision);

    return lines.join("\n");
  };

  return (
    <div className="bg-gradient-to-b from-card2 to-card border border-border rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-2.5 mb-2.5">
        <h2 className="text-sm font-bold">Preview</h2>
        <span className="inline-flex items-center gap-2 px-2.5 py-2 rounded-full border border-border bg-black/[0.18] font-black text-xs text-warn">
          Outputs to VicPol style blocks
        </span>
      </div>
      <pre className="m-0 whitespace-pre-wrap break-words bg-black/[0.28] border border-border rounded-2xl p-3 min-h-[740px] font-mono text-xs leading-[1.35]">
        {generatePreview()}
      </pre>
    </div>
  );
}
