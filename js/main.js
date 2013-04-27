OEN = (function(doc, win, $) {
    var lastRun = Date.now();

    var drawFrame = function() {
        var now = Date.now();
        var dt  = (now - lastRun) / 1000.0;


        lastRun = now;
        requestAnimationFrame(drawFrame);
    };

    return {
        init: function() {
            this.play();
        },

        play: function() {
            requestAnimationFrame(drawFrame);
        }
    };
}(document, window, jQuery));

window.addEventListener('load', function() {
    OEN.init();
});
