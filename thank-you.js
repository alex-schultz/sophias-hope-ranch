// Thank-you page: tailor the message for monthly donors (?gift=monthly, set by the Stripe redirect)
document.addEventListener('DOMContentLoaded', () => {
    const isMonthly = new URLSearchParams(window.location.search).get('gift') === 'monthly';

    document.querySelectorAll('.ty-monthly-only').forEach(el => {
        el.hidden = !isMonthly;
    });
    document.querySelectorAll('.ty-once-only').forEach(el => {
        el.hidden = isMonthly;
    });

    const year = document.getElementById('copyright-year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }
});
