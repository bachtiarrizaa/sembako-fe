import Link from "next/link"
import { ShoppingCart, ShieldCheck, ArrowRight, Wheat } from "lucide-react"

export default function Home() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-background text-foreground overflow-hidden font-sans">
      {/* Dynamic Glow Effects (Adaptive to Light/Dark Mode) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[150px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-40 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-6 flex flex-col items-center text-center">

        {/* Logo and Brand Header */}
        <div className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
          <Wheat className="size-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Toko Beras Putra Mandiri</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3 sm:whitespace-nowrap">
          PORTAL MANAJEMEN <span className="text-primary">TOKO SEMBAKO</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mb-8">
          Selamat datang di sistem informasi penjualan & persediaan. Silakan pilih modul untuk memulai sesi kerja Anda.
        </p>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">

          {/* CASHIER CARD */}
          <div className="group relative flex flex-col justify-between items-start text-left p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg shadow-slate-100/50 dark:shadow-none hover:border-primary/40 hover:bg-card transition-all duration-300 hover:-translate-y-1.5">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-full">
              <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">Kasir (Cashier)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Gunakan modul ini untuk melayani transaksi belanja pelanggan secara ritel, mencatat penjualan langsung, dan mencetak nota pembelian.
              </p>
            </div>

            <Link
              href="/cashier/login"
              className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 text-sm"
            >
              Masuk Sesi Kasir
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* ADMIN CARD */}
          <div className="group relative flex flex-col justify-between items-start text-left p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg shadow-slate-100/50 dark:shadow-none hover:border-primary/40 hover:bg-card transition-all duration-300 hover:-translate-y-1.5">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-full">
              <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">Administrator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Gunakan modul ini untuk mengontrol inventory stok barang, manajemen master data, memonitor grafik laporan, dan mengelola akun staf.
              </p>
            </div>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl border border-white/5 dark:border-border hover:border-primary/20 transition-all shadow-sm text-sm"
            >
              Masuk Sesi Admin
              <ArrowRight className="size-4" />
            </Link>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-8 text-xs text-muted-foreground font-medium">
          © {new Date().getFullYear()} Toko Beras Putra Mandiri. Seluruh hak cipta dilindungi.
        </footer>

      </div>
    </div>
  )
}