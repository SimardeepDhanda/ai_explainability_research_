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

import json as _json
from collections import OrderedDict as _OD

RESPONSES_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Study Responses</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
       background: #f1f5f9; padding: 2rem; color: #1e293b; }
h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
.meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }

/* participant card */
.participant { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0;
               margin-bottom: 2rem; overflow: hidden; }
.p-header { background: #1e3a8a; color: #fff; padding: 0.75rem 1.25rem;
            display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.p-header .sid { font-family: monospace; font-size: 0.85rem; opacity: 0.8; }
.p-header .gtype { background: rgba(255,255,255,0.2); border-radius: 999px;
                   padding: 2px 12px; font-size: 0.8rem; font-weight: 600; }
.p-header .ts { font-size: 0.8rem; opacity: 0.7; margin-left: auto; }

.p-body { padding: 1.25rem; }

/* tasks table */
.section-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
                 letter-spacing: 0.08em; color: #64748b; margin-bottom: 0.5rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-bottom: 1.25rem; }
th { background: #f8fafc; color: #475569; font-weight: 600; font-size: 0.75rem;
     text-transform: uppercase; letter-spacing: 0.05em; padding: 7px 12px;
     border-bottom: 2px solid #e2e8f0; text-align: left; white-space: nowrap; }
td { padding: 7px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8fafc; }
.ds-badge { display: inline-block; background: #dbeafe; color: #1e40af;
            border-radius: 4px; padding: 1px 8px; font-weight: 600; font-size: 0.78rem; }
.decision { display: inline-block; border-radius: 4px; padding: 1px 8px;
            font-size: 0.78rem; font-weight: 600; }
.decision-yes  { background: #dcfce7; color: #166534; }
.decision-no   { background: #fee2e2; color: #991b1b; }
.decision-ns   { background: #fef9c3; color: #854d0e; }
.conf-bar-wrap { display: flex; align-items: center; gap: 8px; }
.conf-bar { height: 6px; border-radius: 3px; background: #bfdbfe; position: relative; width: 80px; }
.conf-fill { height: 6px; border-radius: 3px; background: #2563eb; }
.conf-val { font-size: 0.78rem; color: #334155; min-width: 28px; }

/* questionnaire */
.q-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
.q-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.6rem 0.85rem; }
.q-item .q-label { font-size: 0.7rem; font-weight: 700; color: #64748b;
                   text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
.q-item .q-val { font-size: 0.88rem; font-weight: 600; color: #1e293b; }

.incomplete { color: #94a3b8; font-style: italic; font-size: 0.82rem; }
.no-data { color: #94a3b8; text-align: center; padding: 2rem; }
</style>
</head>
<body>
<h1>Study Responses</h1>
<p class="meta">{{ sessions|length }} participant(s) &nbsp;·&nbsp; {{ total }} total records</p>

{% if not sessions %}
  <p class="no-data">No responses yet.</p>
{% endif %}

{% for s in sessions %}
<div class="participant">
  <div class="p-header">
    <span class="sid">{{ s.session_id }}</span>
    <span class="gtype">{{ s.graph_type }}</span>
    <span class="ts">{{ s.started_at }}</span>
  </div>
  <div class="p-body">

    <!-- Task responses -->
    <div class="section-label">Task Responses ({{ s.tasks|length }} / 12)</div>
    {% if s.tasks %}
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Dataset</th>
          <th>Q1 — Price Range</th>
          <th>Q2 — Confidence</th>
          <th>Q3 — Listing Decision</th>
        </tr>
      </thead>
      <tbody>
      {% for t in s.tasks %}
        <tr>
          <td style="color:#94a3b8;font-size:0.75rem">{{ loop.index }}</td>
          <td><span class="ds-badge">{{ t.dataset }}</span></td>
          <td>
            {% if t.lower and t.upper %}
              ${{ "{:,}".format(t.lower) }} &ndash; ${{ "{:,}".format(t.upper) }}
            {% else %}<span class="incomplete">—</span>{% endif %}
          </td>
          <td>
            {% if t.confidence is not none %}
            <div class="conf-bar-wrap">
              <div class="conf-bar"><div class="conf-fill" style="width:{{ t.confidence }}%"></div></div>
              <span class="conf-val">{{ t.confidence }}%</span>
            </div>
            {% else %}<span class="incomplete">—</span>{% endif %}
          </td>
          <td>
            {% if t.decision %}
              {% if 'yes' in t.decision.lower() or 'list' in t.decision.lower() %}
                <span class="decision decision-yes">{{ t.decision }}</span>
              {% elif 'no' in t.decision.lower() or 'off' in t.decision.lower() %}
                <span class="decision decision-no">{{ t.decision }}</span>
              {% else %}
                <span class="decision decision-ns">{{ t.decision }}</span>
              {% endif %}
            {% else %}<span class="incomplete">—</span>{% endif %}
          </td>
        </tr>
      {% endfor %}
      </tbody>
    </table>
    {% else %}
      <p class="incomplete" style="margin-bottom:1rem">No task responses recorded.</p>
    {% endif %}

    <!-- Questionnaire -->
    <div class="section-label">End-of-Survey Questionnaire</div>
    {% if s.questionnaire %}
    <div class="q-grid">
      <div class="q-item">
        <div class="q-label">Q1 — Highest value</div>
        <div class="q-val">{{ s.questionnaire.get('q1', '—') }}</div>
      </div>
      <div class="q-item">
        <div class="q-label">Q2 — Lowest value</div>
        <div class="q-val">{{ s.questionnaire.get('q2', '—') }}</div>
      </div>
      <div class="q-item">
        <div class="q-label">Q3 — Read data point</div>
        <div class="q-val">{{ s.questionnaire.get('q3', '—') }}</div>
      </div>
      <div class="q-item">
        <div class="q-label">Q4 — Confidence interval</div>
        <div class="q-val">{{ s.questionnaire.get('q4', '—') }}</div>
      </div>
      <div class="q-item">
        <div class="q-label">Q5 — AI tool usage</div>
        <div class="q-val">{{ s.questionnaire.get('q5', '—') }}</div>
      </div>
    </div>
    {% else %}
      <p class="incomplete">Questionnaire not yet completed.</p>
    {% endif %}

  </div>
</div>
{% endfor %}
</body>
</html>
'''

def _build_sessions(rows):
    """Group flat DB rows into per-session dicts for the template."""
    buckets = _OD()
    for r in rows:
        sid = r['session_id'] or 'unknown'
        if sid not in buckets:
            buckets[sid] = {'tasks': [], 'questionnaire': None,
                            'started_at': r['timestamp'][:19].replace('T', ' '),
                            'graph_type': ''}
        b = buckets[sid]

        if r['task_type'] == 'questionnaire':
            try:
                b['questionnaire'] = _json.loads(r['answer'])
            except Exception:
                b['questionnaire'] = {}
        else:
            # derive graph type from graph_name e.g. "Error Bars — Dataset 3"
            gname = r['graph_name'] or ''
            gt = gname.split('—')[0].strip() if '—' in gname else gname
            if gt and not b['graph_type']:
                b['graph_type'] = gt

            # parse dataset number from graph_name
            dataset = ''
            if '—' in gname:
                parts = gname.split('—')
                dataset = parts[-1].strip().replace('Dataset ', '')

            # parse answer JSON
            try:
                ans = _json.loads(r['answer'])
            except Exception:
                ans = {}

            lower = ans.get('lower')
            upper = ans.get('upper')
            decision = ans.get('listingDecision', '')

            try:
                conf = int(float(r['confidence'])) if r['confidence'] else None
            except Exception:
                conf = None

            b['tasks'].append({
                'dataset':    dataset or str(r['task_index'] + 1),
                'lower':      int(lower) if lower is not None else None,
                'upper':      int(upper) if upper is not None else None,
                'confidence': conf,
                'decision':   decision,
            })

    # sort tasks within each session by the order they were submitted
    result = []
    for sid, b in buckets.items():
        result.append({
            'session_id':   sid,
            'started_at':   b['started_at'],
            'graph_type':   b['graph_type'] or 'Unknown graph',
            'tasks':        b['tasks'],
            'questionnaire': b['questionnaire'],
        })
    return result


@app.route('/responses')
def view_responses():
    password = request.args.get('password', '')
    if password != VIEW_PASSWORD:
        return 'Access denied. Add ?password=your_password to the URL.', 403
    with get_db() as conn:
        rows = conn.execute(
            '''SELECT id, session_id, timestamp, task_index, task_type,
                      graph_name, answer, ease, confidence
               FROM task_responses ORDER BY id ASC'''
        ).fetchall()
    sessions = _build_sessions(rows)
    # newest participant first
    sessions.reverse()
    return render_template_string(RESPONSES_TEMPLATE, sessions=sessions, total=len(rows))

if __name__ == '__main__':
    app.run(debug=True, port=8080)
