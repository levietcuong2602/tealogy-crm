/* eslint-disable no-restricted-syntax */
import XLSX from 'xlsx';
import FileSaver from 'file-saver';

const EXTENSIONS = ['xlsx', 'xls'];

const FILE_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const isValidExtension = (file) => {
  const parts = file.name.split('.');
  const extension = parts[parts.length - 1];
  return EXTENSIONS.includes(extension); // return boolean
};

export const convertToJson = (headers, data) => {
  const rows = [];
  data.forEach((row) => {
    const rowData = {};
    row.forEach((element, index) => {
      rowData[headers[index]] = element;
    });
    rows.push(rowData);
  });
  return rows;
};

const readUploadedFileAsBinaryString = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsBinaryString(inputFile);
  });
};

export const readExcel = async (file) => {
  const bstr = await readUploadedFileAsBinaryString(file);
  const workBook = XLSX.read(bstr, { type: 'binary' });
  const workSheetName = workBook.SheetNames[0];
  const workSheet = workBook.Sheets[workSheetName];

  // convert data excel to json
  const fileData = XLSX.utils.sheet_to_json(workSheet, {
    header: 1,
  });

  // get list index alphabets appear in excel. ['A', 'B', 'C', 'D']
  const indexAlphabets = [];

  for (const z in workSheet) {
    if (Object.prototype.hasOwnProperty.call(workSheet, z)) {
      const alphabet = z.toString()[0];
      if (alphabet !== '!') {
        if (indexAlphabets.includes(alphabet)) break;
        indexAlphabets.push(alphabet);
      }
    }
  }

  return { fileData, headers: indexAlphabets };
};

export const exportExcel = (csvData, fileName, header) => {
  const ws = XLSX.utils.json_to_sheet(csvData, { header });

  if (csvData.length !== 0) {
    const headerKeys = Object.keys(csvData[0]);
    const wscols = [];
    for (let i = 0; i < headerKeys.length; i += 1) {
      wscols.push({ wch: headerKeys[i].length + 10 });
    }
    ws['!cols'] = wscols;
  }

  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: FILE_TYPE });
  FileSaver.saveAs(data, fileName);
};

export const exportExcelFromTable = ({
  data,
  fileName,
  heads,
  sheetName = 'data',
}) => {
  const wscols = [];

  const header = heads.map((head) => {
    wscols.push({ wch: head.label.length + 10 });
    return head.label;
  });

  const csvData = data.map((el) => {
    const rowData = {};
    heads.forEach(({ label, valueName }) => {
      const value = el[valueName];
      rowData[label] = value.toString();
    });
    return rowData;
  });

  const ws = XLSX.utils.json_to_sheet(csvData, { header });
  ws['!cols'] = wscols;

  const wb = { Sheets: { [sheetName]: ws }, SheetNames: [sheetName] };

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataExport = new Blob([excelBuffer], { type: FILE_TYPE });
  FileSaver.saveAs(dataExport, fileName);
};
