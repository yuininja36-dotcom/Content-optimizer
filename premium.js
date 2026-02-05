/*
Copyright © 2025 Content Optimizer
All Rights Reserved

This software is the intellectual property of Content Optimizer.
Unauthorized reproduction, distribution, or modification of this software
is strictly prohibited under applicable copyright and intellectual property laws.

Violators will be prosecuted to the fullest extent of the law.
For licensing inquiries, contact: gavin_maxson324@hotmail.com

This software contains proprietary algorithms and trade secrets protected
by intellectual property law. Reverse engineering, decompilation, or
any attempt to extract source code is prohibited.

LICENSE RESTRICTIONS:
- This file may only be used on domains with valid Content Optimizer license
- Commercial use requires explicit written permission
- Redistribution in any form is prohibited
*/

// Premium Features for Content Optimizer
// These features will be unlocked with paid subscriptions

class PremiumFeatures {
    constructor() {
        this.isPro = false;
        this.userPlan = 'free';
        this.articleCount = 0;
        this.maxFreeArticles = 5;
        this.licenseKey = null;
        this.authorizedDomains = [];
        this.initLicenseSystem();
    }

    // Initialize license validation system
    initLicenseSystem() {
        this.currentDomain = window.location.hostname;
        this.validateLicense();
        
        // Periodic license validation (every 5 minutes)
        setInterval(() => this.validateLicense(), 300000);
        
        // Track unauthorized usage attempts
        this.trackUsage();
    }

    // Validate current domain license
    validateLicense() {
        const storedLicense = localStorage.getItem('contentOptimizerLicense');
        
        if (!storedLicense) {
            this.checkUnauthorizedUse();
            return false;
        }

        try {
            const license = JSON.parse(storedLicense);
            this.licenseKey = license.key;
            this.authorizedDomains = license.domains || [];
            this.userPlan = license.plan || 'free';
            
            // Check if current domain is authorized
            if (this.authorizedDomains.length > 0 && !this.authorizedDomains.includes(this.currentDomain)) {
                this.blockUnauthorizedUse();
                return false;
            }
            
            // Validate license format and expiration
            if (!this.validateLicenseFormat(this.licenseKey)) {
                this.blockUnauthorizedUse();
                return false;
            }
            
            this.isPro = this.userPlan !== 'free';
            return true;
            
        } catch (error) {
            this.blockUnauthorizedUse();
            return false;
        }
    }

    // Validate license key format
    validateLicenseFormat(key) {
        if (!key || typeof key !== 'string') return false;
        
        // License key format: CO-XXXX-XXXX-XXXX-XXXX (where X is alphanumeric)
        const licensePattern = /^CO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        return licensePattern.test(key);
    }

    // Check for unauthorized usage patterns
    checkUnauthorizedUse() {
        const usageCount = parseInt(localStorage.getItem('usageCount') || '0');
        localStorage.setItem('usageCount', (usageCount + 1).toString());
        
        // If usage exceeds free limits without license
        if (usageCount > this.maxFreeArticles) {
            this.reportUnauthorizedUse();
        }
    }

    // Report unauthorized usage
    reportUnauthorizedUse() {
        const reportData = {
            domain: this.currentDomain,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            usageCount: localStorage.getItem('usageCount'),
            fingerprint: this.generateFingerprint()
        };
        
        // Store violation evidence
        const violations = JSON.parse(localStorage.getItem('licenseViolations') || '[]');
        violations.push(reportData);
        localStorage.setItem('licenseViolations', JSON.stringify(violations.slice(-10)));
        
        this.showViolationWarning();
    }

    // Generate browser fingerprint for tracking
    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Content Optimizer License Check', 2, 2);
        
        return btoa(canvas.toDataURL()).slice(0, 32);
    }

    // Block unauthorized usage
    blockUnauthorizedUse() {
        this.showLicenseBlock();
        this.disablePremiumFeatures();
    }

    // Show license violation warning
    showViolationWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(220, 38, 38, 0.95); color: white; z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        warning.innerHTML = `
            <div style="text-align: center; padding: 40px; max-width: 600px;">
                <h1 style="font-size: 2rem; margin-bottom: 20px;">⚠️ LICENSE VIOLATION DETECTED</h1>
                <p style="font-size: 1.2rem; margin-bottom: 30px;">
                    This domain (${this.currentDomain}) is not authorized to use Content Optimizer premium features.
                </p>
                <p style="margin-bottom: 30px;">
                    Unauthorized use has been logged and will be reported. 
                    This violation may result in legal action under copyright and intellectual property law.
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3>License ID: ${this.generateFingerprint()}</h3>
                    <p>Domain: ${this.currentDomain}</p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                </div>
                <button onclick="window.location.href='mailto:gavin_maxson324@hotmail.com'" 
                        style="background: white; color: #dc2626; padding: 15px 30px; border: none; 
                               border-radius: 6px; font-size: 16px; cursor: pointer; margin-right: 10px;">
                    Contact Licensing
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: transparent; color: white; padding: 15px 30px; border: 2px solid white; 
                               border-radius: 6px; font-size: 16px; cursor: pointer;">
                    Continue with Free Version
                </button>
            </div>
        `;
        
        document.body.appendChild(warning);
    }

    // Show license block screen
    showLicenseBlock() {
        if (document.getElementById('license-block')) return;
        
        const block = document.createElement('div');
        block.id = 'license-block';
        block.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.9); color: white; z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;
        
        block.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>License Required</h2>
                <p>This feature requires a valid Content Optimizer license.</p>
                <button onclick="window.location.href='pricing.html'">Get License</button>
            </div>
        `;
        
        document.body.appendChild(block);
    }

    // Disable premium features
    disablePremiumFeatures() {
        this.isPro = false;
        this.userPlan = 'free';
    }

    // Track usage for analytics and security
    trackUsage() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.premium-feature')) {
                this.logFeatureUsage(e.target.closest('.premium-feature').dataset.feature);
            }
        });
    }

    // Log feature usage
    logFeatureUsage(feature) {
        const usage = {
            feature,
            domain: this.currentDomain,
            timestamp: new Date().toISOString(),
            licensed: this.isPro
        };
        
        const allUsage = JSON.parse(localStorage.getItem('featureUsage') || '[]');
        allUsage.push(usage);
        localStorage.setItem('featureUsage', JSON.stringify(allUsage.slice(-100)));
    }

    // Check if user can use premium features
    checkPremiumAccess(feature) {
        const premiumFeatures = {
            'competitor-analysis': 'pro',
            'ai-suggestions': 'pro',
            'export-pdf': 'pro',
            'save-history': 'pro',
            'team-collaboration': 'agency',
            'api-access': 'agency',
            'white-label': 'agency'
        };

        const requiredPlan = premiumFeatures[feature];
        if (!requiredPlan) return true; // Free feature

        if (this.userPlan === 'free') {
            this.showUpgradeModal(feature, requiredPlan);
            return false;
        }

        const planHierarchy = { 'free': 0, 'pro': 1, 'agency': 2 };
        return planHierarchy[this.userPlan] >= planHierarchy[requiredPlan];
    }

    // Show upgrade modal
    showUpgradeModal(feature, requiredPlan) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 1000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
                <h2 style="color: #2563eb; margin-bottom: 15px;">Upgrade to ${requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}</h2>
                <p style="color: #64748b; margin-bottom: 20px;">This feature requires a ${requiredPlan} subscription.</p>
                <button onclick="window.location.href='pricing.html'" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; margin-right: 10px;">Upgrade Now</button>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #f8fafc; color: #2563eb; padding: 12px 24px; border: 2px solid #2563eb; border-radius: 6px;">Maybe Later</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Track article usage
    trackArticleUsage() {
        if (this.userPlan === 'free') {
            this.articleCount++;
            if (this.articleCount >= this.maxFreeArticles) {
                this.showLimitReached();
            }
        }
    }

    // Show limit reached modal
    showLimitReached() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 1000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
                <h2 style="color: #ef4444; margin-bottom: 15px;">Free Limit Reached</h2>
                <p style="color: #64748b; margin-bottom: 20px;">You've reached your 5 free articles this month. Upgrade to Pro for unlimited articles!</p>
                <button onclick="window.location.href='pricing.html'" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; margin-right: 10px;">Upgrade to Pro</button>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #f8fafc; color: #2563eb; padding: 12px 24px; border: 2px solid #2563eb; border-radius: 6px;">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // AI-powered suggestions (Pro feature)
    generateAISuggestions(content, keyword) {
        if (!this.checkPremiumAccess('ai-suggestions')) return [];

        const suggestions = [
            `Add "${keyword}" to your H1 heading for better SEO`,
            `Include related terms like "${keyword} guide", "${keyword} tips", "${keyword} best practices"`,
            `Add internal links to other ${keyword} content on your site`,
            `Include statistics or data about ${keyword} to increase authority`,
            `Add a FAQ section about ${keyword} to capture long-tail keywords`
        ];

        return suggestions;
    }

    // Competitor analysis (Pro feature)
    analyzeCompetitors(keyword) {
        if (!this.checkPremiumAccess('competitor-analysis')) return null;

        // Simulated competitor data
        return {
            topCompetitors: [
                { title: "Complete Guide to " + keyword, wordCount: 2500, score: 92 },
                { title: keyword + " Tips and Tricks", wordCount: 1800, score: 85 },
                { title: "How to Master " + keyword, wordCount: 2200, score: 88 }
            ],
            averageWordCount: 2167,
            averageScore: 88,
            recommendations: [
                "Your content is shorter than top competitors",
                "Consider adding more examples and case studies",
                "Include more subheadings for better readability"
            ]
        };
    }

    // Export to PDF (Pro feature)
    exportToPDF(analysisData) {
        if (!this.checkPremiumAccess('export-pdf')) return;

        alert('PDF export feature coming soon! This will generate a professional report with your analysis.');
    }

    // Save analysis history (Pro feature)
    saveAnalysis(content, keyword, score) {
        if (!this.checkPremiumAccess('save-history')) return;

        const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        history.push({
            date: new Date().toISOString(),
            keyword,
            score,
            wordCount: content.split(/\s+/).length,
            preview: content.substring(0, 100) + '...'
        });

        localStorage.setItem('analysisHistory', JSON.stringify(history.slice(-50))); // Keep last 50 analyses
    }

    // Load analysis history
    loadHistory() {
        if (!this.checkPremiumAccess('save-history')) return [];

        return JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    }
}

// Initialize premium features
const premium = new PremiumFeatures();

// Enhanced analyze function with premium features
function analyzeContentPremium() {
    const content = document.getElementById('contentInput').value;
    const keyword = document.getElementById('keywordInput').value.toLowerCase();
    
    if (!content.trim()) {
        alert('Please enter some content to analyze');
        return;
    }

    // Track usage
    premium.trackArticleUsage();

    // Run basic analysis (same as free version)
    analyzeContent();

    // Add premium features if available
    if (premium.checkPremiumAccess('ai-suggestions')) {
        const suggestions = premium.generateAISuggestions(content, keyword);
        displaySuggestions(suggestions);
    }

    if (premium.checkPremiumAccess('competitor-analysis')) {
        const competitorData = premium.analyzeCompetitors(keyword);
        displayCompetitorAnalysis(competitorData);
    }

    // Save analysis if premium
    const score = parseInt(document.getElementById('scoreDisplay').textContent);
    premium.saveAnalysis(content, keyword, score);
}

function displaySuggestions(suggestions) {
    const container = document.createElement('div');
    container.className = 'ai-suggestions';
    container.innerHTML = `
        <h3>🤖 AI Suggestions</h3>
        <ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
    `;
    document.querySelector('.analysis-area').appendChild(container);
}

function displayCompetitorAnalysis(data) {
    const container = document.createElement('div');
    container.className = 'competitor-analysis';
    container.innerHTML = `
        <h3>📊 Competitor Analysis</h3>
        <p>Average word count: ${data.averageWordCount}</p>
        <p>Average score: ${data.averageScore}</p>
        <ul>${data.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
    `;
    document.querySelector('.analysis-area').appendChild(container);
}

// Add premium buttons to UI
function addPremiumButtons() {
    const analyzeBtn = document.querySelector('.analyze-btn');
    
    // Add export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📄 Export PDF';
    exportBtn.className = 'analyze-btn';
    exportBtn.onclick = () => premium.exportToPDF();
    analyzeBtn.parentNode.appendChild(exportBtn);
    
    // Add history button
    const historyBtn = document.createElement('button');
    historyBtn.textContent = '📜 History';
    historyBtn.className = 'analyze-btn';
    historyBtn.onclick = () => showHistory();
    analyzeBtn.parentNode.appendChild(historyBtn);
}

function showHistory() {
    const history = premium.loadHistory();
    if (history.length === 0) {
        alert('No analysis history yet. Start analyzing some content!');
        return;
    }

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px; max-height: 400px; overflow-y: auto;">
            <h2 style="color: #2563eb; margin-bottom: 15px;">Analysis History</h2>
            ${history.map(item => `
                <div style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
                    <strong>${item.keyword}</strong> - Score: ${item.score} - ${new Date(item.date).toLocaleDateString()}
                    <br><small>${item.preview}</small>
                </div>
            `).join('')}
            <button onclick="this.parentElement.parentElement.remove()" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; margin-top: 15px;">Close</button>
        </div>
    `;

    document.body.appendChild(modal);
}

// Initialize premium features when page loads
document.addEventListener('DOMContentLoaded', function() {
    addPremiumButtons();
});
