/*
 * gridcontrol.svg.js
 *
 * Copyright (C) 2013 by Takahiro Kamatani (http://www.buhii.org/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function ($) {
    $.fn.gridControlSVG = function (options) {
        if (this.length > 1) {
            this.each(function() { $(this).gridControlSVG(options) });
            return this;
        }
        var settings = $.extend({}, $.fn.gridControlSVG.defaults, options);
        var s = Snap(this.selector);

        this.changeSettings = function(opt) {
            settings = $.extend({}, settings, opt);
            init();
        }

        init();
        function init() {
            if (settings.gridType == "hex") {
                initHoneycomb();
            } else {
                initRect();
            }
        }

        function initHoneycomb() {
            var h = settings.gridSize / 2;
            var w = h * Math.sqrt(3);
            var pushRow, mx, my;
            var el;
            var color;

            for (var j = 0; j < settings.height; j++) {
                pushRow = (j % 2 == 0) ? w: 0;
                my = 3 * j * h;
                for (var i = 0; i < settings.width; i++) {
                    mx = pushRow + (2 * i - 1) * w;
                    el = s.polyline(
                        // p1
                        mx + w,
                        my - h,
                        // p2
                        mx + 2 * w,
                        my,
                        // p3
                        mx + 2 * w,
                        my + 2 * h,
                        // p4
                        mx + w,
                        my + 3 * h,
                        // p5
                        mx,
                        my + 2 * h,
                        // p6
                        mx,
                        my
                    );
                    color = (Math.random() > 0.5) ? "#cfc": "#ccf";
                    el.data("coord", [i, j]);
                    el.data("color", color);
                    el.attr({fill: color});
                    el.click(function(e) {
                        console.log(this.data("coord"));
                    });
                    el.mouseover(function(e) {
                        this.attr({fill: "#f00"});
                    });
                    el.mouseout(function(e) {
                        this.attr({fill: this.data("color")});
                    });
                }
            }

        }
    };

    /* default settings */
    $.fn.gridControlSVG.defaults = {
        readonly: false,
        initData: undefined,
        width: 5,
        height: 5,
        gridSize: 32,
        gridType: "rect",
        borderColor: '#ccc',
        borderWidth: 0,
        colorOn:  '#50a0cc',
        colorOff: '#ffffff',
        changePos: undefined,
        changeData: undefined,
    };

}( jQuery ));
