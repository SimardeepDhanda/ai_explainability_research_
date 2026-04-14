const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseEnv() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing Supabase environment variables.');
    }
}

async function supabaseRequest(path, { method = 'GET', body } = {}) {
    assertSupabaseEnv();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        method,
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Supabase request failed.');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

module.exports = {
    supabaseRequest
};
