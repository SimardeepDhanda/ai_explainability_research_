// Graph type definitions
// Images must be named: images/<slug>_d<1-4>.<ext>
// e.g. images/beeswarm_d1.png, images/hop_d2.gif
const GRAPHS = [
    { slug: 'beeswarm',          name: 'Beeswarm Plot',                ext: 'png' },
    { slug: 'contour',           name: 'Contour Plot',                 ext: 'png' },
    { slug: 'confidence',        name: 'Color-Coded Confidence',       ext: 'png' },
    { slug: 'error_bars',        name: 'Error Bars',                   ext: 'png' },
    { slug: 'gradient_density',  name: 'Gradient Density Interval',    ext: 'png' },
    { slug: 'scatter_rug',       name: 'Scatter Rug Plot',             ext: 'png' },
    { slug: 'violin',            name: 'Violin Style Distribution',    ext: 'png' },
    { slug: 'hop',               name: 'HOP Graph',                    ext: 'gif' }
];

const DATASETS = [
    { id: '1', name: 'Dataset 1' },
    { id: '2', name: 'Dataset 2' },
    { id: '3', name: 'Dataset 3' },
    { id: '4', name: 'Dataset 4' }
];

// Predetermined questions for the study
const predeterminedQuestions = [
    "question 1",
    "question 2",
    "question 3"
];

// State
let currentGraph = null;
let currentDataset = null;
let responses = {
    graphName: '',
    answers: {},
    ease: '',
    confidence: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const params = getURLParams();
    if (!loadGraphFromParams(params)) {
        showParamError(params);
        return;
    }
    setupQuestions();
    setupRatingButtons();
    setupFormSubmit();
});

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        graph: params.get('graph'),
        dataset: params.get('dataset')
    };
}

function loadGraphFromParams(params) {
    const graph = GRAPHS.find(g => g.slug === params.graph);
    const dataset = DATASETS.find(d => d.id === params.dataset);

    if (!graph || !dataset) {
        return false;
    }

    currentGraph = graph;
    currentDataset = dataset;

    const imageFile = `images/${graph.slug}_d${dataset.id}.${graph.ext}`;
    const graphLabel = `${graph.name} — ${dataset.name}`;

    document.getElementById('graphImage').src = imageFile;
    document.getElementById('graphImage').alt = graphLabel;
    document.getElementById('graphTitle').textContent = graphLabel;

    responses.graphName = graphLabel;
    return true;
}

function showParamError(params) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="header">
            <h1>Graph Understanding Study</h1>
        </div>
        <div class="error-message" style="display:block; padding: 1.5rem;">
            <strong>Invalid or missing URL parameters.</strong><br><br>
            ${params.graph && !GRAPHS.find(g => g.slug === params.graph)
                ? `Unknown graph: <code>${params.graph}</code><br>` : ''}
            ${params.dataset && !DATASETS.find(d => d.id === params.dataset)
                ? `Unknown dataset: <code>${params.dataset}</code><br>` : ''}
            ${!params.graph || !params.dataset
                ? 'Both <code>graph</code> and <code>dataset</code> URL parameters are required.<br>' : ''}
            <br>
            <strong>Valid graph values:</strong>
            <ul style="margin:0.5rem 0 0.5rem 1.5rem">
                ${GRAPHS.map(g => `<li><code>${g.slug}</code> — ${g.name}</li>`).join('')}
            </ul>
            <strong>Valid dataset values:</strong> <code>1</code>, <code>2</code>, <code>3</code>, <code>4</code><br><br>
            <strong>Example link:</strong> <code>/?graph=beeswarm&amp;dataset=1</code>
        </div>
    `;
}

function setupQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    predeterminedQuestions.forEach((question, index) => {
        const questionId = `q${index}`;
        const block = document.createElement('div');
        block.className = 'question-block';
        block.innerHTML = `
            <label class="question-label">Q${index + 1}: ${question}</label>
            <textarea class="response-input" id="${questionId}" placeholder="Type your answer here..."></textarea>
            <input type="hidden" id="${questionId}-value" value="">
        `;
        container.appendChild(block);
        responses.answers[questionId] = '';
    });
}

function setupRatingButtons() {
    document.querySelectorAll('#easeGroup .rating-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('#easeGroup .rating-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            responses.ease = this.dataset.value;
            document.getElementById('easeRating').value = this.dataset.value;
        });
    });

    document.querySelectorAll('#confidenceGroup .rating-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('#confidenceGroup .rating-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            responses.confidence = this.dataset.value;
            document.getElementById('confidenceRating').value = this.dataset.value;
        });
    });
}

function setupFormSubmit() {
    document.getElementById('studyForm').addEventListener('submit', function(e) {
        e.preventDefault();

        Object.keys(responses.answers).forEach(key => {
            const textarea = document.getElementById(key);
            if (textarea) {
                responses.answers[key] = textarea.value;
            }
        });

        if (!validateResponses()) {
            return;
        }

        saveResponses();
    });
}

function validateResponses() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    for (let key in responses.answers) {
        if (!responses.answers[key].trim()) {
            errorMsg.textContent = 'Please answer all open-ended questions.';
            errorMsg.style.display = 'block';
            return false;
        }
    }

    if (!responses.ease) {
        errorMsg.textContent = 'Please rate how easy the graph was to understand.';
        errorMsg.style.display = 'block';
        return false;
    }

    if (!responses.confidence) {
        errorMsg.textContent = 'Please rate your confidence in your answers.';
        errorMsg.style.display = 'block';
        return false;
    }

    return true;
}

async function saveResponses() {
    const errorMsg = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responses)
        });

        if (!response.ok) {
            throw new Error('Unable to save your responses right now.');
        }

        localStorage.setItem('studyResponses', JSON.stringify(responses));
        showSuccessMessage();
    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Responses';
    }
}

function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    successMsg.textContent = '✓ Your responses have been saved successfully!';
    successMsg.style.display = 'block';

    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').textContent = 'Submitted';

    const downloadSection = document.getElementById('downloadSection');
    if (downloadSection) {
        downloadSection.style.display = 'block';
    }
}
