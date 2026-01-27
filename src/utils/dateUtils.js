/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY.
 * @param {string} dateString - The date string in YYYY-MM-DD format.
 * @returns {string} - The formatted date string in DD/MM/YYYY format, or empty string if invalid.
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    // Check if it's already in DD/MM/YYYY format to avoid double formatting issues
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) return dateString;

    try {
        const [year, month, day] = dateString.split('-');
        if (!year || !month || !day) return dateString; // Return original if split fails
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateString;
    }
};

/**
 * Returns today's date in YYYY-MM-DD format for input min attributes.
 * @returns {string}
 */
export const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};
