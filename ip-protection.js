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
*/

// IP Protection and Tracking System
// This system monitors and tracks usage to protect intellectual property

class IPProtectionSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.fingerprint = this.generateFingerprint();
        this.licenseKey = null;
        this.isAuthorized = false;
        this.violationCount = 0;
        this.initTracking();
    }

    // Generate unique session identifier
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Generate browser fingerprint for tracking
    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Content Optimizer IP Protection', 2, 2);
        
        const fingerprintData = {
            canvas: canvas.toDataURL(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            domain: window.location.hostname
        };
        
        return btoa(JSON.stringify(fingerprintData)).slice(0, 64);
    }

    // Initialize tracking system
    initTracking() {
        this.checkLicense();
        this.monitorUsage();
        this.setupWatermarking();
        this.detectTampering();
    }

    // Check license validity
    checkLicense() {
        const storedLicense = localStorage.getItem('contentOptimizerLicense');
        
        if (storedLicense) {
            try {
                const license = JSON.parse(storedLicense);
                this.licenseKey = license.key;
                this.isAuthorized = this.validateLicense(license);
            } catch (error) {
                this.logViolation('Invalid license format');
            }
        }
        
        if (!this.isAuthorized) {
            this.trackUnauthorizedUsage();
        }
    }

    // Validate license
    validateLicense(license) {
        if (!license.key || !license.domains) return false;
        
        const currentDomain = window.location.hostname;
        const isDomainAuthorized = license.domains.includes(currentDomain);
        
        if (!isDomainAuthorized) {
            this.logViolation('Unauthorized domain usage');
            return false;
        }
        
        // Validate license key format
        const keyPattern = /^CO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!keyPattern.test(license.key)) {
            this.logViolation('Invalid license key format');
            return false;
        }
        
        return true;
    }

    // Monitor user activity
    monitorUsage() {
        // Track page views
        this.trackPageView();
        
        // Track feature usage
        document.addEventListener('click', (e) => {
            const feature = e.target.closest('[data-feature]');
            if (feature) {
                this.trackFeatureUsage(feature.dataset.feature);
            }
        });
        
        // Track copy events
        document.addEventListener('copy', (e) => {
            this.trackCopyEvent(e);
        });
        
        // Track dev tools access
        this.monitorDevTools();
    }

    // Track page view
    trackPageView() {
        const viewData = {
            type: 'page_view',
            sessionId: this.sessionId,
            fingerprint: this.fingerprint,
            domain: window.location.hostname,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            authorized: this.isAuthorized,
            licenseKey: this.licenseKey
        };
        
        this.storeTrackingData(viewData);
    }

    // Track feature usage
    trackFeatureUsage(feature) {
        const usageData = {
            type: 'feature_usage',
            sessionId: this.sessionId,
            fingerprint: this.fingerprint,
            feature: feature,
            domain: window.location.hostname,
            timestamp: new Date().toISOString(),
            authorized: this.isAuthorized
        };
        
        this.storeTrackingData(usageData);
        
        // Check if premium feature without authorization
        const premiumFeatures = ['ai-suggestions', 'competitor-analysis', 'export-pdf', 'save-history'];
        if (premiumFeatures.includes(feature) && !this.isAuthorized) {
            this.logViolation('Unauthorized premium feature access');
        }
    }

    // Track copy events
    trackCopyEvent(e) {
        const selection = window.getSelection().toString();
        if (selection.length > 50) { // Only track significant copies
            const copyData = {
                type: 'content_copy',
                sessionId: this.sessionId,
                fingerprint: this.fingerprint,
                contentLength: selection.length,
                domain: window.location.hostname,
                timestamp: new Date().toISOString(),
                authorized: this.isAuthorized
            };
            
            this.storeTrackingData(copyData);
        }
    }

    // Monitor developer tools access
    monitorDevTools() {
        let devtools = {open: false, orientation: null};
        
        const threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.logViolation('Developer tools accessed');
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // Setup watermarking system
    setupWatermarking() {
        this.injectWatermark();
        this.monitorDOMChanges();
    }

    // Inject invisible watermark
    injectWatermark() {
        const watermark = document.createElement('div');
        watermark.setAttribute('data-co-watermark', btoa(JSON.stringify({
            domain: window.location.hostname,
            timestamp: Date.now(),
            fingerprint: this.fingerprint,
            sessionId: this.sessionId,
            authorized: this.isAuthorized
        })));
        
        watermark.style.cssText = `
            position: absolute;
            visibility: hidden;
            height: 0;
            width: 0;
            overflow: hidden;
            pointer-events: none;
        `;
        
        document.body.appendChild(watermark);
    }

    // Monitor DOM changes for tampering
    monitorDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.hasAttribute('data-co-watermark')) {
                            this.logViolation('Watermark removal detected');
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Detect code tampering
    detectTampering() {
        // Check if protection scripts are still present
        const protectionScripts = ['protected-core.js', 'premium.js'];
        
        setInterval(() => {
            const scripts = Array.from(document.scripts);
            const protectionPresent = protectionScripts.every(script => 
                scripts.some(s => s.src.includes(script))
            );
            
            if (!protectionPresent) {
                this.logViolation('Protection scripts removed');
                this.blockAccess();
            }
        }, 5000);
    }

    // Track unauthorized usage
    trackUnauthorizedUsage() {
        const unauthorizedData = {
            type: 'unauthorized_usage',
            sessionId: this.sessionId,
            fingerprint: this.fingerprint,
            domain: window.location.hostname,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        this.storeTrackingData(unauthorizedData);
        this.violationCount++;
        
        if (this.violationCount > 3) {
            this.blockAccess();
        }
    }

    // Log violations
    logViolation(reason) {
        const violation = {
            type: 'violation',
            reason: reason,
            sessionId: this.sessionId,
            fingerprint: this.fingerprint,
            domain: window.location.hostname,
            timestamp: new Date().toISOString(),
            violationCount: this.violationCount + 1
        };
        
        this.storeTrackingData(violation);
        this.violationCount++;
        
        console.warn(`Content Optimizer Violation: ${reason}`);
        
        if (this.violationCount > 5) {
            this.reportViolation();
        }
    }

    // Store tracking data
    storeTrackingData(data) {
        const trackingData = JSON.parse(localStorage.getItem('coTrackingData') || '[]');
        trackingData.push(data);
        
        // Keep only last 1000 entries
        if (trackingData.length > 1000) {
            trackingData.splice(0, trackingData.length - 1000);
        }
        
        localStorage.setItem('coTrackingData', JSON.stringify(trackingData));
    }

    // Block access for violations
    blockAccess() {
        const blockScreen = document.createElement('div');
        blockScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        blockScreen.innerHTML = `
            <div style="text-align: center; padding: 40px; max-width: 600px;">
                <h1 style="color: #ef4444; margin-bottom: 20px;">🚫 ACCESS DENIED</h1>
                <p style="font-size: 1.2rem; margin-bottom: 30px;">
                    Your access to Content Optimizer has been blocked due to license violations.
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3>Violation Details:</h3>
                    <p>Session ID: ${this.sessionId}</p>
                    <p>Fingerprint: ${this.fingerprint}</p>
                    <p>Domain: ${window.location.hostname}</p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                    <p>Violations: ${this.violationCount}</p>
                </div>
                <p style="margin-bottom: 30px;">
                    This incident has been logged and may result in legal action.
                    All activity has been recorded for evidence.
                </p>
                <button onclick="window.location.href='mailto:gavin_maxson324@hotmail.com'" 
                        style="background: #ef4444; color: white; padding: 15px 30px; border: none; 
                               border-radius: 6px; font-size: 16px; cursor: pointer;">
                    Contact Legal Department
                </button>
            </div>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(blockScreen);
        
        // Prevent further interaction
        document.addEventListener('click', (e) => e.preventDefault());
        document.addEventListener('keydown', (e) => e.preventDefault());
    }

    // Report serious violations
    reportViolation() {
        // In a real implementation, this would send data to your server
        const reportData = {
            violations: JSON.parse(localStorage.getItem('coTrackingData') || '[]'),
            fingerprint: this.fingerprint,
            domain: window.location.hostname,
            timestamp: new Date().toISOString()
        };
        
        // Store for later reporting
        localStorage.setItem('coViolationReport', JSON.stringify(reportData));
    }

    // Get tracking data for reporting
    getTrackingData() {
        return JSON.parse(localStorage.getItem('coTrackingData') || '[]');
    }

    // Clear tracking data (for authorized users only)
    clearTrackingData() {
        if (this.isAuthorized) {
            localStorage.removeItem('coTrackingData');
            return true;
        }
        return false;
    }
}

// Initialize IP Protection System
window.ipProtection = new IPProtectionSystem();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IPProtectionSystem;
}
