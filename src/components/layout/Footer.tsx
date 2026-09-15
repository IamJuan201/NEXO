import { FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-slate-300 py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-center">

        <p className="text-sm text-zinc-400 font-light">
          &copy; Todos los derechos reservados.
        </p>

        <div className="flex items-center justify-center gap-6 mt-1">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-slate-400 hover:text-pink-500 transition-colors duration-200 cursor-pointer"
          >
            <FaInstagram />
          </a>

          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <FaTiktok />
          </a>

          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-slate-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
          >
            <FaYoutube />
          </a>
        </div>

      </div>
    </footer>
  );
}
