window.ViewContact = {
    render: () => {
        return ` 
<main style="padding-top: 100px; padding-bottom: 60px; display: flex; align-items: flex-start; justify-content: center; width: 100%;">
        <div class="container" style="display: flex; flex-wrap: wrap; gap: 40px; max-width: 1200px; width: 100%;">
            
            <!-- Left Side: Contact Info (75%) -->
            <div class="card animate-fade-up" style="flex: 3; min-width: 350px;">
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid var(--border-color); padding-bottom: 30px;">
                    <h2>Support & Contact Info</h2>
                    <p style="color: var(--text-muted); margin-top: 10px;">Reach out to our team or visit our corporate office.</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
                    <!-- Contact Info -->
                    <div>
                        <h3 style="margin-bottom: 20px;">Get in Touch</h3>
                        <div style="margin-bottom: 20px;">
                            <span style="color: var(--primary-color); font-size: 0.9rem;">Phone Support</span>
                            <p style="font-size: 1.1rem; font-weight: 500;">+91 98765 43210</p>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <span style="color: var(--primary-color); font-size: 0.9rem;">Email Address</span>
                            <p style="font-size: 1.1rem; font-weight: 500;">support@insurancecorner.com</p>
                        </div>
                    </div>

                    <!-- Firm Card -->
                    <div>
                        <h3 style="margin-bottom: 20px;">Corporate Office</h3>
                        <div style="display: flex; flex-direction: column; justify-content: center; height: 160px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: linear-gradient(145deg, var(--bg-elevated), var(--bg-base)); padding: 24px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary-color);"></div>
                            <h4 style="color: var(--text-main); font-size: 1.2rem; margin-bottom: 12px; font-weight: 600;">Insurance Corner</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.1rem;">📍</span> 123 Cloud Avenue, Tech Park
                            </p>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.1rem;">🏢</span> Mumbai, MH 400001
                            </p>
                            <p style="color: var(--text-muted); font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.1rem;">🕒</span> Mon - Fri, 9:00 AM - 6:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: FAQ Section (25%) -->
            <div class="card glass-panel animate-fade-up delay-200" style="flex: 1; min-width: 300px; height: fit-content;">
                <h2 style="margin-bottom: 24px; font-size: 1.5rem;">FAQs</h2>
                
                <div class="faq-list">
                    <div class="faq-item">
                        <div class="faq-question" style="padding: 15px; font-size: 0.95rem;">How are my premiums calculated? <span class="icon">+</span></div>
                        <div class="faq-answer" style="font-size: 0.85rem; padding: 0 15px;">Your premium is calculated instantly in your browser using an algorithm based on your age, policy type, and selected coverage amount. No data is sent to external servers during quoting.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" style="padding: 15px; font-size: 0.95rem;">Will an agent call me after checking a quote? <span class="icon">+</span></div>
                        <div class="faq-answer" style="font-size: 0.85rem; padding: 0 15px;">No! CloudCover guarantees a bias-free and spam-free experience. Since calculations are client-side, we don't store your details until you explicitly decide to register.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" style="padding: 15px; font-size: 0.95rem;">Does BMI affect my health insurance? <span class="icon">+</span></div>
                        <div class="faq-answer" style="font-size: 0.85rem; padding: 0 15px;">Yes, individuals with a normal BMI generally qualify for standard premium rates, while those in obese categories may face higher premiums depending on the insurer.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" style="padding: 15px; font-size: 0.95rem;">How will you secure my data? <span class="icon">+</span></div>
                        <div class="faq-answer" style="font-size: 0.85rem; padding: 0 15px;">We are currently migrating to AWS Cognito for enterprise-grade authentication and Multi-Factor Authentication (MFA) to ensure your data remains strictly confidential.</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
        `;
    },
    init: () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        // Reset padding for non-active items inline to match CSS overrides
                        const answer = otherItem.querySelector('.faq-answer');
                        if (answer) answer.style.paddingBottom = '0';
                    }
                });
                // Toggle current item
                const isActive = item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                if (isActive) {
                    answer.style.paddingBottom = '15px';
                } else {
                    answer.style.paddingBottom = '0';
                }
            });
        });
    }
};
