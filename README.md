# WebGL Articulated Model

## Deskripsi Singkat

Dalam tugas ini, dibuat sebuah aplikasi berbasis web untuk melakukan manipulasi pada articulated model yang juga dibuat. Kode dibuat dalam bahasa Javascript dan menggunakan API WebGL. WebGL merupakan API Javascript untuk me-render grafika 2 dan 3 dimensi menggunakan browser. Kami menggunakan browser Google Chrome dengan mengaktifkan WebGL developer extension yang telah tersedia.

## Cara Menjalankan

Berikut merupakan langkah-langkah untuk menjalankan proyek ini:

1. _Clone_ atau _download as zip_ _repository_ ini.
2. Buka folder pada VS Code.
3. Jika belum menginstal ekstensi Live Server, _install extension Live Server_ melalui Ctrl+Shift+X lalu cari `Live Server`.
4. Buka _file_ `index.html`, lalu klik F1.
5. Web akan terbuka pada browser default (kami menggunakan Chrome).

## _Articulated Models_

Pada tugas ini, dibuat 4 buah articulated models, yakni:

1. _Human_ dibuat oleh Ilham Prasetyo Wibowo (13520013)
2. _Turtle_ dibuat oleh Maharani Ayu Putri Irawan (13520019)
3. _Snow Golem_ dibuat oleh Muhammad Akmal Arifin (13520037)
4. _Cat_ dibuat oleh Yohana Golkaria Nainggolan (13520053)

## _Input & Output_

Untuk melakukan _load articulated model_, animasi, dan komponen, gunakan _input file_ yang tersedia di panel kanan. Terdapat tiga pilihan kolom input file, pilih yang sesuai, lalu,

1. Klik `Choose file`
2. Pilih file berekstensi `.json`
3. Klik `Load`

Untuk menyimpan _articulated model_, gunakan _button_ yang tersedia di panel kanan

1. Jika ingin menyimpan dengan nama file tertentu, masukkan nama file pada input teks yang tersedia (tanpa ekstensi).
2. Klik `save`.
3. Model tersimpan pada `Downloads` dengan nama default `articulatedmodel.json` atau dengan nama file _custom_ yang telah dimasukkan pada input teks dengan ekstensi JSON.

## Animasi

Animasi diimplementasikan secara global agar dapat digunakan oleh seluruh model. Ada 4 animasi yang diimplementasikan, diletakkan pada direktori `/src/animation`. Untuk mengaplikasikan animasi pada model yang aktif pada kanvas, lakukan:

1. Load animasi
2. Klik Play
3. Untuk melanjutkan play dari state terakhir, gunakan Resume.
4. Untuk menghentikan Play, gunakan Stop. Untuk menghentikan Resume, gunakan Pause.
5. Dapat juga melihat animasi per frame menggunakan Frame modifier.

Untuk mengubah _rate frame per second_, ubah nilai slider. Nilai minimum adalah 1 dan maksimumnya 100. Perhitungan dilakukan dengan 1000/rate.

## Tekstur

Diimplementasikan ketiga jenis tekstur pada tugas ini, yang dapat dipilih pada panel kanan.
Ketiganya merupakan: tekstur dari image, bump mapping, environmental mapping.
Untuk menggunakan tekstur, Anda tinggal memilih jenis tekstur yang akan diaplikasikan pada panel kanan.

## Kanvas

Terdapat 2 kanvas pada panel kiri. Kanvas atas merupakan kanvas global, dimana keseluruhan objek _articulated model_ dapat ditampakkan. Kanvas bagian bawah merupakan kanvas khusus per komponen atau sub komponen.

## Dibuat Oleh:

[@ilhamwibowo](https://github.com/ilhamwibowo)
[@rannnayy](https://github.com/rannnayy)
[@Yohanagn](https://github.com/Yohanagn)
[@AkmalArifin](https://github.com/AkmalArifin)
