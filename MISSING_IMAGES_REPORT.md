# Missing Images Report

## Summary

**Total Missing Images: 26**

These images are referenced in your HTML files but do not exist in the `assets/` folder. They were likely being served from your localhost:3845 server (Figma MCP) during development.

## Missing Images by Page

### index.html (16 missing)

- `74d022a2e9d12219f0ea1785ca21a70fc0ff7322.png` - Hero zipwire overflow image
- `22ac3c59900403b465fb931d5debadf474a11a7d.png` - Hero zipwire base image
- `487a08588634d59932e3cfa516a22d9482b1c11b.png` - Hero zipwire frame (variant2-1)
- `1f197b81d8ebb8bac67d9f2a7b2e2c2e604a20a1.png` - Hero zipwire frame (variant2-2)
- `95129d101f6c7681fb397bdb8ba15f2ca54dca4b.png` - Hero zipwire frame (variant2-3)
- `8c01fa7d849d94270c139e2919d2160276430641.png` - Hero zipwire frame (variant4-1)
- `47e4bde4fd4e353c376465bc0dba03d502561bb8.png` - Hero zipwire frame (variant4-2)
- `cdd40bb013991dd3648fb25a494072bb7bc3f78e.png` - Hero zipwire frame (variant5-1)
- `316ce031662ab6722d250451ee0c6c4834dee14f.png` - Hero zipwire frame (variant6-1)
- `f3707b642efef55cd7cebf07d42aa452a445290d.png` - Hero zipwire frame (variant7-1)
- `10fc6048a07961bad6e86a6faec50939f46a0b2f.svg` - Hero vector image
- `ff23c7e90675612971846f8207980c361c2d23f9.png` - Medlock Hotel attraction image
- `35de54f0f78096abe0cf849295a1b394461647a0.png` - Food & Drink attraction image (2nd)
- `d9027e57701130a55082a0e80110a1aaff7d1d4c.png` - Altitude attraction image
- `02d25f072fd0b6c4df304c80c975ed6f58799a92.png` - Co-op Live attraction image
- `18fc97b9bb98e544be7528f7de115eef55218aa5.png` - Etihad Stadium attraction image

### hotel.html (6 missing)

- `ff23c7e90675612971846f8207980c361c2d23f9.png` - Hero image
- `0b5e4d4205be1378e7a851b9ba315818a10c9ff4.png` - Sticky left section image (Standard Rooms)
- `271ac4be4b80828c18cfeb160755160b4dacf732.png` - Sticky left section image (Standard Rooms)
- `ed7b9439aecbf4060a3ed53e0f09148d88b0133b.png` - Sticky left section image (Penthouse Suites)
- `84c82ad49c84fbb4fa36d50ca45e61419c46a03a.png` - Sticky left section image (Penthouse Suites)
- `bd1579f779b48e952b8fd178950719741a9e303a.png` - Sticky left section image (Penthouse Suites)

### conferences-and-events.html (6 missing)

- `0ea5a50d991bbed707da125f804ccfdc90515d11.png` - Hero image
- `f1d0b7219b11bb03e369f2a94d018a3441d51c7a.png` - City Hall section image
- `c4668963363e2ab9a531508c4bf405b5c125c2d4.png` - Level 04 section image
- `95f7193f6e16db6a631d8d6a2cafaaf8849f3c57.png` - Crossbar section image
- `a2d1241334382617d23b276bad77740e09fdab2a.png` - Pitch View section image
- `22ac3c59900403b465fb931d5debadf474a11a7d.png` - Ticker background image

## Next Steps

To fix these missing images, you need to:

1. **Download the images from your Figma MCP server** (localhost:3845) or from Figma directly
2. **Save them to the `assets/` folder** with the exact filenames listed above
3. **Ensure all images are committed to your repository** so they deploy to Netlify

Alternatively, if you have these images with different names, you can:

- Rename them to match the expected filenames, OR
- Update the HTML files to reference the correct filenames

## Files That Exist (30 total)

The following images ARE present in the assets folder:

- `3cc3574067b9a6cfdbf9d5490a01b7fc9400b17e.png`
- `46ab9ff4e57c6c472014ef0198d9c9fe129a5d44.png`
- `56590ff02ca0bd37bd29960427b308d34a0b8bff.png`
- `5c4f03f3770be8c078b84bc92f321971a6e6d2f1.png`
- `68856543f9aad4d279ab00f8f5d7f9317f69a7b3.png`
- `70aa2afe3486d4e15724cf6e531755ff65247769.png`
- `92b0f039b9cd4f0935f4c7461b4972749c3634ec.png`
- `c6fcf401d4c14dedd5f4ca84a3ee9c0ca6a13ff3.png`
- `d0ca265ab0bdb81466bb91be67028797db80fba2.png`
- `dcc96f016e4d90cdd6bed3214971292facfc9478.png`
- `ebc9baff76ba4ed43c14f2563d0a23415d1a715c.png`
- `altitude-1.png`
- `altitude-2.png`
- `attr_co-op.mp4`
- `attractions-hero.png`
- `coop-live-1.png`
- `coop-live-3.png`
- `food-drink-1.png`
- `food-drink-2.png`
- `food-drink-3.png`
- `hotel-1.png`
- `hotel-2.png`
- `hotel-3.png`
- `hotel/image 18-1.png`
- `hotel/image 18.png`
- `hotel/image 19.png`
- `logo.svg`
- `stadium-1.png`
- `stadium-2.png`
- `ticker-background.png`
