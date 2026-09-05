const LOGIN_COVER =
  "https://images.unsplash.com/photo-1645331465778-eb409d112198?q=80&w=2000&auto=format&fit=crop";

interface AuthCoverPanelProps {
  storeName?: string;
}

export function AuthCoverPanel({ storeName = "Toko Beras Putra Mandiri" }: AuthCoverPanelProps) {
  return (
    <div className="relative hidden bg-muted lg:block overflow-hidden">
      <img
        src={LOGIN_COVER}
        alt={storeName}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

      <div className="absolute bottom-12 left-12 right-12 text-left text-white space-y-4">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10">
          <span className="text-xl leading-none">“</span>
        </div>
        <p className="text-lg font-medium italic text-neutral-200 leading-relaxed">
          Beras pilihan terbaik untuk kebutuhan rumah tangga Anda. Kelola transaksi toko beras Anda dengan mudah.
        </p>
        <div className="pt-4 border-t border-white/15 flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">POS {storeName}</p>
            <p className="text-xs text-neutral-400">Dashboard Manajemen Toko Sembako</p>
          </div>
          <span className="text-[10px] bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-neutral-200 font-mono">
            v1.0.0
          </span>
        </div>
      </div>
    </div>
  );
}
