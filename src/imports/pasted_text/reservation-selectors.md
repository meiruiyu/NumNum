CHANGE: Make the Party, Date, and Time selector boxes
on the Reservation page fully interactive with
dropdown/picker options when tapped.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTY SELECTOR — tap to open dropdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When user taps the Party selector box:
A small dropdown list appears directly below
the selector box.

Dropdown design:
  Width: same as Party selector box (~90px)
  Background: white (#FFFFFF)
  Border: 0.5px solid #D4C9BE
  Border-radius: 10px
  Box shadow: none (flat)
  Overflow: hidden

Dropdown options (8 rows):
  Each row: height 40px, centered text
  Font: 15px, weight 400, #2C1A0E
  Selected row: #E8603C text, weight 600,
    background #FDF6EE
  Hover/tap row: background #F5F0EB

Options list:
  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8+

Default selected: 2

Prototype:
  Create frames for Party = 1, 2, 3, 4
  Tapping each option closes the dropdown
  and updates the selector box value to match
  the selected number

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATE SELECTOR — tap to open calendar picker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When user taps the Date selector box:
A calendar-style dropdown appears below
the selector box (wider than the box itself).

Calendar dropdown design:
  Width: full screen width minus 32px (fills
    the area below all three selectors)
  Background: white (#FFFFFF)
  Border: 0.5px solid #D4C9BE
  Border-radius: 12px
  Padding: 12px

CALENDAR HEADER ROW:
  Left: "‹" chevron (previous month, 20px, #8A8078)
  Center: "March 2026" — 15px, weight 600, #2C1A0E
  Right: "›" chevron (next month, 20px, #8A8078)
  Margin-bottom: 10px

DAY OF WEEK ROW:
  7 columns: Sun Mon Tue Wed Thu Fri Sat
  Font: 11px, weight 500, #8A8078
  Text-align: center, margin-bottom: 6px

DATE GRID:
  7 columns × 5 rows
  Each date cell: width equal (fill grid), height 36px
  Font: 14px, weight 400, #2C1A0E
  Text-align: center

  TODAY cell (March 29):
    Circle background: #E8603C (terracotta)
    Text: white, weight 600
    Border-radius: 999px, size 32px

  PAST dates (before today):
    Text color: #B4B2A9 (muted, not tappable)

  FUTURE available dates:
    Text color: #2C1A0E (normal, tappable)
    On tap: circle background #FDF6EE,
      border 1px #E8603C, text #E8603C

  Show March 2026 calendar grid with correct dates

QUICK SELECT ROW (above calendar grid):
  Horizontally scrollable pill row:
  [Today] [Tomorrow] [Sat Mar 30] [Sun Mar 31]
    [Mon Apr 1]

  Each pill: height 30px, border-radius 999px
  Active: #E8603C fill, white text
  Inactive: white, #D4C9BE border, #8A8078 text
  Font: 12px, weight 500, padding 0 12px
  Default active: "Today"

Tapping a quick select pill highlights that date
on the calendar and updates the selector box.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIME SELECTOR — tap to open time list
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When user taps the Time selector box:
A scrollable time list dropdown appears below
the selector box.

Time dropdown design:
  Width: same as Time selector box (~110px)
  Max height: 200px (scrollable beyond this)
  Background: white (#FFFFFF)
  Border: 0.5px solid #D4C9BE
  Border-radius: 10px
  Overflow: scroll (vertical)

Time options in 15-minute intervals:
  Show from 11:00 AM to 11:00 PM:
  11:00 AM · 11:15 AM · 11:30 AM · 11:45 AM
  12:00 PM · 12:15 PM · 12:30 PM · 12:45 PM
  1:00 PM ... through to 11:00 PM

Each time row:
  Height: 40px
  Font: 14px, weight 400, #2C1A0E
  Text-align: center
  Padding: 0 12px

Selected time row:
  Text: #E8603C, weight 600
  Background: #FDF6EE

Default scrolled to show: 7:30 PM to 9:00 PM
  with 8:00 PM pre-selected (highlighted)

Tapping a time option:
  Closes the dropdown
  Updates the Time selector box value
  Updates the time grid below to show
  available slots around the selected time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERAL INTERACTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Only ONE dropdown/picker can be open at a time.
Tapping a different selector while one is open:
  → Closes the current open dropdown
  → Opens the newly tapped one

Tapping anywhere outside a dropdown:
  → Closes the dropdown, no value change

When any selector value changes:
  → The corresponding selector box text updates
     to reflect the new selection
  → The selector box border changes to:
     1px solid #E8603C (terracotta) to indicate
     an active/modified selection
  → The time slot grid in "Dining Room" section
     refreshes to show relevant available slots

SELECTOR BOX STATES:

Default (unmodified):
  Border: 0.5px solid #D4C9BE
  Text: #2C1A0E, weight 500

Active / recently changed:
  Border: 1px solid #E8603C
  Text: #E8603C, weight 600

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOTYPE CONNECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these interaction frames:

Frame A: Default state
  Party: 2, Date: Today, Time: 8:00 PM
  All dropdowns closed

Frame B: Party dropdown open
  Shows dropdown list below Party box
  All other dropdowns closed

Frame C: Party changed to 4
  Party box shows "4", terracotta border
  Dropdown closed

Frame D: Date picker open
  Shows calendar below Date box
  All other dropdowns closed

Frame E: Date changed to Tomorrow
  Date box shows "Tomorrow", terracotta border
  Calendar closed

Frame F: Time dropdown open
  Shows scrollable time list below Time box
  All other dropdowns closed

Frame G: Time changed to 8:30 PM
  Time box shows "8:30 PM", terracotta border
  Time grid updates: 8:30 PM slot highlighted

Prototype tap interactions:
  Party box tap → Frame B
  Party option "4" tap → Frame C
  Date box tap → Frame D
  "Tomorrow" pill tap → Frame E
  Time box tap → Frame F
  "8:30 PM" row tap → Frame G

All other elements (Dining Room time grid,
bottom Continue button, NomNom attribution)
remain unchanged across all frames.