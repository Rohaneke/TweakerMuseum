        // Override the p5.js setup to attach to specific div
        let originalCreateCanvas = createCanvas;
        window.createCanvas = function(w, h) {
            let canvas = originalCreateCanvas(w, h);
            canvas.parent('p5-canvas');
            return canvas;
        };
        
        // Ensure the canvas resizes properly within the hero section
        function windowResized() {
            let heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
                background(bgColor);
                setupFieldAndParticles();
            }
        }
        
        // Override the original setup to use hero section dimensions
        let originalSetup = setup;
        window.setup = function() {
            pixelDensity(Math.min(1, window.devicePixelRatio));
            
            let heroSection = document.querySelector('.hero-section');
            createCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
            colorMode(HSB, 360, 100, 100, 1);
            
            resetSketch(true);
        };