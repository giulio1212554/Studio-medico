import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { RecipeRequest, Invoice } from "./store";
import { getBrand } from "./brand";

function header(doc: jsPDF) {
  const brand = getBrand();
  doc.setFillColor(42, 110, 120);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(brand.studioName, 14, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${brand.address}  ·  Tel. ${brand.phone}`, 14, 22);
  doc.setTextColor(40, 40, 40);
}

function footer(doc: jsPDF) {
  const brand = getBrand();
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Documento demo – ${brand.studioName}`, 105, 287, {
    align: "center",
  });
}

async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 160,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1e293b", light: "#ffffff" },
  });
}

export async function generateRecipePDF(
  recipe: RecipeRequest,
  patientName: string,
  fiscalCode?: string,
) {
  const doc = new jsPDF();
  header(doc);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RICETTA MEDICA ELETTRONICA", 105, 42, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const nre = recipe.code || "—";
  doc.text(`NRE: ${nre}`, 14, 55);
  doc.text(
    `Data: ${new Date(recipe.signedAt || recipe.createdAt).toLocaleDateString("it-IT")}`,
    140,
    55,
  );
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 60, 196, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Paziente", 14, 72);
  doc.setFont("helvetica", "normal");
  doc.text(patientName, 14, 80);
  if (fiscalCode) doc.text(`Codice fiscale: ${fiscalCode}`, 14, 87);
  doc.setFont("helvetica", "bold");
  doc.text("Prescrizione", 14, 102);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(recipe.medication, 170), 14, 110);
  if (recipe.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Note", 14, 130);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(recipe.notes, 170), 14, 138);
  }

  try {
    const qr = await qrDataUrl(`nre:${encodeURIComponent(nre)}`);
    doc.addImage(qr, "PNG", 150, 155, 40, 40);
  } catch {
    doc.setDrawColor(42, 110, 120);
    doc.rect(150, 155, 40, 40);
  }
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Scansiona NRE", 170, 200, { align: "center" });
  doc.setTextColor(40, 40, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Firma del medico", 14, 210);
  doc.setFont("helvetica", "normal");

  if (recipe.signatureDataUrl) {
    try {
      doc.addImage(recipe.signatureDataUrl, "PNG", 14, 215, 60, 25);
    } catch {
      doc.text("(firma non leggibile)", 14, 225);
    }
  } else {
    doc.setDrawColor(180, 180, 180);
    doc.line(14, 235, 90, 235);
  }

  if (recipe.signedBy) {
    doc.setFontSize(9);
    doc.text(recipe.signedBy, 14, 245);
  }
  if (recipe.signedAt) {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Firmato digitalmente il ${new Date(recipe.signedAt).toLocaleString("it-IT")}`,
      14,
      252,
    );
    doc.setTextColor(40, 40, 40);
  }

  footer(doc);
  doc.save(`ricetta-NRE-${nre}.pdf`);
}

export async function generateInvoicePDF(
  invoice: Invoice,
  fiscalCode?: string,
) {
  const doc = new jsPDF();
  header(doc);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FATTURA", 105, 42, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N. ${invoice.number}`, 14, 55);
  doc.text(
    `Data: ${new Date(invoice.createdAt).toLocaleDateString("it-IT")}`,
    140,
    55,
  );
  doc.line(14, 60, 196, 60);

  doc.setFont("helvetica", "bold");
  doc.text("Cliente", 14, 72);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.patientName, 14, 80);
  if (fiscalCode || invoice.fiscalCode) {
    doc.text(`Codice fiscale: ${fiscalCode || invoice.fiscalCode}`, 14, 87);
  }

  doc.setFont("helvetica", "bold");
  doc.text("Descrizione", 14, 102);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.description, 14, 110);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Importo: € ${invoice.amount.toFixed(2)}`, 14, 130);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Esente IVA (art. 10 DPR 633/72 – prestazioni sanitarie)", 14, 138);
  doc.text(
    `Stato: ${invoice.status === "paid" ? "Pagata" : "Da pagare"}`,
    14,
    148,
  );

  try {
    const qr = await qrDataUrl(`fattura:${encodeURIComponent(invoice.number)}`);
    doc.addImage(qr, "PNG", 150, 160, 36, 36);
  } catch {
    /* optional */
  }

  footer(doc);
  doc.save(`fattura-${invoice.number}.pdf`);
}
