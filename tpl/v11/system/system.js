function checkAll(objname) {
	objEvent = getEvent();
	if (objEvent.srcElement)
		id = objEvent.srcElement;
	else
		id = objEvent.target;
	if (objname != '') {
		var code_Values = document.getElementsByName(objname);
		for (i = 0; i < code_Values.length; i++) {
			if (code_Values[i].type == "checkbox") {
				code_Values[i].checked = id.checked;
			}
		}
	} else {
		var code_Values = document.getElementsByTagName("input");
		for (i = 0; i < code_Values.length; i++) {
			if (code_Values[i].type == "checkbox") {
				code_Values[i].checked = id.checked;
			}
		}
	}
}
$.extend({
	refresh : function(url) {
		window.location.href = url;
	}
});
function getEvent() {
	if (document.all)
		return window.event;
	func = getEvent.caller;
	while (func != null) {
		var arg0 = func.arguments[0];
		if (arg0) {
			if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
					|| (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
				return arg0;
			}
		}
		func = func.caller;
	}
	return null;
}
jQuery.showfloatdiv = function(ox) {
	var oxdefaults = {
		txt : '数据加载中,请稍后...',
		classname : 'progressBar',
		left : 410,
		top : 210,
		wantclose : 1,
		suredo : function(e) {
			return false;
		},
		succdo : function(r) {
		},
		completetxt : '操作成功!',
		autoclose : 1,
		ispost : 0,
		cssname : 'alert',
		isajax : 0,
		intvaltime : 1000,
		redirurl : '/'
	};
	ox = ox || {};
	$.extend(oxdefaults, ox);
	$("#zanpianbox_overlay").remove();
	$("#zanpianbox").remove();
	if (oxdefaults.wantclose == 1) {
		var floatdiv = $('<div class="zanpianbox-overlayBG" id="zanpianbox_overlay"></div><div id="zanpianbox" class="zanpianbox png-img"><iframe frameborder="0" class="ui-iframe"></iframe><table class="ui-dialog-box"><tr><td><div class="ui-dialog"><div class="ui-dialog-cnt" id="ui-dialog-cnt"><div class="ui-dialog-tip alert" id="ui-cnt"><span id="xtip">'
				+ oxdefaults.txt
				+ '</span></div></div><div class="ui-dialog-close"><span class="close">关闭</span></div></div></td></tr></table></div>');
		$("body").append(floatdiv);
		$("#zanpianbox_overlay").fadeIn(500);
		$("#zanpianbox").fadeIn(500);
		$("#ui-cnt").removeClass('succ error alert loading').addClass(
				oxdefaults.cssname);
		$(".ui-dialog-close").click(function() {
			$.closefloatdiv();
		});
		if (oxdefaults.isajax == 1) {
			objEvent = getEvent();
			if (objEvent.srcElement)
				id = objEvent.srcElement;
			else
				id = objEvent.target;
			var idval = (id.attributes["data"].nodeValue != null && id.attributes["data"].nodeValue != undefined) ? id.attributes["data"].nodeValue
					: id.data;
			$.ajax({
				url : idval,
				async : true,
				type : 'get',
				cache : true,
				dataType : 'json',
				success : function(data, textStatus) {
					if (data.msg != null && data.msg != undefined) {
						$("#xtip").html(data.msg);
					} else {
						$("#xtip").html(oxdefaults.completetxt);
					}
					oxdefaults.succdo(data);
					if (data.wantclose != null && data.wantclose != undefined) {
						$.hidediv(data);
					} else if (oxdefaults.autoclose == 1) {
						$.hidediv(data);
					}
					if (data.wait != undefined || data.wait != null) {
						if (data.url != undefined || data.url != null) {
							setTimeout("$.refresh('" + data.url + "')",
									oxdefaults.intvaltime);
						} else {
							setTimeout("$.refresh('" + oxdefaults.redirurl
									+ "')", oxdefaults.intvaltime);
						}
					}
				},
				error : function(e) {
					$("#xtip").html('系统繁忙,请稍后再试...');
				}
			});
		}
	} else if (oxdefaults.wantclose == 2) {
		objEvent = getEvent();
		if (objEvent.srcElement)
			id = objEvent.srcElement;
		else
			id = objEvent.target;
		var idval = (id.attributes["data"].nodeValue != null && id.attributes["data"].nodeValue != undefined) ? id.attributes["data"].nodeValue
				: id.data;
		var floatdiv = $('<div class="zanpianbox-overlayBG" id="zanpianbox_overlay"></div><div id="zanpianbox" class="zanpianbox png-img"><iframe frameborder="0" class="ui-iframe"></iframe><table class="ui-dialog-box"><tr><td><div class="ui-dialog"><div class="ui-dialog-cnt" id="ui-dialog-cnt"><div class="ui-dialog-tip alert" id="ui-cnt"><span id="xtip">'
				+ oxdefaults.txt
				+ '</span></div></div><div class="ui-dialog-todo"><a class="ui-link ui-link-small" href="javascript:void(0);" id="surebt">确定</a><a class="ui-link ui-link-small cancelbt"  id="cancelbt">取消</a><input type="hidden" id="hideval" value=""/></div><div class="ui-dialog-close"><span class="close">关闭</span></div></div></td></tr></table></div>');
		$("body").append(floatdiv);
		$("#zanpianbox_overlay").fadeIn(500);
		$("#zanpianbox").fadeIn(500);
		$(".ui-dialog-close").click(function() {
			$.closefloatdiv();
		});
		$(".cancelbt").click(function() {
			$.closefloatdiv();
		});
		$("#surebt").click(function(e) {
							if (!oxdefaults.suredo(e)) {
								$(".ui-dialog-todo").remove();
								$("#ui-cnt").removeClass('succ error alert').addClass('loading');
								
								
								if (oxdefaults.ispost == 0){
									
									if(idval == "1"){
										return true ;
									}
									
									$.ajax({
										url : idval,
										async : true,
										type : 'get',
										cache : true,
										dataType : 'json',
										success : function(data,textStatus) {
											if (data.msg != null && data.msg != undefined) {
												$("#xtip").html(data.msg);
											}else{
												$("#xtip").html(oxdefaults.completetxt);
											}
													
											oxdefaults.succdo(data);
											if (data.wantclose != null && data.wantclose != undefined) {
													$.hidediv(data);
											} else if (oxdefaults.autoclose == 1) {
														$.hidediv(data);
											}},error : function(e) {
													$("#xtip").html('系统繁忙,请稍后再试...');
												}
											});
								} else {
									$("#" + oxdefaults.formid).zanpiansub({
										curobj : $("#surebt"),
										txt : '数据提交中,请稍后...',
										onsucc : function(result) {
											oxdefaults.succdo(result);
											$.hidediv(result);
										}
									}).post({
										url : oxdefaults.url
									});
								}
							} else {
								oxdefaults.succdo(e);
							}
						});
	} else {
		var floatdiv = $('<div class="zanpianbox_overlayBG" id="zanpianbox_overlay"></div><div id="zanpianbox" class="zanpianbox"><iframe frameborder="0" class="ui-iframe"></iframe><div class="ui-dialog"><div class="ui-dialog-cnt" id="ui-dialog-cnt"><div class="ui-dialog-box"<div class="ui-cnt" id="ui-cnt">'
				+ oxdefaults.txt + '</div></div></div></div></div>');
		$("body").append(floatdiv);
		$("#zanpianbox_overlay").fadeIn(500);
		$("#zanpianbox").fadeIn(500);
	}
	$('#zanpianbox_overlay').bind('click', function(e) {
		$.closefloatdiv(e);
		if (pp != null) {
			clearTimeout(pp);
		}
	});
};
jQuery.closefloatdiv = function(e) {
	$("#zanpianbox_overlay").remove();
	$("#zanpianbox").remove();
};
jQuery.hidediv = function(e) {
	var oxdefaults = {
		intvaltime : 1000
	};
	e = e || {};
	$.extend(oxdefaults, e);
	if (e.msg != null && e.msg != undefined) {
		$("#ui-cnt").html(e.msg);
	}
	if (parseInt(e.rcode) == 1 || parseInt(e.code) == 1) {
		$("#ui-cnt").removeClass('loading error alert').addClass('succ');
	} else if (parseInt(e.rcode) < 1 || parseInt(e.code) < 1) {
		$("#ui-cnt").removeClass('loading alert succ').addClass('error');
	}
	pp = setTimeout("$.closefloatdiv()", oxdefaults.intvaltime);
};
(function($) {
	$.fn.zanpiansub = function(options) {
		var defaults = {
			txt : '数据提交中,请稍后...',
			redirurl : window.location.href,
			dataType : 'json',
			onsucc : function(e){
			},
			onerr : function() {
				$.hidediv({
					msg : '系统繁忙'
				});
			},
			oncomplete : function() {
			},
			intvaltime : 1000
		};
		options.curobj.attr('disabled', true);
		var ox = options.curobj.offset();
		var options = $.extend(defaults, options);
		$.showfloatdiv({
			offset : ox,
			txt : defaults.txt
		});
		var obj = $(this);
		var id = obj.attr('id');
		return {
			post : function(e) {
				$("#ui-cnt").removeClass('succ error alert')
				.addClass('loading');
				$.post(
						e.url,
						obj.serializeArray(),
						function(result){
							options.curobj.attr('disabled', false);
							defaults.onsucc(result)
							console.log(result);
							if (result.closediv != undefined || result.closediv != null) {
								$.closefloatdiv();
							}
							if (result.wait != undefined || result.wait != null) {
								if (result.url != undefined || result.url != null) {
									setTimeout("$.refresh('" + result.url+ "')", options.intvaltime);
								} else {
									setTimeout("$.refresh('" + options.redirurl+ "')", options.intvaltime);
								}
							}
						}, options.dataType).error(function() {
					options.curobj.attr('disabled', false);
					defaults.onerr();
				}).complete(function() {
					defaults.oncomplete();
					options.curobj.attr('disabled', false);
				});
			},
			implodeval : function(e) {
				val = $("#" + id + " :input").map(
						function() {
							if ($(this).attr('name') != ''
									&& $(this).attr('name') != undefined) {
								return $(this).attr('name') + "-"
										+ $(this).val();
							}
						}).get().join("-");
				return val;
			},
			get : function(e) {
				$(".ui-dialog-todo").remove();
				$("#ui-cnt").removeClass('succ error alert')
						.addClass('loading');
				var val = this.implodeval();
				$.get(
						e.url + "-" + val,
						'',
						function(result) {
							options.curobj.attr('disabled', false);
							defaults.onsucc(result);
							if (result.wait != undefined || result.wait != null) {
								if (result.url != undefined || result.url != null) {
									setTimeout("$.refresh(" + result.url+ ")", options.intvaltime);
								} else {
									setTimeout("$.refresh(" + options.redirurl+ ")", options.intvaltime);
								}
							}
						}, options.dataType).error(function() {
					options.curobj.attr('disabled', false);
					defaults.onerr();
				}).complete(function() {
					defaults.oncomplete();
					options.curobj.attr('disabled', false);
				});
			}
		};
	};
	$.fn.ajaxdel = function(options) {
		var defaults = {
			txt : '数据提交中,请稍后...',
			redirurl : window.location.href,
			dataType : 'json',
			onsucc : function(e) {
			},
			onerr : function() {
			},
			oncomplete : function() {
			},
			intvaltime : 3000
		};
		$(".ui-dialog-todo").remove();
		$("#ui-cnt").removeClass('succ error alert').addClass('loading');
		var options = $.extend(defaults, options);
		var ajurl = $(this).attr('url');
		$.ajax({
			url : ajurl,
			success : function(data) {
				options.onsucc(data);
			},
			error : function() {
				options.onerr();
			},
			complete : function() {
				options.oncomplete();
			},
			dataType : 'json'
		});
	};
})(jQuery);
function suburl(url,thisobj) {$.showfloatdiv({txt : '数据提交中...',cssname : 'loading'});$.get(url, function(r){$.hidediv(r);if (parseInt(r.code) > 0){thisobj.children('strong').html(parseInt(thisobj.children('strong').html()) + 1)}},'json');
};
/*!
	Colorbox v1.5.13 - 2014-08-04
	jQuery lightbox and modal window plugin
	(c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(t, e, i) {
	function n(i, n, o) {
		var r = e.createElement(i);
		return n && (r.id = Z + n), o && (r.style.cssText = o), t(r)
	}
	function o() {
		return i.innerHeight ? i.innerHeight : t(i).height()
	}
	function r(e, i) {
		i !== Object(i) && (i = {}), this.cache = {}, this.el = e, this.value = function(e) {
			var n;
			return void 0 === this.cache[e] && (n = t(this.el).attr("data-cbox-" + e), void 0 !== n ? this.cache[e] = n : void 0 !== i[e] ? this.cache[e] = i[e] : void 0 !== X[e] && (this.cache[e] = X[e])), this.cache[e]
		}, this.get = function(e) {
			var i = this.value(e);
			return t.isFunction(i) ? i.call(this.el, this) : i
		}
	}
	function h(t) {
		var e = W.length,
			i = (z + t) % e;
		return 0 > i ? e + i : i
	}
	function a(t, e) {
		return Math.round((/%/.test(t) ? ("x" === e ? E.width() : o()) / 100 : 1) * parseInt(t, 10))
	}
	function s(t, e) {
		return t.get("photo") || t.get("photoRegex").test(e)
	}
	function l(t, e) {
		return t.get("retinaUrl") && i.devicePixelRatio > 1 ? e.replace(t.get("photoRegex"), t.get("retinaSuffix")) : e
	}
	function d(t) {
		"contains" in y[0] && !y[0].contains(t.target) && t.target !== v[0] && (t.stopPropagation(), y.focus())
	}
	function c(t) {
		c.str !== t && (y.add(v).removeClass(c.str).addClass(t), c.str = t)
	}
	function g(e) {
		z = 0, e && e !== !1 && "nofollow" !== e ? (W = t("." + te).filter(function() {
			var i = t.data(this, Y),
				n = new r(this, i);
			return n.get("rel") === e
		}), z = W.index(_.el), -1 === z && (W = W.add(_.el), z = W.length - 1)) : W = t(_.el)
	}
	function u(i) {
		t(e).trigger(i), ae.triggerHandler(i)
	}
	function f(i) {
		var o;
		if (!G) {
			if (o = t(i).data(Y), _ = new r(i, o), g(_.get("rel")), !$) {
				$ = q = !0, c(_.get("className")), y.css({
					visibility: "hidden",
					display: "block",
					opacity: ""
				}), L = n(se, "LoadedContent", "width:0; height:0; overflow:hidden; visibility:hidden"), b.css({
					width: "",
					height: ""
				}).append(L), D = T.height() + k.height() + b.outerHeight(!0) - b.height(), j = C.width() + H.width() + b.outerWidth(!0) - b.width(), A = L.outerHeight(!0), N = L.outerWidth(!0);
				var h = a(_.get("initialWidth"), "x"),
					s = a(_.get("initialHeight"), "y"),
					l = _.get("maxWidth"),
					f = _.get("maxHeight");
				_.w = (l !== !1 ? Math.min(h, a(l, "x")) : h) - N - j, _.h = (f !== !1 ? Math.min(s, a(f, "y")) : s) - A - D, L.css({
					width: "",
					height: _.h
				}), J.position(), u(ee), _.get("onOpen"), O.add(I).hide(), y.focus(), _.get("trapFocus") && e.addEventListener && (e.addEventListener("focus", d, !0), ae.one(re, function() {
					e.removeEventListener("focus", d, !0)
				})), _.get("returnFocus") && ae.one(re, function() {
					t(_.el).focus()
				})
			}
			var p = parseFloat(_.get("opacity"));
			v.css({
				opacity: p === p ? p : "",
				cursor: _.get("overlayClose") ? "pointer" : "",
				visibility: "visible"
			}).show(), _.get("closeButton") ? B.html(_.get("close")).appendTo(b) : B.appendTo("<div/>"), w()
		}
	}
	function p() {
		!y && e.body && (V = !1, E = t(i), y = n(se).attr({
			id: Y,
			"class": t.support.opacity === !1 ? Z + "IE" : "",
			role: "dialog",
			tabindex: "-1"
		}).hide(), v = n(se, "Overlay").hide(), S = t([n(se, "LoadingOverlay")[0], n(se, "LoadingGraphic")[0]]), x = n(se, "Wrapper"), b = n(se, "Content").append(I = n(se, "Title"), R = n(se, "Current"), P = t('<button type="button"/>').attr({
			id: Z + "Previous"
		}), K = t('<button type="button"/>').attr({
			id: Z + "Next"
		}), F = n("button", "Slideshow"), S), B = t('<button type="button"/>').attr({
			id: Z + "Close"
		}), x.append(n(se).append(n(se, "TopLeft"), T = n(se, "TopCenter"), n(se, "TopRight")), n(se, !1, "clear:left").append(C = n(se, "MiddleLeft"), b, H = n(se, "MiddleRight")), n(se, !1, "clear:left").append(n(se, "BottomLeft"), k = n(se, "BottomCenter"), n(se, "BottomRight"))).find("div div").css({
			"float": "left"
		}), M = n(se, !1, "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"), O = K.add(P).add(R).add(F), t(e.body).append(v, y.append(x, M)))
	}
	function m() {
		function i(t) {
			t.which > 1 || t.shiftKey || t.altKey || t.metaKey || t.ctrlKey || (t.preventDefault(), f(this))
		}
		return y ? (V || (V = !0, K.click(function() {
			J.next()
		}), P.click(function() {
			J.prev()
		}), B.click(function() {
			J.close()
		}), v.click(function() {
			_.get("overlayClose") && J.close()
		}), t(e).bind("keydown." + Z, function(t) {
			var e = t.keyCode;
			$ && _.get("escKey") && 27 === e && (t.preventDefault(), J.close()), $ && _.get("arrowKey") && W[1] && !t.altKey && (37 === e ? (t.preventDefault(), P.click()) : 39 === e && (t.preventDefault(), K.click()))
		}), t.isFunction(t.fn.on) ? t(e).on("click." + Z, "." + te, i) : t("." + te).live("click." + Z, i)), !0) : !1
	}
	function w() {
		var e, o, r, h = J.prep,
			d = ++le;
		if (q = !0, U = !1, u(he), u(ie), _.get("onLoad"), _.h = _.get("height") ? a(_.get("height"), "y") - A - D : _.get("innerHeight") && a(_.get("innerHeight"), "y"), _.w = _.get("width") ? a(_.get("width"), "x") - N - j : _.get("innerWidth") && a(_.get("innerWidth"), "x"), _.mw = _.w, _.mh = _.h, _.get("maxWidth") && (_.mw = a(_.get("maxWidth"), "x") - N - j, _.mw = _.w && _.w < _.mw ? _.w : _.mw), _.get("maxHeight") && (_.mh = a(_.get("maxHeight"), "y") - A - D, _.mh = _.h && _.h < _.mh ? _.h : _.mh), e = _.get("href"), Q = setTimeout(function() {
			S.show()
		}, 100), _.get("inline")) {
			var c = t(e);
			r = t("<div>").hide().insertBefore(c), ae.one(he, function() {
				r.replaceWith(c)
			}), h(c)
		} else _.get("iframe") ? h(" ") : _.get("html") ? h(_.get("html")) : s(_, e) ? (e = l(_, e), U = new Image, t(U).addClass(Z + "Photo").bind("error", function() {
			h(n(se, "Error").html(_.get("imgError")))
		}).one("load", function() {
			d === le && setTimeout(function() {
				var e;
				t.each(["alt", "longdesc", "aria-describedby"], function(e, i) {
					var n = t(_.el).attr(i) || t(_.el).attr("data-" + i);
					n && U.setAttribute(i, n)
				}), _.get("retinaImage") && i.devicePixelRatio > 1 && (U.height = U.height / i.devicePixelRatio, U.width = U.width / i.devicePixelRatio), _.get("scalePhotos") && (o = function() {
					U.height -= U.height * e, U.width -= U.width * e
				}, _.mw && U.width > _.mw && (e = (U.width - _.mw) / U.width, o()), _.mh && U.height > _.mh && (e = (U.height - _.mh) / U.height, o())), _.h && (U.style.marginTop = Math.max(_.mh - U.height, 0) / 2 + "px"), W[1] && (_.get("loop") || W[z + 1]) && (U.style.cursor = "pointer", U.onclick = function() {
					J.next()
				}), U.style.width = U.width + "px", U.style.height = U.height + "px", h(U)
			}, 1)
		}), U.src = e) : e && M.load(e, _.get("data"), function(e, i) {
			d === le && h("error" === i ? n(se, "Error").html(_.get("xhrError")) : t(this).contents())
		})
	}
	var v, y, x, b, T, C, H, k, W, E, L, M, S, I, R, F, K, P, B, O, _, D, j, A, N, z, U, $, q, G, Q, J, V, X = {
		html: !1,
		photo: !1,
		iframe: !1,
		inline: !1,
		transition: "elastic",
		speed: 300,
		fadeOut: 300,
		width: !1,
		initialWidth: "600",
		innerWidth: !1,
		maxWidth: !1,
		height: !1,
		initialHeight: "450",
		innerHeight: !1,
		maxHeight: !1,
		scalePhotos: !0,
		scrolling: !0,
		opacity: .8,
		preloading: !0,
		className: !1,
		overlayClose: !0,
		escKey: !0,
		arrowKey: !0,
		top: !1,
		bottom: !1,
		left: !1,
		right: !1,
		fixed: !1,
		data: void 0,
		closeButton: !0,
		fastIframe: !0,
		open: !1,
		reposition: !0,
		loop: !0,
		slideshow: !1,
		slideshowAuto: !0,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
		retinaImage: !1,
		retinaUrl: !1,
		retinaSuffix: "@2x.$1",
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		xhrError: "This content failed to load.",
		imgError: "This image failed to load.",
		returnFocus: !0,
		trapFocus: !0,
		onOpen: !1,
		onLoad: !1,
		onComplete: !1,
		onCleanup: !1,
		onClosed: !1,
		rel: function() {
			return this.rel
		},
		href: function() {
			return t(this).attr("href")
		},
		title: function() {
			return this.title
		}
	},
		Y = "colorbox",
		Z = "cbox",
		te = Z + "Element",
		ee = Z + "_open",
		ie = Z + "_load",
		ne = Z + "_complete",
		oe = Z + "_cleanup",
		re = Z + "_closed",
		he = Z + "_purge",
		ae = t("<a/>"),
		se = "div",
		le = 0,
		de = {},
		ce = function() {
			function t() {
				clearTimeout(h)
			}
			function e() {
				(_.get("loop") || W[z + 1]) && (t(), h = setTimeout(J.next, _.get("slideshowSpeed")))
			}
			function i() {
				F.html(_.get("slideshowStop")).unbind(s).one(s, n), ae.bind(ne, e).bind(ie, t), y.removeClass(a + "off").addClass(a + "on")
			}
			function n() {
				t(), ae.unbind(ne, e).unbind(ie, t), F.html(_.get("slideshowStart")).unbind(s).one(s, function() {
					J.next(), i()
				}), y.removeClass(a + "on").addClass(a + "off")
			}
			function o() {
				r = !1, F.hide(), t(), ae.unbind(ne, e).unbind(ie, t), y.removeClass(a + "off " + a + "on")
			}
			var r, h, a = Z + "Slideshow_",
				s = "click." + Z;
			return function() {
				r ? _.get("slideshow") || (ae.unbind(oe, o), o()) : _.get("slideshow") && W[1] && (r = !0, ae.one(oe, o), _.get("slideshowAuto") ? i() : n(), F.show())
			}
		}();
	t[Y] || (t(p), J = t.fn[Y] = t[Y] = function(e, i) {
		var n, o = this;
		if (e = e || {}, t.isFunction(o)) o = t("<a/>"), e.open = !0;
		else if (!o[0]) return o;
		return o[0] ? (p(), m() && (i && (e.onComplete = i), o.each(function() {
			var i = t.data(this, Y) || {};
			t.data(this, Y, t.extend(i, e))
		}).addClass(te), n = new r(o[0], e), n.get("open") && f(o[0])), o) : o
	}, J.position = function(e, i) {
		function n() {
			T[0].style.width = k[0].style.width = b[0].style.width = parseInt(y[0].style.width, 10) - j + "px", b[0].style.height = C[0].style.height = H[0].style.height = parseInt(y[0].style.height, 10) - D + "px"
		}
		var r, h, s, l = 0,
			d = 0,
			c = y.offset();
		if (E.unbind("resize." + Z), y.css({
			top: -9e4,
			left: -9e4
		}), h = E.scrollTop(), s = E.scrollLeft(), _.get("fixed") ? (c.top -= h, c.left -= s, y.css({
			position: "fixed"
		})) : (l = h, d = s, y.css({
			position: "absolute"
		})), d += _.get("right") !== !1 ? Math.max(E.width() - _.w - N - j - a(_.get("right"), "x"), 0) : _.get("left") !== !1 ? a(_.get("left"), "x") : Math.round(Math.max(E.width() - _.w - N - j, 0) / 2), l += _.get("bottom") !== !1 ? Math.max(o() - _.h - A - D - a(_.get("bottom"), "y"), 0) : _.get("top") !== !1 ? a(_.get("top"), "y") : Math.round(Math.max(o() - _.h - A - D, 0) / 2), y.css({
			top: c.top,
			left: c.left,
			visibility: "visible"
		}), x[0].style.width = x[0].style.height = "9999px", r = {
			width: _.w + N + j,
			height: _.h + A + D,
			top: l,
			left: d
		}, e) {
			var g = 0;
			t.each(r, function(t) {
				return r[t] !== de[t] ? (g = e, void 0) : void 0
			}), e = g
		}
		de = r, e || y.css(r), y.dequeue().animate(r, {
			duration: e || 0,
			complete: function() {
				n(), q = !1, x[0].style.width = _.w + N + j + "px", x[0].style.height = _.h + A + D + "px", _.get("reposition") && setTimeout(function() {
					E.bind("resize." + Z, J.position)
				}, 1), i && i()
			},
			step: n
		})
	}, J.resize = function(t) {
		var e;
		$ && (t = t || {}, t.width && (_.w = a(t.width, "x") - N - j), t.innerWidth && (_.w = a(t.innerWidth, "x")), L.css({
			width: _.w
		}), t.height && (_.h = a(t.height, "y") - A - D), t.innerHeight && (_.h = a(t.innerHeight, "y")), t.innerHeight || t.height || (e = L.scrollTop(), L.css({
			height: "auto"
		}), _.h = L.height()), L.css({
			height: _.h
		}), e && L.scrollTop(e), J.position("none" === _.get("transition") ? 0 : _.get("speed")))
	}, J.prep = function(i) {
		function o() {
			return _.w = _.w || L.width(), _.w = _.mw && _.mw < _.w ? _.mw : _.w, _.w
		}
		function a() {
			return _.h = _.h || L.height(), _.h = _.mh && _.mh < _.h ? _.mh : _.h, _.h
		}
		if ($) {
			var d, g = "none" === _.get("transition") ? 0 : _.get("speed");
			L.remove(), L = n(se, "LoadedContent").append(i), L.hide().appendTo(M.show()).css({
				width: o(),
				overflow: _.get("scrolling") ? "auto" : "hidden"
			}).css({
				height: a()
			}).prependTo(b), M.hide(), t(U).css({
				"float": "none"
			}), c(_.get("className")), d = function() {
				function i() {
					t.support.opacity === !1 && y[0].style.removeAttribute("filter")
				}
				var n, o, a = W.length;
				$ && (o = function() {
					clearTimeout(Q), S.hide(), u(ne), _.get("onComplete")
				}, I.html(_.get("title")).show(), L.show(), a > 1 ? ("string" == typeof _.get("current") && R.html(_.get("current").replace("{current}", z + 1).replace("{total}", a)).show(), K[_.get("loop") || a - 1 > z ? "show" : "hide"]().html(_.get("next")), P[_.get("loop") || z ? "show" : "hide"]().html(_.get("previous")), ce(), _.get("preloading") && t.each([h(-1), h(1)], function() {
					var i, n = W[this],
						o = new r(n, t.data(n, Y)),
						h = o.get("href");
					h && s(o, h) && (h = l(o, h), i = e.createElement("img"), i.src = h)
				})) : O.hide(), _.get("iframe") ? (n = e.createElement("iframe"), "frameBorder" in n && (n.frameBorder = 0), "allowTransparency" in n && (n.allowTransparency = "true"), _.get("scrolling") || (n.scrolling = "no"), t(n).attr({
					src: _.get("href"),
					name: (new Date).getTime(),
					"class": Z + "Iframe",
					allowFullScreen: !0
				}).one("load", o).appendTo(L), ae.one(he, function() {
					n.src = "//about:blank"
				}), _.get("fastIframe") && t(n).trigger("load")) : o(), "fade" === _.get("transition") ? y.fadeTo(g, 1, i) : i())
			}, "fade" === _.get("transition") ? y.fadeTo(g, 0, function() {
				J.position(0, d)
			}) : J.position(g, d)
		}
	}, J.next = function() {
		!q && W[1] && (_.get("loop") || W[z + 1]) && (z = h(1), f(W[z]))
	}, J.prev = function() {
		!q && W[1] && (_.get("loop") || z) && (z = h(-1), f(W[z]))
	}, J.close = function() {
		$ && !G && (G = !0, $ = !1, u(oe), _.get("onCleanup"), E.unbind("." + Z), v.fadeTo(_.get("fadeOut") || 0, 0), y.stop().fadeTo(_.get("fadeOut") || 0, 0, function() {
			y.hide(), v.hide(), u(he), L.remove(), setTimeout(function() {
				G = !1, u(re), _.get("onClosed")
			}, 1)
		}))
	}, J.remove = function() {
		y && (y.stop(), t[Y].close(), y.stop(!1, !0).remove(), v.remove(), G = !1, y = null, t("." + te).removeData(Y).removeClass(te), t(e).unbind("click." + Z).unbind("keydown." + Z))
	}, J.element = function() {
		return t(_.el)
	}, J.settings = X)
})(jQuery, document, window);