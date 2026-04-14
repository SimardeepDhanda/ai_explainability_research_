const { supabaseRequest } = require('./_lib/supabase');

function sendJson(res, statusCode, payload) {
    res.status(statusCode).json(payload);
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { error: 'Method not allowed.' });
    }

    try {
        const data = req.body || {};
        const answers = data.answers || {};

        await supabaseRequest('responses', {
            method: 'POST',
            body: {
                timestamp: new Date().toISOString(),
                graph_name: data.graphName || '',
                q1: answers.q0 || '',
                q2: answers.q1 || '',
                q3: answers.q2 || '',
                ease: data.ease || '',
                confidence: data.confidence || ''
            }
        });

        return sendJson(res, 200, { status: 'success' });
    } catch (error) {
        return sendJson(res, 500, { error: error.message || 'Unable to save response.' });
    }
};
