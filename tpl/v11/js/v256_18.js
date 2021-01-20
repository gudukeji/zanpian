$(function() {
	var throttle = function(fn, delay, mustRunDelay) {
			var timer;
			var t_start;
			return function(val) {
				var args = arguments,
					t_curr = +new Date();
				clearTimeout(timer);
				if (!t_start) {
					t_start = t_curr
				}
				if (t_curr - t_start >= mustRunDelay) {
					fn.apply(null, args);
					t_start = t_curr
				} else {
					timer = setTimeout(function() {
						fn.apply(null, args)
					}, delay)
				}
			}
		};

	function LazyLoad() {}
	var download_count = 0,
		ele_obj = [];
	LazyLoad.prototype = {
		init: function() {
			this.initElementMap();
			this.lazy();
			this.throttleLoad()
		},
		getPosition: {
			Viewport: function() {
				if (document.compatMode == "BackCompat") {
					var Height = document.body.clientHeight
				} else {
					var Height = document.documentElement.clientHeight
				}
				return Height
			},
			ScrollTop: function() {
				if (document.compatMode == "BackCompat") {
					var elementScrollTop = document.body.scrollTop
				} else {
					var elementScrollTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop
				}
				return elementScrollTop
			},
			ElementViewTop: function(ele) {
				if (ele) {
					var actualTop = ele.offsetTop;
					var current = ele.offsetParent;
					while (current !== null) {
						actualTop += current.offsetTop;
						current = current.offsetParent
					}
					return actualTop - this.ScrollTop()
				}
			}
		},
		initElementMap: function() {
			var el = document.getElementsByTagName("img");
			for (var j = 0, len2 = el.length; j < len2; j++) {
				if (typeof(el[j].getAttribute("data-original")) == "string") {
					ele_obj.push(el[j]);
					download_count++
				}
			}
		},
		lazy: function() {
			if (!download_count) {
				return
			}
			var innerHeight = LazyLoad.prototype.getPosition.Viewport();
			for (var i = 0, len = ele_obj.length; i < len; i++) {
				var t_index = LazyLoad.prototype.getPosition.ElementViewTop(ele_obj[i]);
				if (t_index < innerHeight) {
					ele_obj[i].src = ele_obj[i].getAttribute("data-original");
					ele_obj[i].removeAttribute("data-original");
					delete ele_obj[i];
					download_count--
				}
			}
		},
		throttleLoad: function() {
			var throttle1 = throttle(LazyLoad.prototype.lazy, 200, 500);
			window.onscroll = window.onload = function() {
				throttle1()
			}
		},
	};
	window.LazyLoad = LazyLoad;
	var x = new LazyLoad();
	x.init()
});
$(function() {
	var place;
	$(document).click(function(e) {
		$(".f_drop").hide();
		$(".f_search input").attr("placeholder", place)
	});
	$(".f_search").click(function(e) {
		place = $(this).children("input").attr("placeholder");
		$(this).children("input").attr("placeholder", "");
		$(".f_drop").show();
		e = e || event;
		stopFunc(e)
	});
	$(".f_drop").click(function(e) {
		e = e || event;
		stopFunc(e)
	});

	function stopFunc(e) {
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
	}
});
$(function() {
	$(".r_login").click(function() {
		$(".login").show()
	});
	$(".login_close").click(function() {
		$(".login").hide()
	})
});
function coreSlide(box, prev, next, watchNum) {
	function m() {
		var wrap = $(box),
			btnL = $(prev),
			btnR = $(next),
			inner = wrap.children(),
			clone = wrap.children().children().clone();
		wrap.css({
			"position": "relative"
		});
		inner.css({
			"position": "absolute",
			"top": "0",
			"left": "0"
		});
		wrap.children().empty();
		wrap.children().append(inner);
		inner.append(clone);
		var incon = inner,
			con = incon,
			inWidth = incon.children().outerWidth(),
			width = incon.children().outerWidth(true),
			height = incon.children().height(),
			mar = width - inWidth;
		var sl = 0;
		var num = 0,
			showNum = watchNum,
			total = incon.children().length,
			inconWidth = incon.innerWidth(width * total),
			hideNum = total - showNum,
			onlyNum = con.parent().innerWidth() - (inWidth * showNum + mar * (showNum - 1)),
			scrollNum = width,
			lastScroll = width - onlyNum,
			overScroll = width * (hideNum - 1) + lastScroll;
		if (sl == 0 && inner.children().length > showNum) {
			btnL.hide();
			btnR.show()
		} else {
			btnL.hide();
			btnR.hide()
		}
		btnL.click(function() {
			$(this).bind("selectstart", function() {
				return false
			});
			num--;
			if (num == hideNum - 1) {
				sl += lastScroll
			} else {
				sl += scrollNum
			}
			if (num < 0) {
				num = 0;
				sl = 0
			}
			if (sl == 0) {
				btnL.hide();
				btnR.show()
			} else {
				btnL.show();
				btnR.show()
			}
			con.stop().animate({
				"left": sl
			})
		});
		btnR.click(function() {
			$(this).bind("selectstart", function() {
				return false
			});
			num++;
			if (num == hideNum) {
				sl -= lastScroll
			} else {
				sl -= scrollNum
			}
			if (num >= hideNum) {
				num = hideNum;
				sl = -overScroll
			}
			if (sl == -overScroll) {
				btnL.show();
				btnR.hide()
			} else {
				btnL.show();
				btnR.show()
			}
			con.stop().animate({
				"left": sl
			})
		})
	}
	$(window).resize(m).trigger("resize")
}(function(a) {
	a.fn.slide = function(b) {
		return a.fn.slide.defaults = {
			effect: "fade",
			autoPlay: !1,
			delayTime: 500,
			interTime: 2500,
			triggerTime: 150,
			defaultIndex: 0,
			titCell: ".hd li",
			mainCell: ".bd",
			targetCell: null,
			trigger: "mouseover",
			scroll: 1,
			vis: 1,
			titOnClassName: "on",
			autoPage: !1,
			prevCell: ".prev",
			nextCell: ".next",
			pageStateCell: ".pageState",
			opp: !1,
			pnLoop: !0,
			easing: "linear",
			startFun: null,
			endFun: null,
			switchLoad: null
		}, this.each(function() {
			var c = a.extend({}, a.fn.slide.defaults, b),
				d = c.effect,
				e = a(c.prevCell, a(this)),
				f = a(c.nextCell, a(this)),
				g = a(c.pageStateCell, a(this)),
				h = a(c.titCell, a(this)),
				i = h.length,
				j = a(c.mainCell, a(this)),
				k = j.children().length,
				l = c.switchLoad;
			if (null != c.targetCell) {
				var m = a(c.targetCell, a(this))
			}
			var n = parseInt(c.defaultIndex),
				o = parseInt(c.delayTime),
				p = parseInt(c.interTime);
			parseInt(c.triggerTime);
			var r = parseInt(c.scroll),
				s = parseInt(c.vis),
				t = "false" == c.autoPlay || 0 == c.autoPlay ? !1 : !0,
				u = "false" == c.opp || 0 == c.opp ? !1 : !0,
				v = "false" == c.autoPage || 0 == c.autoPage ? !1 : !0,
				w = "false" == c.pnLoop || 0 == c.pnLoop ? !1 : !0,
				x = 0,
				y = 0,
				z = 0,
				A = 0,
				B = c.easing,
				C = null,
				D = n;
			if (0 == i && (i = k), v) {
				var E = k - s;
				i = 1 + parseInt(0 != E % r ? E / r + 1 : E / r), 0 >= i && (i = 1), h.html("");
				for (var F = 0; i > F; F++) {
					h.append("<li>" + (F + 1) + "</li>")
				}
				var h = a("li", h)
			}
			if (j.children().each(function() {
				a(this).width() > z && (z = a(this).width(), y = a(this).outerWidth(!0)), a(this).height() > A && (A = a(this).height(), x = a(this).outerHeight(!0))
			}), k >= s) {
				switch (d) {
				case "fold":
					j.css({
						position: "relative",
						width: y,
						height: x
					}).children().css({
						position: "absolute",
						width: z,
						left: 0,
						top: 0,
						display: "none"
					});
					break;
				case "top":
					j.wrap('<div class="tempWrap" style="position:relative; height:' + s * x + 'px"></div>').css({
						position: "relative",
						padding: "0",
						margin: "0"
					}).children().css({
						height: A
					});
					break;
				case "left":
					j.wrap('<div class="tempWrap" style="position:relative; width:' + s * y + 'px"></div>').css({
						width: k * y,
						position: "relative",
						padding: "0"
					}).children().css({
						"float": "left",
						width: z
					});
					break;
				case "leftLoop":
				case "leftMarquee":
					j.children().clone().appendTo(j).clone().prependTo(j), j.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + s * y + 'px"></div>').css({
						width: 3 * k * y,
						position: "relative",
						overflow: "hidden",
						padding: "0",
						margin: "0",
						left: -k * y
					}).children().css({
						"float": "left",
						width: z
					});
					break;
				case "topLoop":
				case "topMarquee":
					j.children().clone().appendTo(j).clone().prependTo(j), j.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + s * x + 'px"></div>').css({
						height: 3 * k * x,
						position: "relative",
						padding: "0",
						margin: "0",
						top: -k * x
					}).children().css({
						height: A
					})
				}
			}
			var G = function() {
					a.isFunction(c.startFun) && c.startFun(n, i)
				},
				H = function() {
					a.isFunction(c.endFun) && c.endFun(n, i)
				},
				I = function(b) {
					b.eq(n).find("img").each(function() {
						a(this).attr(l) !== void 0 && a(this).attr("src", a(this).attr(l)).removeAttr(l)
					})
				},
				J = function(a) {
					if (D != n || a || "leftMarquee" == d || "topMarquee" == d) {
						switch (d) {
						case "fade":
						case "fold":
						case "top":
						case "left":
							n >= i ? n = 0 : 0 > n && (n = i - 1);
							break;
						case "leftMarquee":
						case "topMarquee":
							n >= 1 ? n = 1 : 0 >= n && (n = 0);
							break;
						case "leftLoop":
						case "topLoop":
							var b = n - D;
							i > 2 && b == -(i - 1) && (b = 1), i > 2 && b == i - 1 && (b = -1);
							var p = Math.abs(b * r);
							n >= i ? n = 0 : 0 > n && (n = i - 1)
						}
						if (G(), null != l && I(j.children()), m && (null != l && I(m), m.hide().eq(n).animate({
							opacity: "show"
						}, o, function() {
							j[0] || H()
						})), k >= s) {
							switch (d) {
							case "fade":
								j.children().stop(!0, !0).eq(n).animate({
									opacity: "show"
								}, o, B, function() {
									H()
								}).siblings().hide();
								break;
							case "fold":
								j.children().stop(!0, !0).eq(n).animate({
									opacity: "show"
								}, o, B, function() {
									H()
								}).siblings().animate({
									opacity: "hide"
								}, o, B);
								break;
							case "top":
								j.stop(!0, !1).animate({
									top: -n * r * x
								}, o, B, function() {
									H()
								});
								break;
							case "left":
								j.stop(!0, !1).animate({
									left: -n * r * y
								}, o, B, function() {
									H()
								});
								break;
							case "leftLoop":
								0 > b ? j.stop(!0, !0).animate({
									left: -(k - p) * y
								}, o, B, function() {
									for (var a = 0; p > a; a++) {
										j.children().last().prependTo(j)
									}
									j.css("left", -k * y), H()
								}) : j.stop(!0, !0).animate({
									left: -(k + p) * y
								}, o, B, function() {
									for (var a = 0; p > a; a++) {
										j.children().first().appendTo(j)
									}
									j.css("left", -k * y), H()
								});
								break;
							case "topLoop":
								0 > b ? j.stop(!0, !0).animate({
									top: -(k - p) * x
								}, o, B, function() {
									for (var a = 0; p > a; a++) {
										j.children().last().prependTo(j)
									}
									j.css("top", -k * x), H()
								}) : j.stop(!0, !0).animate({
									top: -(k + p) * x
								}, o, B, function() {
									for (var a = 0; p > a; a++) {
										j.children().first().appendTo(j)
									}
									j.css("top", -k * x), H()
								});
								break;
							case "leftMarquee":
								var q = j.css("left").replace("px", "");
								0 == n ? j.animate({
									left: ++q
								}, 0, function() {
									if (j.css("left").replace("px", "") >= 0) {
										for (var a = 0; k > a; a++) {
											j.children().last().prependTo(j)
										}
										j.css("left", -k * y)
									}
								}) : j.animate({
									left: --q
								}, 0, function() {
									if (2 * -k * y >= j.css("left").replace("px", "")) {
										for (var a = 0; k > a; a++) {
											j.children().first().appendTo(j)
										}
										j.css("left", -k * y)
									}
								});
								break;
							case "topMarquee":
								var t = j.css("top").replace("px", "");
								0 == n ? j.animate({
									top: ++t
								}, 0, function() {
									if (j.css("top").replace("px", "") >= 0) {
										for (var a = 0; k > a; a++) {
											j.children().last().prependTo(j)
										}
										j.css("top", -k * x)
									}
								}) : j.animate({
									top: --t
								}, 0, function() {
									if (2 * -k * x >= j.css("top").replace("px", "")) {
										for (var a = 0; k > a; a++) {
											j.children().first().appendTo(j)
										}
										j.css("top", -k * x)
									}
								})
							}
						}
						h.removeClass(c.titOnClassName).eq(n).addClass(c.titOnClassName), D = n, 0 == w && (f.removeClass("nextStop"), e.removeClass("prevStop"), 0 == n ? e.addClass("prevStop") : n == i - 1 && f.addClass("nextStop")), g.html("<span>" + (n + 1) + "</span>/" + i)
					}
				};
			J(!0), t && ("leftMarquee" == d || "topMarquee" == d ? (u ? n-- : n++, C = setInterval(J, p), j.hover(function() {
				t && clearInterval(C)
			}, function() {
				t && (clearInterval(C), C = setInterval(J, p))
			})) : (C = setInterval(function() {
				u ? n-- : n++, J()
			}, p), a(this).hover(function() {
				t && clearInterval(C)
			}, function() {
				t && (clearInterval(C), C = setInterval(function() {
					u ? n-- : n++, J()
				}, p))
			})));
			var K;
			"mouseover" == c.trigger ? h.hover(function() {
				n = h.index(this), K = window.setTimeout(J, c.triggerTime)
			}, function() {
				clearTimeout(K)
			}) : h.click(function() {
				n = h.index(this), J()
			}), f.click(function() {
				(1 == w || n != i - 1) && (n++, J())
			}), e.click(function() {
				(1 == w || 0 != n) && (n--, J())
			})
		})
	}
})(jQuery), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
	def: "easeOutQuad",
	swing: function(a, b, c, d, e) {
		return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
	},
	easeInQuad: function(a, b, c, d, e) {
		return d * (b /= e) * b + c
	},
	easeOutQuad: function(a, b, c, d, e) {
		return -d * (b /= e) * (b - 2) + c
	},
	easeInOutQuad: function(a, b, c, d, e) {
		return 1 > (b /= e / 2) ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
	},
	easeInCubic: function(a, b, c, d, e) {
		return d * (b /= e) * b * b + c
	},
	easeOutCubic: function(a, b, c, d, e) {
		return d * ((b = b / e - 1) * b * b + 1) + c
	},
	easeInOutCubic: function(a, b, c, d, e) {
		return 1 > (b /= e / 2) ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
	},
	easeInQuart: function(a, b, c, d, e) {
		return d * (b /= e) * b * b * b + c
	},
	easeOutQuart: function(a, b, c, d, e) {
		return -d * ((b = b / e - 1) * b * b * b - 1) + c
	},
	easeInOutQuart: function(a, b, c, d, e) {
		return 1 > (b /= e / 2) ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
	},
	easeInQuint: function(a, b, c, d, e) {
		return d * (b /= e) * b * b * b * b + c
	},
	easeOutQuint: function(a, b, c, d, e) {
		return d * ((b = b / e - 1) * b * b * b * b + 1) + c
	},
	easeInOutQuint: function(a, b, c, d, e) {
		return 1 > (b /= e / 2) ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
	},
	easeInSine: function(a, b, c, d, e) {
		return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
	},
	easeOutSine: function(a, b, c, d, e) {
		return d * Math.sin(b / e * (Math.PI / 2)) + c
	},
	easeInOutSine: function(a, b, c, d, e) {
		return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
	},
	easeInExpo: function(a, b, c, d, e) {
		return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
	},
	easeOutExpo: function(a, b, c, d, e) {
		return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
	},
	easeInOutExpo: function(a, b, c, d, e) {
		return 0 == b ? c : b == e ? c + d : 1 > (b /= e / 2) ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
	},
	easeInCirc: function(a, b, c, d, e) {
		return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
	},
	easeOutCirc: function(a, b, c, d, e) {
		return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
	},
	easeInOutCirc: function(a, b, c, d, e) {
		return 1 > (b /= e / 2) ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
	},
	easeInElastic: function(a, b, c, d, e) {
		var f = 1.70158,
			g = 0,
			h = d;
		if (0 == b) {
			return c
		}
		if (1 == (b /= e)) {
			return c + d
		}
		if (g || (g = 0.3 * e), Math.abs(d) > h) {
			h = d;
			var f = g / 4
		} else {
			var f = g / (2 * Math.PI) * Math.asin(d / h)
		}
		return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g)) + c
	},
	easeOutElastic: function(a, b, c, d, e) {
		var f = 1.70158,
			g = 0,
			h = d;
		if (0 == b) {
			return c
		}
		if (1 == (b /= e)) {
			return c + d
		}
		if (g || (g = 0.3 * e), Math.abs(d) > h) {
			h = d;
			var f = g / 4
		} else {
			var f = g / (2 * Math.PI) * Math.asin(d / h)
		}
		return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
	},
	easeInOutElastic: function(a, b, c, d, e) {
		var f = 1.70158,
			g = 0,
			h = d;
		if (0 == b) {
			return c
		}
		if (2 == (b /= e / 2)) {
			return c + d
		}
		if (g || (g = e * 0.3 * 1.5), Math.abs(d) > h) {
			h = d;
			var f = g / 4
		} else {
			var f = g / (2 * Math.PI) * Math.asin(d / h)
		}
		return 1 > b ? -0.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + c : 0.5 * h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
	},
	easeInBack: function(a, b, c, d, e, f) {
		return void 0 == f && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c
	},
	easeOutBack: function(a, b, c, d, e, f) {
		return void 0 == f && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
	},
	easeInOutBack: function(a, b, c, d, e, f) {
		return void 0 == f && (f = 1.70158), 1 > (b /= e / 2) ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
	},
	easeInBounce: function(a, b, c, d, e) {
		return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
	},
	easeOutBounce: function(a, b, c, d, e) {
		return 1 / 2.75 > (b /= e) ? d * 7.5625 * b * b + c : 2 / 2.75 > b ? d * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + c : 2.5 / 2.75 > b ? d * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + c
	},
	easeInOutBounce: function(a, b, c, d, e) {
		return e / 2 > b ? 0.5 * jQuery.easing.easeInBounce(a, 2 * b, 0, d, e) + c : 0.5 * jQuery.easing.easeOutBounce(a, 2 * b - e, 0, d, e) + 0.5 * d + c
	}
});

function fixBar(a, b) {
	function g() {
		var g = $(window).scrollLeft(),
			h = $(window).scrollTop(),
			i = $(document).height(),
			j = $(window).height(),
			k = c.height(),
			l = d.height(),
			m = k > l ? f : e,
			n = k > l ? d : c,
			o = k > l ? c.offset().left + c.outerWidth(!0) - g : d.offset().left - c.outerWidth(!0) - g,
			p = k > l ? l : k,
			q = k > l ? k : l,
			r = parseInt(q - j) - parseInt(p - j);
		$(a + "," + b).removeAttr("style"), j > i || p > q || m > h || p - j + m >= h ? n.removeAttr("style") : j > p && h - m >= r || p > j && h - m >= q - j ? n.attr("style", "margin-top:" + r + "px;") : n.attr("style", "_margin-top:" + (h - m) + "px;position:fixed;left:" + o + "px;" + (j > p ? "top" : "bottom") + ":0;")
	}
	if ($(a).length > 0 && $(b).length > 0) {
		var c = $(a),
			d = $(b),
			e = c.offset().top,
			f = d.offset().top;
		$(window).resize(g).scroll(g).trigger("resize")
	}
}
function fixBarL(l, c, ff) {
	function g() {
		var flag = ff,
			k = l.height(),
			o = c.height(),
			j = $(document).height(),
			h = $(window).scrollTop(),
			ow = $(window).width(),
			w = l.outerWidth(true),
			s = k > o ? n : m,
			p = k > o ? o : k,
			q = k > o ? k : o,
			r = parseInt(q - j) - parseInt(p - j);
		if (h > m) {
			l.attr("style", "_margin-top:" + (h - s) + "px;position:fixed;top:0px;left:" + (ow - (l.parent().outerWidth())) / 2 + "px");
			if (window.screen.width > 1440) {
				l.parent().attr("style", "position:relative;padding-left:" + w + "px")
			} else {
				!flag ? l.parent().attr("style", "position:relative;padding-left:0px") : l.parent().attr("style", "position:relative;padding-left:" + w + "px")
			}
		} else {
			l.removeAttr("style");
			c.removeAttr("style");
			l.parent().attr("style", "position:relative;padding-left:0px")
		}
		if (h - m >= r) {
			l.attr("style", "position:absolute;bottom:0;left:0");
			c.removeAttr("style")
		}
	}
	if ($(l).length > 0 && $(c).length > 0) {
		var l = $(l),
			c = $(c),
			m = l.offset().top,
			n = c.offset().top;
		$(window).resize(g).scroll(g).trigger("resize")
	}
}
function changHeadImg() {
	var head = true;
	var _thisImg;
	$(".l_head span").click(function() {
		if (head) {
			$(".f_bottom").show();
			head = false
		}
	});
	$(".b_left li").each(function() {
		_thisImg = $(".on").children("img").attr("src");
		$(this).click(function() {
			$(this).addClass("on").siblings().removeClass("on");
			_thisImg = $(this).children("img").attr("src");
			$(".b_shadow").children("img").attr("src", _thisImg)
		})
	});
	$(".b_top span").click(function() {
		$(".l_img").children("img").attr("src", _thisImg);
		$(".f_bottom").hide();
		head = true
	})
}
function loadMore() {
	if ($("#J-news-more").length > 0) {
		var me = this;
		$("#J-news-more a").click(function() {
			var t = $(this),
				page = t.parent().attr("page");
			me.getAjax(page)
		})
	}
}
function getAjax(page) {
	var npage = parseInt(page) + 1;
	$.ajax({
		url: url,
		type: "POST",
		data: {
			"page": npage,
			"ajax": 1
		},
		dataType: "json",
		cache: false,
		timeout: 5000,
		success: function(data) {
			if (data.html) {
				$("#J-news-more").before(data.html);
				$("#J-news-more").attr("page", npage);
				if (npage === 7) {
					$("#J-news-more").hide()
				}
			} else {
				$("#J-news-more").html('<a href="javascript:void(0)">没有更多了 &gt;&gt;</a>')
			}
		},
		error: function() {
			$("#J-news-more").html('<a href="javascript:void(0)">没有更多了 &gt;&gt;</a>')
		},
	})
}
function newsNav() {
	var a = $(".news_nav");
	var h = a.outerHeight();
	var b = $(".news_content")[0].offsetTop;
	$(window).scroll(function() {
		var top = $(document).scrollTop();
		if (top >= b) {
			a.parent().css({
				"padding-top": h
			});
			a.css({
				"position": "fixed",
				"top": "0"
			})
		} else {
			a.removeAttr("style")
		}
	})
}
function nclick(nid, cid, sel, show) {
	if ($(nid).length > 0) {
		$(nid).children().click(function() {
			$(this).addClass(sel).siblings().removeClass(sel);
			$(cid).children().eq($(this).index()).addClass(show).siblings().removeClass(show)
		})
	}
}
function nhover(nid, cid, sel, show) {
	if ($(nid).length > 0) {
		$(nid).children().hover(function() {
			$(this).addClass(sel).siblings().removeClass(sel);
			$(cid).children().eq($(this).index()).addClass(show).siblings().removeClass(show)
		})
	}
}
function banner(obj, sel, current, len, ot) {
	var obj = obj,
		sel = sel,
		current = current,
		ot = ot || null,
		time = null,
		len = len - 1,
		index = 0;
	listInit = function(a) {
		index = $(sel).eq(a).index();
		$(sel).eq(a).addClass("on").siblings().removeClass("on");
		$(obj).children().eq(a).addClass("on").siblings().removeClass("on")
	};
	listRun = function(a) {
		index = $(sel).eq(index).next().index();
		$(sel).eq(a).next().addClass("on").siblings().removeClass("on");
		$(obj).children().eq(a).next().addClass("on").siblings().removeClass("on")
	};
	AddFn = function() {
		if (index == len) {
			listInit(0)
		} else {
			listRun(index)
		}
		autoPlay()
	};
	clearTimer = function() {
		clearInterval(time)
	};
	autoPlay = function() {
		var i = 0;
		var width = $(sel).outerWidth();
		time = setInterval(function() {
			++i;
			if (i == width) {
				clearTimer();
				AddFn()
			}
			$(ot).css({
				"width": i
			})
		}, 20)
	};
	autoPlay();
	$(obj).hover(function() {
		clearTimer()
	}, function() {
		autoPlay()
	});
	$(sel).hover(function() {
		clearTimer()
	}, function() {
		autoPlay()
	});
	$(sel).hover(function() {
		var index = $(this).index();
		listInit(index)
	})
}
function removeCollect(obj, url) {
	$(obj).click(function() {
		var _this = $(this);
		var id = _this.attr("data-id");
		$.ajax({
			type: "GET",
			url: url,
			data: {
				"id": id
			},
			dataType: "json",
			success: function(data) {
				if (_this.hasClass("c_icon")) {
					_this.parent().parent().remove()
				} else {
					_this.parent().remove()
				}
			}
		})
	})
}
function regFn() {
	var mobile, email, nickname, gender, flag, flag1 = 0,
		flag2 = 0,
		flag3 = 0;
	change1 = 0, change2 = 0, change3 = 0;
	$(".tel input").on("keyup blur", function() {
		mobile = $(this).val();
		var _this = $(this);
		change1 = 1;
		if ($(".tel input").val() != "") {
			if (mobile.match(/^1[345789]\d{9}$/gi)) {
				$(".tel").css({
					"border-color": "#28ce6e"
				});
				_this.parent().siblings(".no_right").text("");
				flag1 = 1
			} else {
				$(".tel").css({
					"border-color": "#f00"
				});
				_this.parent().siblings(".no_right").text("请输入正确手机号码");
				flag1 = 0
			}
		} else {
			$(".tel").css({
				"border-color": "#f00"
			});
			_this.parent().siblings(".no_right").text("请输入手机号码");
			flag1 = 0
		}
	});
	$(".mail input").on("keyup blur", function() {
		email = $(this).val();
		var _this = $(this);
		change2 = 1;
		if ($(".mail input").val() != "") {
			if (email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
				$(".mail").css({
					"border-color": "#28ce6e"
				});
				_this.parent().siblings(".no_right").text("");
				flag2 = 1
			} else {
				$(".mail").css({
					"border-color": "#f00"
				});
				_this.parent().siblings(".no_right").text("请输入正确邮箱地址");
				flag2 = 0
			}
		} else {
			$(".mail").css({
				"border-color": "#f00"
			});
			_this.parent().siblings(".no_right").text("请输入邮箱地址");
			flag2 = 0
		}
	});
	$(".name input").on("keyup blur", function() {
		nickname = $(this).val();
		var _this = $(this);
		change3 = 1;
		if ($(".name input").val() != "") {
			if (nickname.match(/^[0-9a-zA-Z\u4E00-\u9FA5\\s_-]{2,20}$/)) {
				$(".name").css({
					"border-color": "#28ce6e"
				});
				_this.parent().siblings(".no_right").text("");
				flag3 = 1
			} else {
				$(".name").css({
					"border-color": "#f00"
				});
				_this.parent().siblings(".no_right").text("昵称只能由中文、字母、数字、下划线或者短横线组成,最少2个字符");
				flag3 = 0
			}
		} else {
			$(".name").css({
				"border-color": "#f00"
			});
			_this.parent().siblings(".no_right").text("请输入昵称");
			flag3 = 0
		}
	});
	$(".sex span").on("click", function() {
		gender = $(this).children("i").attr("data-val");
		$(this).children("i").addClass("on").parent().siblings().children("i").removeClass("on")
	});
	$(".r_submit input").click(function() {
		var _this = $(this);
		mobile = $(".tel input").val();
		email = $(".mail input").val();
		nickname = $(".name input").val();
		gender = $(".sex span").children(".on").attr("data-val");
		var t = (flag1 + flag2 + flag3 + change1 + change2 + change3) % 2;
		switch (t) {
		case 0:
			flag = true;
			break;
		case 1:
			flag = false
		}
		if (flag) {
			$.ajax({
				type: "POST",
				url: "/u/update_profile",
				data: {
					"doSubmit": 1,
					"nickname": nickname,
					"email": email,
					"mobile": mobile,
					"info[gender]": gender
				},
				dataType: "json",
				success: function(data) {
					_this.parent().siblings(".sucess").text("修改成功");
					setTimeout(function() {
						_this.parent().siblings(".sucess").text("")
					}, 1000)
				}
			})
		}
	})
}
function formFn() {
	var verification = ".verification_box";

	function tips(a, b, c, d) {
		a.parent().addClass(b);
		a.parent().removeClass(c);
		a.parent().siblings(".input_tips").text(d)
	}
	function isNull() {
		var i = 0,
			j = 0;
		if ($("#vCode").val() == "") {
			tips($("#vCode"), "error", "right", "请输入验证码");
			$("#vCode").focus();
			j = 1
		} else {
			i = 0
		}
		if ($("#userPhone").val() == "") {
			tips($("#userPhone"), "error", "right", "请输入手机号码");
			$("#userPhone").focus();
			j = 1
		} else {
			i = 0
		}
		return i + j
	}
	function allNull() {
		var i = 0,
			j = 0;
		if ($("#phoneVcode").val() == "") {
			tips($("#phoneVcode"), "error", "right", "请输入短信验证码");
			$("#phoneVcode").focus();
			j = 1
		} else {
			i = 0
		}
		return i + j
	}
	function changeCode() {
		var _this = $(".item_img img");
		var t = _this.attr("src");
		_this.attr("src", t + "&" + Math.random())
	}
	function checkPhone() {
		var i = 0;
		var _this = $("#userPhone");
		if (_this.val().match(/^1[345789]\d{9}$/gi)) {
			tips(_this, "right", "error", "");
			return i + 1
		} else {
			tips(_this, "error", "right", "请输入正确手机号码");
			return i
		}
	}
	$(verification).on("keyup blur", "input[id='userPhone']", function() {
		var _this = $(this);
		var mobile = $(this).val();
		if (mobile == "") {
			tips(_this, "error", "right", "请输入手机号码")
		} else {
			checkPhone()
		}
	});
	$(verification).on("keyup blur", "input[id='vCode']", function() {
		var _this = $(this);
		var vCode = $(this).val();
		if (vCode == "") {
			tips(_this, "error", "right", "请输入验证码")
		} else {
			tips(_this, "right", "error", "")
		}
	});
	$(verification).on("keyup blur", "input[id='phoneVcode']", function() {
		var _this = $(this);
		var phoneVcode = $(this).val();
		if (phoneVcode == "") {
			tips(_this, "error", "right", "请输入短信验证码")
		} else {
			tips(_this, "right", "error", "")
		}
	});

	function recode(n, d) {
		switch (n) {
		case -1:
			$("#userPhone").parent().siblings(".input_tips").text(d);
			break;
		case -2:
			$("#vCode").parent().siblings(".input_tips").text(d);
			break;
		case -3:
		case -4:
		case -5:
			$("#phoneVcode").parent().siblings(".input_tips").text(d);
			break
		}
	}
	var phonetimes = 0;
	var getCode = ".item_getCode";
	$(getCode).children().click(function() {
		var _this = $(this);
		if (isNull() > 0) {
			isNull()
		} else {
			if (checkPhone() > 0) {
				if (_this.parent().hasClass("hasSend")) {
					return
				}
				var pn = $("#userPhone").val();
				var vc = $("#vCode").val();
				$.ajax({
					type: "POST",
					url: "/api.php?op=sms",
					data: {
						"userPhone": pn,
						"vCode": vc
					},
					dataType: "json",
					success: function(data) {
						if (data.error_code == 0) {
							phonetimes++;
							if (phonetimes > 3) {
								_this.parent().siblings(".input_tips").text("超出验证次数");
								return
							}
							$("#phoneVcode").parent().siblings(".input_tips").text(data.msg);
							var s = 60,
								t;
							$(getCode).children().val(s + "s");
							$(getCode).addClass("hasSend");
							t = setInterval(function() {
								s--;
								$(getCode).children().val(s + "s");
								if (s <= 0) {
									s = 60;
									clearTimeout(t);
									$(getCode).children().val("重新获取");
									$(getCode).children().addClass("reGet");
									$(getCode).removeClass("hasSend")
								}
							}, 1000)
						} else {
							recode(data.error_code, data.msg);
							changeCode()
						}
					}
				})
			}
		}
	});
	$(".item_btn").children().click(function() {
		if (isNull() + allNull() > 0) {
			allNull();
			isNull()
		} else {
			if (checkPhone() > 0) {
				var userPhone = $("#userPhone").val(),
					vCode = $("#vCode").val(),
					phoneVcode = $("#phoneVcode").val(),
					userAvatar = $("#userAvatar").val(),
					userName = $("#userName").val(),
					userGender = $("#userGender").val();
				$.ajax({
					type: "POST",
					url: "/u/auth_register",
					data: {
						"doSubmit": 1,
						"userPhone": userPhone,
						"vCode": vCode,
						"phoneVcode": phoneVcode,
						"userAvatar": userAvatar,
						"userName": userName,
						"userGender": userGender
					},
					dataType: "json",
					success: function(data) {
						if (data.error_code != 0) {
							recode(data.error_code, data.msg)
						} else {
							window.location.href = data.msg
						}
					}
				})
			}
		}
	})
}
function clickPartntAddClass(a, b, c) {
	$("." + a).click(function() {
		if (!$(this).parent().hasClass(b)) {
			if (arguments[2] != "undefined") {
				$(this).addClass(c)
			}
			$(this).parent().addClass(b)
		} else {
			$(this).removeClass(c);
			$(this).parent().removeClass(b)
		}
	})
}
function selBtn(i, s) {
	var obj = $(i);
	var ta = $(s);
	var st;

	function mo() {
		if ($(".source-selected .no-more").length == 0) {
			obj.addClass("on");
			ta.show();
			clearTimeout(st)
		}
	}
	function mt() {
		st = setTimeout(mh, 100)
	}
	function mh() {
		obj.removeClass("on");
		ta.hide()
	}
	obj.click(function() {
		mo()
	});
	obj.mouseout(function() {
		mt()
	});
	ta.mousemove(function() {
		mo()
	});
	ta.mouseout(function() {
		mt()
	})
}
function heightAuto() {
	var $height = $(".detail-episode .selection-con,.varie-episode").height();
	var $more = $(".more-btn");
	var $less = $(".res-btn");
	$more.click(function() {
		$(this).parent().parent().css({
			"max-height": "none",
			"height": "auto"
		});	
		$more.hide();
		$less.show()
	});
	$less.click(function() {
		$(this).parent().parent().height($height);
		$less.hide();
		$more.show();
		$(".detail-episode .selection-con").children().eq(0).addClass("show").siblings().removeClass("show");
		$(".source-list li").eq(0).addClass("on").siblings().removeClass("on")
	})
}
function episodeTab() {
	$(".source-list li").click(function() {
		$(".more-btn").hide();
		$(".res-btn").show();
		$(this).addClass("on").siblings().removeClass("on");
		$(".selection-con").css({
			"max-height": "none",
			"height": "auto"
		});
		$(".selection-con").children("div").eq($(this).index()).addClass("show").siblings().removeClass("show")
	})
}
function episodeSelect() {
	var $Btn = $(".source-box a"),
		$selected = $(".source-selected");
	$Btn.click(function() {
		var site = $(this).attr("site"),
			txt = $(this).text(),
			cl = $(this).attr("class");
		$selected.children().removeClass().addClass(cl);
		$selected.children().text(txt);
		$selected.children().attr("site", site);
		
	})
}
function varietyFun() {
	if ($("#js-source .on").attr("site") != null) {
		var site = $("#js-source .on").attr("site")
	} else {
		var site = $("#js-selected em").attr("site")
	}

	function yearSelect() {
		$("#js-year").hover(function() {
			$(this).children("ul").show()
		}, function() {
			$(this).children("ul").hide()
		});
		$("#js-year li").click(function() {
			var year = parseInt($(this).text());
			ajaxUrl = Url + year;
			ajaxFun(ajaxUrl)
		})
	}
	function monthSelect() {
		var h = $("#js-box").height();
		$("#js-month li").click(function() {
			$(this).addClass("on").siblings().removeClass("on");
			$("#js-box > ul").eq($(this).index()).show().siblings().hide();
			$("#js-box").css({
				"max-height": "216px"
			});
			$("#js-open").show()
		});
		$("#js-open").click(function() {
			$(this).hide();
			$("#js-box").css({
				"max-height": "none"
			})
		});
		$("#js-close").click(function() {
			$("#js-box").css({
				"max-height": "216px"
			});
			$("#js-open").show()
		})
	}
	yearSelect();
	monthSelect();

	function ajaxFun(url) {
		$.ajax({
			type: "get",
			url: url,
			dataType: "json",
			success: function(data) {
				$("#js-json").empty();
				$("#js-json").append(data["data"]);
				monthSelect();
				yearSelect()
			},
			error: function(xhr, type) {
				alert(xhr.responseText)
			}
		})
	}
}
function navClick() {
	if ($("#js-source").length > 0) {
		var me = this;
		$("#js-source a").click(function() {
			var t = $(this);
			size = t.attr("site");
			var Url = "/api.php?op=get_varieplay&id=" + cId + "&site=" + size + "&do=switchsite";
			t.addClass("on").siblings().removeClass("on");
			var cc = $("#js-selected em");
			cc.html(t.html());
			cc.removeClass().addClass("siteimg").addClass("gico-" + size);
			$.ajax({
				type: "get",
				url: Url,
				dataType: "json",
				success: function(data) {
					console.log(data["data"]);
					$("#js-json").empty();
					$("#js-json").append(data["data"]);
					me.varietyFun()
				},
				error: function(xhr, type) {
					alert(xhr.responseText)
				}
			})
		})
	}
}
function newWindow() {
	$(document).delegate(".detail-episode a.play_btn,.banner_play a.play_btn,.banner_center dt a", "click", function(e) {
		var src = $(this).attr("href"),
			site = $(".source-selected").children().attr("site"),
			iWidth, iHeight;
		switch (site) {
		case "qq":
			iWidth = 700, iHeight = 500;
			break;
		case "qiyi":
			iWidth = 680, iHeight = 450;
			break;
		case "levp":
			iWidth = 680, iHeight = 440;
			break;
		case "youku":
			iWidth = 740, iHeight = 600;
			break;
		case "imgo":
			iWidth = 930, iHeight = 600;
			break;
		case "sohu":
			iWidth = 640, iHeight = 580;
			break;
		case "tudou":
			iWidth = 680, iHeight = 650;
			break;
		case "pptv":
			iWidth = 680, iHeight = 500;
			break;
		case "huashu":
			iWidth = 920, iHeight = 680;
			break;
		default:
			iWidth = 720, iHeight = 540
		}
		var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
		var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
		var params = "width=" + iWidth + ",height=" + iHeight + ",top=" + iTop + ",left=" + iLeft + ",channelmode=yes" + ",directories=yes" + ",fullscreen=no" + ",location=no" + ",menubar=no" + ",resizable=no" + ",scrollbars=yes" + ",status=yes" + ",titlebar=yes" + ",toolbar=no";
		window.open(src, "", params);
		return false
	})
}
function onlySelect(a, b) {
	if ($(a).length > 0) {
		$(a).hover(function() {
			$(this).addClass(b).siblings().removeClass(b)
		})
	}
}
function openSelect(h, n, pr, pl) {
	var flag = true;
	$(".open").click(function() {
		if (flag) {
				$(this).parent().css({
					"height": "auto",
					"white-space": "normal",
					"padding-right": "0"
				});
				$(this).css({
					"position": "static",
					"padding-left": "0"
				});
				$(this).text("收起<<")
			flag = false
		} else {
				$(this).parent().css({
					"height": h + "px",
					"white-space": n,
					"padding-right": pr + "px",
				});
				$(this).css({
					"position": "absolute",
					"padding-left": pl + "em"
				});
				$(this).text("展开>>")
			flag = true
		}
	})
}
function stagePic() {
	var i = 0;
	var len = $(".stage_slide .bd li").length;
	var img = $(".stage_slide .bd li").eq(i).children().children().attr("src");
	$(".stage_slide .hd .next").click(function() {
		i++;
		if (i >= len) {
			i = 0
		}
		img = $(".stage_slide .bd li").eq(i).children().children().attr("src")
	});
	$(".stage_slide .hd .prev").click(function() {
		i--;
		if (i < 0) {
			i = len - 1
		}
		img = $(".stage_slide .bd li").eq(i).children().children().attr("src")
	});
	$(".bigPic").click(function() {
		window.open(img, "_blank")
	})
}
function stageHeight() {
	var i = 0;
	var len = $(".stage_slide .bd li").length;
	var h = $(".stage_slide .bd li img").eq(0).height();
	$(".stage_slide .bd").height(h);
	$(".stage_slide .next").click(function() {
		i++;
		if (i >= len) {
			i = 0
		}
		h = $(".stage_slide .bd li img").eq(i).height();
		$(".stage_slide .bd").height(h)
	});
	$(".stage_slide .prev").click(function() {
		i--;
		if (i < 0) {
			i = len - 1
		}
		h = $(".stage_slide .bd li img").eq(i).height();
		$(".stage_slide .bd").height(h)
	})
}
function openStar() {
	var m = $(".star_road .road_bottom");
	var t = $(".road_show li").height();
	var e = $(".road_show").children().eq(0).children().length;
	if (e <= 5) {
		$(".road_show").css({
			"height": e * t
		});
		m.hide()
	} else {
		$(".road_show").css({
			"height": t * 5
		})
	}
	$(".road_nav span").hover(function() {
		var n = $(this).index();
		var p = $(".road_show").children().eq($(this).index()).children().length;
		$(this).addClass("on").siblings().removeClass("on");
		if (p <= 5) {
			$(".road_show").children().eq($(this).index()).addClass("show").siblings().removeClass("show").parent().css({
				"height": p * t
			});
			m.hide()
		} else {
			$(".road_show").children().eq($(this).index()).addClass("show").siblings().removeClass("show").parent().css({
				"height": t * 5
			});
			m.show()
		}
		$(".data-show").show().siblings().hide()
	});
	$(".road_bottom span,.more_data span").click(function() {
		if ($(this).parent().parent().hasClass("star_road")) {
			if ($(".road_show .show").children().length > 5) {
				if ($(this).hasClass("data_open")) {
					$(".road_show").css({
						"height": "auto"
					});
					$(this).text("收起").attr("class", "data_close")
				} else {
					$(".road_show").css({
						"height": t * 5
					});
					$(this).text("展开").attr("class", "data_open")
				}
			} else {
				return
			}
		} else {
			if ($(this).parent().parent().hasClass("star_recommend")) {
				if ($(this).hasClass("open_data")) {
					$(".star_data").css({
						"height": "auto"
					});
					$(this).text("收起资料").attr("class", "close_data");
					fixBar(".main_left", ".main_right")
				} else {
					$(".star_data").css({
						"height": "70px"
					});
					$(this).text("更多资料").attr("class", "open_data");
					fixBar(".main_left", ".main_right")
				}
			} else {
				return
			}
		}
	})
}
function indexFn() {
	banner(".bs_list", ".bs_select li", ".bs_select .on", 9, ".bs_select em");
	if ($(window).width() < 1441) {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 6)
	} else {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 8)
	}
}
function tvFn() {
	if ($(window).width() < 1441) {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 6)
	} else {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 8)
	}
	if ($(window).width() < 1441) {
		coreSlide(".show_theater .theater_box", ".show_theater .prev", ".show_theater .next", 3)
	} else {
		coreSlide(".show_theater  .theater_box", ".show_theater .prev", ".show_theater .next", 4)
	}
}
function filmFn() {
	if ($(window).width() < 1441) {
		banner(".banner_box", ".banner_sel li", ".banner_sel .on", 6)
	} else {
		banner(".banner_box", ".banner_sel li", ".banner_sel .on", 8)
	}
	if ($(window).width() < 1441) {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 6)
	} else {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 8)
	}
	if ($(window).width() < 1441) {
		coreSlide(".show_theater .theater_box", ".show_theater .prev", ".show_theater .next", 3)
	} else {
		coreSlide(".show_theater  .theater_box", ".show_theater .prev", ".show_theater .next", 4)
	}
	nhover(".ft_nav", ".ft_box", "on", "show")
}
function varieFn() {
	if ($(window).width() < 1441) {
		banner(".banner_box", ".banner_sel li", ".banner_sel .on", 6)
	} else {
		banner(".banner_box", ".banner_sel li", ".banner_sel .on", 8)
	}
	if ($(window).width() < 1441) {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 6)
	} else {
		coreSlide(".show_slide .show_film", ".show_slide .prev", ".show_slide .next", 8)
	}
	if ($(window).width() < 1441) {
		coreSlide(".show_theater .theater_box", ".show_theater .prev", ".show_theater .next", 3)
	} else {
		coreSlide(".show_theater  .theater_box", ".show_theater .prev", ".show_theater .next", 4)
	}
}
function animeFn() {
	nhover(".anime_nav", ".anime_box", "on", "show");
	if ($(window).width() < 1441) {
		coreSlide(".show_theater .theater_box", ".show_theater .prev", ".show_theater .next", 3)
	} else {
		coreSlide(".show_theater  .theater_box", ".show_theater .prev", ".show_theater .next", 4)
	}
}
function newsFn() {
	fixBar(".nc_content", ".nc_right");
	fixBarL(".nc_left", ".nc_content", false);
	nhover(".news_nav", ".news_box", "on", "show");
	loadMore();
	newsNav()
}
function stageFn() {
	jQuery(".col_wheel").slide({
		mainCell: ".bd ul",
		autoPlay: true,
		interTime: 5000
	});
	if ($(window).width() < 1441) {
		coreSlide(".show_theater .theater_box", ".show_theater .prev", ".show_theater .next", 3)
	} else {
		coreSlide(".show_theater  .theater_box", ".show_theater .prev", ".show_theater .next", 4)
	}
}
function entDl() {
	fixBar(".ent_left", ".ent_right");
	nhover(".ent_nav", ".ent_box", "on", "show");
	window._bd_share_config = {
		"common": {
			"bdSnsKey": {},
			"bdText": "",
			"bdMini": "2",
			"bdMiniList": false,
			"bdPic": "",
			"bdStyle": "1",
			"bdSize": "32"
		},
		"share": {}
	};
	with(document) {
		0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = "/static/api/js/share.js?v=89860593.js?cdnversion=" + ~ (-new Date() / 3600000)]
	}
}
function tvDl() {
	fixBar(".main_left", ".main_right");
	selBtn(".source-selected", ".source-box");
	episodeTab();
	heightAuto();
	episodeSelect();
	onlySelect(".show_ranking li", "on");
	openSelect(22, "nowrap", 42, 0);
	//newWindow();
	
	
}
function stageDl() {
	fixBar(".stage_left", ".stage_right");
	jQuery(".stage_slide").slide({
		mainCell: ".bd ul",
		autoPage: true,
		effect: "left"
	});
	window._bd_share_config = {
		"common": {
			"bdSnsKey": {},
			"bdText": "",
			"bdMini": "2",
			"bdMiniList": false,
			"bdPic": "",
			"bdStyle": "1",
			"bdSize": "32"
		},
		"share": {}
	};
	with(document) {
		0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = "/static/api/js/share.js?v=89860593.js?cdnversion=" + ~ (-new Date() / 3600000)]
	}
	stagePic();
	stageHeight()
}
function varDl() {
	fixBar(".main_left", ".main_right");
	onlySelect(".show_ranking li", "on");
	varietyFun();
	navClick();
	selBtn(".source-selected", ".source-box");
	openSelect(22, "nowrap", 42, 0);
	
	
}
function animeDl() {
	fixBar(".main_left", ".main_right");
	selBtn(".source-selected", ".source-box");
	episodeTab();
	heightAuto();
	episodeSelect();
	onlySelect(".show_ranking li", "on");
	openSelect(44, "normal", 0, 1);
	//newWindow();
	
	
}
function filmDl() {
	fixBar(".main_left", ".main_right");
	openSelect(22, "nowrap", 42, 0);
	onlySelect(".show_ranking li", "on");
	selBtn(".source-selected", ".source-box");
	
	
}
function avatarFn() {
	fixBar(".main_left", ".main_right");
	clickPartntAddClass("avatar_more", "avatar_open", "avatar_btn")
}
function compre() {
    selBtn(".source-selected",".source-box");
    episodeTab();
    heightAuto();
    episodeSelect();
    coreSlide(".compre-slide .cs-slide",".cs-nav .prev",".cs-nav .next",5);
}
var share = {
	openWindow: function(_url, _name, _iWidth, _iHeight) {
		var url = _url;
		var name = _name;
		var iWidth = _iWidth;
		var iHeight = _iHeight;
		var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
		var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
		var params = "width=" + iWidth + ",height=" + iHeight + ",top=" + iTop + ",left=" + iLeft + ",channelmode=yes" + ",directories=yes" + ",fullscreen=no" + ",location=no" + ",menubar=no" + ",resizable=no" + ",scrollbars=yes" + ",status=yes" + ",titlebar=yes" + ",toolbar=no";
		window.open(url, "_blank")
	},
	qq: function(url, title, summary, pic) {
		var p = {
			url: url,
			desc: "来自256影视的分享",
			title: title,
			summary: summary,
			pics: pic,
			flash: "",
			site: "256影视"
		};
		var s = [];
		for (var i in p) {
			s.push(i + "=" + encodeURIComponent(p[i] || ""))
		}
		var target_url = "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join("&");
		share.openWindow(target_url, "qq", 720, 510)
	},
	qZone: function(url, title, summary, pic) {
		var p = {
			url: url,
			showcount: "1",
			desc: "这篇文章不错,分享一下~~",
			summary: summary,
			title: title,
			site: "256影视",
			pics: pic,
			style: "101",
			width: 199,
			height: 30
		};
		var s = [];
		for (var i in p) {
			s.push(i + "=" + encodeURIComponent(p[i] || ""))
		}
		var target_url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join("&");
		share.openWindow(target_url, "qZone", 400, 430)
	},
	sinaWeiBo: function(url, title, pic) {
		var p = {
			url: url,
			type: "3",
			count: "1",
			appkey: "256影视",
			title: title,
			pic: pic,
			ralateUid: "",
			rnd: new Date().valueOf()
		};
		var s = [];
		for (var i in p) {
			s.push(i + "=" + encodeURIComponent(p[i] || ""))
		}
		var target_url = "http://service.weibo.com/share/share.php?" + s.join("&");
		share.openWindow(target_url, "sinaweibo", 400, 430)
	},
	weixin: function(url) {
		var target_url = "http://qr.liantu.com/api.php?text=" + url,
			Div = document.createElement("div"),
			h2 = document.createElement("h2"),
			span = document.createElement("span"),
			p1 = document.createElement("p"),
			p2 = document.createElement("p"),
			img = document.createElement("img");
		Div.appendChild(h2);
		Div.appendChild(span);
		Div.appendChild(img);
		Div.appendChild(p1);
		Div.appendChild(p2);
		Div.style.cssText = "position: absolute;top: 50%;left: 50%;margin-left:-120px;margin-top:-164px;padding:10px;width: 240px;background: #fff;border: 1px solid #d8d8d8;font-size: 12px;z-index: 9999999999";
		span.style.cssText = "position: absolute;top: 10px;right: 10px;width: 22px;height:22px;font-size: 16px;text-align:center;line-height: 22px;cursor: pointer;";
		span.innerHTML = "×";
		h2.style.cssText = "margin: 0;font-size: 14px;line-height: 22px;";
		h2.innerHTML = "分享到微信朋友圈";
		img.style.cssText = "display: block;width: 240px;height: 240px;";
		img.src = target_url;
		p1.style.cssText = "margin: 0;font-size: 12px;color: #666;text-align: left;line-height: 22px;";
		p2.style.cssText = "margin: 0;font-size: 12px;color: #666;text-align: left;line-height: 22px;";
		p1.innerHTML = "打开微信，点击底部的“发现”，";
		p2.innerHTML = "使用“扫一扫”即可将网页分享至朋友圈。";
		document.body.appendChild(Div);
		span.onclick = function() {
			document.body.removeChild(Div)
		}
	},
	init: function() {
		var qq = document.getElementById("sQQ"),
			qzone = document.getElementById("sQzone"),
			wx = document.getElementById("sWx"),
			sina = document.getElementById("sSina");
		if (qq || wx || sina > 0 || qzone > 0) {
			var url = window.location.href,
				title = document.title,
				summary, metaList = document.getElementsByTagName("meta"),
				pic = document.getElementById("shareImg").getAttribute("src");
			for (var i = 0; i < metaList.length; i++) {
				if (metaList[i].getAttribute("name") == "description") {
					summary = metaList[i].content
				}
			}
			qq.onclick = function() {
				share.qq(url, title, summary, pic)
			};
			sina.onclick = function() {
				share.sinaWeiBo(url, title, pic)
			};
			wx.onclick = function() {
				console.log(pic);
				share.weixin(url)
			}
		}
	}
};
share.init();
$(function() { 
	$(".source-box a").each(function(j){
			$(this).click(function(){	   
				$('.selections,.varie-box ul').hide().css("opacity",0);
				$('.selections:eq('+j+'),.varie-box ul:eq('+j+')').show().animate({"opacity":"1"});
	});
	});		
		   
})