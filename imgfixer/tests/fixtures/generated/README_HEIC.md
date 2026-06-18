# HEIC Test Asset

HEIC/HEIF images cannot be reliably generated programmatically in Node.js because they require hardware-encapsulated encoding (typically from Apple devices).

## To test /heic-to-jpg manually:

1. Take a photo with an iPhone (saves as .heic by default).
2. Transfer the .heic file to this directory.
3. Open `http://localhost:3000/heic-to-jpg` in a browser.
4. Upload the .heic file.
5. Verify:
   - Conversion to JPG succeeds.
   - The downloaded file opens correctly.
   - Dimensions are preserved.
   - Wrong file types are rejected.

Without a real HEIC sample, only unit-level testing of `heic2any` is possible.
