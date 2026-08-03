document.addEventListener('DOMContentLoaded', () => {
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
});