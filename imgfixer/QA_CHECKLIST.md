# ImgFixer QA Checklist

## Build & Static Analysis

- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run build` — 0 errors, all routes generated
- [ ] TypeScript — no type errors

## Route Verification

Check that each route loads without crash (200 OK):

- [ ] `/` — Homepage
- [ ] `/tools` — All Tools listing
- [ ] `/compress-image` — Compress (quality mode)
- [ ] `/compress-image-to-100kb` — Compress to 100KB
- [ ] `/compress-image-to-200kb` — Compress to 200KB
- [ ] `/compress-image-to-500kb` — Compress to 500KB
- [ ] `/compress-image-to-1mb` — Compress to 1MB
- [ ] `/resize-image` — Resize
- [ ] `/heic-to-jpg` — HEIC to JPG
- [ ] `/webp-to-jpg` — WebP to JPG
- [ ] `/png-to-jpg` — PNG to JPG
- [ ] `/jpg-to-pdf` — JPG to PDF
- [ ] `/remove-exif` — Remove EXIF metadata
- [ ] `/privacy` — Privacy policy
- [ ] `/terms` — Terms of service
- [ ] `/contact` — Contact page
- [ ] `/sitemap.xml` — Sitemap XML
- [ ] `/robots.txt` — Robots txt

## Tool: Compress Image (Quality Mode) — /compress-image

### Upload Tests
- [ ] Upload JPG — processes without error
- [ ] Upload PNG — processes without error
- [ ] Upload WebP — processes without error
- [ ] Upload wrong-file.txt — shows rejection error
- [ ] Upload photo-large.jpg — handles large file

### Quality Slider
- [ ] Set quality to 100% — output is larger
- [ ] Set quality to 70% — output is reasonably compressed
- [ ] Set quality to 30% — output is significantly compressed
- [ ] Slider changes trigger re-compression immediately

### Download & Reset
- [ ] Downloaded file has .jpg/.png/.webp extension
- [ ] Downloaded file opens correctly in image viewer
- [ ] File size changes logically with quality changes
- [ ] Side-by-side before/after preview renders
- [ ] Reset clears everything and returns to upload state

## Tool: Compress Image (Target Size) — /compress-image-to-{100kb,200kb,500kb,1mb}

- [ ] `/compress-image-to-100kb`
- [ ] `/compress-image-to-200kb`
- [ ] `/compress-image-to-500kb`
- [ ] `/compress-image-to-1mb`

### Per target-size page:
- [ ] Upload photo-large.jpg — tool compresses toward target
- [ ] Upload photo-small-under-100kb.jpg — shows "already under target" message
- [ ] Upload transparent-logo.png — shows format change warning if PNG→JPG
- [ ] Upload screenshot-text.png — handles PNG compression
- [ ] Under/over target status indicator is accurate
- [ ] Warning text is clear and honest
- [ ] Downloaded file opens correctly
- [ ] Reset works

## Tool: Resize Image — /resize-image

### Upload
- [ ] Upload photo-medium.jpg
- [ ] Upload wrong-file.txt — rejection

### Presets
- [ ] 300×300
- [ ] 512×512
- [ ] 800×800
- [ ] 1080×1080
- [ ] 1200×630
- [ ] 1920×1080

### Resize Modes
- [ ] Fit — output respects aspect ratio, may be smaller than target
- [ ] Exact — output matches requested dimensions exactly
- [ ] Crop — output matches requested dimensions exactly, center-cropped

### Aspect Ratio
- [ ] Fit mode: changing width updates height proportionally
- [ ] Fit mode: toggle aspect lock/unlock
- [ ] Exact/Crop mode: width and height are independent

### Output Format
- [ ] Same as original
- [ ] JPG
- [ ] PNG
- [ ] WebP

### Validation
- [ ] Width/height accept positive integers only
- [ ] Dimensions > 6000px — rejection error
- [ ] Non-numeric input — rejection or handled gracefully

### Download
- [ ] Download works
- [ ] Downloaded file has correct dimensions
- [ ] Reset works

## Tool: WebP to JPG — /webp-to-jpg

- [ ] Upload photo.webp — converts to JPG
- [ ] Upload wrong-file.txt — rejection
- [ ] Dimensions are preserved in output
- [ ] File size is reasonable for JPG
- [ ] Downloaded file opens
- [ ] Reset works

## Tool: PNG to JPG — /png-to-jpg

- [ ] Upload transparent-logo.png — conversion succeeds
- [ ] Transparency warning appears
- [ ] Output is JPG format
- [ ] Transparent areas appear white in output
- [ ] Upload JPG — rejection (wrong file type)
- [ ] Upload wrong-file.txt — rejection
- [ ] Dimensions preserved
- [ ] Downloaded file opens
- [ ] Reset works

## Tool: HEIC to JPG — /heic-to-jpg

- [ ] Upload real iPhone .heic file — conversion succeeds
- [ ] Upload wrong-file.txt — rejection
- [ ] Dimensions preserved
- [ ] Downloaded JPG opens correctly
- [ ] Reset works
- [ ] *Note: Requires physical .heic file; see tests/fixtures/generated/README_HEIC.md*

## Tool: JPG to PDF — /jpg-to-pdf

### Single Image
- [ ] Upload 1 JPG — PDF created
- [ ] Download opens as valid PDF
- [ ] PDF has 1 page

### Multiple Images
- [ ] Upload 3 JPGs (multi-page-1, -2, -3) — PDF created
- [ ] Reorder: move page 3 up to position 2
- [ ] Remove one image — remaining images still work
- [ ] Add more images after initial upload

### PDF Settings
- [ ] Page size: A4
- [ ] Page size: Letter
- [ ] Page size: Same as image
- [ ] Orientation: Auto
- [ ] Orientation: Portrait
- [ ] Orientation: Landscape
- [ ] Margin: None
- [ ] Margin: Small
- [ ] Margin: Medium
- [ ] Image fit: Fit page
- [ ] Image fit: Fill page (crop)
- [ ] Image fit: Original size

### Validation
- [ ] Page count matches image count
- [ ] Image order in PDF matches the order shown in UI
- [ ] Downloaded PDF opens in PDF reader
- [ ] Wrong file type — rejection
- [ ] Files > 15MB — rejection
- [ ] More than 20 images — rejection
- [ ] Reset works

## Tool: Remove EXIF Metadata — /remove-exif

### Upload
- [ ] Upload photo-medium.jpg
- [ ] Upload transparent-logo.png
- [ ] Upload photo.webp
- [ ] Upload wrong-file.txt — rejection
- [ ] File > 15MB — rejection

### Output Format
- [ ] Same as original
- [ ] JPG
- [ ] PNG
- [ ] WebP

### Transparency Warning
- [ ] PNG to JPG — warning appears

### Processing
- [ ] Dimensions preserved
- [ ] Output opens in viewer
- [ ] UI wording does not overpromise (uses "re-encoding" language)
- [ ] Download works
- [ ] Reset works

## Legal Pages

- [ ] /privacy — loads, has meaningful content
- [ ] /terms — loads, has meaningful content
- [ ] /contact — loads, has contact form/message

## SEO

- [ ] /sitemap.xml — valid XML, lists all routes
- [ ] /robots.txt — allows crawling, points to sitemap
- [ ] Each page has unique `<title>` and `<meta name="description">`
- [ ] OG tags present on key pages
- [ ] Canonical URL tags present

## Responsive / Mobile

- [ ] Header nav works on mobile (< 640px)
- [ ] Tool grid collapses to single column on mobile
- [ ] Upload area is tappable on mobile
- [ ] All buttons are large enough to tap (≥ 44px)
- [ ] Footer links wrap on narrow screens

## Accessibility

- [ ] UploadBox has `role="button"` and `tabIndex={0}`
- [ ] UploadBox has `aria-label`
- [ ] Upload works via keyboard (Enter/Space)
- [ ] Drag-and-drop shows visual feedback on dragover
- [ ] Focus rings visible for keyboard navigation
- [ ] Range inputs have `aria-label`
- [ ] Color contrast meets WCAG AA (text on backgrounds)
