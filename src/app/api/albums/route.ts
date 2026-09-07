import { supabase } from "@/lib/supabaseClient";
import { Album } from "@/types/Album";
import { NextResponse } from "next/server";

export async function GET() { // De albums selecionalos todos
    const { data, error } = await supabase
    .from('albums')
    .select('*')
    .returns<Album[]>(); // Para el tipo de dato que devolvera, un array q trae todos los albums

    // si hay un error haz esto:
    if(error) { // Muestra el mensaje de error con que el problema es del server
        return NextResponse.json({ message: error.message}, { status: 500 })
    }

    // Sino solo retorna los albums
    return NextResponse.json(data);
}