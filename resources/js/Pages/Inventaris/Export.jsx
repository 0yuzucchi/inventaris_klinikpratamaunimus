import jsPDF from "jspdf";

export default function DownloadPDF() {
  const handleDownload = () => {
    const doc = new jsPDF();

    // Judul
    doc.setFontSize(16);
    doc.text("Laporan Inventaris", 20, 20);

    // Garis pemisah
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Isi teks biasa
    doc.setFontSize(12);
    doc.text("Tanggal: 15 September 2025", 20, 35);
    doc.text("Daftar Inventaris:", 20, 45);

    // Data manual (hardcoded dulu)
    const items = [
      { no: 1, nama: "Kursi", jumlah: 10 },
      { no: 2, nama: "Meja", jumlah: 5 },
      { no: 3, nama: "Lemari", jumlah: 2 },
    ];

    let startY = 55;
    items.forEach((item) => {
      doc.text(`${item.no}. ${item.nama} - ${item.jumlah} unit`, 25, startY);
      startY += 10;
    });

    // Simpan PDF
    doc.save("inventaris.pdf");
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Download PDF
    </button>
  );
}
