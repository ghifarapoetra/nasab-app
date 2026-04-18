'use client'
import LegalLayout from '../../components/LegalLayout'

export default function PrivacyPage() {
  return (
    <LegalLayout title="Kebijakan Privasi" subtitle="Privacy Policy" lastUpdated="18 April 2026">

      <div className="dalil">
        "Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya."
        — QS. An-Nisa: 58
      </div>

      <p>
        Menjaga data keluarga adalah amanah. Sulalah (&quot;kami&quot;) berkomitmen melindungi informasi
        pribadi Anda dan anggota keluarga yang Anda catat dalam aplikasi ini. Kebijakan ini menjelaskan
        data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak Anda atas data tersebut.
      </p>

      <h2>1. Siapa Kami</h2>
      <p>
        Sulalah adalah aplikasi pohon silsilah keluarga Muslim, dikembangkan oleh:
      </p>
      <div className="info-box">
        <p><strong>Pemilik:</strong> Ghifara Poetra (perorangan)</p>
        <p><strong>Domisili:</strong> Tengaran, Indonesia</p>
        <p><strong>Email:</strong> <a href="mailto:halo@sulalah.my.id">halo@sulalah.my.id</a></p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/6285175132050">+62 851-7513-2050</a></p>
        <p><strong>Website:</strong> <a href="https://sulalah.my.id">sulalah.my.id</a></p>
      </div>

      <h2>2. Data yang Kami Kumpulkan</h2>

      <h3>2.1. Data Akun Anda</h3>
      <ul>
        <li>Alamat email — untuk login dan komunikasi</li>
        <li>Nama lengkap — untuk identifikasi akun</li>
        <li>Kata sandi — tersimpan dalam bentuk <em>hash</em> (tidak dapat dibaca siapapun, termasuk kami)</li>
      </ul>

      <h3>2.2. Data Silsilah Keluarga yang Anda Input</h3>
      <ul>
        <li>Nama anggota keluarga</li>
        <li>Jenis kelamin, tanggal/tahun lahir, tanggal/tahun wafat</li>
        <li>Hubungan keluarga (ayah, ibu, pasangan, anak)</li>
        <li>Foto profil anggota keluarga (opsional)</li>
        <li>Nomor HP/WhatsApp dan email anggota (opsional)</li>
        <li>Catatan pribadi atau riwayat keluarga (opsional)</li>
      </ul>

      <h3>2.3. Data Teknis</h3>
      <ul>
        <li>Cookie untuk menjaga sesi login dan preferensi tema (terang/gelap)</li>
        <li>Log akses untuk keperluan keamanan (IP address, waktu akses, user agent)</li>
        <li>Data pembayaran via Trakteer bila Anda upgrade Premium (hanya ID transaksi, bukan nomor kartu)</li>
      </ul>

      <h2>3. Bagaimana Kami Menggunakan Data Anda</h2>
      <p>Data Anda hanya digunakan untuk:</p>
      <ul>
        <li>Menjalankan fungsi aplikasi (menampilkan pohon silsilah, deteksi mahram, dll.)</li>
        <li>Mengirim notifikasi milad atau pengingat (hanya jika Anda mengaktifkan)</li>
        <li>Komunikasi penting terkait akun (misalnya verifikasi pembayaran)</li>
        <li>Peningkatan layanan berdasarkan pola penggunaan (anonim/agregat)</li>
      </ul>
      <p>
        <strong>Kami TIDAK PERNAH:</strong>
      </p>
      <ul>
        <li>Menjual data Anda kepada pihak ketiga</li>
        <li>Menggunakan data silsilah untuk iklan</li>
        <li>Membagikan foto atau nama anggota keluarga di luar aplikasi</li>
        <li>Membaca catatan pribadi atau pesan personal Anda</li>
      </ul>

      <h2>4. Keamanan Data</h2>
      <p>
        Data Anda disimpan di server terenkripsi milik <strong>Supabase</strong> (terdaftar di AWS),
        dengan enkripsi standar industri (AES-256 at-rest dan TLS 1.3 in-transit).
      </p>
      <ul>
        <li>Kata sandi Anda di-<em>hash</em> menggunakan bcrypt dan tidak dapat dibaca oleh siapapun</li>
        <li>Foto anggota keluarga disimpan dengan nama file acak yang tidak dapat ditebak</li>
        <li>Sistem <em>Row Level Security</em> memastikan data Anda tidak dapat diakses user lain</li>
        <li>Setiap upload foto tercatat di log audit untuk memantau aktivitas tidak wajar</li>
      </ul>
      <p>
        Meski demikian, tidak ada sistem yang 100% aman. Kami berupaya terbaik, namun tidak dapat
        menjamin sepenuhnya. Gunakan kata sandi yang kuat dan unik.
      </p>

      <h2>5. Siapa yang Bisa Melihat Data Anda</h2>
      <p>Data dalam pohon silsilah Anda hanya dapat dilihat oleh:</p>
      <ul>
        <li><strong>Anda sebagai pemilik pohon</strong> — akses penuh</li>
        <li><strong>Anggota yang Anda undang</strong> (editor/penonton) — sesuai peran</li>
        <li><strong>Orang yang memiliki link undangan valid</strong> (berlaku 7 hari)</li>
      </ul>
      <p>
        Anda sepenuhnya mengontrol siapa yang bisa mengakses pohon Anda. Anda dapat menghapus anggota
        atau membatalkan undangan kapan saja.
      </p>

      <h2>6. Berbagi Data dengan Pihak Ketiga</h2>
      <p>
        Kami bekerja sama dengan layanan pihak ketiga untuk menjalankan Sulalah:
      </p>
      <ul>
        <li><strong>Supabase</strong> — penyedia database dan penyimpanan foto</li>
        <li><strong>Vercel</strong> — penyedia hosting aplikasi</li>
        <li><strong>Trakteer</strong> — pemroses pembayaran Premium</li>
      </ul>
      <p>
        Pihak-pihak ini hanya memiliki akses teknis yang diperlukan untuk menjalankan layanan, dan
        terikat oleh kebijakan privasi masing-masing.
      </p>

      <h2>7. Data Anak di Bawah Umur</h2>
      <p>
        Kami menyadari pohon silsilah sering berisi data anak-anak (anggota keluarga Anda).
        Sebagai pemilik pohon, Anda bertanggung jawab memastikan:
      </p>
      <ul>
        <li>Memiliki izin dari orang tua/wali untuk mencatat data anak</li>
        <li>Menjaga kerahasiaan data anak sebagaimana amanah keluarga</li>
      </ul>
      <p>
        Sulalah tidak ditujukan untuk digunakan langsung oleh anak di bawah 13 tahun. Jika Anda
        mengetahui ada akun yang didaftarkan oleh anak di bawah umur, harap hubungi kami untuk
        dihapus.
      </p>

      <h2>8. Hak Anda atas Data Anda</h2>
      <p>Sesuai UU Perlindungan Data Pribadi Indonesia, Anda berhak:</p>
      <ul>
        <li><strong>Mengakses</strong> seluruh data Anda kapan saja melalui aplikasi</li>
        <li><strong>Memperbaiki</strong> data yang tidak akurat melalui menu Edit</li>
        <li><strong>Menghapus</strong> seluruh akun dan data Anda di halaman <a href="/hapus-akun">Hapus Akun</a></li>
        <li><strong>Mengekspor</strong> pohon silsilah Anda dalam bentuk PDF/poster</li>
        <li><strong>Mengajukan keberatan</strong> atas pemrosesan data melalui email kami</li>
      </ul>

      <h2>9. Cookie dan Penyimpanan Lokal</h2>
      <p>Sulalah menggunakan cookie dan penyimpanan lokal browser untuk:</p>
      <ul>
        <li>Menjaga sesi login Anda</li>
        <li>Menyimpan preferensi tema terang/gelap</li>
        <li>Menyimpan status &quot;sudah menutup banner milad&quot; (harian)</li>
      </ul>
      <p>
        Kami TIDAK menggunakan cookie iklan, tracker pihak ketiga, atau Google Analytics. Privasi
        Anda diutamakan.
      </p>

      <h2>10. Perubahan Kebijakan</h2>
      <p>
        Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal &quot;Terakhir diperbarui&quot; di atas
        menunjukkan versi terbaru. Untuk perubahan signifikan, kami akan memberitahu via email atau
        banner di aplikasi.
      </p>

      <h2>11. Pertanyaan atau Komplain</h2>
      <p>
        Jika Anda memiliki pertanyaan, permintaan, atau komplain terkait privasi data, hubungi kami:
      </p>
      <div className="info-box">
        <p>📧 Email: <a href="mailto:halo@sulalah.my.id">halo@sulalah.my.id</a></p>
        <p>💬 WhatsApp: <a href="https://wa.me/6285175132050">+62 851-7513-2050</a></p>
      </div>

      <div className="dalil">
        Semoga Sulalah menjadi amanah yang dijaga dengan baik, dan bermanfaat untuk silaturahim
        keluarga Muslim Indonesia. Jazakumullahu khayran.
      </div>

    </LegalLayout>
  )
}
