# Design Guidelines: Masvingo City Council Rate Clearance Certificate System

## Design Approach
**Selected System**: Material Design with Government/Municipal Adaptations
**Rationale**: Material Design provides excellent patterns for form-heavy, data-driven applications while maintaining a professional, trustworthy appearance suitable for municipal services.

## Core Design Elements

### A. Color Palette

**Primary Colors**:
- Council Green: `142 65% 35%` - Primary actions, headers, navigation
- Dark Green: `142 70% 25%` - Hover states, emphasis
- Light Green: `142 45% 92%` - Success states, backgrounds

**Accent Colors**:
- Gold: `43 85% 50%` - Important highlights, certificates, badges
- Status colors:
  - Submitted: `210 60% 55%` (Blue)
  - Under Review: `35 85% 55%` (Orange)
  - Approved: `142 60% 45%` (Green)
  - Rejected: `0 70% 50%` (Red)

**Neutrals**:
- Text Primary: `0 0% 15%`
- Text Secondary: `0 0% 40%`
- Borders: `0 0% 85%`
- Background: `0 0% 98%`
- White: `0 0% 100%`

### B. Typography

**Font Families**: 
- Primary: 'Inter' (Google Fonts) - Body text, forms, UI elements
- Headings: 'DM Sans' (Google Fonts) - Page titles, section headers

**Scale**:
- H1: text-4xl font-bold (Page titles)
- H2: text-2xl font-semibold (Section headers)
- H3: text-xl font-semibold (Card headers)
- Body: text-base (Forms, content)
- Small: text-sm (Helper text, labels)
- Tiny: text-xs (Timestamps, metadata)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Tight spacing: p-2, m-2 (within components)
- Standard spacing: p-4, p-6, gap-4 (cards, form fields)
- Section spacing: py-8, py-12, py-16 (page sections)
- Page margins: px-4 md:px-8 lg:px-12

**Grid System**:
- Max width: max-w-7xl mx-auto (main content)
- Form containers: max-w-2xl (application forms)
- Admin dashboard: Full width with sidebar

### D. Component Library

**Navigation**:
- Fixed header with council logo, navigation links, and user menu
- Sidebar navigation for admin dashboard
- Breadcrumbs for multi-step forms
- Mobile: Hamburger menu with slide-out drawer

**Forms**:
- Clean input fields with floating labels
- Grouped sections with light borders
- Progress indicator for multi-step applications
- Clear validation states (green check, red error)
- Helper text below fields in text-sm text-gray-600

**Cards**:
- White background with subtle shadow (shadow-sm)
- Rounded corners (rounded-lg)
- Border on hover (border-gray-200)
- Status badges in top-right corner

**Tables** (Admin Dashboard):
- Striped rows for readability
- Sortable column headers
- Inline action buttons (View, Approve, Reject)
- Sticky header for long lists
- Pagination at bottom

**Buttons**:
- Primary: Green background, white text, rounded-md
- Secondary: White background, green border, green text
- Danger: Red background for reject actions
- Icon buttons: Circular for quick actions
- Sizes: Default px-4 py-2, Large px-6 py-3

**Status Indicators**:
- Pill-shaped badges with appropriate color
- Icons paired with status text
- Timeline view for application progress

**Data Display**:
- Definition lists for property details
- Summary cards showing application count
- Certificate preview with official seal placeholder

**Modals/Overlays**:
- Confirmation dialogs for approve/reject
- Certificate preview lightbox
- Application details slide-over panel

### E. Visual Hierarchy

**Page Structure**:
1. Header: Council branding, navigation, user info
2. Hero/Title: Page title with breadcrumb
3. Main Content: Forms/dashboard with white card containers
4. Footer: Council contact info, links, copyright

**Application Form**:
- Clear step indicators at top
- Grouped sections with headings
- Submit button prominent at bottom right
- Save draft option in bottom left

**Admin Dashboard**:
- Summary statistics cards at top
- Filters and search bar
- Data table with bulk actions
- Quick action buttons per row

**Tracking Page**:
- Large reference number input
- Timeline visualization of progress
- Certificate download button when approved
- Contact support link if delayed

### Images
**Council Logo**: Place in top-left header, approximately 40-50px height
**Certificate Seal**: Circular official seal watermark on generated PDFs
**No Hero Image**: This is a utility application - lead directly with functionality

### Accessibility & Trust Elements
- High contrast ratios (WCAG AA compliant)
- Official government aesthetic with seal/logo
- Clear language in Shona and English options
- Consistent layout reduces cognitive load
- Print-friendly certificate format
- Offline-ready indicators for poor connectivity areas