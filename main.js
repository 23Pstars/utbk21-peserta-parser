const fs = require('fs');

const DomParser = require('dom-parser');
const parser = new DomParser();

const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = new createCsvWriter({
    path: './bbb.csv',
    header: [
        'Nama', 'NIK', 'Alamat',
        'No. Peserta', 'Sesi', 'Waktu',
        'Lokasi', 'Ruang'
    ],
});

fs.readFile('./aaa.html', 'utf8', (err, html) => {
    const dom = parser.parseFromString(html);
    const lists = dom.getElementsByClassName('white-box');

    let records = [];

    lists.forEach(item => {
        const rows = item.getElementsByTagName('td');
        if (rows.length > 5) {
            const nama = rows[0].textContent;
            const nik = rows[2].textContent;
            const alamat = rows[6].textContent;
            const jadwal = rows.pop().textContent.split('\n');
            const noPeserta = jadwal[0];
            let sesi = '';
            let waktu = '';
            let lokasi = '';
            let ruang = '';
            if (jadwal.length >= 10) {
                const _waktu = jadwal[4].split(' • ');
                sesi = _waktu[0];
                waktu = _waktu[1];
                lokasi = jadwal[6];
                ruang = jadwal[8];
            }
            records.push([
                nama, nik, alamat, noPeserta,
                sesi, waktu, lokasi, ruang
            ]);
            // console.log([
            //     nama, nik, alamat, noPeserta,
            //     sesi, waktu, lokasi, ruang
            // ]);
        }
    });

    csvWriter.writeRecords(records)
        .then(() => {
            console.log('done...')
        });
});