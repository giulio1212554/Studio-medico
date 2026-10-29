import { jsPDF } from "jspdf";
import type { RecipeRequest, Invoice } from "./store";
import { CONTACT } from "./store";

function header(doc: jsPDF) {
  doc.setFillColor(42, 110, 120);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Studio Medico Aurelia", 14, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${CONTACT.address}  ·  Tel. ${CONTACT.phone}`, 14, 22);
  doc.setTextColor(40, 40, 40);
}

function footer(doc: jsPDF) {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Documento generato da Tecoloii", 105, 287, { align: "center" });
}

export function generateRecipePDF(recipe: RecipeRequest, patientName: string, fiscalCode?: string) {
  const doc = new jsPDF();
  header(doc);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RICETTA MEDICA", 105, 42, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Codice: ${recipe.code || "—"}`, 14, 55);
  doc.text(`Data: ${new Date(recipe.createdAt).toLocaleDateString("it-IT")}`, 140, 55);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 60, 196, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Paziente", 14, 72);
  doc.setFont("helvetica", "normal");
  doc.text(patientName, 14, 80);
  if (fiscalCode) doc.text(`CF: ${fiscalCode}`, 14, 87);
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
  doc.setDrawColor(42, 110, 120);
  doc.rect(150, 160, 40, 40);
  doc.setFontSize(8);
  doc.text("QR", 170, 182, { align: "center" });
  doc.text(recipe.code || "RIC", 170, 188, { align: "center" });
  doc.setFontSize(9);
  doc.text("Firma del medico ________________________", 14, 220);
  footer(doc);
  doc.save(`ricetta-${recipe.code || recipe.id}.pdf`);
}

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF();
  header(doc);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FATTURA", 105, 42, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N. ${invoice.number}`, 14, 55);
  doc.text(`Data: ${new Date(invoice.createdAt).toLocaleDateString("it-IT")}`, 140, 55);
  doc.line(14, 60, 196, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente", 14, 72);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.patientName, 14, 80);
  doc.setFont("helvetica", "bold");
  doc.text("Descrizione", 14, 100);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.description, 14, 108);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Importo: € ${invoice.amount.toFixed(2)}`, 14, 130);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Stato: ${invoice.status === "paid" ? "Pagata" : "Da pagare"}`, 14, 140);
  footer(doc);
  doc.save(`fattura-${invoice.number}.pdf`);
}
