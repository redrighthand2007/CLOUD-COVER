// Logic for due queue calculations

function calculateNextDueDate(currentDueDate, frequency) {
    if (!currentDueDate) return null;
    const date = new Date(currentDueDate);
    
    switch (frequency) {
        case 'Monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'Quarterly':
            date.setMonth(date.getMonth() + 3);
            break;
        case 'Half-yearly':
            date.setMonth(date.getMonth() + 6);
            break;
        case 'Yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
        case 'Single Premium':
            return null; // No next due date
    }
    return date.toISOString().split('T')[0];
}

module.exports = {
    calculateNextDueDate
};
