"use client";

export default function DownloadPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden border bg-black px-3 py-2 text-sm text-white hover:opacity-90"
    >
      Download as PDF
    </button>
  );
}
