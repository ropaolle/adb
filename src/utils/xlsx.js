import XLSX from 'xlsx';

export function dateToString(rawDate) {
  return XLSX.SSF.format('YYYY-MM-DD', rawDate) || '-';
}

function groupByFamily(worksheet) {
  const families = [];
  Object.values(worksheet).forEach((row, i) => {
    if (i === 0 || families[families.length - 1].family !== row.family) {
      families.push({
        family: row.family,
        data: [{ ...row, id: i }],
        completed: !!row.date,
        id: i.toString(),
      });
    } else {
      families[families.length - 1].data.push({ ...row, id: i });
    }
    if (!row.date) families[families.length - 1].completed = false;
  });
  return families;
}

function fileType(type) {
  const fileTypeXlxs = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
  const fileTypeXls = /application\/vnd.ms-excel/;
  if (type.match(fileTypeXlxs)) return 'xlxs';
  if (type.match(fileTypeXls)) return 'xls';
  return null;
}

export default function parsXlsx(file) {
  if (!fileType(file.type)) {
    return Promise.reject('Wrong file format');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' /* , cellDates: 'true' */ });
      const worksheetRaw = workbook.Sheets[workbook.SheetNames[0]];
      const header = [
        'kingdom',
        'order',
        'family',
        'speices',
        'sex',
        'speices_latin',
        'place',
        'county',
        'date',
        'image',
        'comment',
      ];

      const worksheet = XLSX.utils.sheet_to_json(worksheetRaw, { header, raw: true, range: 1 });
      resolve(groupByFamily(worksheet));
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
}
