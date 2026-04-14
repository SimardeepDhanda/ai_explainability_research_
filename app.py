from flask import Flask, send_from_directory, request, jsonify, render_template_string
import sqlite3
import os
from datetime import datetime
from functools import wraps

app = Flask(__name__, static_folder='.')

DB_PATH = os.environ.get('DB_PATH', 'responses.db')
VIEW_PASSWORD = os.environ.get('VIEW_PASSWORD', 'research2024')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                graph_name TEXT,
                q1 TEXT,
                q2 TEXT,
                q3 TEXT,
                ease TEXT,
                confidence TEXT
            )
        ''')

init_db()

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
    with get_db() as conn:
        conn.execute('''
            INSERT INTO responses (timestamp, graph_name, q1, q2, q3, ease, confidence)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            datetime.utcnow().isoformat(),
            data.get('graphName', ''),
            answers.get('q0', ''),
            answers.get('q1', ''),
            answers.get('q2', ''),
            data.get('ease', ''),
            data.get('confidence', '')
        ))
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
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
        th { background: #f0f0f0; }
        tr:nth-child(even) { background: #fafafa; }
        h1 { margin-bottom: 1rem; }
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
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM responses ORDER BY id DESC').fetchall()
    return render_template_string(RESPONSES_TEMPLATE, rows=rows)

if __name__ == '__main__':
    app.run(debug=True)
