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
            s.circle(100, 100, 100);
        }

        console.log("hoge");
    };

    /* default settings */
    $.fn.gridControlSVG.defaults = {
        readonly: false,
        initData: undefined,
        width: 5,
        height: 5,
        gridSize: 32,
        kind: "rect",
        borderColor: '#ccc',
        borderWidth: 0,
        colorOn:  '#50a0cc',
        colorOff: '#ffffff',
        changePos: undefined,
        changeData: undefined,
    };

}( jQuery ));
