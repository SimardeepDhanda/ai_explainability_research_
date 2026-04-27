// ----------------------------------------------------------------
// Study configuration
// ----------------------------------------------------------------

const GRAPH_EXPLANATIONS = {
    contour:          'Nested contour rings show the most likely prediction range around the center estimate. Inner rings indicate higher density near the predicted price, while outer rings show lower probability values.',
    confidence:       'Layered shaded bands represent confidence ranges around the predicted price. Darker central zones indicate higher confidence near the estimate, while lighter outer bands show increasing uncertainty.',
    beeswarm:         'Each dot represents an individual result. Clusters of dots show where values are concentrated, while spread-out dots indicate higher variation.',
    hop:              'Connected points show changes between categories or time steps. Larger jumps between points indicate stronger differences or movement.',
    gradient_density: 'The shaded region shows the likely value range. Darker opacity indicates more probability mass near the estimate, fading outward toward the bounds.',
    scatter_rug:      'Each dot represents one simulated or observed house price. The vertical spread shows the range of possible values, while clusters of dots near the center indicate where prices are most concentrated. Rug marks highlight the distribution of individual observations.',
    violin:           'The width of the shape shows data density at each value. Wider sections mean more observations, narrower sections mean fewer observations.',
    error_bars:       'The center point shows the estimate. Horizontal bars show the uncertainty range, with longer bars indicating greater variability.',
};

// MC options for the tutorial house (interval roughly $180k – $260k)
// All options use the same rough precision so no single answer stands out
const TUTORIAL_MC = [
    { text: 'Between $130,000 and $210,000', correct: false },
    { text: 'Between $180,000 and $260,000', correct: true  },
    { text: 'Between $195,000 and $235,000', correct: false },
    { text: 'Between $245,000 and $360,000', correct: false },
];

const QUESTION_TEXT = 'question 1';

const TASK_CONTEXT = 'A machine learning model predicts the sale price of houses based on their features. Each dot in the plot represents one sampled outcome from the model\'s prediction distribution for a given house.';

const DATASET_LISTINGS = {
    tutorial: {
        location:    'Astoria, Queens, NY',
        specs:       'Floor 1 · Built 1959 · Walk-up',
        size:        '1,652 sq ft · 3 bed · 1.5 bath · 1 of 4 floors',
        features:    'Exposed brick facade. Wood-burning fireplace. Two-car private parking. Large private yard. Pets welcome.',
        askingPrice: 155000,
    },
    '1': {
        location:    'Park Slope, Brooklyn, NY',
        specs:       'Floor 3 · Built 1994 · Elevator',
        size:        '1,721 sq ft · 3 bed · 2.5 bath · 3 of 6 floors',
        features:    'Exposed brick facade. Central A/C. Private 300 sq ft deck. Two-car garage included. Updated kitchen and bathrooms.',
        askingPrice: 120000,
    },
    '2': {
        location:    'Astoria, Queens, NY',
        specs:       'Floor 2 · Built 1957 · Walk-up',
        size:        '1,105 sq ft · 3 bed · 1 bath · 2 of 4 floors',
        features:    'Stone exterior facade. One-car parking included. Hardwood floors throughout. Quiet tree-lined street. Laundry in building.',
        askingPrice: 460000,
    },
    '3': {
        location:    'Bushwick, Brooklyn, NY',
        specs:       'Floor 2 · Built 1951 · Walk-up',
        size:        '1,396 sq ft · 4 bed · 2 bath · 2 of 3 floors',
        features:    'Pre-war details throughout. Spacious layout across 1.5 levels. Window A/C units. No parking. Close to J/M subway lines.',
        askingPrice: 95000,
    },
    '4': {
        location:    'Ridgewood, Queens, NY',
        specs:       'Floor 2 · Built 1962 · Walk-up',
        size:        '1,269 sq ft · 3 bed · 1.5 bath · 2 of 4 floors',
        features:    'Classic brick exterior. One-car parking available. Spacious living areas. Close to L train. Laundry in building.',
        askingPrice: 315000,
    },
    '5': {
        location:    'Bedford-Stuyvesant, Brooklyn, NY',
        specs:       'Floor 2 · Built 1930 · Walk-up',
        size:        '1,248 sq ft · 2 bed · 1 bath · 2 of 3 floors',
        features:    'Pre-war character with original moldings. Loft-style upper half floor. No parking. High ceilings. Near A/C subway lines.',
        askingPrice: 180000,
    },
    '6': {
        location:    'Forest Hills, Queens, NY',
        specs:       'Floor 4 · Built 1997 · Elevator',
        size:        '2,098 sq ft · 4 bed · 2.5 bath · 4 of 6 floors',
        features:    'Wood-burning fireplace. Private 331 sq ft deck. Two-car garage included. Central A/C. In-unit washer/dryer.',
        askingPrice: 140000,
    },
    '7': {
        location:    'Jackson Heights, Queens, NY',
        specs:       'Floor 1 · Built 2003 · Walk-up',
        size:        '1,560 sq ft · 3 bed · 2 bath · 1 of 3 floors',
        features:    'Modern construction. Private deck and covered porch. Two-car parking included. Central A/C. Open floor plan.',
        askingPrice: 125000,
    },
    '8': {
        location:    'Prospect Heights, Brooklyn, NY',
        specs:       'Floor 2 · Built 1992 · Walk-up',
        size:        '1,575 sq ft · 2 bed · 2 bath · 2 of 4 floors',
        features:    'Spacious open layout. Two-car parking included. En-suite baths in both bedrooms. Central A/C. Near Grand Army Plaza.',
        askingPrice: 330000,
    },
    '9': {
        location:    'Upper East Side, Manhattan, NY',
        specs:       'Floor 5 · Built 2003 · Elevator',
        size:        '2,400 sq ft · 4 bed · 3.5 bath · 5 of 8 floors',
        features:    'Stone facade. Gas fireplace. Three-car private garage. Central A/C. Floor-to-ceiling windows. Doorman building.',
        askingPrice: 175000,
    },
    '10': {
        location:    'Maspeth, Queens, NY',
        specs:       'Floor 2 · Built 1941 · Walk-up',
        size:        '1,111 sq ft · 3 bed · 1 bath · 2 of 3 floors',
        features:    'Pre-war construction. Loft-style upper level. One-car parking included. Window A/C units. Original hardwood floors.',
        askingPrice: 195000,
    },
    '11': {
        location:    'Sunnyside, Queens, NY',
        specs:       'Floor 1 · Built 1965 · Walk-up',
        size:        '925 sq ft · 2 bed · 1 bath · 1 of 4 floors',
        features:    'Cozy layout with natural light. One-car parking included. Hardwood floors. Quiet residential block. Laundry in building.',
        askingPrice: 115000,
    },
    '12': {
        location:    'Crown Heights, Brooklyn, NY',
        specs:       'Floor 2 · Built 1978 · Walk-up',
        size:        '1,096 sq ft · 3 bed · 1 bath · 2 of 3 floors',
        features:    'Exposed brick facade. Wood-burning fireplace. Split-level layout. Two-car parking included. Near 3/4 subway lines.',
        askingPrice: 110000,
    },
};

const MODEL_INFO = 'Prediction generated by a gradient boosting model trained on 2,344 apartment sale listings. 90% prediction interval calibrated via split conformal prediction.';

// 8 datasets, shuffled fresh each page load
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const TASKS = (() => {
    const ALL_GRAPHS  = ['beeswarm', 'error_bars', 'violin', 'gradient_density', 'confidence', 'contour', 'scatter_rug', 'hop'];
    const chosenGraph = ALL_GRAPHS[Math.floor(Math.random() * ALL_GRAPHS.length)];
    return shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map(ds => ({
        graph:   chosenGraph,
        dataset: String(ds),
    }));
})();

const GRAPH_REGISTRY = {
    beeswarm:         { name: 'Beeswarm Plot',            ext: 'png' },
    error_bars:       { name: 'Error Bars',               ext: 'png' },
    violin:           { name: 'Violin Plot',              ext: 'png' },
    gradient_density: { name: 'Gradient Density',         ext: 'png' },
    confidence:       { name: 'Confidence Zones',         ext: 'png' },
    contour:          { name: 'Contour Plot',             ext: 'png' },
    scatter_rug:      { name: 'Scatter with Rug',         ext: 'png' },
    hop:              { name: 'Hypothetical Outcomes',    ext: 'png' },
};

const GROUND_TRUTHS = {
    '1':  201000,
    '2':  135000,
    '3':  115000,
    '4':  134500,
    '5':   87000,
    '6':  240000,
    '7':  201000,
    '8':  179200,
    '9':  290000,
    '10':  95000,
    '11': 117500,
    '12': 157500,
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

let phase = 'landing';       // 'landing' | 'intro' | 'task' | 'questionnaire' | 'complete'
let currentTaskIndex = 0;
let groundTruthShowing = false;
let introMCCorrect = false;
let introMCSelectedIndex = null;

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

    if (phase === 'landing')        renderLanding(container);
    else if (phase === 'intro')     renderIntro(container);
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

    if (phase === 'landing') {
        fill.style.width    = '0%';
        label.textContent   = 'Welcome';
        btn.textContent     = 'Start Tutorial ›';
    } else if (phase === 'intro') {
        fill.style.width    = '0%';
        label.textContent   = 'Tutorial';
        btn.textContent     = introMCCorrect ? 'Begin Study ›' : 'Check Answer';
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

function renderLanding(container) {
    container.innerHTML = `
        <div class="placeholder-page">
            <div class="placeholder-content">
                <h1>Welcome to the Study</h1>
            </div>
        </div>
    `;
}

function renderIntro(container) {
    const graphType = TASKS[0].graph;
    const graphInfo = GRAPH_REGISTRY[graphType] || { name: graphType, ext: 'png' };
    const imageSrc  = `images/${graphType}_tutorial.${graphInfo.ext}`;
    const explanation = GRAPH_EXPLANATIONS[graphType] || '';

    const optionsHtml = TUTORIAL_MC.map((opt, i) => `
        <div class="mc-option ${introMCSelectedIndex === i ? 'selected' : ''}" data-index="${i}">
            <span class="mc-radio"></span>
            <span class="mc-text">${esc(opt.text)}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="task-wrapper">

        ${renderListingCard(DATASET_LISTINGS['tutorial'])}

        <div class="task-layout">

            <div class="task-left">
                <div class="graph-panel">
                    <div class="section-title">${esc(graphInfo.name)} — Tutorial</div>
                    <div class="graph-image-wrapper">
                        <img src="${imageSrc}" alt="Tutorial graph">
                    </div>
                </div>
            </div>

            <div class="task-right tutorial-right">

                <div class="section-box" style="flex-shrink:0">
                    <div class="section-title">About This Study</div>
                    <div class="section-body">
                        In this study you will see predictions from a machine learning model for monthly apartment rent.
                        Each prediction has two parts — a <strong>point estimate</strong> (the model's best single guess)
                        and a <strong>90% prediction interval</strong> (the range the model considers most likely).
                        <br><br>
                        The interval is not a guarantee and only reflects the model's uncertainty.
                        A well-calibrated prediction interval means the true value falls inside the range 90% of the time.
                    </div>
                </div>

                <div class="section-box" style="flex-shrink:0">
                    <div class="section-title">How to Read This Graph</div>
                    <div class="section-body">${esc(explanation)}</div>
                </div>

                <div class="question-panel" style="flex-shrink:0">
                    <div class="section-title">Practice Question</div>
                    <label class="question-label">
                        Based on the graph, approximately where does the 90% prediction interval for House 1 lie?
                    </label>
                    <div class="mc-options" id="mcOptions">${optionsHtml}</div>
                    <div class="mc-feedback" id="mcFeedback"></div>
                </div>

            </div>
        </div>
        </div>
    `;

    document.querySelectorAll('.mc-option').forEach(el => {
        el.addEventListener('click', () => {
            if (introMCCorrect) return;
            introMCSelectedIndex = parseInt(el.dataset.index);
            document.querySelectorAll('.mc-option').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
            const fb = document.getElementById('mcFeedback');
            fb.textContent = '';
            fb.className = 'mc-feedback';
            clearError();
        });
    });
}

const QUESTIONNAIRE_ITEMS = [
    {
        id: 'q1',
        stem: 'Please rate how easy or difficult was it to',
        bold: 'determine the highest value shown in the chart.',
        options: ['1 – Very difficult', '2 – Somewhat Difficult', '3 – Neutral', '4 – Somewhat Easy', '5 – Very easy'],
    },
    {
        id: 'q2',
        stem: 'Please rate how easy or difficult was it to',
        bold: 'determine the lowest value shown in the chart.',
        options: ['1 – Very difficult', '2 – Somewhat Difficult', '3 – Neutral', '4 – Somewhat Easy', '5 – Very easy'],
    },
    {
        id: 'q3',
        stem: 'Please rate how easy or difficult was it to',
        bold: 'read the value of a data point from the chart.',
        options: ['1 – Very difficult', '2 – Somewhat Difficult', '3 – Neutral', '4 – Somewhat Easy', '5 – Very easy'],
    },
    {
        id: 'q4',
        stem: 'Please rate how easy or difficult was it to',
        bold: 'interpret what confidence interval means on the chart.',
        options: ['1 – Very difficult', '2 – Somewhat Difficult', '3 – Neutral', '4 – Somewhat Easy', '5 – Very easy'],
    },
    {
        id: 'q5',
        boldPrefix: 'How often',
        stem: 'have you used AI or machine learning tools in your daily life (e.g. recommendations, predictions)',
        options: ['1 – Never', '2 – Rarely', '3 – Sometimes', '4 – Often', '5 – Always'],
    },
];

function renderQuestionnaire(container) {
    const blocksHtml = QUESTIONNAIRE_ITEMS.map((q, qi) => {
        const stemHtml = q.boldPrefix
            ? `<strong>${esc(q.boldPrefix)}</strong> ${esc(q.stem)}`
            : `${esc(q.stem)} <strong>${esc(q.bold)}</strong>`;

        const optsHtml = q.options.map((opt, i) => `
            <div class="mc-option" data-q="${q.id}" data-value="${i + 1}">
                <span class="mc-radio"></span>
                <span class="mc-text">${esc(opt)}</span>
            </div>
        `).join('');

        return `
            <div class="q-block">
                <div class="q-stem"><span class="q-num">Q${qi + 1}.</span> ${stemHtml}</div>
                <div class="mc-options q-options">${optsHtml}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="questionnaire-page">
            <div class="questionnaire-content">
                <div class="questionnaire-heading">Post-Study Questionnaire</div>
                ${blocksHtml}
            </div>
        </div>
    `;

    document.querySelectorAll('.q-block .mc-option').forEach(el => {
        el.addEventListener('click', () => {
            const qId = el.dataset.q;
            document.querySelectorAll(`.mc-option[data-q="${qId}"]`).forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
            clearError();
        });
    });
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

function renderListingCard(listing) {
    if (!listing) return '';
    return `
        <div class="listing-card">
            <div class="listing-left">
                <div class="listing-eyebrow">Apartment Listing</div>
                <div class="listing-location">${esc(listing.location)}</div>
                <div class="listing-specs">${esc(listing.specs)}</div>
                <div class="listing-size">${esc(listing.size)}</div>
            </div>
            <div class="listing-sep"></div>
            <div class="listing-right">
                <div class="listing-features-label">Features</div>
                <div class="listing-features">${esc(listing.features)}</div>
            </div>
        </div>
    `;
}

function renderTask(container, task) {
    const graphInfo      = GRAPH_REGISTRY[task.graph] || { name: task.graph, ext: 'png' };
    const imageSrc       = `images/${task.graph}_d${task.dataset}.${graphInfo.ext}`;
    const listing        = DATASET_LISTINGS[task.dataset] || {};
    const askingFormatted = listing.askingPrice
        ? '$' + listing.askingPrice.toLocaleString('en-US')
        : '$—';

    container.innerHTML = `
        <div class="task-layout">

            <!-- Left: single card containing listing + model info + graph -->
            <div class="task-left">
                <div class="graph-panel">

                    <div class="listing-in-panel">
                        <div class="listing-left">
                            <div class="listing-eyebrow">Apartment Listing</div>
                            <div class="listing-location">${esc(listing.location || '')}</div>
                            <div class="listing-specs">${esc(listing.specs || '')}</div>
                            <div class="listing-size">${esc(listing.size || '')}</div>
                        </div>
                        <div class="listing-sep"></div>
                        <div class="listing-right">
                            <div class="listing-features-label">Features</div>
                            <div class="listing-features">${esc(listing.features || '')}</div>
                        </div>
                    </div>

                    <div class="model-info-in-panel">${esc(MODEL_INFO)}</div>

                    <div class="section-title">${esc(graphInfo.name)} — Dataset ${esc(task.dataset)}</div>
                    <div class="graph-image-wrapper">
                        <img src="${imageSrc}" alt="${esc(graphInfo.name)}">
                    </div>

                </div>
            </div>

            <!-- Right: instruction + 3 questions -->
            <div class="task-right">

                <div class="model-info-box">
                    Based on the graph shown on the left, please answer the below three questions.
                </div>

                <div class="section-box">
                    <div class="section-title">Question 1 of 3 — Interval Reading</div>
                    <p class="question-label">Based on the chart, what is the <span class="q-keyword q-low">lowest</span> and <span class="q-keyword q-high">highest</span> house price the model considers likely? Enter the values that mark the edges of the highlighted region.</p>
                    <div class="price-input-row">
                        <div class="price-input-group">
                            <div class="price-input-label">LOWEST LIKELY PRICE</div>
                            <input type="number" class="price-input" id="lowerBound" placeholder="e.g. 120000">
                        </div>
                        <div class="price-input-group">
                            <div class="price-input-label">HIGHEST LIKELY PRICE</div>
                            <input type="number" class="price-input" id="upperBound" placeholder="e.g. 180000">
                        </div>
                    </div>
                </div>

                <div class="section-box">
                    <div class="section-title">Question 2 of 3 — Confidence in Your Reading</div>
                    <p class="question-label">How confident are you that your answers accurately reflect what the chart shows? You do not need to consider whether the model is correct, only <strong>how accurately you read the chart</strong>.</p>
                    <div class="slider-row confidence-row">
                        <span class="slider-end-label">Not at all confident</span>
                        <input type="range" class="slider-input" id="confidenceSlider" min="0" max="100" value="0">
                        <span class="slider-end-label right">Completely confident</span>
                        <span class="slider-value-display" id="confidenceDisplay">0%</span>
                    </div>
                    <input type="hidden" id="confidenceTouched" value="0">
                    <div class="slider-warning" id="confidenceWarning">You must move the slider to record a response.</div>
                </div>

                <div class="question-panel">
                    <div class="section-title">Question 3 of 3 — Listing Decision</div>
                    <p class="question-label">An owner is considering listing this apartment for sale at <strong>${askingFormatted}</strong>. Based on the model's prediction, would you advise listing at this price?</p>
                    <div class="q3-options">
                        <button class="q3-option" data-value="Yes, list at ${askingFormatted}">Yes, List at ${askingFormatted}</button>
                        <button class="q3-option" data-value="No, price seems off">No, price seems off</button>
                        <button class="q3-option" data-value="Not Sure">Not Sure</button>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.querySelectorAll('.q3-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.q3-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            clearError();
        });
    });

    const confSlider  = document.getElementById('confidenceSlider');
    const confDisplay = document.getElementById('confidenceDisplay');
    const confTouched = document.getElementById('confidenceTouched');
    confSlider.addEventListener('input', function () {
        confDisplay.textContent = this.value + '%';
        if (confTouched.value === '0') {
            confTouched.value = '1';
            document.getElementById('confidenceWarning').style.display = 'none';
        }
    });
}

// ----------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------

function handleNext() {
    clearError();

    if (phase === 'landing') {
        phase = 'intro';
        renderCurrentState();
        return;
    }

    if (phase === 'intro') {
        if (!introMCCorrect) {
            // Validate MC answer
            if (introMCSelectedIndex === null) {
                showError('Please select an answer before continuing.');
                return;
            }
            if (TUTORIAL_MC[introMCSelectedIndex].correct) {
                introMCCorrect = true;
                const fb = document.getElementById('mcFeedback');
                if (fb) {
                    fb.textContent = 'Correct! Click "Begin Study" to continue.';
                    fb.className = 'mc-feedback mc-correct';
                }
                // Lock options so they can't change the answer
                document.querySelectorAll('.mc-option').forEach(o => o.style.pointerEvents = 'none');
                updateProgressBar(); // button → "Begin Study ›"
            } else {
                const fb = document.getElementById('mcFeedback');
                if (fb) {
                    fb.textContent = 'Incorrect — look at the graph again and try once more.';
                    fb.className = 'mc-feedback mc-wrong';
                }
                // Deselect so they must pick again
                introMCSelectedIndex = null;
                document.querySelectorAll('.mc-option').forEach(o => o.classList.remove('selected'));
            }
        } else {
            // Correct answer already confirmed — advance to tasks
            phase = 'task';
            currentTaskIndex = 0;
            groundTruthShowing = false;
            introMCCorrect = false;
            introMCSelectedIndex = null;
            hideGtPopout();
            renderCurrentState();
        }
        return;
    }

    if (phase === 'task') {
        if (!groundTruthShowing) {
            // Validate, save, then reveal ground truth
            const lower       = (document.getElementById('lowerBound')?.value || '').trim();
            const upper       = (document.getElementById('upperBound')?.value || '').trim();
            const confidence  = document.getElementById('confidenceSlider')?.value || '0';
            const confTouched = document.getElementById('confidenceTouched')?.value === '1';
            const q3Btn       = document.querySelector('.q3-option.selected');

            if (!lower || !upper) {
                showError('Please enter both the lowest and highest likely prices.');
                return;
            }
            const lowerNum = parseFloat(lower);
            const upperNum = parseFloat(upper);
            if (isNaN(lowerNum) || isNaN(upperNum) || lowerNum >= upperNum) {
                showError('Enter valid prices with the lowest less than the highest.');
                return;
            }
            if (!confTouched) {
                const warn = document.getElementById('confidenceWarning');
                if (warn) warn.style.display = 'block';
                showError('Please move the confidence slider before submitting.');
                return;
            }
            if (!q3Btn) {
                showError('Please select an answer for Question 3.');
                return;
            }
            const listingAns = q3Btn.dataset.value;

            const btn = document.getElementById('nextBtn');
            btn.disabled    = true;
            btn.textContent = 'Saving…';

            saveTaskResponse(lowerNum, upperNum, confidence, listingAns)
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
        const answers = {};
        for (const q of QUESTIONNAIRE_ITEMS) {
            const sel = document.querySelector(`.mc-option[data-q="${q.id}"].selected`);
            if (!sel) {
                showError('Please answer all questions before continuing.');
                return;
            }
            answers[q.id] = sel.dataset.value;
        }

        const btn = document.getElementById('nextBtn');
        btn.disabled    = true;
        btn.textContent = 'Saving…';

        saveQuestionnaireResponse(answers)
            .then(() => {
                phase = 'complete';
                hideGtPopout();
                renderCurrentState();
            })
            .catch(err => {
                showError('Could not save responses: ' + err.message + '. Please try again.');
                btn.disabled    = false;
                btn.textContent = 'Continue ›';
            });
        return;
    }
}

// ----------------------------------------------------------------
// Ground truth popout
// ----------------------------------------------------------------

function showGtPopout() {
    const task    = TASKS[currentTaskIndex];
    const dataset = task?.dataset;
    const price   = GROUND_TRUTHS[dataset];
    document.getElementById('gtDataset').textContent = dataset ? `Dataset ${dataset}` : '';
    document.getElementById('gtValue').textContent = price
        ? '$' + price.toLocaleString('en-US')
        : '—';
    document.getElementById('gtPopout').classList.add('visible');
}

function hideGtPopout() {
    document.getElementById('gtPopout').classList.remove('visible');
}

// ----------------------------------------------------------------
// API
// ----------------------------------------------------------------

async function saveTaskResponse(lowerBound, upperBound, confidence, listingDecision) {
    const task      = TASKS[currentTaskIndex];
    const graphInfo = GRAPH_REGISTRY[task.graph] || {};

    const payload = {
        sessionId:  SESSION_ID,
        taskIndex:  currentTaskIndex,
        taskType:   'comprehension',
        graphName:  `${graphInfo.name || task.graph} — Dataset ${task.dataset}`,
        answer:     JSON.stringify({ lower: lowerBound, upper: upperBound, listingDecision }),
        ease:       '',
        confidence: String(confidence),
    };

    const res = await fetch('/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
}

async function saveQuestionnaireResponse(answers) {
    const payload = {
        sessionId:  SESSION_ID,
        taskIndex:  -1,
        taskType:   'questionnaire',
        graphName:  TASKS[0]?.graph || '',
        answer:     JSON.stringify(answers),
        ease:       '',
        confidence: '',
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
