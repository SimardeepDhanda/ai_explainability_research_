from flask import Flask, send_from_directory, request, jsonify, render_template_string
import sqlite3
import os
from datetime import datetime, timezone

app = Flask(__name__, static_folder='.')

DB_PATH = os.environ.get('DB_PATH', 'responses.db')
VIEW_PASSWORD = os.environ.get('VIEW_PASSWORD', 'research2024')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        # Legacy table kept for any existing data
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
        # New flexible per-task table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS task_responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                timestamp TEXT,
                task_index INTEGER,
                task_type TEXT,
                graph_name TEXT,
                answer TEXT,
                ease TEXT,
                confidence TEXT
            )
        ''')

init_db()

#static files

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

#API

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute('''
            INSERT INTO task_responses
                (session_id, timestamp, task_index, task_type, graph_name, answer, ease, confidence)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('sessionId', ''),
            now,
            data.get('taskIndex', 0),
            data.get('taskType', ''),
            data.get('graphName', ''),
            data.get('answer', ''),
            data.get('ease', ''),
            data.get('confidence', ''),
        ))
    return jsonify({'status': 'success'})

#Responses viewer 

RESPONSES_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Study Responses</title>
    <style>
        body { font-family: sans-serif; padding: 2rem; }
        table { border-collapse: collapse; width: 100%; font-size: 0.82rem; }
        th, td { border: 1px solid #ccc; padding: 7px 10px; text-align: left; vertical-align: top; }
        th { background: #f0f0f0; white-space: nowrap; }
        tr:nth-child(even) { background: #fafafa; }
        h1 { margin-bottom: 0.5rem; }
        .count { color: #555; margin-bottom: 1rem; }
        .badge { display: inline-block; border-radius: 4px; padding: 1px 7px; font-size: 0.75rem; font-weight: 600; }
        .badge-comprehension { background: #dbeafe; color: #1e3a8a; }
        .badge-comparison    { background: #fef3c7; color: #78350f; }
        .badge-ranking       { background: #d1fae5; color: #064e3b; }
        .session-id { font-family: monospace; font-size: 0.75rem; color: #888; }
        .answer-cell { max-width: 340px; word-break: break-word; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>Study Responses</h1>
    <p class="count">Total task responses: {{ rows|length }}</p>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Session</th>
                <th>Timestamp</th>
                <th>Task #</th>
                <th>Type</th>
                <th>Graph</th>
                <th>Answer</th>
                <th>Ease</th>
                <th>Confidence</th>
            </tr>
        </thead>
        <tbody>
            {% for row in rows %}
            <tr>
                <td>{{ row['id'] }}</td>
                <td><span class="session-id">{{ row['session_id'][:8] if row['session_id'] else '—' }}</span></td>
                <td>{{ row['timestamp'][:19].replace('T', ' ') }}</td>
                <td style="text-align:center">{{ row['task_index'] + 1 }}</td>
                <td><span class="badge badge-{{ row['task_type'] }}">{{ row['task_type'] }}</span></td>
                <td>{{ row['graph_name'] }}</td>
                <td class="answer-cell">{{ row['answer'] }}</td>
                <td style="text-align:center">{{ row['ease'] }}</td>
                <td style="text-align:center">{{ row['confidence'] }}</td>
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
        rows = conn.execute(
            '''SELECT id, session_id, timestamp, task_index, task_type,
                      graph_name, answer, ease, confidence
               FROM task_responses ORDER BY id DESC'''
        ).fetchall()
    return render_template_string(RESPONSES_TEMPLATE, rows=rows)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
