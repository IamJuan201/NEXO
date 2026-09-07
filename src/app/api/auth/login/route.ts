import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({email, password});

    if (error) {    // Para auth coloque un error 401 (no autorizado), que un 500 xq el usuario esta intentando iniciar session
        return NextResponse.json({message: error.message}, { status: 401 })
    }

    return NextResponse.json({
        user: data.user,
        session: data.session
    });
}
