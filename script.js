// ----------------------------------------------------------------
// Study configuration
// ----------------------------------------------------------------

const QUESTION_TEXT = 'Based on the beeswarm plot, what is your best estimate of the predicted sale price for House 3? How certain does the model appear to be about this prediction?';

const TASK_CONTEXT = 'A machine learning model predicts the sale price of houses based on their features. Each dot in the beeswarm plot represents one sampled outcome from the model\'s prediction distribution for a given house.';

// 8 datasets, shuffled fresh each page load
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const TASKS = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8]).map(ds => ({
    graph:   'beeswarm',
    dataset: String(ds),
}));

const GRAPH_REGISTRY = {
    beeswarm: { name: 'Beeswarm Plot', ext: 'png' },
};

const SESSION_ID = (() => {
    const key = 'studySessionId';
    let id = sessionStorage.getItem(key);
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem(key, id);
    }
    return id;
})();

// ----------------------------------------------------------------
// State
// ----------------------------------------------------------------

let phase = 'intro';         // 'intro' | 'task' | 'questionnaire' | 'complete'
let currentTaskIndex = 0;
let groundTruthShowing = false;

// ----------------------------------------------------------------
// Entry point
// ----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nextBtn').addEventListener('click', handleNext);
    renderCurrentState();
});

// ----------------------------------------------------------------
// Top-level render dispatcher
// ----------------------------------------------------------------

function renderCurrentState() {
    updateProgressBar();
    clearError();
    const container = document.getElementById('mainContainer');

    if (phase === 'intro')          renderIntro(container);
    else if (phase === 'task')      renderTask(container, TASKS[currentTaskIndex]);
    else if (phase === 'questionnaire') renderQuestionnaire(container);
    else if (phase === 'complete')  renderComplete(container);
}

function updateProgressBar() {
    const fill   = document.getElementById('progressFill');
    const label  = document.getElementById('progressLabel');
    const btn    = document.getElementById('nextBtn');

    btn.disabled    = false;
    btn.style.display = '';

    if (phase === 'intro') {
        fill.style.width    = '0%';
        label.textContent   = 'Introduction';
        btn.textContent     = 'Begin Study ›';
    } else if (phase === 'task') {
        const pct           = Math.round((currentTaskIndex / TASKS.length) * 100);
        fill.style.width    = pct + '%';
        label.textContent   = `Task ${currentTaskIndex + 1} of ${TASKS.length}`;
        btn.textContent     = groundTruthShowing ? 'Next Task ›' : 'Submit';
    } else if (phase === 'questionnaire') {
        fill.style.width    = '100%';
        label.textContent   = 'Questionnaire';
        btn.textContent     = 'Continue ›';
    } else if (phase === 'complete') {
        fill.style.width    = '100%';
        label.textContent   = 'Complete';
        btn.style.display   = 'none';
    }
}

// ----------------------------------------------------------------
// Page renderers
// ----------------------------------------------------------------

function renderIntro(container) {
    container.innerHTML = `
        <div class="placeholder-page">
            <div class="placeholder-content">
                <h1>Welcome to the Study</h1>
                <p class="placeholder-body">[Instructions and study overview will go here]</p>
            </div>
        </div>
    `;
}

function renderQuestionnaire(container) {
    container.innerHTML = `
        <div class="placeholder-page">
            <div class="placeholder-content">
                <h1>Questionnaire</h1>
                <p class="placeholder-body">[Post-study questionnaire will go here]</p>
            </div>
        </div>
    `;
}

function renderComplete(container) {
    container.innerHTML = `
        <div class="placeholder-page">
            <div class="placeholder-content">
                <div class="check-icon">✓</div>
                <h1>Study Complete!</h1>
                <p class="placeholder-body">Thank you for participating. All your responses have been saved successfully.</p>
            </div>
        </div>
    `;
}

function renderTask(container, task) {
    const graphInfo = GRAPH_REGISTRY[task.graph] || { name: task.graph, ext: 'png' };
    const imageSrc  = `images/${task.graph}_d${task.dataset}.${graphInfo.ext}`;

    container.innerHTML = `
        <div class="task-layout">

            <!-- Left: graph image -->
            <div class="task-left">
                <div class="graph-panel">
                    <div class="section-title">${esc(graphInfo.name)} — Dataset ${esc(task.dataset)}</div>
                    <div class="graph-image-wrapper">
                        <img src="${imageSrc}" alt="${esc(graphInfo.name)}">
                    </div>
                </div>
            </div>

            <!-- Right: context + question + experience rating -->
            <div class="task-right">

                <div class="section-box context-box">
                    <div class="section-title">Task Description</div>
                    <div class="section-body">${esc(TASK_CONTEXT)}</div>
                </div>

                <div class="question-panel">
                    <div class="section-title">Question</div>
                    <label class="question-label" for="mainAnswer">${esc(QUESTION_TEXT)}</label>
                    <textarea class="question-textarea" id="mainAnswer" placeholder="Type your answer here..."></textarea>
                </div>

                <div class="rating-panel">
                    <div class="section-title">Rate My Experience</div>

                    <div class="slider-block-compact">
                        <label class="slider-label-compact" for="easeSlider">How easy was it to answer?</label>
                        <div class="slider-row">
                            <span class="slider-end-label">Very difficult</span>
                            <input type="range" class="slider-input" id="easeSlider" min="1" max="5" value="3">
                            <span class="slider-end-label right">Very easy</span>
                            <span class="slider-value-display" id="easeDisplay">3</span>
                        </div>
                    </div>

                    <div class="slider-block-compact">
                        <label class="slider-label-compact" for="confidenceSlider">How confident are you in your answer?</label>
                        <div class="slider-row">
                            <span class="slider-end-label">Not confident</span>
                            <input type="range" class="slider-input" id="confidenceSlider" min="1" max="5" value="3">
                            <span class="slider-end-label right">Very confident</span>
                            <span class="slider-value-display" id="confidenceDisplay">3</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.getElementById('easeSlider').addEventListener('input', function () {
        document.getElementById('easeDisplay').textContent = this.value;
    });
    document.getElementById('confidenceSlider').addEventListener('input', function () {
        document.getElementById('confidenceDisplay').textContent = this.value;
    });
}

// ----------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------

function handleNext() {
    clearError();

    if (phase === 'intro') {
        phase = 'task';
        currentTaskIndex = 0;
        groundTruthShowing = false;
        hideGtPopout();
        renderCurrentState();
        return;
    }

    if (phase === 'task') {
        if (!groundTruthShowing) {
            // Validate, save, then reveal ground truth
            const answer = (document.getElementById('mainAnswer')?.value || '').trim();
            if (!answer) {
                showError('Please answer the question before submitting.');
                return;
            }

            const ease       = document.getElementById('easeSlider').value;
            const confidence = document.getElementById('confidenceSlider').value;

            const btn = document.getElementById('nextBtn');
            btn.disabled    = true;
            btn.textContent = 'Saving…';

            saveTaskResponse(answer, ease, confidence)
                .then(() => {
                    groundTruthShowing = true;
                    showGtPopout();
                    updateProgressBar();
                })
                .catch(err => {
                    showError('Could not save response: ' + err.message + '. Please try again.');
                    btn.disabled    = false;
                    btn.textContent = 'Submit';
                });
        } else {
            // Advance to next task (or questionnaire)
            currentTaskIndex++;
            groundTruthShowing = false;
            hideGtPopout();
            phase = currentTaskIndex >= TASKS.length ? 'questionnaire' : 'task';
            renderCurrentState();
        }
        return;
    }

    if (phase === 'questionnaire') {
        phase = 'complete';
        hideGtPopout();
        renderCurrentState();
        return;
    }
}

// ----------------------------------------------------------------
// Ground truth popout
// ----------------------------------------------------------------

function showGtPopout() {
    document.getElementById('gtPopout').classList.add('visible');
}

function hideGtPopout() {
    document.getElementById('gtPopout').classList.remove('visible');
}

// ----------------------------------------------------------------
// API
// ----------------------------------------------------------------

async function saveTaskResponse(answer, ease, confidence) {
    const task      = TASKS[currentTaskIndex];
    const graphInfo = GRAPH_REGISTRY[task.graph] || {};

    const payload = {
        sessionId:  SESSION_ID,
        taskIndex:  currentTaskIndex,
        taskType:   'comprehension',
        graphName:  `${graphInfo.name || task.graph} — Dataset ${task.dataset}`,
        answer:     answer,
        ease:       ease,
        confidence: confidence,
    };

    const res = await fetch('/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showError(msg) {
    const el = document.getElementById('errorMessage');
    el.textContent  = msg;
    el.style.display = 'block';
}

function clearError() {
    const el = document.getElementById('errorMessage');
    el.style.display = 'none';
    el.textContent   = '';
}
