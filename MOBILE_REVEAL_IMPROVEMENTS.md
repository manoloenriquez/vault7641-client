# Mobile Reveal Page Responsiveness Improvements

## Issue
Users on mobile devices were reporting that the confirm pop-up on the reveal page was not displaying properly, causing the confirm button to be cut off and not visible.

## Changes Made

### 1. Dialog Component (`src/components/ui/dialog.tsx`)

**Improvements:**
- Changed dialog max width from `max-w-[calc(100%-2rem)]` to `max-w-[calc(100%-1rem)]` for more screen space on mobile
- Increased max height from `max-h-[85vh]` to `max-h-[90vh]` on mobile for better use of available screen space
- Changed from `overflow-y-auto` to `overflow-hidden` on the parent, allowing child elements to handle scrolling
- Improved close button positioning with responsive spacing (`top-2.5 right-2.5 sm:top-3 sm:right-3 md:top-4 md:right-4`)
- Added `z-10` to close button to ensure it stays above scrolling content

### 2. Reveal Feature Dialog (`src/components/vault/nft-reveal-feature.tsx`)

**Improvements:**
- Added `flex flex-col` layout to `DialogContent` for proper flexbox structure
- Set `w-[calc(100%-1rem)]` for mobile to maximize available width
- Made `DialogHeader` flex-shrink-0 to prevent it from being compressed
- Created a scrollable middle section with `overflow-y-auto flex-1 min-h-0` for the dialog content
- Made `DialogFooter` flex-shrink-0 to ensure buttons are always visible
- Reduced font sizes and spacing on mobile for more compact display:
  - Dialog title: `text-base sm:text-lg md:text-xl` (was `text-lg sm:text-xl`)
  - Description: `text-[11px] sm:text-xs md:text-sm` (was `text-xs sm:text-sm`)
  - List items: `text-[10px] sm:text-[11px] md:text-xs` (was `text-[11px] sm:text-xs`)
- Shortened text descriptions on mobile for better readability:
  - "NFT will be revealed with custom guild artwork" → "NFT revealed with custom guild artwork"
  - "Metadata uploaded to Arweave (permanent storage)" → "Metadata uploaded to Arweave"
  - "Transaction approval required for metadata update" → "Transaction approval required"
  - "Fees: ~0.003 SOL (Arweave) + ~0.00005 SOL (transaction)" → "Fees: ~0.003 SOL + ~0.00005 SOL"
  - "Estimated Total Cost:" → "Estimated Total:"
- Increased button height to `h-10` on all screen sizes for better touch targets
- Added `font-semibold` to confirm button for better visibility

### 3. Global CSS (`src/app/globals.css`)

**Improvements:**
- Updated mobile dialog max-height calculation to include safe area insets:
  ```css
  max-height: 90vh;
  max-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 1rem);
  ```
- Added flex layout to dialog content for proper structure
- Increased minimum button height from `2.25rem` to `2.5rem` for better touch targets
- Made `DialogFooter` sticky on mobile to ensure buttons are always visible:
  ```css
  position: sticky;
  bottom: 0;
  background: inherit;
  z-index: 10;
  ```
- Made `DialogHeader` non-scrollable with `flex-shrink: 0`
- Added support for dynamic viewport height (`dvh`) for better mobile browser support
- Enhanced touch handling with `touch-action: pan-y` and `overscroll-behavior: contain`

### 4. Layout Viewport Settings (`src/app/layout.tsx`)

**Improvements:**
- Added viewport configuration for proper mobile scaling:
  ```typescript
  export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  }
  ```
- This ensures the page scales correctly on all mobile devices
- `viewportFit: 'cover'` ensures proper display on devices with notches (iPhone X+)

## Benefits

1. **Always Visible Buttons**: The confirm and cancel buttons are now always visible on mobile, regardless of dialog content length
2. **Better Space Utilization**: Dialog uses more of the available screen space (90vh instead of 85vh)
3. **Improved Touch Targets**: All buttons now have a minimum height of 2.5rem for easier tapping
4. **Proper Scrolling**: Only the middle content section scrolls, while header and footer remain fixed
5. **Safe Area Support**: Respects device safe areas (notches, home indicators) on modern mobile devices
6. **Compact Content**: Text is more concise and font sizes are optimized for mobile screens
7. **Better Layout Structure**: Flexbox layout ensures proper component sizing and positioning

## Testing Recommendations

Test the reveal page on:
- iPhone SE (small screen)
- iPhone 14 Pro (with notch)
- Android phones with various aspect ratios
- Landscape orientation on mobile
- Various browser zoom levels

The dialog should now:
✅ Display the confirm button at all times
✅ Allow scrolling of the content area when needed
✅ Keep the header and footer visible
✅ Respect safe areas on devices with notches
✅ Be easily readable with appropriately sized text

