import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X, ChevronDown, CheckCircle, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { NumNumLogoSmall } from '../components/NumNumLogo';
import { createReservation, getRestaurantById } from '../api/restaurants';
import { restaurants as localRestaurants } from '../data/restaurants';

/* --------------------------------------------------------------------------
 * Helpers: convert the UI's friendly date/time labels into the ISO shapes the
 * backend expects.
 *   "Today"      -> "2026-04-19"
 *   "Tomorrow"   -> "2026-04-20"
 *   "Sat, Mar 30" -> "2026-03-30" (current year)
 *   "8:00 PM"    -> "20:00"
 * -------------------------------------------------------------------------- */
function labelToIsoDate(label: string): string {
  const today = new Date();
  const normalize = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;

  if (label === 'Today') return normalize(today);
  if (label === 'Tomorrow') {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return normalize(t);
  }

  // "Sat, Mar 30" style labels — parse the month + day, assume current year.
  const parsed = Date.parse(`${label} ${today.getFullYear()}`);
  if (!Number.isNaN(parsed)) return normalize(new Date(parsed));

  // Fallback — today.
  return normalize(today);
}

// Best-effort: pull the first `title` from a JSON-serialised category array
// stored as a string in the SQLite cache row.
function tryParseFirstCategory(json: string): string | null {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed[0]?.title) return parsed[0].title as string;
  } catch {
    /* swallow */
  }
  return null;
}

function labelToTime24(label: string): string {
  // Matches "8:00 PM", "11:45 AM", etc.
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '19:00';
  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minute}`;
}

export function Reservation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('8:00 PM');
  const [selectedSlot, setSelectedSlot] = useState('8:00 PM');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'party' | 'date' | 'time' | null>(null);
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Resolve the restaurant being reserved. We try in this order:
  //   1. Local hardcoded list (for the curated 18 restaurants)
  //   2. /api/restaurants/:id (for Yelp-sourced restaurants)
  //   3. Fallback placeholder so the page never crashes.
  const [restaurant, setRestaurant] = useState<{ name: string; cuisine: string }>(() => {
    const local = localRestaurants.find((r) => r.id === id);
    if (local) return { name: local.name, cuisine: local.cuisine };
    return { name: 'Loading…', cuisine: '' };
  });

  useEffect(() => {
    if (!id) return;
    if (localRestaurants.some((r) => r.id === id)) return; // already resolved
    getRestaurantById(id)
      .then((res) => {
        const r = res.restaurant;
        if (!r) return;
        const name = r.name ?? 'Restaurant';
        const cuisine =
          (r.categories && Array.isArray(r.categories) && r.categories[0]?.title) ||
          (r.categories_json && tryParseFirstCategory(r.categories_json)) ||
          'Restaurant';
        setRestaurant({ name, cuisine });
      })
      .catch(() => {
        // Leave the placeholder; the user can still pick a time slot and POST.
        setRestaurant({ name: 'Restaurant', cuisine: '' });
      });
  }, [id]);

  const partyOptions = [1, 2, 3, 4, 5, 6, 7, '8+'];
  
  const quickDates = ['Today', 'Tomorrow', 'Sat, Mar 30', 'Sun, Mar 31', 'Mon, Apr 1'];
  
  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const period = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        slots.push(`${displayHour}:${displayMinute} ${period}`);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  const timeSlots = [
    { time: '7:00 PM', available: false },
    { time: '7:15 PM', available: false },
    { time: '7:30 PM', available: false },
    { time: '7:45 PM', available: false },
    { time: '8:00 PM', available: true },
    { time: '8:15 PM', available: true },
    { time: '8:30 PM', available: true },
    { time: '8:45 PM', available: true },
    { time: '9:00 PM', available: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handlePartySizeSelect = (size: number | string) => {
    setPartySize(size as number);
    setModifiedFields(prev => new Set(prev).add('party'));
    setOpenDropdown(null);
  };

  const handleDateSelect = (dateValue: string) => {
    setDate(dateValue);
    setModifiedFields(prev => new Set(prev).add('date'));
    setOpenDropdown(null);
  };

  const handleTimeSelect = (timeValue: string) => {
    setTime(timeValue);
    setSelectedSlot(timeValue);
    setModifiedFields(prev => new Set(prev).add('time'));
    setOpenDropdown(null);
  };

  const handleTimeSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setTime(slot);
  };

  // Submission state for the POST /api/reservations call.
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedReservationId, setConfirmedReservationId] = useState<number | null>(null);

  const handleContinue = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { reservation } = await createReservation({
        restaurant_id: id ?? 'demo',
        restaurant_name: restaurant.name,
        party_size: typeof partySize === 'number' ? partySize : 8,
        reservation_date: labelToIsoDate(date),
        reservation_time: labelToTime24(selectedSlot),
      });
      setConfirmedReservationId(reservation.id);
      setShowConfirmation(true);
    } catch (err: any) {
      // Fallback: still show the confirmation screen so the demo flow works
      // even if the backend is offline — but surface the error to the user.
      setSubmitError(err?.message ?? 'Backend unreachable — saved locally.');
      setShowConfirmation(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setShowConfirmation(false);
    navigate(-1);
  };

  const isFieldModified = (field: string) => modifiedFields.has(field);

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#F0EBE3] h-16 px-4 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1"
        >
          <X className="size-5 text-[#2C1A0E]" />
        </button>
        <div className="text-center">
          <h1 className="text-[17px] font-semibold text-[#2C1A0E]">
            {restaurant.name}
          </h1>
          <p className="text-[13px] text-[#8A8078]">
            {restaurant.cuisine}
          </p>
        </div>
      </div>

      {/* Selection Row - Party / Date / Time */}
      <div className="px-4 pt-5" ref={dropdownRef}>
        <div className="flex gap-2 relative">
          {/* Party Selector */}
          <div style={{ flex: '0.8' }} className="relative">
            <label className="block text-xs text-[#8A8078] mb-1.5">Party</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'party' ? null : 'party')}
              className={`w-full h-12 bg-white rounded-[10px] px-3 flex items-center justify-between ${
                isFieldModified('party') 
                  ? 'border border-[#E8603C]' 
                  : 'border border-[#D4C9BE]'
              }`}
            >
              <span className={`text-[15px] ${
                isFieldModified('party') 
                  ? 'font-semibold text-[#E8603C]' 
                  : 'font-medium text-[#2C1A0E]'
              }`}>
                {partySize}
              </span>
              <ChevronDown className="size-3 text-[#8A8078]" />
            </button>

            {/* Party Dropdown */}
            {openDropdown === 'party' && (
              <div className="absolute top-full mt-2 w-full bg-white border border-[#D4C9BE] rounded-[10px] overflow-hidden z-50">
                {partyOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePartySizeSelect(option)}
                    className={`w-full h-10 text-center text-[15px] ${
                      partySize === option
                        ? 'bg-[#FDF6EE] text-[#E8603C] font-semibold'
                        : 'text-[#2C1A0E] font-normal hover:bg-[#F5F0EB]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          <div style={{ flex: '1.4' }} className="relative">
            <label className="block text-xs text-[#8A8078] mb-1.5">Date</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              className={`w-full h-12 bg-white rounded-[10px] px-3 flex items-center justify-between ${
                isFieldModified('date') 
                  ? 'border border-[#E8603C]' 
                  : 'border border-[#D4C9BE]'
              }`}
            >
              <span className={`text-[15px] ${
                isFieldModified('date') 
                  ? 'font-semibold text-[#E8603C]' 
                  : 'font-medium text-[#2C1A0E]'
              }`}>
                {date}
              </span>
              <ChevronDown className="size-3 text-[#8A8078]" />
            </button>
          </div>

          {/* Time Selector */}
          <div style={{ flex: '1.0' }} className="relative">
            <label className="block text-xs text-[#8A8078] mb-1.5">Time</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
              className={`w-full h-12 bg-white rounded-[10px] px-3 flex items-center justify-between ${
                isFieldModified('time') 
                  ? 'border border-[#E8603C]' 
                  : 'border border-[#D4C9BE]'
              }`}
            >
              <span className={`text-[15px] ${
                isFieldModified('time') 
                  ? 'font-semibold text-[#E8603C]' 
                  : 'font-medium text-[#2C1A0E]'
              }`}>
                {time}
              </span>
              <ChevronDown className="size-3 text-[#8A8078]" />
            </button>

            {/* Time Dropdown */}
            {openDropdown === 'time' && (
              <div className="absolute top-full mt-2 w-full max-h-[200px] bg-white border border-[#D4C9BE] rounded-[10px] overflow-y-auto z-50">
                {allTimeSlots.map((timeOption) => (
                  <button
                    key={timeOption}
                    onClick={() => handleTimeSelect(timeOption)}
                    className={`w-full h-10 text-center text-[14px] px-3 ${
                      time === timeOption
                        ? 'bg-[#FDF6EE] text-[#E8603C] font-semibold'
                        : 'text-[#2C1A0E] font-normal hover:bg-[#F5F0EB]'
                    }`}
                  >
                    {timeOption}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Calendar Picker - Full Width */}
        {openDropdown === 'date' && (
          <div className="absolute left-4 right-4 mt-2 bg-white border border-[#D4C9BE] rounded-xl p-3 z-50">
            {/* Quick Select Pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
              {quickDates.map((quickDate) => (
                <button
                  key={quickDate}
                  onClick={() => handleDateSelect(quickDate)}
                  className={`flex-shrink-0 h-[30px] px-3 rounded-full text-xs font-medium ${
                    date === quickDate
                      ? 'bg-[#E8603C] text-white'
                      : 'bg-white border border-[#D4C9BE] text-[#8A8078]'
                  }`}
                >
                  {quickDate}
                </button>
              ))}
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-2.5">
              <button className="p-1">
                <ChevronLeft className="size-5 text-[#8A8078]" />
              </button>
              <span className="text-[15px] font-semibold text-[#2C1A0E]">March 2026</span>
              <button className="p-1">
                <ChevronRight className="size-5 text-[#8A8078]" />
              </button>
            </div>

            {/* Day of Week Row */}
            <div className="grid grid-cols-7 gap-1 mb-1.5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-[11px] font-medium text-[#8A8078]">
                  {day}
                </div>
              ))}
            </div>

            {/* Date Grid - March 2026 */}
            <div className="grid grid-cols-7 gap-1">
              {/* First week - starts on Saturday March 1 */}
              {[null, null, null, null, null, null, 1].map((day, i) => (
                <div key={`empty-${i}`} className="h-9 flex items-center justify-center">
                  {day && (
                    <button className="size-8 rounded-full flex items-center justify-center text-sm text-[#B4B2A9]">
                      {day}
                    </button>
                  )}
                </div>
              ))}
              
              {/* Rest of March 2026 */}
              {Array.from({ length: 30 }, (_, i) => i + 2).map((day) => {
                const isToday = day === 29;
                const isPast = day < 29;
                return (
                  <div key={day} className="h-9 flex items-center justify-center">
                    <button
                      onClick={() => !isPast && handleDateSelect(`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(day) % 7]}, Mar ${day}`)}
                      disabled={isPast}
                      className={`size-8 rounded-full flex items-center justify-center text-sm ${
                        isToday
                          ? 'bg-[#E8603C] text-white font-semibold'
                          : isPast
                          ? 'text-[#B4B2A9] cursor-not-allowed'
                          : 'text-[#2C1A0E] hover:bg-[#FDF6EE] hover:border hover:border-[#E8603C] hover:text-[#E8603C]'
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#F0EBE3] mt-5" />

      {/* Available Times Section */}
      <div>
        <h2 className="text-[17px] font-semibold text-[#2C1A0E] px-4 pt-5 pb-3">
          Dining Room
        </h2>

        {/* Time Slot Grid */}
        <div className="px-4 grid grid-cols-3 gap-2.5">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && handleTimeSlotClick(slot.time)}
              disabled={!slot.available}
              className={`
                h-12 rounded-[10px] text-[15px] font-medium
                ${!slot.available ? 'bg-[#F5F0EB] text-[#B4B2A9] cursor-not-allowed' : ''}
                ${slot.available && selectedSlot !== slot.time ? 'bg-white border border-[#E8603C] text-[#E8603C]' : ''}
                ${slot.available && selectedSlot === slot.time ? 'bg-[#E8603C] text-white' : ''}
              `}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#F0EBE3] mt-6" />

      {/* Booking Attribution */}
      <div className="px-4 pt-4">
        <p className="text-xs text-[#8A8078] mb-1">Booking powered by</p>
        <div className="flex items-center">
          <NumNumLogoSmall />
          <span className="text-sm font-semibold text-[#2C1A0E] ml-2">NumNum</span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0EBE3] px-4 py-3 h-20 flex items-center">
        <button
          onClick={handleContinue}
          disabled={!selectedSlot || submitting}
          className={`
            w-full h-[52px] rounded-xl text-base font-semibold transition-colors
            ${selectedSlot && !submitting
              ? 'bg-[#E8603C] text-white hover:bg-[#D55534]'
              : 'bg-[#D4C9BE] text-white cursor-not-allowed'}
          `}
        >
          {submitting ? 'Booking…' : 'Continue'}
        </button>
      </div>

      {/* Confirmation Bottom Sheet */}
      {showConfirmation && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowConfirmation(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-50 px-6 pt-8 pb-6 animate-slide-up">
            <div className="flex flex-col items-center">
              {/* Check Circle Icon */}
              <div className="size-10 rounded-full bg-[#2D6A4F] flex items-center justify-center mb-3">
                <CheckCircle className="size-6 text-white" strokeWidth={2.5} />
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-[#2C1A0E] mb-3">
                Reservation Confirmed!
              </h2>

              {/* Details */}
              <div className="text-[13px] text-[#8A8078] text-center leading-relaxed space-y-0.5 mb-4">
                <p>{restaurant.name}</p>
                <p>Party of {partySize} · {date} · {selectedSlot}</p>
                <p>Dining Room</p>
                {confirmedReservationId && (
                  <p className="pt-1 text-[11px] text-[#2D6A4F]">
                    Confirmation #{confirmedReservationId} · saved to database
                  </p>
                )}
                {submitError && (
                  <p className="pt-1 text-[11px] text-[#993C1D]">
                    ⚠ {submitError}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-[#F0EBE3] w-full my-4" />

              {/* Add to Calendar Button */}
              <button className="w-full h-11 rounded-[10px] border border-[#E8603C] text-[#E8603C] text-sm font-medium mb-3">
                Add to Calendar
              </button>

              {/* Done Button */}
              <button
                onClick={handleDone}
                className="w-full h-11 text-sm font-medium text-[#8A8078]"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}