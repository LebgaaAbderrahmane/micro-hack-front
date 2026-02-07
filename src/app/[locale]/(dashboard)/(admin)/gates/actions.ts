"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getGates() {
    const supabase = await createClient();
    const { data, error, count } = await supabase
        .from('gates')
        .select('*, port:ports(*)', { count: 'exact' });

    console.log(`[getGates Action] Database returned ${data?.length || 0} rows. Total count match: ${count}`);

    if (error) {
        console.error("[getGates Action] Error:", error);
        return { data: [], error };
    }
    return { data: data || [], error: null };
}

export async function addGate(formData: FormData) {
    const supabase = await createClient();

    const gate_number = formData.get("gateVolume") as string;
    const capacity = parseInt(formData.get("capacity") as string) || 0;
    const port_id = formData.get("port_id") as string || "PORT_001";

    const { data, error } = await supabase
        .from('gates')
        .insert({
            gate_number,
            port_id,
            physical_capacity: capacity,
            gate_status: 'OPERATIONAL'
        })
        .select()
        .single();

    if (error) {
        console.error("[addGate Action] Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/manage");
    return { data, error: null };
}
