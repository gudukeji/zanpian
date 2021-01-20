var m256 = {
	navSlide: function() {
		var menuSwiper = new Swiper(".menu_container", {
			freeMode: true,
			slidesPerView: "auto",
			observer: true,
			observeParents: true,
			onInit: function(swiper) {
				var currentSlide = $(".menu_container .swiper-slide").find("a.on").parent(),
					slideWidth = currentSlide.outerWidth(),
					slideLeft = currentSlide.offset().left,
					maxTranslate = swiper.maxTranslate(),
					windowWidth = $(window).outerWidth();
				if (slideLeft < windowWidth / 2) {
					swiper.setWrapperTranslate(0)
				} else {
					if (slideLeft > -maxTranslate + (windowWidth / 2) - slideWidth) {
						swiper.setWrapperTranslate(maxTranslate)
					} else {
						swiper.setWrapperTranslate((windowWidth / 2) - slideLeft - (slideWidth / 2))
					}
				}
			}
		})
	},
	bannerSlide: function() {
		var bannerSwiper = new Swiper(".banner_container", {
			effect: "coverflow",
			grabCursor: true,
			centeredSlides: true,
			loop: true,
			autoplay: 5000,
			autoplayDisableOnInteraction: false,
			speed: 800,
			slidesPerView: "auto",
			observer: true,
			observeParents: true,
			coverflow: {
				rotate: 30,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows: true
			}
		})
	},
	tabSlide: function() {
		var topSwiper = new Swiper(".top_container", {
			freeMode: true,
			slidesPerView: "auto",
			observer: true,
			observeParents: true,
			onTap: function(swiper) {
				bottomSwiper.slideTo(swiper.clickedIndex)
			}
		});
		var bottomSwiper = new Swiper(".bottom_container", {
			freeMode: false,
			spaceBetween: 10,
			observer: true,
			observeParents: true,
			onSlideChangeStart: function(swiper) {
				$(".top_container .on").removeClass("on");
				var currentSlide = $(".top_container .swiper-slide").eq(swiper.activeIndex).addClass("on");
				var slide = topSwiper.slides[swiper.activeIndex],
					swiperWidth = topSwiper.container[0].clientWidth,
					maxTranslate = topSwiper.maxTranslate();
				maxWidth = -maxTranslate + swiperWidth / 2;
				slideLeft = slide.offsetLeft, slideWidth = slide.clientWidth, slideCenter = slideLeft + slideWidth / 2;
				topSwiper.setWrapperTransition(300);
				if (slideCenter < swiperWidth / 2) {
					topSwiper.setWrapperTranslate(0)
				} else {
					if (slideCenter > maxWidth) {
						topSwiper.setWrapperTranslate(maxTranslate)
					} else {
						nowTlanslate = slideCenter - swiperWidth / 2;
						topSwiper.setWrapperTranslate(-nowTlanslate)
					}
				}
			}
		})
	},
	newSlide: function() {
		var newSwiper = new Swiper(".new_container", {
			freeMode: true,
			slidesPerView: "auto",
			observer: true,
			observeParents: true
		})
	},dbOpen: function(){
        $(".db_more").click(function(){
            $(this).hide();
            $(this).parent().css({
                "padding-right" : "0",
                "white-space" : "normal"
            })
        })
    },
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
	},lanScroll : function() {
        var box = $(".swiper-variecontainer");
        if(box.length >= 1) {
            var item = $(".swiper-variecontainer .ent_model .model_item");
            var t = parseFloat(item.outerWidth(true)+1);
            var l = item.length;
            $(".swiper-variecontainer .ent_model").width(t*l);
            box.on('vmousedown', function(event){
                $(this).on('vmousemove',function(event){
                    picMod();               
                }).on('vmouseup', function(){
                    setTimeout(function(){
                        picMod();
                    }, 500)
                })
            })
            function picMod(){
                item.each(function(){
                    var thisWrap = parseInt(box.width()) + parseInt(box.offset().left);
                    var thisPic = $(this).offset().left; 
                    var real = $(this).children().find("img").attr("data-src");
                    if (thisPic <= thisWrap && real != $(this).children().find("img").attr("src")) {
                       $(this).children().find("img").attr("src", real);
                    }
                    
                })
            }
        }
    },
    sortData: function(a,b,c){
        $(a).click(function(){
            var ob = $(b),
                box = $(c),
                len = ob.length,
                arr = [],
                i = 0,
                str;
                if($(this).children("i.down").hasClass("on")){
                    $(this).children("i.up").addClass("on").siblings().removeClass("on")
                }else {
                    $(this).children("i.down").addClass("on").siblings().removeClass("on")   
                }
                ob.each(function(){
                    i = len - $(this).index() -1;
                    str = ob.eq(i);
                    arr.push(str);
                })
                box.append(arr);
        })   
    },navSlides: function() {
        var filmswiper = new Swiper('.swiper-filmcontainer', {
            slidesPerView: 'auto',
            paginationClickable: true,
            speed : 500,
            freeMode: true,
            freeModeFluid: true,
            freeModeMomentumRatio: 0.4,
            scrollContainer: true,
            momentumRatio: 0,
            momentumBounce: false,
        });
        var navSwiper = new Swiper('.swiper-navcontainer', {
            slidesPerView: 'auto',
            freeMode: true,
            freeModeMomentumRatio: 0.5,
            roundLengths: true,
            setWrapperSize :true,
        }); 
    },
	ElementViewTop: function(ele) {
		if (ele) {
			var actualTop = ele.offsetTop;
			var current = ele.offsetParent;
			while (current !== null) {
				actualTop += current.offsetTop;
				current = current.offsetParent
			}
			return actualTop - m256.ScrollTop()
		}
	},
	lazyLoad: function() {
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
			nl_count = 0,
			nl_obj = [],
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
					if (typeof(el[j].getAttribute("data-src")) == "string" && typeof(el[j].getAttribute("lazy-unload")) != "string") {
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
						ele_obj[i].src = ele_obj[i].getAttribute("data-src");
						ele_obj[i].removeAttribute("data-src");
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
	},
	setCookie: function(c_name, value, expiredays, path) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=" + path
	},
	getCookie: function(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) {
					c_end = document.cookie.length
				}
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
	},
	isExist: function(cookieName) {
		if (document.cookie.indexOf(cookieName) != -1) {
			return true
		}
		return false
	},
	navFixed: function() {
		var target = $("nav");
		var headHeight = $("header").height();
		var navHeight = target.height();
		$(window).scroll(function() {
			var top = $(window).scrollTop();
			if (top > headHeight + navHeight) {
				target.parent().css({
					"padding-top": navHeight
				});
				target.css({
					"position": "fixed",
					"top": "0"
				})
			} else {
				target.parent().removeAttr("style");
				target.removeAttr("style")
			}
		})
	},
	changeShow: function() {
		var btn = $(".changeBtn");
		btn.click(function() {
			var _this = $(this).parent().parent().parent().children("ul").children().eq(0);
			var target = _this.siblings().children();
			if (_this.hasClass("show")) {
				_this.removeClass("show").siblings().addClass("show")
			} else {
				_this.addClass("show").siblings().removeClass("show")
			}
			m256.imgLoad(target)
		})
	},
	imgLoad: function(target) {
		target.find("img").each(function() {
			if (typeof($(this).attr("lazy-unload")) == "string") {
				$(this).attr("src", $(this).attr("data-src"));
				$(this).removeAttr("data-src");
				$(this).removeAttr("lazy-unload")
			}
		})
	},
	weekTab: function(a, b) {
		var btn = $(a).children();
		var target = $(b).children();
		btn.click(function() {
			var index = $(this).index();
			var imgTarget = target.eq(index);
			$(this).addClass("on").siblings().removeClass("on");
			target.eq(index).addClass("show").siblings().removeClass("show");
			m256.imgLoad(imgTarget)
		})
	},
	goTop: function(a) {
		var gotop = $(a);
		$(window).scroll(function() {
			$(window).scrollTop() > 200 ? gotop.show() : gotop.hide()
		});
		gotop.on("click", function() {
			$("html,body").stop().animate({
				scrollTop: 0
			}, 500)
		})
	},showData: function(a,b,c) {
        $(a).click(function(){
            $("body").css({"overflow" : "hidden"})
            $(b).stop().animate({
                "height" : c + "rem"
            }, 400)
        })
        $(".fix_select .close").click(function(){
            $("body").css({"overflow" : "inherit"})
            $(b).stop().animate({
                "height" : "0"
            }, 400)
        })
    },
 episodeSelect: function() {
	var $Btn = $(".source-box span"),
		$selected = $(".play_icon");
	$Btn.click(function() {
		var site = $(this).attr("site"),
			txt = $(this).text(),
			cl = $(this).attr("class");
		$selected.children().removeClass().addClass(cl);
		$selected.children().text(txt);
		$selected.children().attr("site", site);
		$(".source-box").hide();
		
	})
},	
	openInfo: function(a, b, c, d, e) {
		var btn = $(a),
			target = $(b);
		btn.click(function() {
			if (target.hasClass(c)) {
				$(this).html(d + '<i class="down"></i>');
				target.removeClass(c);
				$("html,body").stop().animate({
					scrollTop: 0
				}, 10)
			} else {
				target.addClass(c);
				$(this).html(e + '<i class="up"></i>')
			}
		})
	},
	selectPopup: function() {
		$(".select_btn").click(function() {
			var h = $(window).height();
			var contentHeight = $(".detail_banner").outerHeight();
			var headHeight = $("header").height();
			var popupTitle = $(".popup_title").height();
			var topHeight = $(".select_popup .top_container").outerHeight(true);
			var mainHeight = h - contentHeight;
			var popupHeight = mainHeight - popupTitle - topHeight;
			$(".select_wrap").show();
			$("body").css({
				"overflow": "hidden",
				"height": "100%",
				"position": "fixed",
				"top": "0"
			});
			$(".wrapper").css({
				"position": "absolute",
				"top": -headHeight
			});
			$(".select_popup").stop().animate({
				"height": mainHeight
			}, 100);
			$(".select_popup .select_show").height(popupHeight)
		});
		$(".popup_close,.popup_bg").on("click", function() {
			$(".select_wrap").hide();
			$("body").removeAttr("style");
			$(".wrapper").removeAttr("style")
		})
	},
	bigPic: function(a) {
		$(a).click(function() {
			var src = $(this).attr("src");
			var title = $(this).attr("title");
			var pop = '<div id="imgPop" style="display: -webkit-flex;display: flex;flex-wrap: wrap;justify-content: center; align-items: center;position: fixed; top:0;left:0;width: 100%;height:100%;background-color: rgba(0,0,0,1);z-index:99999"><img style="width: 100%;min-height: unset" src="' + src + '" alt="' + title + '" title="' + title + '"></div>';
			$("body").css({
				"position": "relative"
			});
			$("body").append(pop);
			$("#imgPop").click(function() {
				$(this).remove()
			})
		})
	},menuClick : function(a,b,c) {
        var btn = $(a);
        var box = $(b);
        var f = true;
        btn.click(function(){
            if(f){
                box.stop().animate({
                    "height" : c + "rem"
                }, 400) 
                f = false;  
            }else {
                box.stop().animate({
                    "height" : "0"
                }, 400) 
                f = true;
            }
        })
        box.click(function(){
            $(this).stop().animate({
                "height" : "0"
            }, 400)
            f = true;
        })
    },
	stagePhoto: function(){
        var navh = $(".head_detail").height();
        var bh = $(".swiper-title").height();
        var nh = $(".stage_bottom").height();
        var h = window.screen.height;
        var bannerSwiper = new Swiper('.stage_slide',{
            pagination: '.swiper-pagination',
            paginationType: 'custom',
            paginationClickable: true,
            paginationCustomRender: function(swiper, current, total) { 
                var customPaginationHtml = ""; 
                if(current < 10){
                        current = "0" + current;
                    }else {
                        current = current;
                    }
                for(var i = 0; i < total; i++) {  
                    customPaginationHtml = '<span class="swiper-pagination-current">'+ current +'</span>/<span class="swiper-pagination-total">'+ total +'</span>';
                } 
                return customPaginationHtml; 
            },
            onInit: function(swiper){
                var flag = false;
                $(".stage_slide img").each(function(){
                    if($(this).height() > 450){
                        flag = true;
                    }
                }) 
                if(!flag){
                    $(".swiper-wrapper").height(h - navh - bh - nh)
                }
            },
            onSlideChangeStart: function(swiper){
                if($(".swiper-slide")[swiper.activeIndex].offsetHeight > 450){
                    $(".swiper-wrapper").height("auto")
                }else {
                    $(".swiper-wrapper").height(h - navh - bh - nh)
                }


                var len = $(".swiper-slide").length;
                if(swiper.activeIndex  == (len -1)){
                    $(".swiper-title").children().hide();
                    $(".swiper-pagination").hide();
                }else {
                    $(".swiper-title").children().show();
                    $(".swiper-pagination").show();
                }
            }
        });
    }
};

function channel() {
	m256.bannerSlide();
	m256.navSlide();
	m256.navFixed();
	m256.openInfo("#plot_list .more_open", ".plot_list", "hasOpen", "加载更多", "点击收起")
}
function detail() {
	m256.openInfo(".more_open", ".detail_intr", "hasOpen", "更多详情", "收起详情");
	m256.openInfo("#plot_detail .more_open", ".plot_change", "hasOpen", "显示全文", "收起全文");
	m256.openInfo("#news_detail .more_open", ".news_change", "hasOpen", "显示全文", "收起全文");
	m256.openInfo("#star_detail .more_open", ".star_article", "hasOpen", "更多详情", "收起详情");
	m256.openInfo("#theme_detail .more_open", ".theme_info", "hasOpen", "更多详情", "收起详情");
	m256.openInfo("#update .more_open", ".update", "hasOpen", "加载更多", "点击收起");
	m256.selectPopup();
	m256.lanScroll();
	m256.navSlides();
	m256.dbOpen();
	m256.episodeSelect();
	m256.sortData(".sort",".fix_select_con a", ".fix_select_con");
	m256.showData(".show_data",".fix_select",5.5);
    m256.showData(".show_data",".fix_varie",6.1);
	m256.menuClick(".menu_detail",".layer",10.4);
	m256.bigPic(".news_article_content img")
	if($(".news_change").height()>1000){
		$(".news_change").height(1000);
		$(".news_change .more_open").show();
	}else{
	   $(".news_change .more_open").show();
	}
	if($(".plot_change").height()>500){
		$(".plot_change").height(500);
		$(".plot_change .more_open").show();
	}else{
	   $(".plot_change .more_open").hide();
	}	
};		   
$(document).ready(function() {
	m256.lazyLoad();
	m256.newSlide();
	m256.tabSlide();
	m256.changeShow();
	m256.weekTab(".week_nav", ".week_box");
	$(".source-box span").each(function(j) {
		$(this).click(function() {
			$('.selections').hide().css("opacity", 0);
			$('.selections:eq(' + j + ')').show().animate({
				"opacity": "1"
			});
			var html = $('.selections:eq(' + j + ')').html();
			html = html.replace(/<div\/?[^>]*>/g, '');
			html = html.replace(/<\/div\/?[^>]*>/g, '');
			$(".fix_select_con").html(html);
			var html = $('.selections:eq(' + j + ') ul').html();
			html = html.replace(/<li\/?[^>]*>/g, '');
			html = html.replace(/<\/li\/?[^>]*>/g, '');
			$(".select_shows").html(html);
		});
	});
	$('.play_icon span').click(function() {
		$(".source-box").show();
	});
	$(".detail-hits").each(function(i) {
		var $this = $(".detail-hits").eq(i);
		$.ajax({
			url: cms.root + 'index.php?s=/home/hits/show/id/' + $this.attr("data-id") + '/sid/' + $this.attr("data-sid") + '/type/' + $this.attr("data-type"),
			cache: true,
			dataType: 'json',
			success: function(data) {
				$type = $this.attr('data-type');
				if ($type != 'insert') {
					$this.html(eval('(data.' + $type + ')'));
				}
				$("#detail-hits").html(eval('(data.' + $("#detail-hits").attr('data-type') + ')'));
			}
		});
	});
})