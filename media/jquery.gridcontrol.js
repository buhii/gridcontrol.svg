/*
 * jquery.gridcontrol.js
 *
 * Copyright (C) 2013 by Takahiro Kamatani (http://www.buhii.org/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function ($) {
    $.fn.gridControl = function (options) {
        if (this.length > 1) {
            this.each(function() { $(this).gridControl(options) });
            return this;
        }
        var width, height;
        var ctx = this[0].getContext("2d");
        var settings = $.extend({}, $.fn.gridControl.defaults, options);
        var dataManager;
        var target = this;
        var drawEnabled;
        var currentPos;

        this.changeSettings = function(opt) {
            settings = $.extend({}, settings, opt);
            init();
        }
        this.data = function() {
            return dataManager.data;
        };

        init();
        function init() {
            dataManager = new $.fn.gridControl.DataManager(settings);
            drawEnabled = false;
            currentPos = undefined;
            var gSize = settings.gridSize;
            width = gSize * settings.gridColumn + settings.borderWidth;
            height = gSize * Math.ceil(dataManager.length / settings.gridColumn) + settings.borderWidth;
            target.width(width);
            target.height(height);
            ctx.canvas.width = width;
            ctx.canvas.height = height;

            drawBorder();
            drawData();
        }
        function drawBorder() {
            var i;
            var gSize = settings.gridSize;
            var tr = Math.ceil(settings.borderWidth / 2.0);
            var w = settings.gridColumn;
            var h = Math.ceil(dataManager.length / w);

            ctx.translate(tr, tr);
            ctx.strokeStyle = settings.borderColor;
            ctx.lineWidth = settings.borderWidth;

            var lineLength;

            for (i = 0; i <= w; i++) {
                if (dataManager.length % w != 0 &&
                    Math.floor(dataManager.length / w) == 0) {
                    if (i > (dataManager.length % w)) {
                        break;
                    }
                }
                ctx.beginPath();
                ctx.moveTo(gSize * i, -tr);
                if ((dataManager.length % w) >= i) {
                    lineLength = gSize * h;
                } else if (dataManager.length % w != 0) {
                    lineLength = gSize * (h - 1);
                }
                ctx.lineTo(gSize * i, lineLength + tr);
                ctx.stroke();
            }
            for (i = 0; i <= h; i++) {
                ctx.beginPath();
                ctx.moveTo(-tr, gSize * i);
                if (Math.floor(dataManager.length / w) == 0) {
                    lineLength = gSize * (dataManager.length % w) + tr;
                } else if (i == h && dataManager.length % w != 0) {
                    lineLength = gSize * (dataManager.length % w) + tr;
                } else {
                    lineLength = gSize * w + tr;
                }
                ctx.lineTo(lineLength, gSize * i);
                ctx.stroke();
            }
            ctx.translate(0, 0);
        }
        function drawData() {
            for (var i = 0; i < dataManager.length; i++) {
                drawPos(i + dataManager.minPos);
            }
        }
        function drawPos(pos) {
            var val = dataManager.getValue(pos);
            ctx.fillStyle = (val) ? settings.colorOn: settings.colorOff;
            var rect = dataManager.getRect(pos);
            ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
        }
        function updatePos(x, y) {
            var newPos = dataManager.getPos(x, y);
            if (newPos && (!currentPos || currentPos != newPos)) {
                if (settings.changePos) {
                    settings.changePos(newPos);
                }
                return newPos;
            }
        }
        function invertValue(x, y) {
            var newPos = updatePos(x, y);
            if (newPos && drawEnabled && !settings.readonly) {
                currentPos = newPos;
                dataManager.invertValue(currentPos);
                if (settings.changeData) {
                    settings.changeData(dataManager.data);
                }
                drawPos(currentPos);
            }
        }

        /* mouse or touch events */
        $(window).bind('mouseup', function() {
            drawEnabled = false;
            curentPos = undefined;
        });
        this.mousedown(function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            drawEnabled = true;
            invertValue(e.offsetX, e.offsetY);
        });
        this.mouseup(function() {
            drawEnabled = false;
            currentPos = undefined;
        });
        this.mousemove(function(e) {
            invertValue(e.offsetX, e.offsetY);
        });
        this.bind('touchcancel', function() {
            drawEnabled = false;
            currentPos = undefined;
        });
        this.bind('touchstart touchmove', function(evt) {
            if (evt.type == 'touchstart') {
                currentPos = undefined;
            }
            var e = evt.originalEvent;
            e.preventDefault();
            drawEnabled = true;
            for (i = 0; i < e.touches.length; i++) {
                invertValue(
                    e.touches[i].pageX - this.offsetLeft,
                    e.touches[i].pageY - this.offsetTop
                );
            }
        });
        this.bind('touchup', function(evt) {
            drawEnabled = false;
            currentPos = undefined;
        });

        return this;
    };

    /* data manager. */
    $.fn.gridControl.DataManager = function(opt) {
        this.length = opt.dataRange[1] - opt.dataRange[0] + 1;
        this.data = opt.initData || [];
        for (var i = this.data.length; i < this.length; i++) {
            this.data.push(0);
        }
        this.minPos = opt.dataRange[0];

        var gs = opt.gridSize;
        var gc = opt.gridColumn;
        var bw = opt.borderWidth;

        this.getPos = function (x, y) {
            // Do not permit cross-border
            if (x <= bw || y <= bw || (gs * gc) <= x)
                return undefined;

            // return grid number
            var gx = Math.floor((x - bw) / gs);
            var gy = Math.floor((y - bw) / gs);
            var rawPos = gy * gc + gx;
            if (0 <= rawPos && rawPos < this.length) {
                return this.minPos + rawPos;
            } else {
                return undefined;
            }
        };
        this.getValue = function(pos) {
            return this.data[pos - this.minPos];
        };
        this.getRect = function(pos) {
            var gx = (pos - this.minPos) % gc;
            var gy = Math.floor((pos - this.minPos) / gc);
            return [gx * gs + bw / 2, gy * gs + bw / 2, gs - bw, gs - bw];
        };
    };
    $.fn.gridControl.DataManager.prototype = {
        invertValue: function(pos) {
            pos -= this.minPos;
            this.data[pos] = (this.data[pos] == 0) ? 1: 0;
        },
    };

    /* default settings */
    $.fn.gridControl.defaults = {
        readonly: false,
        initData: undefined,
        dataRange: [1, 25],
        gridColumn: 5,
        gridSize: 32,
        borderColor: '#ccc',
        borderWidth: 0,
        showNumber: false,
        colorOn:  '#50a0cc',
        colorOff: '#ffffff',
        changePos: undefined,
        changeData: undefined,
    };

}( jQuery ));
