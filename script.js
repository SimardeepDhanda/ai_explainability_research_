// The graph data
const graphs = [
    { name: 'Beeswarm Plot', file: 'images/beeswarm.png' },
    { name: 'Contour Plot (Prediction Density)', file: 'images/contour_plot_prediction_density.png' },
    { name: 'Color-Coded Confidence', file: 'images/coour-coded-confidence.png' },
    { name: 'Error Bars', file: 'images/error_bars.png' },
    { name: 'Gradient Density Interval', file: 'images/gradient_density_interval.png' },
    { name: 'Scatter Rug Plot', file: 'images/scatter_rug_plot.png' },
    { name: 'Violin Style Distribution', file: 'images/violin_style_distribution.png' },
    { name: 'HOP Graph', file: 'images/hop.gif' }

];

//predetermined questions for the study
const predeterminedQuestions = [
    "question 1",
    "question 2",
    "question 3"
];

// State
let currentGraph = null;
let responses = {
    graphName: '',
    answers: {},
    ease: '',
    confidence: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    selectRandomGraph();
    setupRatingButtons();
    setupFormSubmit();
});

function selectRandomGraph() {
    const randomIndex = Math.floor(Math.random() * graphs.length);
    currentGraph = graphs[randomIndex];
    
    document.getElementById('graphImage').src = currentGraph.file;
    document.getElementById('graphTitle').textContent = currentGraph.name;
    
    responses.graphName = currentGraph.name;

    setupQuestions();
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
    //ease of understanding
    document.querySelectorAll('#easeGroup .rating-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('#easeGroup .rating-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            responses.ease = this.dataset.value;
            document.getElementById('easeRating').value = this.dataset.value;
        });
    });

    // Confidence
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
        
        //collect text answers
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

    // Check all text answers are provided
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
        const response = await fetch('/api/submit', {
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
    
    //disable submit button
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').textContent = 'Submitted';
    
    const downloadSection = document.getElementById('downloadSection');
    if (downloadSection) {
        downloadSection.style.display = 'block';
    }
}
