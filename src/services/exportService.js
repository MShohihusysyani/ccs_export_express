const db = require('../config/db');
const { createRincianExcel } = require('../utils/excel');

// exports.rincianPelaporan = async (filters) => {

//     function nullIfEmpty(val) {
//         return val === '' ? null : val;
//     }

//     const tanggalAwal  = nullIfEmpty(filters.tanggal_awal);
//     const tanggalAkhir = nullIfEmpty(filters.tanggal_akhir);
//     const namaKlien    = nullIfEmpty(filters.nama_klien);
//     const namaUser     = nullIfEmpty(filters.nama_user);
//     const ratingVal    = nullIfEmpty(filters.rating);
//     const statusCCS    = nullIfEmpty(filters.status);

//     const conn = await db.getConnection();
//     const [rows] = await conn.query(
//         `
//         SELECT p.no_tiket, p.created_at, p.finish_at, p.kategori, p.status,p.priority, p.maxday, p.judul, p.perihal,k.nama_klien AS nama,p.handle_by, p.handle_by2, p.handle_by3, p.rating
//         FROM pelaporan p
//         LEFT JOIN klien k ON p.klien_id = k.id_klien
//         WHERE (? IS NULL OR DATE(p.created_at) BETWEEN ? AND ?)
//             AND (? IS NULL OR p.klien_id = ?) 
//             AND (? IS NULL OR p.handle_by LIKE CONCAT('%', ?, '%')
//                 OR p.handle_by2 LIKE CONCAT('%', ?, '%')
//                 OR p.handle_by3 LIKE CONCAT('%', ?, '%'))
//             AND (? IS NULL OR p.status = ?)
//             AND (? IS NULL OR p.rating = ?)
//         ORDER BY p.created_at DESC
//         `,
//         [
//         tanggalAwal, tanggalAwal, tanggalAkhir,
//         namaKlien, namaKlien,
//         namaUser, namaUser, namaUser, namaUser,
//         statusCCS, statusCCS,
//         ratingVal, ratingVal
//         ]
//     );
//     conn.release();

//     return await createRincianExcel(rows, tanggalAwal, tanggalAkhir);
// };
exports.rincianPelaporan = async (filters) => {
    function nullIfEmpty(val) {
        return val === '' ? null : val;
    }

    const tanggalAwal  = nullIfEmpty(filters.tanggal_awal);
    const tanggalAkhir = nullIfEmpty(filters.tanggal_akhir);
    const namaKlien    = nullIfEmpty(filters.klien);
    const namaUser     = nullIfEmpty(filters.petugas);
    const ratingVal    = nullIfEmpty(filters.rating);
    const statusCCS    = nullIfEmpty(filters.status);
    const prioritas    = nullIfEmpty(filters.prioritas);
    
    // Mendapatkan jenis input tanggal
    const dateTypeInput = filters.filter_date_type; 
    
    // Daftar kolom yang diizinkan (Whitelist)
    const allowedColumns = {
        'created_at': 'created_at',
        'finish_at': 'finish_at',
        'tgl_jatuh_tempo': 'tgl_jatuh_tempo'
    };

    // Default ke 'created_at' jika input tidak dikenali atau kosong
    const targetColumn = allowedColumns[dateTypeInput] || 'created_at';

    const conn = await db.getConnection();
    
    const [rows] = await conn.query(
        `
        SELECT p.no_tiket, p.created_at, p.finish_at, p.kategori, p.status, p.priority, p.maxday, p.judul, p.perihal, 
                k.nama_klien AS nama, p.handle_by, p.handle_by2, p.handle_by3, p.rating
        FROM pelaporan p
        LEFT JOIN klien k ON p.klien_id = k.id_klien
        WHERE 
            (? IS NULL OR DATE(p.${targetColumn}) >= ?) 
            AND (? IS NULL OR DATE(p.${targetColumn}) <= ?)
            AND (? IS NULL OR p.klien_id = ?) 
            AND (? IS NULL OR p.handle_by LIKE CONCAT('%', ?, '%')
                OR p.handle_by2 LIKE CONCAT('%', ?, '%')
                OR p.handle_by3 LIKE CONCAT('%', ?, '%'))
            AND (? IS NULL OR p.status = ?)
            AND (? IS NULL OR p.rating = ?)
            AND (? IS NULL OR p.priority = ?)
        ORDER BY p.${targetColumn} DESC
        `,
        [
            // Parameter Tanggal
            tanggalAwal, tanggalAwal,   // Untuk logic >=
            tanggalAkhir, tanggalAkhir, // Untuk logic <=
            
            // Parameter Sisanya 
            namaKlien, namaKlien,
            namaUser, namaUser, namaUser, namaUser,
            statusCCS, statusCCS,
            ratingVal, ratingVal,
            prioritas, prioritas
        ]
    );
    conn.release();

    return await createRincianExcel(rows, tanggalAwal, tanggalAkhir);
};
exports.rincianPelaporanExcelHelpdesk = async (filters, userId) => {
    function nullIfEmpty(val) {
        return val === '' ? null : val;
    }

    const tanggalAwal  = nullIfEmpty(filters.tanggal_awal);
    const tanggalAkhir = nullIfEmpty(filters.tanggal_akhir);
    const namaKlien    = nullIfEmpty(filters.klien);
    const ratingVal    = nullIfEmpty(filters.rating);
    const statusCCS    = nullIfEmpty(filters.status);

    const conn = await db.getConnection();
    const [rows] = await conn.query(
        `
        SELECT p.id_pelaporan, p.no_tiket, p.created_at, p.finish_at, p.kategori, p.status,
            p.priority, p.maxday, p.judul, p.perihal,p.rating, p.handle_by, p.handle_by2, p.handle_by3,
            k.nama_klien AS nama
        FROM pelaporan p
        LEFT JOIN klien k ON p.klien_id = k.id_klien
        INNER JOIN forward_helpdesk f 
                ON f.pelaporan_id = p.id_pelaporan 
                AND f.user_id = ?
        WHERE (? IS NULL OR DATE(p.created_at) BETWEEN ? AND ?)
            AND (? IS NULL OR p.klien_id = ?)
            AND (? IS NULL OR p.status = ?)
            AND (? IS NULL OR p.rating = ?)
        ORDER BY p.created_at DESC
        `,
        [
            userId,
            tanggalAwal, tanggalAwal, tanggalAkhir,
            namaKlien, namaKlien,
            statusCCS, statusCCS,
            ratingVal, ratingVal
        ]
    );
    conn.release();

    return await createRincianExcel(rows, tanggalAwal, tanggalAkhir);
};

exports.rincianPelaporanExcelImplementator = async (filters, userId) => {
    function nullIfEmpty(val) {
        return val === '' ? null : val;
    }

    const tanggalAwal  = nullIfEmpty(filters.tanggal_awal);
    const tanggalAkhir = nullIfEmpty(filters.tanggal_akhir);
    const namaKlien    = nullIfEmpty(filters.klien);
    const ratingVal    = nullIfEmpty(filters.rating);
    const statusCCS    = nullIfEmpty(filters.status);

    const conn = await db.getConnection();
    const [rows] = await conn.query(
        `
        SELECT p.id_pelaporan, p.no_tiket, p.created_at, p.finish_at, p.kategori, p.status,
            p.priority, p.maxday, p.judul, p.perihal,p.rating, p.handle_by, p.handle_by2, p.handle_by3,
            k.nama_klien AS nama
        FROM pelaporan p
        LEFT JOIN klien k ON p.klien_id = k.id_klien
        INNER JOIN forward_implementator f 
                ON f.pelaporan_id = p.id_pelaporan 
                AND f.user_id = ?
        WHERE (? IS NULL OR DATE(p.created_at) BETWEEN ? AND ?)
            AND (? IS NULL OR p.klien_id = ?)
            AND (? IS NULL OR p.status = ?)
            AND (? IS NULL OR p.rating = ?)
        ORDER BY p.created_at DESC
        `,
        [
            userId,
            tanggalAwal, tanggalAwal, tanggalAkhir,
            namaKlien, namaKlien,
            statusCCS, statusCCS,
            ratingVal, ratingVal
        ]
    );
    conn.release();

    return await createRincianExcel(rows, tanggalAwal, tanggalAkhir);   
};

