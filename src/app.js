const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const geocode = require('./utils/geocode');
const forecast = require('./utils/prediksiCuaca');
const axios = require("axios");

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));

// Menyajikan file statis
app.use(express.static(path.join(__dirname, '../templates')));
app.use(express.static(path.join(__dirname, '../public')));

// Set partials
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Rute
app.get('/', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Wulan Ainiyyah puteri'
    });
});

// Rute untuk info cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Masukan lokasi yang ingin dicari'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            });
        });
    });
});

// Rute untuk halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'BIODATA ',
        nama: 'Wulan Ainiyyah Puteri'
    });
});

//Halaman Berita
app.get("/berita", async (req, res) => {
    try {
      const urlApiMediaStack = "https://api.mediastack.com/v1/news";
      const apiKey = "ff6a770e730fcd7e4cf07842d0a0253b";
  
      const params = {
        access_key: apiKey,
        countries: "id",
      };
  
      const response = await axios.get(urlApiMediaStack, { params });
      const dataBerita = response.data;
  
      res.render("berita", {
        name: "Wulan Ainiyyah Puteri",
        title: "News Update",
        berita: dataBerita.data,
      });
    } catch (error) {
      console.error(error);
      res.render("error", {
        title: "Terjadi Kesalahan",
        pesanKesalahan: "Terjadi kesalahan saat mengambil berita.",
      });
    }
  });
  

// Rute untuk halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan dan Dukungan'
    });
});



// Rute untuk halaman penjelasan
app.get('/penjelasan', (req, res) => {
    res.render('penjelasan', {
        judul: 'Penjelasan Aplikasi Cek Cuaca'
    });
});


// Wildcard route untuk halaman tidak ditemukan
app.get('*', (req, res) => {
    res.render('404', {
        pesanKesalahan: 'Halaman tidak ditemukan.'
    });
});


// Jalankan server
app.listen(port, () => {
    console.log('Server berjalan pada port '+ port);
});
