// Logic for due queue calculations

const MONTHS_BY_FREQUENCY = {
    'Monthly': 1,
    'Quarterly': 3,
    'Half-yearly': 6,
    'Yearly': 12,
};

// Works on 'YYYY-MM-DD' strings in UTC so the result never shifts by a day.
// Clamps the day to the end of shorter months (31 Jan + 1 month = 28/29 Feb).
function addMonths(dateStr, months) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(Date.UTC(y, m - 1 + months, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(d, lastDay));
    return target.toISOString().split('T')[0];
}

// Returns the next due date, or null when no further premium is due
// (single premium, or the next date would fall after the premium end date).
function calculateNextDueDate(currentDueDate, frequency, premiumEndDate = null) {
    if (!currentDueDate) return null;
    const months = MONTHS_BY_FREQUENCY[frequency];
    if (!months) return null;

    const next = addMonths(currentDueDate, months);
    if (premiumEndDate && next > premiumEndDate) return null;
    return next;
}

module.exports = {
    addMonths,
    calculateNextDueDate
};
