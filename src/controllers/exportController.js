const exportService = require('../services/exportService');

exports.rincianPelaporan = async (req, res) => {
    try {
        const buffer = await exportService.rincianPelaporan(req.query);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Content-Disposition', 'attachment; filename="Rincian_Pelaporan.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);
    } catch (err) {
        console.error('Export error:', err);
        if (!res.headersSent) {
            res.status(500).send('Gagal export Excel');
        }
    }
};

exports.rincianPelaporanExcelHelpdesk = async (req, res) => {
    try {
        const {user_id} = req.query;
        const buffer = await exportService.rincianPelaporanExcelHelpdesk(req.query, user_id);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Content-Disposition', 'attachment; filename="Rincian_Pelaporan.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);
    } catch (err) {
        console.error('Export error:', err);
        if (!res.headersSent) {
            res.status(500).send('Gagal export Excel');
        }
    }
}

exports.rincianPelaporanExcelImplementator = async (req, res) => {
    try{
        const {user_id} = req.query;
        const buffer = await exportService.rincianPelaporanExcelImplementator(req.query, user_id);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Content-Disposition', 'attachment; filename="Rincian_Pelaporan.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);
    } catch (err) {
        console.error('Export error:', err);
        if (!res.headersSent) {
            res.status(500).send('Gagal export Excel');
        }
    }
}
