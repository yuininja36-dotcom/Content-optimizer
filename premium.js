// Premium Features for Content Optimizer
// These features will be unlocked with paid subscriptions

class PremiumFeatures {
    constructor() {
        this.isPro = false;
        this.userPlan = 'free';
        this.articleCount = 0;
        this.maxFreeArticles = 5;
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
