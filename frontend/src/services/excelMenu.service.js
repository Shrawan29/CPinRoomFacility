import * as XLSX from "xlsx";

export function exportMenuToExcel(menu, filename = "menu.xlsx") {
  const ws = XLSX.utils.json_to_sheet(menu);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Menu");
  XLSX.writeFile(wb, filename);
}

export function importMenuFromExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    callback(json);
  };
  reader.readAsArrayBuffer(file);
}
