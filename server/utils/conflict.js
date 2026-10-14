/**
 * Returns true if two bookings overlap in time.
 * Times are strings in "HH:MM" 24-hour format.
 */
function hasTimeConflict(existing, requested) {
  return (
    requested.startTime < existing.endTime &&
    requested.endTime > existing.startTime
  );
}

module.exports = { hasTimeConflict };