// Esto es unba ruta dinamica
/* 
GET recibe un segundo parámetro con el id de la URL, 
y la consulta usa .eq() + .single() en vez de traer todo:
*/

import { supabase } from "@/lib/supabaseClient";
import { Album } from "@/types/Album";
import { NextResponse } from "next/server";

// En estos caso primero se debe hacer:
export async function GET(request: Request, { params }: { params : Promise<{id: string}> }) {
    const { id } = await params

    const { data, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .eq('id', id)
    .single()
    .returns<Album>();

    if (error) {
        return NextResponse.json({message: error.message}, { status: 500 } )
    }

    return NextResponse.json(data)
}