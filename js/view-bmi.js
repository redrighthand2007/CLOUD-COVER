window.ViewBmi = {
    render: () => {
        return ` 
<main style="padding-top: 100px; padding-bottom: 60px;">
        <div class="container" style="display: flex; gap: 40px; flex-wrap: wrap; justify-content: center;">
            
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
            <div id="bmiResults" class="card glass-panel" style="flex: 1; min-width: 300px; max-width: 400px; display: none; text-align: center;">
                <h3 style="margin-bottom: 24px;">Health Status</h3>
                
                <div style="position: relative; width: 150px; height: 150px; margin: 0 auto 20px;">
                    <!-- SVG Gauge Background -->
                    <svg width="150" height="150" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-elevated)" stroke-width="10"/>
                        <circle id="gaugeCircle" cx="50" cy="50" r="45" fill="none" stroke="var(--primary-color)" stroke-width="10" stroke-linecap="round" class="gauge-progress"/>
                    </svg>
                    <!-- Center Text -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <span id="bmiValueDisplay" style="font-size: 2.5rem; font-weight: 800; line-height: 1; font-family: 'Outfit';">0</span>
                    </div>
                </div>

                <h4 id="bmiCategoryDisplay" style="font-size: 1.5rem; margin-bottom: 8px;">--</h4>
                <p id="bmiAdviceDisplay" style="color: var(--text-muted); font-size: 0.9rem;">
                    A healthy BMI indicates standard premium rates.
                </p>
                
                <a href="#quotes" class="btn btn-outline" style="margin-top: 24px; width: 100%;">Check Impact on Premiums</a>
            </div>

        </div>
    </main>
        `;
    },
    init: () => {

    const form = document.getElementById('bmiForm');
    const resultsContainer = document.getElementById('bmiResults');
    const resultValue = document.getElementById('bmiValueDisplay');
    const resultCategory = document.getElementById('bmiCategoryDisplay');
    const resultAdvice = document.getElementById('bmiAdviceDisplay');
    
    // SVG Elements
    const gaugeCircle = document.getElementById('gaugeCircle');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const weight = parseFloat(document.getElementById('weight').value);
            const heightCm = parseFloat(document.getElementById('height').value);
            const heightM = heightCm / 100;
            
            const bmi = (weight / (heightM * heightM)).toFixed(1);
            
            let category, color, offset;
            
            // Circumference of a circle with r=45 is 2 * pi * 45 ≈ 283
            // Max offset = 283 (empty), Min offset = 0 (full)
            if (bmi < 18.5) {
                category = 'Underweight';
                color = '#F6C343'; // Yellow/Gold
                offset = 283 - (283 * 0.25);
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                category = 'Normal Weight';
                color = '#4dbfa8'; // Teal
                offset = 283 - (283 * 0.5);
            } else if (bmi >= 25 && bmi <= 29.9) {
                category = 'Overweight';
                color = '#f97316'; // Orange
                offset = 283 - (283 * 0.75);
            } else {
                category = 'Obese';
                color = '#ef4444'; // Red
                offset = 0; // 100% full
            }
            
            // Update UI
            resultValue.textContent = bmi;
            resultValue.style.color = color;
            resultCategory.textContent = category;
            
            // Update SVG Gauge
            gaugeCircle.style.stroke = color;
            gaugeCircle.style.setProperty('--target-offset', offset);
            
            // Re-trigger animation
            gaugeCircle.classList.remove('gauge-progress');
            void gaugeCircle.offsetWidth; // trigger reflow
            gaugeCircle.classList.add('gauge-progress');
            
            resultsContainer.style.display = 'block';
            resultsContainer.classList.add('animate-fade-up');
        });
    }

    }
};
