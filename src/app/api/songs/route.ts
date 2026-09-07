import { supabase } from "@/lib/supabaseClient";
import { Song } from "@/types/Song";
import { NextResponse } from "next/server";


export async function GET() {
    const { data, error } = await supabase
    .from('songs')
    .select('*')
    .returns<Song[]>();

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}