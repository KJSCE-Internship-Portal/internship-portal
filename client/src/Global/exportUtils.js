import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatDate(inputDate) {
  if (!inputDate) return "";
  const d = new Date(inputDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function flattenObject(obj, prefix = "") {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  Object.entries(obj).forEach(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v === null || v === undefined) {
      out[key] = v;
    } else if (v instanceof Date) {
      out[key] = formatDate(v);
    } else if (Array.isArray(v)) {
      // Special-case common arrays: internships and evaluation - flatten useful fields
      const lk = k.toLowerCase();
      if (k === "internships" || lk.includes("intern")) {
        if (v.length > 0 && typeof v[0] === "object") {
          // flatten first internship entry under the internships prefix
          Object.assign(out, flattenObject(v[0], key));
        } else {
          out[key] = JSON.stringify(v);
        }
      } else if (k === "evaluation" || lk.includes("evaluation")) {
        // flatten evaluation entries using their evaluation type if available
        v.forEach((entry, idx) => {
          if (entry && typeof entry === "object") {
            const evName = entry.evaluation || idx;
            Object.assign(out, flattenObject(entry, `${key}.${evName}`));
          }
        });
      } else {
        // default: stringify other arrays (e.g., students) so they don't explode cells
        out[key] = JSON.stringify(v);
      }
    } else if (typeof v === "object") {
      Object.assign(out, flattenObject(v, key));
    } else {
      out[key] = v;
    }
  });
  return out;
}

function sanitizeCellValue(v) {
  if (v === null || v === undefined) return "";
  const MAX = 32766; // Excel cell limit is 32767
  let s = typeof v === "string" ? v : String(v);
  if (s.length > MAX) {
    return s.slice(0, MAX - 15) + " ... [truncated]";
  }
  return s;
}

function shouldExcludeKey(k) {
  if (!k) return false;
  const lk = String(k).toLowerCase();
  if (lk.includes("__v")) return true;
  // remove internship progress fields
  if (lk.includes(".progress") || lk.endsWith(".progress")) return true;
  // remove large binary/pdf buffer fields
  if (lk.includes("pdf") && lk.includes("buffer")) return true;
  if (lk.includes("pdf_buffer") || lk.includes("buffer.data") || lk.includes("pdf_")) return true;
  // remove numerous fields per request
  // isActive / is_active / is active
  if (lk === "isactive" || lk === "is_active" || lk === "is active" || lk.startsWith("isactive") || lk.startsWith("is_")) return true;
  // isApproved
  if (lk.includes("isapproved") || lk.includes("is_approved") || lk.includes("is approved")) return true;
  // other submission / othersubmission fields
  if (lk.includes("othersubm") || lk.includes("other_submission") || lk.includes("other submissions")) return true;
  // internships.completion
  if (lk.endsWith(".completion") || lk.includes(".completion")) return true;
  // evaluation private/internal fields (ids, examiner remarks, is_signed)
  if (lk.match(/\.evaluation\./) && (lk.endsWith("._id") || lk.includes("examiner_specific_remarks") || lk.includes("is_signed") || lk.includes("is_sig"))) return true;
  // stipend amount and related flags
  if (lk.includes("stipend_amount") || lk.includes("iscompleted") || lk.includes("is_submitted") || lk === "issubmitted" || lk === "iscompleted") return true;
  // offer_letter internals
  if (lk.includes("offer_letter.filename") || lk.includes("offer_letter.buffer") || lk.includes("offerletter") || lk.includes("offer_letter")) return true;
  // sub_id and profile picture URL and mentor details
  if (lk === "sub_id" || lk === "subid" || lk === "sub-id" || lk.includes("profile_picture_url") || lk.includes("profilepicture") ) return true;
  // remove id and _id fields
  if (lk === "_id" || lk === "id" || lk.endsWith("._id") || lk.endsWith(".id")) return true;
  // remove report and role fields
  if (lk === "report" || lk.endsWith(".report")) return true;
  if (lk === "role") return true;
  if (lk.startsWith("mentor") || lk.includes(".mentor.")) return true;
  return false;
}

function titleCase(s) {
  return String(s)
    .replace(/[_\.]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function humanizeFlattenedKey(k) {
  if (!k) return "";
  // evaluation entries: internships.evaluation.<idx>.<field>(.scored|.outOf)
  const evalMatch = k.match(/^internships\.evaluation\.(\d+)\.(.+)$/i);
  if (evalMatch) {
    const idx = parseInt(evalMatch[1], 10);
    const labelPrefix = idx === 0 ? "ISE" : idx === 1 ? "ESE" : `Eval ${idx}`;
    const rest = evalMatch[2];
    // detect scored/outOf
    const scoredMatch = rest.match(/(.+)\.(scored|outof|outOf)$/i);
    let fieldName = rest;
    let suffix = "";
    if (scoredMatch) {
      fieldName = scoredMatch[1];
      suffix = scoredMatch[2].toLowerCase() === "scored" ? "(scored)" : "(out of)";
    }
    // clean fieldName: remove trailing dots, underscores
    const cleaned = fieldName.replace(/[_\.]+/g, " ");
    return `${labelPrefix} - ${titleCase(cleaned)} ${suffix}`.trim();
  }

  // internships prefixed fields: internships.startDate, internships.job_description, etc.
  if (k.startsWith("internships.")) {
    const rest = k.replace(/^internships\./, "");
    return titleCase(rest);
  }

  // generic flatten keys: convert dots/underscores to spaces and title case
  return titleCase(k.replace(/^\./, ""));
}

export function exportToExcel(filename, dataArray) {
  if (!dataArray) return;
  // Flatten nested objects so new merged fields are included as columns
  const rows = Array.isArray(dataArray)
    ? dataArray.map((r) => flattenObject(r))
    : [flattenObject(dataArray)];
  // Sanitize long string values to avoid Excel cell length limit errors
  const sanitizedRows = rows.map((row) => {
    const out = {};
    Object.entries(row).forEach(([k, v]) => {
      if (shouldExcludeKey(k)) return; // skip unwanted keys
      out[k] = sanitizeCellValue(v);
    });
    return out;
  });
  // Humanize headers: map original keys to readable labels
  const allKeys = new Set();
  sanitizedRows.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));
  const keyList = Array.from(allKeys);
  const headerMap = keyList.reduce((m, k) => {
    m[k] = humanizeFlattenedKey(k);
    return m;
  }, {});
  // Build rows with human-readable headers
  const humanRows = sanitizedRows.map((r) => {
    const out = {};
    keyList.forEach((k) => {
      out[headerMap[k]] = r.hasOwnProperty(k) ? r[k] : "";
    });
    return out;
  });
  const worksheet = XLSX.utils.json_to_sheet(humanRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  try {
    XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  } catch (err) {
    console.error("Failed to write Excel file:", err);
    // Fallback: try to truncate all cells aggressively and retry
    const truncatedRows = rows.map((row) => {
      const out = {};
      Object.entries(row).forEach(([k, v]) => {
        out[k] = sanitizeCellValue(v);
      });
      return out;
    });
    const ws2 = XLSX.utils.json_to_sheet(truncatedRows);
    XLSX.utils.book_append_sheet(workbook, ws2, "Sheet1");
    XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  }
}

// data can be an array of objects or single object
export function exportToPDF(filename, data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  if (!data) {
    doc.setFontSize(12);
    doc.text("No data to export", margin, 60);
    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
    return;
  }

  // Helper to normalize values (dates/objects)
  const normalize = (v) => {
    if (v instanceof Date) return formatDate(v);
    if (typeof v === "object" && v !== null) return JSON.stringify(v);
    return String(v ?? "");
  };

  if (Array.isArray(data)) {
    if (data.length === 0) {
      doc.setFontSize(12);
      doc.text("No entries", margin, 60);
    } else {
      // Flatten rows so all nested/merged fields are included
      const flatRows = data.map((r) => flattenObject(r));
      const keys = Object.keys(flatRows[0]).filter((k) => !shouldExcludeKey(k));
      // convert keys to human readable headers
      const headers = keys.map((k) => humanizeFlattenedKey(k));
      const head = [headers];
      const body = flatRows.map((row) => keys.map((k) => normalize(row[k])));
      doc.setFontSize(12);
      autoTable(doc, {
        startY: 40,
        head: head,
        body: body,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { left: margin, right: margin },
        theme: "grid",
      });
    }
  } else {
    // Single object: produce a nice report (title + two-column details + optional tables)
    const title = data.name || data.fullName || data.username || "Report";
    doc.setFontSize(18);
    doc.text(title, margin, 60);

    // Flatten object for details while preserving original arrays like students
    const students = data.students || data.mentored || data.mentoredStudents || null;
    const flat = flattenObject(data);

    // Prepare details as two-column table (label, value) with human-readable labels
    const details = Object.entries(flat)
      .filter(([k]) => k !== "students" && k !== "mentored" && k !== "_id" && !shouldExcludeKey(k))
      .map(([k, v]) => [humanizeFlattenedKey(k), normalize(v)]);

    autoTable(doc, {
      startY: 80,
      head: [["Field", "Value"]],
      body: details,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [30, 87, 153], textColor: 255 },
      margin: { left: margin, right: margin },
      columnStyles: { 0: { cellWidth: pageWidth * 0.25 }, 1: { cellWidth: pageWidth * 0.65 } },
      theme: "striped",
    });
    if (Array.isArray(students) && students.length > 0) {
      const lastY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : 120;

      // Determine sensible student columns by checking available keys in first student
      const first = students[0] || {};
      const preferred = ["rollno", "roll_no", "sub_id", "name", "email", "department", "batch"];
      const headerMap = {
        rollno: "Roll No",
        roll_no: "Roll No",
        sub_id: "Sub ID",
        name: "Name",
        email: "Email",
        department: "Department",
        batch: "Batch",
      };
      const studentKeys = preferred.filter((k) => Object.prototype.hasOwnProperty.call(first, k));
      // Fallback: if none of preferred keys exist, use keys from object
      if (studentKeys.length === 0) studentKeys.push(...Object.keys(first));

      const head = [studentKeys.map((k) => headerMap[k] || String(k).toUpperCase())];
      const body = students.map((s) => studentKeys.map((k) => normalize(s[k] ?? s[k.toLowerCase()] ?? s[k.toUpperCase()] ?? "")));

      autoTable(doc, {
        startY: lastY || undefined,
        head: head,
        body: body,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { left: margin, right: margin },
        theme: "grid",
      });
    }
  }

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

const exportUtils = { exportToExcel, exportToPDF };
export default exportUtils;
