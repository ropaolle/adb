import XLSX from 'xlsx';

export function getDateString(rawDate) {
  if (!rawDate) return '-';

  function pad(val) {
    return (val > 9 ? '' : '0') + val;
  }
  const date = XLSX.SSF.parse_date_code(rawDate); // eslint-disable-line
  return `${date.y}-${pad(date.m)}-${pad(date.d)}`;
}

function groupByFamily(worksheet) {
  let index = 0;
  return Object.values(worksheet).reduce((acc, row, i) => {
    const newFamily = { family: row.family, data: [row], completed: !!row.date };
    if (i === 0) {
      acc[index] = newFamily;
    } else if (acc[index].family !== row.family) {
      index += 1;
      acc[index] = newFamily;
    } else {
      acc[index].data.push(row);
      if (!row.date) acc[index].completed = false;
    }
    return acc;
  }, []);
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
