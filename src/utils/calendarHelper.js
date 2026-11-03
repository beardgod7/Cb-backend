/**
 * Get available tour dates for a given month and year
 * @param {Array<string>} availableDays - Array of day names (e.g., ["Wednesday", "Friday"])
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Array<string>} Array of available dates in YYYY-MM-DD format
 */
function getAvailableTourDates(availableDays, month, year) {
  const dates = [];
  const daysOfWeek = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // Convert day names to day numbers
  const targetDays = availableDays.map((day) => daysOfWeek[day]);

  // Get the number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Iterate through all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Check if this day is in the available days
    if (targetDays.includes(dayOfWeek)) {
      // Only include future dates
      if (date >= new Date().setHours(0, 0, 0, 0)) {
        const formattedDate = date.toISOString().split("T")[0];
        dates.push(formattedDate);
      }
    }
  }

  return dates;
}

/**
 * Check if a date is available for booking
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {Array<string>} availableDays - Array of day names
 * @returns {boolean} True if date is available
 */
function isDateAvailable(dateString, availableDays) {
  const date = new Date(dateString);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];

  // Check if date is in the future
  const today = new Date().setHours(0, 0, 0, 0);
  if (date < today) {
    return false;
  }

  // Check if day is in available days
  return availableDays.includes(dayName);
}

/**
 * Get date range between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array<string>} Array of dates in YYYY-MM-DD format
 */
function getDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} Formatted date string
 */
function formatDate(date, format = "long") {
  const d = new Date(date);
  
  const options = {
    short: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  };

  return d.toLocaleDateString("en-US", options[format] || options.long);
}

/**
 * Calculate number of days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of days
 */
function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Build a minimal RFC 5545 iCalendar (.ics) string for an event.
 * @param {object} e { uid, title, description, startAt, endAt, location, url }
 * @returns {string}
 */
function buildICS(e = {}) {
  const fmt = (d) => {
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };
  const esc = (s) =>
    String(s || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");

  const now = fmt(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CBAAC//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${esc(e.uid || Date.now())}@cbaac.gov.ng`,
    `DTSTAMP:${now}`,
    e.startAt ? `DTSTART:${fmt(e.startAt)}` : "",
    e.endAt ? `DTEND:${fmt(e.endAt)}` : "",
    `SUMMARY:${esc(e.title)}`,
    e.description ? `DESCRIPTION:${esc(e.description)}` : "",
    e.location ? `LOCATION:${esc(e.location)}` : "",
    e.url ? `URL:${esc(e.url)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

module.exports = {
  getAvailableTourDates,
  isDateAvailable,
  getDateRange,
  formatDate,
  getDaysBetween,
  buildICS,
};
