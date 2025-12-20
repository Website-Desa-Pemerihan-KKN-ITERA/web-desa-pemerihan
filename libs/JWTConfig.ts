/*

JWT_SECRET diambil dari .env, jadi pastikan JWT_SECRET diset di environtment.

JWT_EXP_DIVIDER abaikan saja, ini hanya untuk merubah format waktu jadi detik
                                mengapa karena date.now() itu dalam satuan millis
                                (yang saya(lordsina) pahami sih gitu)

JWT_EXP_TIME adalah waktu expired, jadi untuk menghitung rentang waktu validnya
                                    waktu sekarang dibagi 1000 (JWT_EXP_DIVIDER)
                                    lalu di tambah oleh JWT_EXP_TIME,
                                    mengapa 1 * (60 * 60), karena 1 jam itu 60 menit 
                                    dan 60 menit itu 3600 detik, jadi karena 
                                    kita divide date.now() dengan 1000 sekarang 
                                    ia dalam satuan detik, sehingga 60 menit 
                                    tersebut perlu di ubah jadi detik.
                                    Namun feel free aja, karena saya kira ini bisa
                                    aja di buat "1 * 3600" atau "60 * 60"
*/
export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "秘密です",
  JWT_EXP_DIVIDER: 1000,
  JWT_EXP_TIME: 1 * (60 * 60),
};
