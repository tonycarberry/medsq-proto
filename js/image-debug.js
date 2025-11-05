// Image loading debug script
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");
  let loaded = 0;
  let failed = 0;

  images.forEach((img, index) => {
    const originalSrc = img.src;

    // Log image loading status
    img.addEventListener("load", function () {
      loaded++;
      console.log(`✓ Image ${index + 1} loaded: ${originalSrc}`);
      checkComplete();
    });

    img.addEventListener("error", function () {
      failed++;
      console.error(`✗ Image ${index + 1} failed to load: ${originalSrc}`);
      console.error(`  Error details:`, {
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
      });
      checkComplete();
    });

    // Check if already loaded
    if (img.complete) {
      if (img.naturalWidth > 0) {
        loaded++;
        console.log(`✓ Image ${index + 1} already loaded: ${originalSrc}`);
      } else {
        failed++;
        console.error(`✗ Image ${index + 1} failed (already checked): ${originalSrc}`);
      }
      checkComplete();
    }
  });

  function checkComplete() {
    if (loaded + failed === images.length) {
      console.log(`\n📊 Image Loading Summary:`);
      console.log(`   Loaded: ${loaded}/${images.length}`);
      console.log(`   Failed: ${failed}/${images.length}`);

      if (failed > 0) {
        console.warn(`\n⚠️  Some images failed to load. Possible causes:`);
        console.warn(`   1. Proxy server not running (check port 3846)`);
        console.warn(`   2. Figma MCP server not running (check port 3845)`);
        console.warn(`   3. Network/firewall blocking 10.224.148.128:3846`);
        console.warn(`   4. Browser cache (try hard refresh: Cmd+Shift+R or Ctrl+Shift+R)`);
      }
    }
  }
});
