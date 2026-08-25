window.ViewBmi = {
    render: () => {
        return ` 
<main style="padding-top: 80px; padding-bottom: 60px; display: flex; align-items: center; justify-content: center; width: 100%;">
        <div class="container" style="display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; width: 100%;">
            
            <!-- Left Side: Form -->
            <div class="card animate-fade-up" style="flex: 1; min-width: 300px; max-width: 400px;">
                <h2 style="margin-bottom: 24px;">Check Your BMI</h2>
                <form id="bmiForm">
                    <div class="form-group">
                        <label class="form-label">Weight (kg)</label>
                        <input type="number" id="weight" class="form-input" required min="20" max="300" step="0.1" placeholder="e.g. 70">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Height (cm)</label>
                        <input type="number" id="height" class="form-input" required min="50" max="250" placeholder="e.g. 175">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Calculate BMI</button>
                </form>
            </div>

            <!-- Right Side: SVG Gauge Results -->
            <div class="card glass-panel animate-fade-up delay-200" style="flex: 1; min-width: 300px; max-width: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <h3 style="margin-bottom: 20px;">Your Result</h3>
                
                <!-- SVG Gauge -->
                <div style="position: relative; width: 200px; height: 100px; margin-bottom: 20px;">
                    <!-- Background Arc -->
                    <svg viewBox="0 0 200 100" style="width: 100%; height: 100%;">
                        <path d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="var(--border-color)" stroke-width="20" stroke-linecap="round"/>
                        <!-- Foreground Arc (will be updated via JS) -->
                        <path id="gaugeArc" d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="var(--primary-color)" stroke-width="20" stroke-linecap="round" stroke-dasharray="250" stroke-dashoffset="250" style="transition: stroke-dashoffset 1s ease-out, stroke 0.5s ease;"/>
                    </svg>
                    <div id="bmiValueDisplay" style="position: absolute; bottom: 0; left: 0; width: 100%; text-align: center; font-size: 2.5rem; font-weight: 800; font-family: 'Outfit';">--</div>
                </div>

                <h4 id="bmiCategory" style="font-size: 1.2rem; margin-bottom: 10px; color: var(--text-muted);">Awaiting Input</h4>
                <p id="bmiAdvice" style="font-size: 0.9rem; color: var(--text-muted);">Enter your height and weight to see how your BMI affects your insurance premium.</p>
                
                <a href="#quotes" class="btn btn-outline" style="margin-top: 20px; display: none;" id="toQuotesBtn">Get Premium Quote</a>
            </div>

        </div>
    </main>
        `;
    },
    init: () => {
        const form = document.getElementById('bmiForm');
        const gaugeArc = document.getElementById('gaugeArc');
        const valueDisplay = document.getElementById('bmiValueDisplay');
        const categoryDisplay = document.getElementById('bmiCategory');
        const adviceDisplay = document.getElementById('bmiAdvice');
        const toQuotesBtn = document.getElementById('toQuotesBtn');

        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const w = parseFloat(document.getElementById('weight').value);
                const h = parseFloat(document.getElementById('height').value) / 100; // cm to m
                
                const bmi = (w / (h * h)).toFixed(1);
                valueDisplay.innerText = bmi;

                let category = "";
                let color = "";
                let advice = "";
                let percentage = 0; // 0 to 100 for gauge

                if (bmi < 18.5) {
                    category = "Underweight";
                    color = "#f6ad55"; // orange
                    percentage = 20;
                    advice = "You might face slightly higher premiums due to underweight health risks.";
                } else if (bmi >= 18.5 && bmi < 25) {
                    category = "Normal";
                    color = "#4dbfa8"; // teal (primary)
                    percentage = 50;
                    advice = "Great! You fall in the standard risk pool and qualify for the best premium rates.";
                } else if (bmi >= 25 && bmi < 30) {
                    category = "Overweight";
                    color = "#f6ad55"; // orange
                    percentage = 75;
                    advice = "You might face a minor bump in premiums depending on the insurer.";
                } else {
                    category = "Obese";
                    color = "#fc8181"; // red
                    percentage = 95;
                    advice = "Higher BMI often leads to increased premiums due to associated health risks.";
                }

                categoryDisplay.innerText = category;
                categoryDisplay.style.color = color;
                adviceDisplay.innerText = advice;
                toQuotesBtn.style.display = 'inline-block';

                // Update Gauge (Arc length is roughly 220)
                // stroke-dasharray is 250. offset 250 is empty. offset 30 is full.
                const offset = 250 - (220 * (percentage / 100));
                gaugeArc.style.strokeDashoffset = offset;
                gaugeArc.style.stroke = color;
            });
        }
    }
};
