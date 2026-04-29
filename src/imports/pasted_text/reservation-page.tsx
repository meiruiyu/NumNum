CREATE a new full-screen reservation page that appears
when the user taps the "Reserve" button on the
Restaurant Detail page.

This page is inspired by Google's restaurant reservation
UI, adapted to match our app's visual design system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Left: "×" close icon (20px, #2C1A0E)
  Tapping dismisses this page and returns to
  Restaurant Detail page
  Transition: slide down to dismiss

Center (vertical stack, centered):
  Line 1: Restaurant name "Flushing Hot Pot"
    Font: 17px, weight 600, #2C1A0E
  Line 2: Cuisine type "Chinese Restaurant"
    Font: 13px, weight 400, #8A8078

Right: empty (no element)

Top bar height: 64px
Separator below: 0.5px #F0EBE3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECTION ROW — Party / Date / Time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Three dropdown selectors in a horizontal row,
sitting below the top bar.
Padding: 16px horizontal, 20px top

Each selector:
  Label above: 12px, weight 400, #8A8078
  e.g. "Party" / "Date" / "Time"
  Margin-bottom: 6px between label and selector box

Selector box:
  Height: 48px
  Background: white (#FFFFFF)
  Border: 0.5px solid #D4C9BE
  Border-radius: 10px
  Padding: 0 12px
  Content: selected value (left) + chevron ▼ (right)
  Value font: 15px, weight 500, #2C1A0E
  Chevron: 12px, #8A8078

PARTY selector (leftmost, narrowest ~90px):
  Label: "Party"
  Value: "2  ▼"
  Options on tap: 1, 2, 3, 4, 5, 6, 7, 8+

DATE selector (middle, widest ~160px):
  Label: "Date"
  Value: "Today  ▼"
  Options on tap: Today, Tomorrow, then next 7 days
  Format: "Mon, Mar 30" etc.

TIME selector (rightmost, ~110px):
  Label: "Time"
  Value: "8:00 PM  ▼"
  Options on tap: time slots in 15-minute intervals
  Format: 12-hour with AM/PM

Gap between the three selectors: 8px
The three selectors fill the full width minus 32px
total horizontal padding using flex-grow proportions:
  Party: flex 0.8
  Date: flex 1.4
  Time: flex 1.0

Divider line below selectors: 0.5px #F0EBE3
Margin-top: 20px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AVAILABLE TIMES SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section header:
  "Dining Room" — 17px, weight 600, #2C1A0E
  Padding: 20px 16px 12px 16px

Time slot grid:
  3 columns × multiple rows
  Column gap: 10px, Row gap: 10px
  Horizontal padding: 16px

Each time slot button:
  Height: 48px
  Border-radius: 10px
  Font: 15px, weight 500
  Text centered

UNAVAILABLE slot style (grayed out):
  Background: #F5F0EB
  Text color: #B4B2A9
  Border: none
  Not tappable

AVAILABLE slot style (default):
  Background: white (#FFFFFF)
  Border: 1px solid #E8603C
  Text color: #E8603C
  Tappable

SELECTED slot style (after user taps):
  Background: #E8603C (terracotta filled)
  Border: none
  Text color: white (#FFFFFF)

Show these time slots in order (3 per row):

Row 1: 7:00 PM  |  7:15 PM  |  7:30 PM
  All three: UNAVAILABLE (grayed)

Row 2: 7:45 PM  |  8:00 PM  |  8:15 PM
  7:45 PM: UNAVAILABLE
  8:00 PM: AVAILABLE (default selected / highlighted)
  8:15 PM: AVAILABLE

Row 3: 8:30 PM  |  8:45 PM  |  9:00 PM
  All three: AVAILABLE

The SELECTED state defaults to "8:00 PM" when
the page first loads (pre-selected to match the
Time selector value at the top).

When user taps a different available slot:
  Previously selected → returns to AVAILABLE style
  Newly tapped → becomes SELECTED style
  Time selector value at top updates to match

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING ATTRIBUTION (below time grid)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Divider line: 0.5px #F0EBE3
Margin-top: 24px, padding: 16px

Attribution row:
  Line 1: "Booking powered by"
    Font: 12px, weight 400, #8A8078

  Line 2 (below, horizontal flex):
    Left: App icon — small rounded square 24×24px
      Background: #E8603C (terracotta)
      Content: fork icon or "N" initial in white
      Border-radius: 6px
    Right of icon: "NomNom" (or your confirmed app name)
      Font: 14px, weight 600, #2C1A0E
      Margin-left: 8px

  Gap between Line 1 and Line 2: 4px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM ACTION BAR (fixed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed to bottom of screen above safe area.
Height: 80px
Background: white
Border-top: 0.5px #F0EBE3
Padding: 12px 16px

CONTINUE button:
  Full width
  Height: 52px
  Border-radius: 12px
  Font: 16px, weight 600, white

TWO STATES:

State A — No time selected yet (inactive):
  Background: #D4C9BE (muted warm gray)
  Text: "Continue"
  Not tappable

State B — Time slot selected (active):
  Background: #E8603C (terracotta)
  Text: "Continue"
  Tappable
  Default state since 8:00 PM is pre-selected

Tapping "Continue" when active:
  Navigates to a booking confirmation overlay/sheet:

  Confirmation bottom sheet (slides up):
  Height: 280px, border-radius: 20px 20px 0 0
  Background: white

  Content:
    Checkmark circle icon: 40px, #2D6A4F green,
      centered, margin-bottom: 12px
    Title: "Reservation Confirmed!"
      18px, weight 700, #2C1A0E, centered
    Details (13px, #8A8078, centered, line-height 1.6):
      "Flushing Hot Pot"
      "Party of 2  ·  Today  ·  8:00 PM"
      "Dining Room"
    Divider: 0.5px #F0EBE3, margin: 16px 0
    "Add to Calendar" button:
      Full width, height: 44px, border-radius: 10px
      Border: 0.5px #E8603C, text #E8603C, bg white
      Font: 14px, weight 500
    "Done" button below:
      Full width, height: 44px, no border, no bg
      Text: "Done" — 14px, weight 500, #8A8078
      Tapping dismisses sheet AND returns to
      Restaurant Detail page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOTYPE CONNECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Restaurant Detail page "Reserve" button
   → Navigate to: this Reservation page
   Transition: slide up from bottom

2. Reservation page "×" top-left
   → Navigate back to: Restaurant Detail page
   Transition: slide down to dismiss

3. Any available time slot tap
   → Swap slot visual state to SELECTED
   → Activate "Continue" button to terracotta

4. "Continue" button (active state) tap
   → Show: Confirmation bottom sheet overlay

5. Confirmation sheet "Done" button
   → Dismiss sheet
   → Navigate back to: Restaurant Detail page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Background: #FDF6EE (warm cream page background)
All selector boxes: white with warm border #D4C9BE
Available slots: white with terracotta border
Selected slot: terracotta fill, white text
Unavailable slots: #F5F0EB fill, #B4B2A9 text
Primary action: #E8603C (terracotta)
Text primary: #2C1A0E
Text secondary: #8A8078
All text: no overflow, fixed heights enforced
Screen edge padding: 16px horizontal throughout