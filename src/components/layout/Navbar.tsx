import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800/60 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        <Link href="/" className="text-xl font-bold tracking-wider text-[#D4AF37] hover:text-[#F3E5AB] transition-colors duration-200 cursor-pointer select-none">
          MJ Music
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-neutral-50 transition-colors duration-200">
            Inicio
          </Link>
          <Link href="/albums" className="hover:text-neutral-50 transition-colors duration-200">
            Álbumes
          </Link>
          <Link href="/historia" className="hover:text-neutral-50 transition-colors duration-200">
            Historia
          </Link>
        </div>

      </div>
    </nav>
  );
}
