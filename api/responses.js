const { supabaseRequest } = require('./_lib/supabase');

const VIEW_PASSWORD = process.env.VIEW_PASSWORD || 'research2024';

function sendJson(res, statusCode, payload) {
    res.status(statusCode).json(payload);
}

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendJson(res, 405, { error: 'Method not allowed.' });
    }

    const password = req.query.password || '';
    if (password !== VIEW_PASSWORD) {
        return sendJson(res, 403, { error: 'Access denied.' });
    }

    try {
        const rows = await supabaseRequest(
            'responses?select=*&order=id.desc'
        );
        return sendJson(res, 200, { rows: rows || [] });
    } catch (error) {
        return sendJson(res, 500, { error: error.message || 'Unable to load responses.' });
    }
};
