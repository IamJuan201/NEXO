import { supabase } from "@/lib/supabaseClient";
import { History } from "@/types/History";
import { NextResponse } from "next/server";


export async function GET() {
    const { data, error } = await supabase
    .from('history_events')
    .select('*')
    .returns<History[]>();

    if (error) {
        return  NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data);

}