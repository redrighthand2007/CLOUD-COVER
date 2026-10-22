// Server-side input checks. Each validate* function returns either
// { data } with cleaned values, or { error } with a message to show the user.
// The browser checks forms too, but only these checks can be trusted.

const POLICY_CATEGORIES = ['Life', 'Term', 'Pension', 'Health', 'Mediclaim', 'Motor', 'Accidental'];
const PREMIUM_FREQUENCIES = ['Monthly', 'Quarterly', 'Half-yearly', 'Yearly', 'Single Premium'];
const POLICY_STATUSES = ['Active', 'Due', 'Overdue', 'Lapsed', 'Matured', 'Cancelled'];
const PAYMENT_STATES = ['Paid', 'Pending'];
const INVESTMENT_FREQUENCIES = ['Monthly (SIP)', 'Lumpsum'];
const INVESTMENT_STATUSES = ['Active', 'Closed'];
const STAFF_ROLES = ['Admin', 'Staff'];

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());
const blankToNull = (value) => (text(value) === '' ? null : text(value));

// Indian mobile: accepts "98765 43210", "+91 98765-43210", "098765..." -> "9876543210"
function normalizePhone(value) {
    let digits = text(value).replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

const isPan = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function isDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

const today = () => new Date().toISOString().split('T')[0];

function positiveAmount(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 && n < 1e10 ? Math.round(n * 100) / 100 : null;
}

function optionalDate(body, field, label) {
    const value = blankToNull(body[field]);
    if (value && !isDate(value)) return { error: `${label} is not a valid date` };
    return { value };
}

function validateCustomer(body) {
    const full_name = text(body.full_name);
    if (full_name.length < 2 || full_name.length > 150) return { error: 'Full name is required (2-150 characters)' };

    const pan = text(body.pan).toUpperCase();
    if (!isPan(pan)) return { error: 'PAN must look like ABCDE1234F' };

    const primary_phone = normalizePhone(body.primary_phone);
    if (!primary_phone) return { error: 'Enter a valid 10-digit Indian mobile number' };

    const email = blankToNull(body.email);
    if (email && (!isEmail(email) || email.length > 100)) return { error: 'Email address is not valid' };

    const dob = optionalDate(body, 'date_of_birth', 'Date of birth');
    if (dob.error) return dob;
    if (dob.value && dob.value > today()) return { error: 'Date of birth cannot be in the future' };

    const address = blankToNull(body.address);
    if (address && address.length > 500) return { error: 'Address is too long (max 500 characters)' };

    return { data: { full_name, pan, primary_phone, email: email && email.toLowerCase(), address, date_of_birth: dob.value } };
}

function validatePolicy(body) {
    const customer_id = Number(body.customer_id);
    if (!Number.isInteger(customer_id) || customer_id <= 0) return { error: 'Choose a customer' };

    const insurer_id = Number(body.insurer_id);
    if (!Number.isInteger(insurer_id) || insurer_id <= 0) return { error: 'Choose an insurer' };

    if (!POLICY_CATEGORIES.includes(body.category)) return { error: 'Choose a valid category' };
    if (!PREMIUM_FREQUENCIES.includes(body.premium_frequency)) return { error: 'Choose a valid premium frequency' };

    const policy_status = text(body.policy_status) || 'Active';
    if (!POLICY_STATUSES.includes(policy_status)) return { error: 'Choose a valid policy status' };

    const current_payment_state = text(body.current_payment_state) || 'Pending';
    if (!PAYMENT_STATES.includes(current_payment_state)) return { error: 'Invalid payment state' };

    const policy_name = text(body.policy_name);
    if (!policy_name || policy_name.length > 150) return { error: 'Policy name is required (max 150 characters)' };

    const policy_number = text(body.policy_number).toUpperCase();
    if (!policy_number || policy_number.length > 100) return { error: 'Policy number is required (max 100 characters)' };

    const premium_amount = positiveAmount(body.premium_amount);
    if (premium_amount === null) return { error: 'Premium amount must be more than 0' };

    let total_tenure_years = blankToNull(body.total_tenure_years);
    if (total_tenure_years !== null) {
        total_tenure_years = Number(total_tenure_years);
        if (!Number.isInteger(total_tenure_years) || total_tenure_years < 0 || total_tenure_years > 100) {
            return { error: 'Tenure must be a whole number of years (0-100)' };
        }
    }

    const policyholder_pan = blankToNull(body.policyholder_pan) && text(body.policyholder_pan).toUpperCase();
    if (policyholder_pan && !isPan(policyholder_pan)) return { error: 'Policyholder PAN must look like ABCDE1234F' };

    const dates = {};
    for (const [field, label, required] of [
        ['policy_start_date', 'Policy start date', true],
        ['policy_end_date', 'Policy end date', false],
        ['premium_start_date', 'Premium start date', true],
        ['premium_end_date', 'Premium end date', false],
        ['next_due_date', 'Next due date', false],
    ]) {
        const result = optionalDate(body, field, label);
        if (result.error) return result;
        if (required && !result.value) return { error: `${label} is required` };
        dates[field] = result.value;
    }
    if (dates.policy_end_date && dates.policy_end_date < dates.policy_start_date) {
        return { error: 'Policy end date must be after the start date' };
    }
    if (dates.premium_end_date && dates.premium_end_date < dates.premium_start_date) {
        return { error: 'Premium end date must be after the premium start date' };
    }

    const notes = blankToNull(body.notes);
    if (notes && notes.length > 2000) return { error: 'Notes are too long (max 2000 characters)' };

    return {
        data: {
            customer_id, policyholder_pan, category: body.category, insurer_id, policy_name, policy_number,
            premium_amount, total_tenure_years, ...dates, premium_frequency: body.premium_frequency,
            current_payment_state, policy_status, notes,
        }
    };
}

function validateInvestment(body) {
    const customer_id = Number(body.customer_id);
    if (!Number.isInteger(customer_id) || customer_id <= 0) return { error: 'Choose a customer' };

    const investment_type = text(body.investment_type);
    if (!investment_type || investment_type.length > 50) return { error: 'Investment type is required (max 50 characters)' };

    const scheme_name = text(body.scheme_name);
    if (!scheme_name || scheme_name.length > 150) return { error: 'Scheme name is required (max 150 characters)' };

    const folio_number = text(body.folio_number);
    if (!folio_number || folio_number.length > 100) return { error: 'Folio/account number is required (max 100 characters)' };

    const amc_company = blankToNull(body.amc_company);
    if (amc_company && amc_company.length > 100) return { error: 'AMC/company name is too long' };

    const investment_amount = positiveAmount(body.investment_amount);
    if (investment_amount === null) return { error: 'Investment amount must be more than 0' };

    const start = optionalDate(body, 'start_date', 'Start date');
    if (start.error) return start;
    if (!start.value) return { error: 'Start date is required' };

    const frequency = blankToNull(body.frequency);
    if (frequency && !INVESTMENT_FREQUENCIES.includes(frequency)) return { error: 'Choose a valid frequency' };

    const status = text(body.status) || 'Active';
    if (!INVESTMENT_STATUSES.includes(status)) return { error: 'Choose a valid status' };

    const notes = blankToNull(body.notes);
    if (notes && notes.length > 2000) return { error: 'Notes are too long (max 2000 characters)' };

    return {
        data: { customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date: start.value, frequency, status, notes }
    };
}

// Office user (team member). Password is required only when creating.
function validateStaffUser(body, { creating }) {
    const username = text(body.username).toLowerCase();
    if (creating && !/^[a-z0-9_.]{3,50}$/.test(username)) {
        return { error: 'Username must be 3-50 characters: letters, numbers, _ or .' };
    }

    const full_name = text(body.full_name);
    if (full_name.length < 2 || full_name.length > 100) return { error: 'Full name is required (2-100 characters)' };

    if (!STAFF_ROLES.includes(body.role)) return { error: 'Choose Admin or Staff' };

    const password = body.password === undefined ? '' : String(body.password);
    if (creating && password.length < 8) return { error: 'Password must be at least 8 characters' };

    return { data: { username, full_name, role: body.role, password } };
}

module.exports = {
    normalizePhone, isPan, validateCustomer, validatePolicy, validateInvestment, validateStaffUser,
    POLICY_CATEGORIES, PREMIUM_FREQUENCIES, POLICY_STATUSES,
};
