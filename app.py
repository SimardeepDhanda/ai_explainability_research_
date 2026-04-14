from flask import Flask, send_from_directory, request, jsonify, render_template_string
from supabase import create_client
import os
from datetime import datetime

app = Flask(__name__, static_folder='.')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
VIEW_PASSWORD = os.environ.get('VIEW_PASSWORD', 'research2024')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Static files ---

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

# --- API ---

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    answers = data.get('answers', {})
    supabase.table('responses').insert({
        'timestamp': datetime.utcnow().isoformat(),
        'graph_name': data.get('graphName', ''),
        'q1': answers.get('q0', ''),
        'q2': answers.get('q1', ''),
        'q3': answers.get('q2', ''),
        'ease': data.get('ease', ''),
        'confidence': data.get('confidence', '')
    }).execute()
    return jsonify({'status': 'success'})

# --- Responses viewer ---

RESPONSES_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Study Responses</title>
    <style>
        body { font-family: sans-serif; padding: 2rem; }
        table { border-collapse: collapse; width: 100%; font-size: 0.85rem; }
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; vertical-align: top; }
        th { background: #f0f0f0; }
        tr:nth-child(even) { background: #fafafa; }
        h1 { margin-bottom: 0.5rem; }
        .count { color: #555; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <h1>Study Responses</h1>
    <p class="count">Total responses: {{ rows|length }}</p>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Graph</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Ease</th>
                <th>Confidence</th>
            </tr>
        </thead>
        <tbody>
            {% for row in rows %}
            <tr>
                <td>{{ row['id'] }}</td>
                <td>{{ row['timestamp'] }}</td>
                <td>{{ row['graph_name'] }}</td>
                <td>{{ row['q1'] }}</td>
                <td>{{ row['q2'] }}</td>
                <td>{{ row['q3'] }}</td>
                <td>{{ row['ease'] }}</td>
                <td>{{ row['confidence'] }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</body>
</html>
'''

@app.route('/responses')
def view_responses():
    password = request.args.get('password', '')
    if password != VIEW_PASSWORD:
        return 'Access denied. Add ?password=your_password to the URL.', 403
    rows = supabase.table('responses').select('*').order('id', desc=True).execute().data
    return render_template_string(RESPONSES_TEMPLATE, rows=rows)

if __name__ == '__main__':
    app.run(debug=True)
