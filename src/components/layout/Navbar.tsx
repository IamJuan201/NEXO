import Link from "next/link";


export default function Navbar() {
    return (
        <nav>
            <div>MJ Music</div>
            <div>
                <Link href="/">Inicio</Link>
                <Link href="/albums">Albums</Link>
                <Link href="/historia">Historia</Link>
            </div>
        </nav>
    );
}