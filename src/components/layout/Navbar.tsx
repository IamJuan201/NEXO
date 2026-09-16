import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800/60 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-[#D4AF37] hover:text-[#F3F5A8] transition-colors duration-200 cursor-pointer">
          MJ Music
        </Link>
        <img src="/icon.svg" className="w-6 h-6 object-contain cursor-pointer" alt="MJ Icon" />

        <div className="flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-neutral-50 transition-colors hover:transition-transform duration-100 ease-in-out hover:scale-120">
            Inicio
          </Link>
          <Link href="/albums" className="hover:text-neutral-50 transition-colors hover:transition-transform duration-100 ease-in-out hover:scale-120">
            Álbumes
          </Link>
          <Link href="/historia" className="hover:text-neutral-50 transition-colors hover:transition-transform duration-100 ease-in-out hover:scale-120">
            Historia
          </Link>
        </div>

      </div>
    </nav>
  );
}
