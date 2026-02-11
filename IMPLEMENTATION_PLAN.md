# Spring Lane Nursery - Implementation Plan

**Date:** 11 February 2026
**Status:** Awaiting Approval

---

## Executive Summary

This document outlines the implementation plan for 7 key changes to the Spring Lane Nursery website:

1. Address change (23 → 25 Spring Lane)
2. Welcome section full-width + centered text
3. Cal.com integration for "Book Your Visit" (with admin date blocking)
4. Updated admin email structure
5. Stripe payments for Breakfast Club, After School Club & Deposits
6. Updated operating hours
7. **NEW: Fees Overview PDF - View & Download on Fees page**

---

## Research Findings & Best Practices

### 1. Cal.com Integration Research

**Sources:**
- [Cal.com Embed Documentation](https://cal.com/embed)
- [Cal.com vs Calendly Comparison 2026](https://youcanbook.me/blog/calendly-vs-cal-dot-com)
- [Cal.com Blog - Embedding Guide](https://cal.com/blog/embedding-a-scheduling-system-on-your-website-a-simple-how-to)

**Key Findings:**

| Feature | Cal.com (Recommended) | Calendly |
|---------|----------------------|----------|
| **Free Plan** | Unlimited bookings, calendars, embeds | 1 calendar, 1 event type |
| **Admin Controls** | Full availability blocking | Full availability blocking |
| **Open Source** | Yes (self-host option) | No |
| **Price** | Free / £15/user/month | £12-20/user/month |
| **Next.js Integration** | `@calcom/embed-react` package | Widget embed only |
| **HIPAA Compliant** | Yes | No |

**Recommendation:** Cal.com is the better choice because:
- Free unlimited bookings (Calendly restricts free users)
- Native React/Next.js integration with `@calcom/embed-react`
- Admin can easily block dates/times via the Cal.com dashboard
- No vendor lock-in (open source)

**Implementation Approach:**
```jsx
// Using @calcom/embed-react
import Cal from "@calcom/embed-react";

<Cal
  calLink="springlanenursery/nursery-visit"
  style={{ width: "100%", height: "600px" }}
  config={{
    theme: "light",
    hideEventTypeDetails: false,
    layout: "month_view"
  }}
/>
```

**Admin Benefits:**
- Block specific dates directly from Cal.com dashboard
- Set buffer times between appointments
- Automatic timezone detection
- Email notifications and reminders
- Sync with Google Calendar/Outlook

---

### 2. Stripe Payments Research

**Sources:**
- [Stripe Documentation - Payment Holds](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)
- [Stripe Deposit Invoices Guide](https://stripe.com/resources/more/deposit-invoices-101-what-they-are-and-how-to-use-them)
- [Brightwheel Childcare Billing](https://mybrightwheel.com/features/billing/)
- [UK Nursery Funding Compliance 2025-2026](https://www.nurseryinabox.com/how-nursery-in-a-box-simplifies-invoicing-and-compliance-for-2025-early-years-funding-reforms/)

**Key Findings:**

**Stripe Fees (UK):**
- Card payments: 1.5% + 20p (UK cards) / 2.5% + 20p (EU cards)
- No monthly fees
- No setup fees

**Best Practices for Nursery Deposits:**

1. **Use PaymentIntents (not holds)** - Stripe holds have limitations on partial captures
2. **Clear refund/cancellation policy** - Required for UK childcare compliance
3. **Itemised invoices** - From April 2025, UK nurseries must clearly show funded vs private hours
4. **Receipt generation** - Automatic receipts via Stripe

**Current Implementation:** Stripe is already integrated for Breakfast/After School clubs at £8/day ✅

---

### 3. UK Childcare Compliance Notes (2025-2026)

From April 2025, UK nurseries must comply with new transparency requirements:
- Invoices must clearly separate funded hours from private fees
- All charges must be itemised (meals, snacks, consumables, extras)
- Meeting local authority requirements by January 2026

**The PDF already complies with these requirements** - it clearly shows:
- Childcare fees separately
- Meals charges (optional)
- Consumables charges (optional)
- Important information about funding

---

## Current State Analysis

### Files Requiring Address Changes (23 → 25 Spring Lane)

| File | Line(s) | Current Value |
|------|---------|---------------|
| `src/lib/email-templates.ts` | 17 | "23 Spring Lane, Croydon SE25 4SP" |
| `src/lib/pdf-templates/styles.ts` | ~20 | Nursery info constant |
| `src/app/page.tsx` | 44, 167, 197, 253 | Schema.org structured data |
| `src/components/common/Footer.tsx` | 100-101 | "23 Spring Lane" |

**Note:** `OurLocation.tsx` already shows "25 Spring Lane" (will be consistent after changes)

### Hours to Update

| Location | Current | New |
|----------|---------|-----|
| Footer | 7:30am - 6:30pm | 07:30 - 18:00 (Core) |
| Footer | Breakfast: 6:30am - 7:30am | 06:30 - 07:30 |
| Footer | After-School: 6:30pm - 7:30pm | 18:00 - 19:00 |
| Fees.tsx | 7:30am - 6:30pm | 07:30 - 18:00 |
| Fees.tsx | 6:30am - 7:30am | 06:30 - 07:30 |
| Fees.tsx | 6:30pm - 7:30pm | 18:00 - 19:00 |
| BookClubs.tsx | 6:30AM - 7:30AM / 6:30PM - 7:30PM | 06:30 - 07:30 / 18:00 - 19:00 |
| page.tsx (Schema) | Opens: "06:30", Closes: "19:30" | Opens: "06:30", Closes: "19:00" |

---

## Visual Mockups

### 1. Welcome Section (Full-Width, Centered)

**Current Issue:** Section has `max-w-[1440px]` constraint, not spanning full width.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CURRENT (Constrained Width)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │     ┌─────────────────────────────────────────────────────┐   │  │
│  │     │         Welcome to Spring Lane Nursery              │   │  │
│  │     │                                                     │   │  │
│  │     │     Nestled in the heart of Croydon, we provide...  │   │  │
│  │     └─────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PROPOSED (Full-Width Background)                  │
│█████████████████████████████████████████████████████████████████████│
│█████████████████████████████████████████████████████████████████████│
│███████████      Welcome to Spring Lane Nursery       ████████████████│
│███████████                                           ████████████████│
│███████████  Nestled in the heart of Croydon, we...   ████████████████│
│█████████████████████████████████████████████████████████████████████│
│█████████████████████████████████████████████████████████████████████│
└─────────────────────────────────────────────────────────────────────┘
```

**CSS Changes:**
- Remove `max-w-[1440px]` from section
- Add `w-full` to section for full-width
- Keep inner content container with `max-w-4xl mx-auto text-center`

---

### 2. Book Your Visit - Cal.com Integration

**Current Flow:**
```
┌──────────────────────────────────────┐
│        CURRENT: Custom Modal          │
├──────────────────────────────────────┤
│  • Custom date picker                │
│  • Fixed time slots (9AM-4PM)        │
│  • No admin blocking capability      │
│  • Manual email notifications        │
│  • Data stored in MongoDB            │
└──────────────────────────────────────┘
```

**Proposed Flow:**
```
┌──────────────────────────────────────┐
│       PROPOSED: Cal.com Embed         │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │     📅 February 2026           │  │
│  │  ┌──┬──┬──┬──┬──┬──┬──┐       │  │
│  │  │Su│Mo│Tu│We│Th│Fr│Sa│       │  │
│  │  ├──┼──┼──┼──┼──┼──┼──┤       │  │
│  │  │  │ 1│ 2│ 3│ 4│ 5│ 6│       │  │
│  │  │  │  │██│  │  │  │  │ ██=blocked │
│  │  ├──┼──┼──┼──┼──┼──┼──┤       │  │
│  │  │ 7│ 8│ 9│10│11│12│13│       │  │
│  │  └──┴──┴──┴──┴──┴──┴──┘       │  │
│  │                                │  │
│  │  Available Times:              │  │
│  │  [09:00] [10:00] [11:00]      │  │
│  │  [14:00] [15:00] [16:00]      │  │
│  └────────────────────────────────┘  │
│                                      │
│  Admin can block dates/times via     │
│  Cal.com dashboard                   │
└──────────────────────────────────────┘
```

**Admin Dashboard (Cal.com) - Date Blocking:**
```
┌──────────────────────────────────────────────────────────────┐
│  Cal.com Admin Dashboard                              [×]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Event Type: Nursery Visit                                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Availability                                        │    │
│  │ ─────────────────────────────────────────────────── │    │
│  │ Monday - Friday: 09:00 - 16:00                      │    │
│  │ Duration: 30 minutes                                │    │
│  │ Buffer: 15 minutes between visits                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Block Dates                               [+ Add]   │    │
│  │ ─────────────────────────────────────────────────── │    │
│  │ ❌ 14 Feb 2026 (Staff Training)                     │    │
│  │ ❌ 21-22 Feb 2026 (Half Term)                       │    │
│  │ ❌ 28 Feb 2026 (Ofsted Visit)                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [Save Changes]                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Updated Admin Email Structure

**Proposed Admin Email (for Cal.com bookings):**
```
┌──────────────────────────────────────────────────────────────┐
│  📅 NEW NURSERY VISIT BOOKING                                │
│  ─────────────────────────────────────────────────────────── │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🚨 ACTION REQUIRED                                  │    │
│  │    New visit scheduled - View in Cal.com            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 📅 VISIT DETAILS                                    │    │
│  │ ─────────────────────────────────────              │    │
│  │ Date:  Thursday, 13 February 2026                  │    │
│  │ Time:  10:00 AM                                    │    │
│  │ Duration: 30 minutes                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 👪 FAMILY INFORMATION                               │    │
│  │ ─────────────────────────────────────              │    │
│  │ Parent:  Sarah Johnson                             │    │
│  │ Email:   sarah.johnson@email.com                   │    │
│  │ Phone:   +44 7700 900123                           │    │
│  │                                                    │    │
│  │ Child:   Emma Johnson                              │    │
│  │ Age:     2 years old                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ QUICK ACTIONS                                       │    │
│  │ ─────────────────────────────────────              │    │
│  │ [View in Cal.com]  [Reschedule]  [Contact Family] │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ─────────────────────────────────────────────────────────── │
│  Spring Lane Nursery                                         │
│  25 Spring Lane, Croydon SE25 4SP                           │
│  📞 020 XXXX XXXX | ✉️ info@springlanenursery.co.uk         │
└──────────────────────────────────────────────────────────────┘
```

---

### 4. Fees Overview PDF Section (NEW)

**Location:** After "Opening Hours" section on Fees page
**PDF File:** `/public/Fee overview - Springlane.pdf`

**Visual Mockup:**
```
┌──────────────────────────────────────────────────────────────┐
│                        FEES PAGE                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🕐 Opening Hours                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Core Hours  │ │ Breakfast   │ │ After School│            │
│  │ 07:30-18:00 │ │ 06:30-07:30 │ │ 18:00-19:00 │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  ══════════════════════════════════════════════════════════  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  📄 FEES OVERVIEW DOCUMENT                              │ │
│  │  ────────────────────────────────────────────────────── │ │
│  │                                                         │ │
│  │  Download our complete fees overview including:         │ │
│  │  • Childcare fees (Full day, Half day)                  │ │
│  │  • Meals charges (Optional)                             │ │
│  │  • Consumables charges (Optional)                       │ │
│  │  • Important information                                │ │
│  │                                                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐              │ │
│  │  │  👁️ View PDF    │  │  ⬇️ Download PDF │              │ │
│  │  └─────────────────┘  └─────────────────┘              │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ══════════════════════════════════════════════════════════  │
│                                                              │
│  💰 Daily Fees (Before Funding)                              │
│  ... rest of fees page ...                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Component Design:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📄                                                      │ │
│  │                                                          │ │
│  │  FEES OVERVIEW                                           │ │
│  │  ─────────────                                           │ │
│  │  Download our complete fee schedule including            │ │
│  │  childcare rates, meals, and consumables.                │ │
│  │                                                          │ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │                                                     ││ │
│  │  │  [PDF Preview Thumbnail]                            ││ │
│  │  │                                                     ││ │
│  │  │       Fee Overview - Springlane                     ││ │
│  │  │       2 pages • PDF                                 ││ │
│  │  │                                                     ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  │                                                          │ │
│  │  ┌──────────────────┐   ┌──────────────────┐            │ │
│  │  │  👁️ View PDF     │   │  ⬇️ Download     │            │ │
│  │  │                  │   │                  │            │ │
│  │  └──────────────────┘   └──────────────────┘            │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Implementation Options:**

| Option | View Functionality | Download Functionality |
|--------|-------------------|----------------------|
| **A: Simple (Recommended)** | Opens PDF in new tab | Direct download link |
| **B: Modal Viewer** | Embedded PDF viewer in modal | Download button |
| **C: Inline Preview** | Small preview thumbnail | Download button |

**Recommendation: Option A (Simple)** - Most reliable across all devices and browsers.

**Code Implementation:**
```jsx
<div className="bg-[#FFF8E7] rounded-lg p-6 border-2 border-[#F9AE15]">
  <div className="flex items-start gap-4">
    <div className="text-4xl">📄</div>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-[#252650] mb-2">
        Fees Overview Document
      </h3>
      <p className="text-[#252650] mb-4">
        Download our complete fee schedule including childcare rates,
        meals charges, and consumables.
      </p>
      <div className="flex gap-3">
        <a
          href="/Fee overview - Springlane.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C97A9] text-white rounded-lg hover:bg-[#247d8c] transition-colors"
        >
          <Eye className="w-4 h-4" />
          View PDF
        </a>
        <a
          href="/Fee overview - Springlane.pdf"
          download="Spring-Lane-Nursery-Fees-Overview.pdf"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F95921] text-white rounded-lg hover:bg-[#e04d1a] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  </div>
</div>
```

---

### 5. Payments Section - Deposits (Existing Stripe)

**Current State:**
- Breakfast Club and After School Club have Stripe payments ✅
- Registration & Deposits section exists but no online payment ❌

**Proposed: Add Pay Deposit Online Button**

```
┌──────────────────────────────────────────────────────────────┐
│              REGISTRATION & DEPOSITS                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │  Registration Fee   │  │  Security Deposit   │           │
│  │  ────────────────   │  │  ─────────────────  │           │
│  │      £75.00         │  │      £250.00        │           │
│  │  Non-refundable     │  │  Refundable (4 wks) │           │
│  │                     │  │                     │           │
│  │  [Pay Online]       │  │  [Pay Online]       │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6. Updated Hours Display

**Footer (Before → After):**
```
BEFORE:                              AFTER:
─────────────────────────           ─────────────────────────
Monday - Friday                      Monday - Friday
7:30am - 6:30pm                     07:30 - 18:00 (Core Hours)

Breakfast Club                       Breakfast Club
6:30am - 7:30am                     06:30 - 07:30

After-School Club                    After School Club
6:30pm - 7:30pm                     18:00 - 19:00

Weekend: Closed                      Weekend: Closed
```

**Fees Page (Before → After):**
```
BEFORE:                              AFTER:
─────────────────────────           ─────────────────────────
Standard Core Hours                  Standard Core Hours
7:30am - 6:30pm                     07:30 - 18:00

Breakfast Club                       Breakfast Club
6:30am - 7:30am                     06:30 - 07:30

After Hours Club                     After School Club
6:30pm - 7:30pm                     18:00 - 19:00
```

**BookClubs Component (Before → After):**
```
BEFORE:                              AFTER:
─────────────────────────           ─────────────────────────
Breakfast Club                       Breakfast Club
6:30AM - 7:30AM                     06:30 - 07:30
£8.00                               £8.00

After Hours Club                     After School Club
6:30PM - 7:30PM                     18:00 - 19:00
£8.00                               £8.00
```

---

## Implementation Steps

### Phase 1: Quick Fixes (Address, Hours, Welcome, PDF)
1. ✅ Update address from "23" to "25" in all files
2. ✅ Update hours across Footer, Fees, BookClubs, and Schema
3. ✅ Fix Welcome section full-width styling
4. ✅ Add PDF view/download section to Fees page
5. ✅ Rename PDF file to `Spring-Lane-Nursery-Fees-Overview.pdf`

### Phase 2: Cal.com Integration
1. Create Cal.com account for Spring Lane Nursery
2. Set up "Nursery Visit" event type with availability
3. Install `@calcom/embed-react` package
4. Replace BookingModal with Cal.com embed (or add as option)
5. Configure Cal.com webhook for admin notifications (optional)
6. Update admin email template
7. (Optional) Keep MongoDB logging for backup/records

### Phase 3: Deposit Payments (If Required)
1. Create new deposit payment component
2. Add API endpoint `/api/deposit-payment`
3. Configure Stripe product for registration fee (£75)
4. Configure Stripe product for security deposit (£250)
5. Add admin email notification for deposits
6. Create deposit confirmation emails

### Phase 4: Testing & QA
1. Test Cal.com booking flow end-to-end
2. Test PDF view/download on all devices
3. Verify all address changes are consistent
4. Verify all hours display correctly
5. Test deposit payment with test cards (if implemented)
6. Verify all emails are delivered

---

## Environment Variables Required

```env
# Cal.com Integration (New)
CALCOM_API_KEY=your_cal_com_api_key
NEXT_PUBLIC_CALCOM_USERNAME=springlanenursery
NEXT_PUBLIC_CALCOM_EVENT_SLUG=nursery-visit

# Existing Stripe (already configured)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Deposit amounts (if implementing online payments)
REGISTRATION_FEE_PENCE=7500   # £75.00
SECURITY_DEPOSIT_PENCE=25000  # £250.00
```

---

## Questions for Client

Before implementation, please confirm:

### Cal.com Setup
1. **Cal.com Account:** Do you want us to create the Cal.com account, or will you create it yourself?
2. **Visit Duration:** How long should each nursery visit be? (Suggested: 30 minutes)
3. **Visit Buffer:** How much time between visits? (Suggested: 15 minutes)
4. **Calendar Sync:** Should Cal.com sync with a specific Google Calendar?

### Deposit Payments
5. **Online Deposits:** Do you want parents to pay registration fee (£75) and security deposit (£250) online via Stripe?
6. **Deposit Refund Policy:** If yes, what are the refund terms?

### PDF
7. **PDF Filename:** Should we rename to `Spring-Lane-Nursery-Fees-Overview.pdf`?

---

## Summary of All Changes

| # | Change | Priority | Complexity |
|---|--------|----------|------------|
| 1 | Address: 23 → 25 Spring Lane | High | Low |
| 2 | Welcome section full-width | High | Low |
| 3 | Cal.com for "Book Your Visit" | High | Medium |
| 4 | Updated admin email structure | Medium | Low |
| 5 | Deposit payments via Stripe | Medium | Medium |
| 6 | Updated hours (06:30-07:30, 07:30-18:00, 18:00-19:00) | High | Low |
| 7 | Fees PDF view/download section | High | Low |

---

## Approval Checklist

- [ ] Address change (23 → 25 Spring Lane)
- [ ] Welcome section full-width + centered
- [ ] Cal.com integration for visits (admin can block dates)
- [ ] Updated admin email structure
- [ ] Updated hours (Breakfast 06:30-07:30, Core 07:30-18:00, After School 18:00-19:00)
- [ ] Fees PDF view/download on Fees page
- [ ] Deposit payment system (optional - confirm if needed)

**Client Signature:** _______________
**Date:** _______________

---

## Sources

- [Cal.com Embed Documentation](https://cal.com/embed)
- [Cal.com Features - Embed](https://cal.com/features/embed)
- [Cal.com vs Calendly 2026 Comparison](https://youcanbook.me/blog/calendly-vs-cal-dot-com)
- [Cal.com Blog - Embedding Guide](https://cal.com/blog/embedding-a-scheduling-system-on-your-website-a-simple-how-to)
- [Stripe Documentation - Payment Holds](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)
- [Stripe Deposit Invoices Guide](https://stripe.com/resources/more/deposit-invoices-101-what-they-are-and-how-to-use-them)
- [Stripe Pricing UK](https://stripe.com/pricing)
- [Brightwheel Childcare Billing](https://mybrightwheel.com/features/billing/)
- [UK Nursery Funding Compliance 2025-2026](https://www.nurseryinabox.com/how-nursery-in-a-box-simplifies-invoicing-and-compliance-for-2025-early-years-funding-reforms/)
