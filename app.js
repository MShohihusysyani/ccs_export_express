const express = require('express');
const app = express();
const exportRoute = require('./src/routes/export');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/export', exportRoute);

app.use((req, res, next) => {
    res.status(404).send('Halaman tidak ditemukan');
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');
});