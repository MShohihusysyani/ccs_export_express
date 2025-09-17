const Excel = require('exceljs');
const dayjs = require('dayjs');
require('dayjs/locale/id');
dayjs.locale('id');

const formatTanggal = (val) => {
    if (!val) return '';
    return dayjs(val).format('DD MMMM YYYY HH:mm:ss');
};

exports.createRincianExcel = async (rows, tanggalAwal, tanggalAkhir) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('Rincian Pelaporan', {
        pageSetup: { orientation: 'landscape' }
    });

  // Judul & Periode
    sheet.addRow(['CCS | RINCIAN PELAPORAN']).font = { bold: true, size: 14 };
    sheet.mergeCells('A1:M1');
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    const periodeText = (tanggalAwal && tanggalAkhir)
        ? `Periode: ${tanggalAwal} s/d ${tanggalAkhir}`
        : 'Semua Data';
    sheet.addRow([periodeText]).font = { bold: true };
    sheet.mergeCells('A2:M2');
    sheet.getCell('A2').alignment = { horizontal: 'center' };

    // Header
    sheet.addRow([
        'NO', 'No Tiket', 'Judul', 'Perihal', 'BPR/Klien', 'Kategori',
        'Priority', 'Maxday', 'Handled By', 'Status', 'Rating',
        'Create at', 'Finish at'
    ]);

    // Data
    let no = 1;
    for (const data of rows) {
        const handleBy = [data.handle_by, data.handle_by2, data.handle_by3]
        .filter(Boolean)
        .join(', ');

        sheet.addRow([
            no++,
            data.no_tiket || '',
            data.judul || '',
            data.perihal || '',
            data.nama || '',
            data.kategori || '',
            data.priority || '',
            data.maxday || '',
            handleBy || '',
            data.status || '',
            data.rating || '',
            formatTanggal(data.created_at) || '',
            formatTanggal(data.finish_at) || ''
        ]);
    }

    return await workbook.xlsx.writeBuffer();
};
