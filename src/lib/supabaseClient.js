
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getAdminsByCategory = async (category, currentAdminId) => {
    // In a real app, you would fetch this from your 'area_heads' or 'profiles' table
    // structured like: { id, full_name, email, category_handled }

    // Example query:
    const { data, error } = await supabase
        .from('area_heads')
        .select('*')
        .eq('category_handled', category)
        .neq('user_id', currentAdminId); // Assuming 'user_id' maps to auth.uid()

    if (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }

    return data;
};

export const transferComplaint = async (complaintId, newAdminId) => {
    const { data, error } = await supabase
        .from('complaints')
        .update({ assigned_to: newAdminId })
        .eq('id', complaintId)
        .select();

    if (error) throw error;
    return data;
};
