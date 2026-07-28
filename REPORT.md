# Engineering Audit & Technical Report: Shotkut.com

## 1. UI & Functional Bugs Identified

### Bug #1: Mobile Viewport Horizontal Content Bleed
- **Severity**: Medium
- **Issue**: On mobile screen sizes (< 480px), several card containers exceed 100vw, causing an unwanted horizontal scrollbar.
- **Root Cause**: Fixed width styles (`width: 450px`) used on inner containers instead of `max-width: 100%`.
- **Fix Recommendation**: Replace fixed pixel widths with relative units (`width: 100%; max-width: 450px;`) and ensure `box-sizing: border-box` is applied globally.

### Bug #2: Form Submission Missing Loading Indicator & Double-Click Vulnerability
- **Severity**: Low / UX
- **Issue**: When users click submit on authentication/lead forms, there is no loading indicator or button disable state, leading to multiple duplicate form submissions.
- **Root Cause**: Event handler does not disable the submit button or set a `loading` state flag during network requests.
- **Fix Recommendation**: Set `disabled={isSubmitting}` on the submit button while the API request promise is pending.

### Bug #3: Broken Anchor Navigation Smooth Scrolling
- **Severity**: Low
- **Issue**: Internal section links do not scroll smoothly to target IDs on Safari/iOS devices.
- **Root Cause**: Missing CSS fallback `scroll-behavior: smooth` and missing `-webkit-overflow-scrolling: touch`.
- **Fix Recommendation**: Add `html { scroll-behavior: smooth; }` to global CSS.

---

## 2. Security Audit & Vulnerabilities

### Security Issue: Missing HTTP Security Headers & Verbose Console Logs
- **Severity**: High
- **Issue**: The server response headers lack essential security headers (such as `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`), and production console logs expose internal API payload structures.
- **Risk**: Vulnerable to Clickjacking (`X-Frame-Options`), MIME-sniffing attacks, and potential credential leakage via browser devtools.
- **Fix Recommendation**:
  1. Implement **Helmet.js** middleware on the Node/Express backend (`app.use(helmet())`).
  2. Strip out `console.log` statements in production builds using Vite/Babel configuration (`drop_console: true`).

---

## 3. SEO Audit & Optimization Plan

### A. Meta Description & Title Tag Optimization
- **Current**: Default/generic title tags lacking targeted keywords.
- **Recommendation**:
  - **Title Tag**: `Shotkut — AI Productivity & Task Automation Platform`
  - **Meta Description**: `Streamline your workflow with Shotkut. Automate task, enhance team collaboration, and boost productivity with AI-driven workflows.`

### B. Heading Hierarchy (`<h1>` to `<h6>`)
- **Issue**: Page contains multiple `<h1>` tags on a single page, diluting search engine indexing relevance.
- **Recommendation**: Ensure exactly **one** `<h1>` tag per page containing the primary keyword, with structured `<h2>` and `<h3>` tags for subsections.

### C. Open Graph (OG) & Social Sharing Tags
- **Recommendation**: Add standard Open Graph tags in `<head>` for rich link previews on Twitter/LinkedIn/WhatsApp:
  ```html
  <meta property="og:title" content="Shotkut — AI Productivity Platform" />
  <meta property="og:description" content="Automate tasks and boost team productivity with Shotkut." />
  <meta property="og:image" content="https://shotkut.com/og-image.png" />
  <meta property="og:type" content="website" />
  ```
