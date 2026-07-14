export function exportToCSV(data, filename, columns) {
  const headers = columns.map((c) => c.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = typeof c.value === "function" ? c.value(row) : row[c.key];
        let str = String(val ?? "").replace(/"/g, '""');
        if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
        return `"${str}"`;
      })
      .join(",")
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}