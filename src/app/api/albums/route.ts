import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

console.log('valor de la URL:', JSON.stringify(process.env.SUPABASE_URL));

export async function GET() { // De albums selecionalos todos
    const { data, error } = await supabase.from('albums').select('*');

    // si hay un error haz esto:
    if(error) { // Muestra el mensaje de error con que el problema es del server
        return NextResponse.json({ message: error.message}, { status: 500 })
    }

    // Sino solo retorna los albums
    return NextResponse.json(data);
}