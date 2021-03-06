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
                        my,
                        // return to p1.
                        mx + w,
                        my - h
                    );
                    el.data("coord", [i, j]);
                    el.data("data", 0);
                    if (el.data("data") == 0) {
                        el.attr({fill: "#aaa"});
                    } else {
                        el.attr({fill: "#ddd"});
                    }
                    el.click(function(e) {
                        var newData = this.data("data") == 0 ? 1: 0;
                        this.data("data", newData);
                        var c = newData == 0 ? "#aaa": "#ddd";
                        this.attr({fill: c});
                    });
                    el.mouseover(function(e) {
                        settings.changePos(this.data("coord"));
                        this.attr({stroke: "#f00", strokeWidth: 1});
                    });
                    el.mouseout(function(e) {
                        this.animate({strokeWidth: 0}, 500);
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
