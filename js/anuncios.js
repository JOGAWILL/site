
/* ========== ADSTERRA GLOBAL AD FILE ========== */
/* This script injects all your Adsterra ads automatically */

/* Helper to write blocks safely */
function inject(html) {
    document.write(html);
}

/* ---------------- TOP BANNER 728x90 ---------------- */
inject(`
<div style="text-align:center; margin:20px auto;">
<script type="text/javascript">
    atOptions = {
        'key' : 'd7f9fd9b65051082e170401380571aac',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/d7f9fd9b65051082e170401380571aac/invoke.js"></script>
</div>
`);

/* ---------------- BANNER 468x60 (before content) ---------------- */
inject(`
<div style="text-align:center; margin:20px auto;">
<script type="text/javascript">
    atOptions = {
        'key' : '1e344a3fdf1d83a265d8b241043e31d2',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/1e344a3fdf1d83a265d8b241043e31d2/invoke.js"></script>
</div>
`);

/* ---------------- POPUNDER ---------------- */
inject(`
<script type='text/javascript' src='//pl28129076.effectivegatecpm.com/e5/1c/eb/e51cebe6f8dee8c5f2b89912fd8dbb41.js'></script>
`);

/* ---------------- SOCIAL BAR ---------------- */
inject(`
<script type='text/javascript' src='//pl28142518.effectivegatecpm.com/6b/31/b1/6b31b1db2012ec28789a2d51ce932ec9.js'></script>
`);

/* ---------------- SMARTLINK ---------------- */
inject(`
<a href="https://www.effectivegatecpm.com/dqmnuhnn9?key=81e1f14bf425238d457a3c71b95d7f21" style="display:none;"></a>
`);

/* ---------------- NATIVE BANNER (middle) ---------------- */
inject(`
<div style="text-align:center; margin:25px 0;">
<script async="async" data-cfasync="false" src="//pl28152870.effectivegatecpm.com/5811c7abb70e6b21727831675f614a3c/invoke.js"></script>
<div id="container-5811c7abb70e6b21727831675f614a3c"></div>
</div>
`);

/* ---------------- FINAL 320x50 ---------------- */
inject(`
<div style="text-align:center; margin:20px auto;">
<script type="text/javascript">
    atOptions = {
        'key' : '52634881ed357d23ec22fa9cce51fa95',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/52634881ed357d23ec22fa9cce51fa95/invoke.js"></script>
</div>
`);
