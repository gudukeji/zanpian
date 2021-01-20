var zanpian = {
//浏览器信息
'browser':{
	'url': document.URL,
	'domain': document.domain,
	'title': document.title,
	'language': function(){
		try {
		  var ua = (navigator.browserLanguage || navigator.language).toLowerCase();//zh-tw|zh-hk|zh-cn
		  return ua;
		} catch (e) {}
	}(),
	'canvas' : function(){
		return !!document.createElement('canvas').getContext;
	}(),
	'useragent' : function(){
		var ua = navigator.userAgent;//navigator.appVersion
		return {
			'mobile': !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端 
			'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1, //android终端或者uc浏览器 
			'iPhone': ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器 
			'iPad': ua.indexOf('iPad') > -1, //是否iPad
			'trident': ua.indexOf('Trident') > -1, //IE内核
			'presto': ua.indexOf('Presto') > -1, //opera内核
			'webKit': ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			'gecko': ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核 
			'weixin': ua.indexOf('MicroMessenger') > -1 //是否微信 ua.match(/MicroMessenger/i) == "micromessenger",			
		};
	}(),
	'path' : function(){
		var url = document.location.toString();
		var arrUrl = url.split("//");
		var start = arrUrl[1].indexOf("/");
		var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符
		if (relUrl.indexOf("?") != -1) {
			//relUrl = relUrl.split("?")[0];
		}
		return relUrl;
	}
},	
	//系统相关
	'cms': {
		//加载资源
		'load': function() {
			$("<link>").attr({rel: "stylesheet",type: "text/css",href: cms.public + "v11/system/css/system.css"}).appendTo("head");
			$.ajaxSetup({cache: true});
			$.getScript(cms.public + "v11/system/system.js");
			zanpian.cms.verify();
			zanpian.cms.hits();
			zanpian.cms.qrcode();			
		},
		//人气处理
		'hits': function() {
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
		},
		//二维码生成
		'qrcode': function() {
			if ($('.qrcode,#qrcode').length > 0) {
				murl = cms.murl;
				if (murl == '' || murl == 'undefined' || murl == undefined) {
					murl = document.URL;
				}
				$(".qrcode img").attr("src", "//api.97bike.com/qrcode/?url=" + encodeURIComponent(murl));
				$("#qrcode").append('<img src="//api.97bike.com/qrcode/?url=' + encodeURIComponent(murl) + '"/>');
			}
		},
		//验证码
		'verify': function() {
			$('body').on('click', 'img.validate', function() {
				$(this).attr("src", cms.root + 'index.php?s=/home/verify/index/' + Math.random());
			});
		},
	},
	'list': {
		//列表AJAX响应
		'more': function() {
			if ($('#content-more').length > 0) {
				var msg_list_loading = false;
				var i = 2;
				$(window).scroll(function() {
					if (!msg_list_loading) {
						load_more_msg(more_ajax_url);
					}
				})
				function load_more_msg(url) {
					var winH = $(window).height();
					var pageH = $(document.body).height();
					var scrollT = $(window).scrollTop(); //滚动条top
					var aa = (pageH - winH - scrollT) / winH;
					if (aa < 0.02) {
						msg_list_loading = true;
						$("#content-more").append('<div class="loading" id="moreloading">正在加载中</div>');
						$.get(url + '-p-' + i, function(data, status) {
							var value = jQuery('#content-more', data).html();
							$("#content-more").find("#moreloading").remove();
							if (value == null || value == '') {
								value = '<div class="kong">抱歉，已经没有数据了！</div>';
								msg_list_loading = true;
								$("#content-more").append(value);
								return false;
							}
							$("#content-more").append(value);
							msg_list_loading = false;
							$(".loading").lazyload({
								effect: 'fadeIn'
							});
							i++;
						});
					}
				}
			}
		},
		'ajax': function() {
			$('body').on("click", ".list_type ul li a", function(e) {
				if (type_parms != undefined && type_parms != null) {
					var curdata = $(this).attr('data').split('-');
					if (curdata[0] == 'id' || curdata[0] == 'sid') {
						type_parms = {
							"id": curdata[1],
							"mcid": "0",
							"area": "0",
							"year": "0",
							"letter": "0",
							"sid": "0",
							"wd": "0",
							"sex": "0",
							"zy": "0",
							"order": "0",
							"picm": 1,
							"p": 1
						};
						deltype();
					}
					type_parms[curdata[0]] = curdata[1];
					type_parms['p'] = 1;
					url = parseurl(type_parms);
					$(this).parent().siblings().children("a").removeClass('active');
					$(this).addClass('active');
					zanpian.list.url(url);
					deltitle()
				}
				return false;
			});
			$('body').on("click", ".ajax-page ul li a,.tv_detail_week a", function(e) {
				e.preventDefault();
				$(this).addClass('active');
				$(this).siblings().removeClass('active');
				var curdata = $(this).attr('data').split('-');
				type_parms[curdata[0]] = curdata[1];
				var url = parseurl(type_parms);
				zanpian.list.url(url);
			});
			$('body').on("click", ".ajax-nav-tabs li a", function(e) {
				e.preventDefault();
				var curdata = $(this).attr('data').split('-');
				type_parms[curdata[0]] = curdata[1];
				type_parms['p'] = 1;
				var url = parseurl(type_parms);
				$(this).parent().siblings().removeClass('active');
				$(this).parent().addClass('active');
				zanpian.list.url(url);
			});
			$('body').on("click", ".seach-nav-tabs li a", function(e) {
				e.preventDefault();
				var curdata = $(this).attr('data').split('-');
				type_parms[curdata[0]] = curdata[1];
				type_parms['p'] = 1;
				var url = parseurl(type_parms);
				$('.seach-nav-tabs li a').each(function(e) {
					$(this).parent().removeClass('on');
				});
				$(this).parent().addClass('on');
				zanpian.list.url(url);
			});
			$('body').on("click", "#conreset a", function(e) {
				var curdata = $(this).attr('data').split('-');
				type_parms = {
					"id": curdata[1],
					"mcid": "0",
					"area": "0",
					"year": "0",
					"letter": "0",
					"sid": "0",
					"wd": "0",
					"sex": "0",
					"zy": "0",
					"order": "0",
					"picm": 1,
					"p": 1
				};
				url = parseurl(type_parms);
				zanpian.list.url(url);
				deltype();
				deltitle();
			});

			function deltitle() {
				var constr = '';
				$('.list_type ul li a').each(function(e) {
					if ($(this).attr('class') == 'active') {
						if ($(this).html() == '全部') constr += ' ';
						else constr += '<span>' + $(this).html() + '</span>';
					}
				});
				if (constr != '') $('.conbread').html(constr);
			}
			function deltype() {
				$('.list_type ul li a').each(function(e) {
					$(this).removeClass('active');
					if ($(this).html() == '全部') {
						$(this).attr('class', 'active');
					}
				});
				return false;
			}
			function emptyconbread() {
				$('.list_type ul li a').each(function(e) {
					$(this).removeClass('active');
					if ($(this).html() == '全部') {
						$(this).attr('class', 'active');
					}
				});
				return false;
			}
			function parseurl(rr) {
				var url = cms.root + type_ajax_url;
				for (var c in rr) {
					if (rr[c] != '0') {
						url = url + "-" + c + "-" + rr[c];
					}
				}
				return url;
			}
		},
		'url': function(url) {
			if (($('#content li').length > 3)) $("html,body").animate({
				scrollTop: $("#content").offset().top - 93
			}, 500);
			$.showfloatdiv({
				txt: '努力加载中...',
				cssname: 'loading'
			});
			//$("#content").html('<div class="loading">努力加载中……</div>');
			$.ajax({
				type: 'get',
				cache: false,
				url: url,
				timeout: 10000,
				success: function(data, status) {
					$.closefloatdiv();
					var value = jQuery('#content', data).html();
					if (value == null || value == '') {
						value = '<div class="kong">抱歉，没有找到相关内容！</div>';
					}
					$("#content").html(value);
					$("#short-page").html(jQuery('#short-page', data).html())
					$("#long-page").html(jQuery('#long-page', data).html())
					$("#total-page").html(jQuery('#total-page', data).html())
					$("#current-page").html(jQuery('#current-page', data).html())
					$("#page").html(jQuery('#page', data).html())
					$("#count").html(jQuery('#count', data).html())
				},
				error: function(data, status) {
					$.showfloatdiv({
						txt: "加载失败,请重试",
						cssname: "error",
						classname: "error"
					}), $.hidediv({});
					return false;
				}

			});

		},
	},
	//会员相关
	'user': {
		//加载会员
		'load': function() {
			zanpian.user.nav();
			zanpian.user.send();
			$('body').on("click", "#user_login,#player-login", function() {
				zanpian.user.login_form();
			});
			$('body').on("click", "#login_submit", function() {
				zanpian.user.login();
			});
			$('body').on("click", "#reg_submit", function() {
				zanpian.user.reg();
			});
			//第三方登录
			$("#qqlogin,#weibologin").click(function(e) {
				var url = $(this).attr("url");
				var t = $(this).attr("t");
				var snsckeck = setInterval(snslogin, 1000);
				if (t == 1) {
					window.open(url, "_blank", "width=750, height=425");
					$("#cboxClose").trigger("click")
				}

				function snslogin() {
					if (zanpian.user.islogin()) {
						zanpian.user.nav();
						clearInterval(snsckeck);
					} else {
						return false;
					}
				}
			});
			$("#login2,#login1").click(function() {
				$.colorbox({
					inline: true,
					href: "#login-dialog",
					width: '570px',
				});
			})
		//购买VIP界面
		$('body').on("click", "#user-vip,#ispay-vip", function() {
			if (!zanpian.user.islogin()) {
				zanpian.user.login_form();
				return false;
			}
			$.colorbox({href: cms.root + 'index.php?s=/user/center/buy'});
		});
		//点击冲值影币
		$('body').on("click", "#user-payment,#user-score-payment", function() {
			if (!zanpian.user.islogin()) {
				zanpian.user.login_form();
				return false;
			}
			zanpian.user.payment();
		   });			
		//支付VIP影币
		$('body').on("click", "#user-pay-vip,#pay_vip", function() {
			$(".form-pay-vip").zanpiansub({
				curobj: $("#pay_vip"),
				txt: "数据提交中,请稍后...",
				onsucc: function(a) {
					if ($.hidediv(a), parseInt(a["code"]) > 0) {
						setTimeout(function() {
							$(".modal-dialog .close").trigger('click');
						}, 500);
						$("#grouptitle").html(a["data"]['user_grouptitle']);
						$("#viptime").html(a["data"]['user_viptime']);
						$("#usescore").html(a["data"]['user_score']);
						zanpian.user.iframe();
					}
					if ($.hidediv(a), parseInt(a["code"]) == -2) {
						setTimeout(function() {
				            zanpian.user.payment();
				        }, 500);
					} else - 3 == parseInt(a["code"])
				}
			}).post({
				url: cms.root + "index.php?s=/user/center/buy"
			}), !1;
		});
		//卡密充值
		$('body').on("click", "#user-pay-card,#payment_card", function() {
			$(".form-pay-card,.form-horizontal").zanpiansub({
				curobj: $(".form-pay-card,#payment_card"),
				txt: "充值中,请稍后...",
				onsucc: function(a){
					if ($.hidediv(a), parseInt(a["code"]) > 0 || parseInt(a["code"])> 0) {
						setTimeout(function() {
							$(".modal-dialog .close").trigger('click');
						}, 500);
						$("#usescore").html(parseInt($("#usescore").text()) + parseInt(a["data"]));
						zanpian.user.iframe();
					}
					if ($.hidediv(a), parseInt(a["code"]) == -2 || parseInt(a["code"]) == -2) {
						zanpian.user.payment();
					} else - 3 == parseInt(a["code"])
				}
			}).post({
				url: cms.root + "index.php?s=/user/payment/card"
			}), !1;
		});
		//在线充值
		$('body').on("click", "#user-pay", function(e) {
			var type=$("select[name='payment'] option:selected").val();
			var score=$("#score").val();
			if(type=='weixinpay'){
              e.preventDefault();
			  	 $.colorbox({href: cms.root+'index.php?s=/user/payment/index/payment/'+type+'/score/'+score,});
			}  
              payckeck=setInterval(function(){check()},5000);
              function check(){
				   if( $(".modal").css("display")=='none' ){clearInterval(payckeck); }
	               $.get(cms.root + 'index.php?s=/user/payment/check/type/'+type+'/id/'+$("#order_id").text(), function(a){
		           if ($.hidediv(a), parseInt(a["code"]) > 0 || parseInt(a["code"])> 0) {
                        clearInterval(payckeck);
                        $("#success").html('付款成功增加'+parseInt(a["data"])+'积分');
						$("#usescore").html(parseInt($("#usescore").text()) + parseInt(a["data"]));
						$.showfloatdiv({txt: '付款成功增加'+parseInt(a["data"])+'积分',cssname : 'succ'});
						$(".modal-dialog .close").trigger('click');                   
						zanpian.user.iframe();
		            }
	               });
                }	
		});	
       //购买VIP界面
        $('body').on("click","#pay_card",function(){
	         $.colorbox({
                  href: cms.root+'index.php?s=/user/payment/card',
                });
        });		
		},
		//判断是否登录
		'islogin': function() {
			if (document.cookie.indexOf('auth_sign=') >= 0) {
				return true;
			}
			return false;
		},
		//弹出登录窗口
		'login_form': function() {
			if (!zanpian.user.islogin()) {
				$.colorbox({
					inline: true,
					href: "#login-dialog",
					width: '570px'
				});
			}
		},
		//登录
		'login': function() {
			if ("" == $("#username").val()) {
				$.showfloatdiv({
					txt: "请输入用户名手机或邮箱"
				}), $("#username").focus(), $.hidediv({});
				return false;
			} else {
				if ("" != $("#password").val()) return $("#login_form").zanpiansub({
					curobj: $("#login_submit"),
					txt: "数据提交中,请稍后...",
					isajax: 1,
					onsucc: function(a) {
						if ($.hidediv(a), parseInt(a["code"]) > 0) {
							try {
								zanpian.user.nav();
								zanpian.user.iframe();
							} catch (e) {}
							setTimeout(function() {
								$("#cboxClose").trigger("click")
							}, 500);
						} else - 3 == parseInt(a["code"])
						$("#login_form img.validate").trigger('click');
					}
				}).post({
					url: cms.root + "index.php?s=/user/login/index"
				}), !1;
				$.showfloatdiv({
					txt: "请输入密码"
				}), $("#password").focus(), $.hidediv({})
			}
		},
		//注册
		'reg': function() {
			var ac = $('input[name="ac"]').val();
			var to = $('input[name="to"]').val();
			if ("" == $("#reg-form #user_name").val()) {
				$.showfloatdiv({
					txt: "请输入用户名"
				}), $("#reg-form #user_name").focus(), $.hidediv({});
				return false;
			}
			if (ac == 'mobile') {
				if ("" == to) {
					$.showfloatdiv({
						txt: "请输入手机号码"
					}), $('input[name="to"]').focus(), $.hidediv({});
					return false;

				}
				var pattern = /^[1][0-9]{10}$/;
				var ex = pattern.test(to);
				if (!ex) {
					$.showfloatdiv({
						txt: "手机号格式不正确"
					}), $('input[name="to"]').focus(), $.hidediv({});
					return false;
				}

			} else if (ac == 'email') {
				if ("" == to) {
					$.showfloatdiv({
						txt: "请输入邮箱"
					}), $('input[name="to"]').focus(), $.hidediv({});
					return false;
				}
				var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				var ex = pattern.test(to);
				if (!ex) {
					$.showfloatdiv({
						txt: "邮箱格式不正确"
					}), $('input[name="to"]').focus(), $.hidediv({});
					return false;
				}
			}
			if ("" != $("#reg-form #user_password").val()) return $("#reg-form").zanpiansub({
				curobj: $("#reg-submit"),
				txt: "数据提交中,请稍后...",
				onsucc: function(a) {
					if ($.hidediv(a), parseInt(a["code"]) > 0) {
						try {
							zanpian.user.nav();
						} catch (e) {}
						setTimeout(function() {
							$("#cboxClose").trigger("click")
						}, 500);
					} else - 3 == parseInt(a["code"])
					$("#reg-form img.validate").trigger('click');
					return false;
				}
			}).post({
				url: cms.root + "index.php?s=/user/reg/index"
			}), !1;
			$.showfloatdiv({
				txt: "请输入密码"
			}), $("#reg-form #user_password").focus(), $.hidediv({})
		},
		//发动短信
		'send': function() {
			var countdown = 60;

			function settime(val) {
				if (countdown == 0) {
					val.addClass('send-success').prop('disabled', false);
					val.val("获取验证码");
					countdown = 60;
					return true;
				} else {
					val.removeClass('send-success').prop('disabled', true);
					val.val("重新发送(" + countdown + ")");
					countdown--;
				}
				setTimeout(function() {
					settime(val)
				}, 1000)
			}
			//重新发送邮件
			$('body').on("click", "#send", function() {
				var ac = $('input[name="ac"]').val();
				var to = $('input[name="to"]').val();
				if (ac == 'mobile') {
					if ("" == to) {
						$.showfloatdiv({
							txt: "请输入手机号码"
						}), $("#to").focus(), $.hidediv({});
						return false;
					}
					var pattern = /^[1][0-9]{10}$/;
					var ex = pattern.test(to);
					if (!ex) {
						$.showfloatdiv({
							txt: "手机号格式不正确"
						}), $("#to").focus(), $.hidediv({});
						return false;
					}
				} else if (ac == 'email') {
					if ("" == to) {
						$.showfloatdiv({
							txt: "请输入邮箱"
						}), $("#to").focus(), $.hidediv({});
						return false;
					}
					var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					var exs = pattern.test(to);
					if (!exs) {
						$.showfloatdiv({
							txt: "邮箱格式不正确"
						}), $("#to").focus(), $.hidediv({});
						return false;
					}
				}
				var obj = $(this);
				$(this).closest('form').zanpiansub({
					curobj: $(this),
					txt: "数据提交中,请稍后...",
					onsucc: function(a) {
						if ($.hidediv(a), parseInt(a["code"]) > 0) {
							settime(obj)
						} else {
							$("#reg-form img.validate").trigger('click');
						}
					}
				}).post({
					url: cms.root + "index.php?s=/user/reg/send/"
				}), !1;
			});
		},
		//获取会员中心导航
		'nav': function() {
			if (!zanpian.user.islogin()) {
				return false;
			}
			$.ajax({
				type: 'get',
				cache: false,
				url: cms.root + 'index.php?s=/user/center/flushinfo',
				timeout: 10000,
				success: function(a) {
					return -7 == parseInt(a.code) ? ($.showfloatdiv({
						txt: a.msg,
						classname: "error"
					}), $.hidediv({
						code: -1,
						msg: a.msg
					}), !1) : (a.uid > 0 && (parseInt(a.history) > 10 ? ($("#playlog-todo").html('<a target="_blank" href="' + cms.root + 'index.php?s=/user/center/playlog">进入会员中心查看' + a.history + '条播放记录>></a>'), $("#playlog-todo").show()) : ($("#playlog-todo").html(""), $("#playlog-todo").hide()), loginhtml = $("#navbar_user_login,#user_login").html(), $("#navbar_user_login,#user_login").html(a.html), $("#nav-signed").hide(), $(".logoutbt").unbind(), $('#navbar_user_login .nav-link').removeAttr("href"), $('#navbar_user_login').click(function() {
						$('.user-search,#example-navbar-collapse').hide();
						$(this).children('#nav-signed').toggle();
					}), $('#user_login').hover(function() {
						$(this).children('#nav-signed').stop(true, true).show();
					}, function() {
						$(this).children('#nav-signed').stop(true, true).hide();
					}), $(".logoutbt").click(function(event) {
						event.stopPropagation();
						$.showfloatdiv({
							txt: '数据提交中...',
							cssname: 'loading'
						});
						$.get(cms.root + "index.php?s=/home/ajax/logout", function(r) {
							if ($.hidediv(r), parseInt(r["code"]) > 0) {
								$("#user_login").html(loginhtml);
								zanpian.user.iframe();
								$("#love,#remind").show();
								$("#yeslove,#yesremind").hide();
							}
						}, 'json');
					})))
				}
			})
		},	
	//会员充值窗口
	'payment': function(){
		if (!zanpian.user.islogin()) {
				zanpian.user.login_form();
				return false;
		}
	    $.colorbox({
               href: cms.root+'index.php?s=/user/payment/index/',
        });
	},
	//检查VIP播放页面并刷新页面
	'iframe': function() {
		if ($("#zanpiancms-player-vip").length > 0) {
			if ($(".zanpiancms-player-iframe").length > 0 && $('.zanpiancms-player-iframe').attr('src').indexOf("home-vod-vip-type-play") >= 0) {
				$('.zanpiancms-player-iframe').attr('src', $('.zanpiancms-player-iframe').attr('src')).show();
			} else {
				self.location.reload();
			}
		}
	},		
	},
	//评论
	'cm': {
		//按类型加载评论
		'load': function() {
			if ($('#comment[data-type=zanpian]').length) {
				this.forum();
			}
			if ($('#comment[data-type=uyan]').length) {
				this.uyan();
			}
			if ($('#comment[data-type=changyan]').length) {
				this.changyan();
			}
		},
		'forum': function() {
			var id = $("#comment").data('id');
			var sid = $("#comment").data('sid');
			//如果同时需要评分并加载
			if ($('#score').length > 0) {
				zanpian.cm.ajax(cms.root + "index.php?s=/home/ajax/get/id/" + id + "/sid/" + sid);
			} else {
				zanpian.cm.ajax(cms.root + "index.php?s=/home/ajax/cm/id/" + id + "/sid/" + sid);
			}
			$("#cm-add").click(function(e) {
				if (!zanpian.user.islogin()) {
					zanpian.user.login_form();
					return false;
				}
				$("#cm-add-form").zanpiansub({
					curobj: $("#cm-add"),
					txt: '数据提交中,请稍后...',
					onsucc: function(result) {
						$.hidediv(result);
						if (parseInt(result['code']) > 0) {
							zanpian.cm.ajax(cms.root + "index.php?s=/home/ajax/cm/id/" + id + "/sid/" + sid)
						} else {
							$("#cm-add-form img.validate").trigger('click');
						}
						if (parseInt(result['code']) < -1) {
							zanpian.user.login_form();
							return false;
						}
					}
				}).post({
					url: cms.root + 'index.php?s=/home/ajax/addcm/sid/' + sid + '/id/' + id
				});
				return false;
			});
			$("#cmt-input-tip .ui-input").focus(function() {
				$("#cmt-input-tip").hide(), $("#cmt-input-bd").show(), $("#cmt-input-bd .ui-textarea").focus()
			})
			$("#comm_txt").focus(function(e) {
				if (!zanpian.user.islogin()) {
					zanpian.user.login_form();
					return false;
				}
			});
			if ($(".emotion").length > 0) {
				$(".emotion").on('click', function() {
					var left = $(this).offset().left;
					var top = $(this).offset().top;
					var id = $(this).attr("data-id");
					$("#smileBoxOuter").css({
						"left": left,
						"top": top + 20
					}).show().attr("data-id", id)
				});
				$("#smileBoxOuter,.emotion").hover(function() {
					$("#smileBoxOuter").attr("is-hover", 1)
				}, function() {
					$("#smileBoxOuter").attr("is-hover", 0)
				});
				$(".emotion,#smileBoxOuter").blur(function() {
					var is_hover = $("#smileBoxOuter").attr("is-hover");
					if (is_hover != 1) {
						$("#smileBoxOuter").hide()
					}
				});
				$(".smileBox").find("a").click(function() {
					var textarea_id = $("#smileBoxOuter").attr("data-id");
					var textarea_obj = $("#reply_" + textarea_id).find("textarea");
					var textarea_val = textarea_obj.val();
					if (textarea_val == "发布评论") {
						textarea_obj.val("")
					}
					var title = "[" + $(this).attr("title") + "]";
					textarea_obj.val(textarea_obj.val() + title).focus();
					$("#smileBoxOuter").hide()
				});
				$("#smileBoxOuter").find(".smilePage").children("a").click(function() {
					$(this).addClass("current").siblings("a").removeClass("current");
					var index = $(this).index();
					$("#smileBoxOuter").find(".smileBox").eq(index).show().siblings(".smileBox").hide()
				});
				$(".comment_blockquote").hover(function() {
					$(".comment_action_sub").css({
						"visibility": "hidden"
					});
					$(this).find(".comment_action_sub").css({
						"visibility": "visible"
					})
				}, function() {
					$(".comment_action_sub").css({
						"visibility": "hidden"
					})
				})
			}
		},
		'uyan': function() {
			$("#comment").html('<div id="uyan_frame"></div>');
			$.getScript("http://v2.uyan.cc/code/uyan.js?uid=" + $('#comment[data-type=uyan]').attr('data-uyan-uid'));
		},
		'changyan': function() {
			$appid = $('#comment[data-type=changyan]').attr('data-changyan-id');
			$conf = $('#comment[data-type=changyan]').attr('data-changyan-conf');
			$sourceid = cms.sid + '-' + cms.id;
			var width = window.innerWidth || document.documentElement.clientWidth;
			if (width < 768) {
				$("#comment").html('<div id="SOHUCS" sid="' + $sourceid + '"></div><script charset="utf-8" id="changyan_mobile_js" src="https://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + $appid + '&conf=prod_' + $conf + '"><\/script>');
			} else {
				$("#comment").html('<div id="SOHUCS" sid="' + $sourceid + '"></div>');
				$.getScript("https://changyan.sohu.com/upload/changyan.js", function() {
					window.changyan.api.config({
						appid: $appid,
						conf: 'prod_' + $conf
					});
				});
			}
		},
		'ajax': function(url) {
			$.ajax({
				url: url,
				cache: false,
				timeout: 3000,
				success: function(data) {
					if (data != '') {
						if ($('#datalist li').length > 3) $("html,body").animate({
							scrollTop: $("#datalist").offset().top - 130
						}, 1000);
						$("#comment-list").empty().html(data.comment);
						$("#comment-count").html(jQuery('#comment-count', data.comment).html());
						$(".digg a").click(function(e) {
							var id = $(this).data('id');
							var type = $(this).data('type');
							suburl($(this).data('url'), $(this));
							return false;
						});
						$(".reply").click(function(e) {
							var curid = $(this).attr('data-id');
							var curpid = $(this).attr('data-pid');
							var curtid = $(this).attr('data-tid');
							var curtuid = $(this).attr('data-tuid');
							var curvid = $(this).attr('data-vid');
							var cursid = $(this).attr('data-sid');
							if (!zanpian.user.islogin()) {
								zanpian.user.login_form();
								return false;
							} else {
								if ($("#rep" + curid).html() != '') {
									$("#rep" + curid).html('');
								} else {
									$(".comms").html('');
									$("#rep" + curid).html($("#comment-sub").html());
									$(".emotion").on('click', function() {
										var left = $(this).offset().left;
										var top = $(this).offset().top;
										var id = $(this).attr("data-id");
										$("#smileBoxOuter").css({
											"left": left,
											"top": top + 20
										}).show().attr("data-id", id)
									});
									$("#rep" + curid + " #comm_pid").val(curpid); //顶级ID
									$("#rep" + curid + " #comm_id").val(curid); //回贴ID
									$("#rep" + curid + " #comm_tid").val(curtid); //回贴ID
									$("#rep" + curid + " #comm_tuid").val(curtuid); //回贴用户ID
									$("#rep" + curid + " #comm_sid").val(cursid);
									$("#rep" + curid + " #comm_vid").val(curvid);
									$("#rep" + curid + " #row_id").attr("data-id", curid)
									$("#rep" + curid + " .recm_id").attr("id", 'reply_' + curid)
									$("#rep" + curid + " .cm-sub").unbind();
									$("#rep" + curid + " .cm-sub").click(function(e) {
										if (!zanpian.user.islogin()) {
											zanpian.user.login_form();
											return false;
										}
										$("#rep" + curid + " #cm-sub-form").zanpiansub({
											curobj: $("#rep" + curid + " .cm-sub"),
											txt: '数据提交中,请稍后...',
											onsucc: function(result) {
												$.hidediv(result);
												if (parseInt(result['code']) > 0) {
													zanpian.cm.ajax(url);
												} else {
													$("#rep" + curid + " #cm-sub-form img.validate").trigger('click');
												}
												if (parseInt(result['code']) < -1) {
													zanpian.user.login_form();
													return false;
												}

											}
										}).post({
											url: cms.root + 'index.php?s=/home/ajax/addrecm'
										});
									});
								}
							}
						});
					} else {
						$("#datalist").html('<li class="kong">当前没有评论，赶紧抢个沙发！</li>');
					};

					if (data.gold != undefined && data.gold != null) {
						zanpian.score.stars(data.gold);
					};
					$("#pages").html(data.pages);
					$("#pagetop").html(data.pagetop);
					$(".ajax-page ul a").click(function(e) {
						var pagegourl = $(this).attr('href');
						zanpian.cm.ajax(pagegourl);
						return false;
					});
				},
				dataType: 'json'
			});
			return false;
		},

	},
	'love': { //订阅与收藏
		'load': function() {
			$(".user-bt").each(function() {
				var a = $(this).find(".sect-btn"),
					b = $(this).find(".cancel"),
					c = $(this).find(".sect-show");
				a.click(function() {
					if (!zanpian.user.islogin()) {
						zanpian.user.login_form();
						return false;
					}
					$.showfloatdiv({
						txt: "数据提交中...",
						cssname: "loading"
					});
					var d = $(this);
					$.ajax({
						type: 'get',
						cache: false,
						url: cms.root + "index.php?s=/home/ajax/mark/type/" + a.attr("data-type") + "/id/" + a.attr("data-id") + "/cid/" + a.attr("data-cid"),
						timeout: 3000,
						success: function(a) {
							$.hidediv(a), parseInt(a.code) > 0 ? (d.hide(), c.show(), b.show()) : parseInt(a["yjdy"]) > 0 && 1 == parseInt(a["yjdy"]) && (d.hide(a), c.show(), b.show())
						}
					})
				}), b.click(function() {
					$.showfloatdiv({
						txt: "数据提交中...",
						cssname: "loading"
					}), $.ajax({
						type: 'get',
						cache: false,
						url: cms.root + "index.php?s=/home/ajax/mark/type/" + a.attr("data-type") + "/id/" + a.attr("data-id") + "/cid/" + a.attr("data-cid"),
						timeout: 3000,
						success: function(b) {
							$.hidediv(b), parseInt(b.code) > 0 && (a.show(), c.hide())
						}
					})
				})
			})

		},
	},
	//评分
	'score': {
		'load': function() {
			if ($('#zanpian-score').length > 0 && $('#zanpian-cm').length <= 0) {
				zanpian.score.ajax(cms.root + "index.php?s=/home/ajax/gold/id/" + $('#zanpian-score').data('id') + "/sid/" + $('#zanpian-score').data('sid'))
			}
		},
		'loading': function() {
			if ($('#zanpian-score').length > 0) {
				zanpian.score.ajax(cms.root + "index.php?s=/home/ajax/gold/id/" + $('#zanpian-score').data('id') + "/sid/" + $('#zanpian-score').data('sid'))
			}
		},
		//加载评分与订阅收藏
		'ajax': function(url) {
			$.ajax({
				url: url,
				cache: false,
				timeout: 3000,
				success: function(data) {
					if (data.gold != undefined && data.gold != null) {
						zanpian.score.stars(data.gold);
					};
				}
			});
			return false;
		},
		'stars': function(r) {
			if ($("#rating")) {
				$("ul.rating li").each(function() {
					var b = $(this).attr("title"),
						c = $("ul.rating li"),
						d = $(this).index(),
						e = d + 1;
					$(this).click(function() {
						hadpingfen > 0 ? ($.showfloatdiv({
							txt: "已经评分,请务重复评分"
						}), $.hidediv({})) : ($.showfloatdiv({
							txt: "数据提交中...",
							cssname: "loading"
						}), c.removeClass("active"), $("ul.rating li:lt(" + e + ")").addClass("active"), $("#ratewords").html(b), $.post(cms.root + "index.php?s=/home/ajax/addgold", {
							val: $(this).attr("val"),
							id: cms.id,
							sid: cms.sid
						}, function(a) {
							if (parseInt(a.code) == 1) {
								$.ajax({
									type: 'get',
									cache: false,
									timeout: 3000,
									url: cms.root + "index.php?s=/home/ajax/gold/id/" + cms.id + "/sid/" + cms.sid,
									success: function(data) {
										zanpian.score.stars(data.gold);
									}
								});
							}
							parseInt(a.code) > 0 ? ($.hidediv(a), loadstat(), hadpingfen = 1) : -2 == parseInt(a.code) ? (hadpingfen = 1, $.showfloatdiv({
								txt: "已经评分,请务重复评分"
							}), $.hidediv({})) : ($.closefloatdiv(), $("#innermsg").trigger("click"))

						}, "json"))
					}).hover(function() {
						this.myTitle = this.title, this.title = "", $(this).nextAll().removeClass("active"), $(this).prevAll().addClass("active"), $(this).addClass("active"), $("#ratewords").html(b)
					}, function() {
						this.title = this.myTitle, $("ul.rating li:lt(" + e + ")").removeClass("hover")

					})
				}), $(".rating-panle").hover(function() {
					$(this).find(".rating-show").show()
				}, function() {
					$(this).find(".rating-show").hide()
				})
			}
			var hadpingfen = 0;
			var curstars = parseInt(r.mygold);
			$("#pa").html(r['curpingfen'].a + "人");
			$("#pb").html(r['curpingfen'].b + "人");
			$("#pc").html(r['curpingfen'].c + "人");
			$("#pd").html(r['curpingfen'].d + "人");
			$("#pe").html(r['curpingfen'].e + "人");
			$("#vod_gold").html(r['curpingfen'].pinfen);
			var totalnum = parseInt(r['curpingfen'].a) + parseInt(r['curpingfen'].b) + parseInt(r['curpingfen'].c) + parseInt(r['curpingfen'].d) + parseInt(r['curpingfen'].e);
			if (totalnum > 0) {
				$("#pam").css("width", ((parseInt(r['curpingfen'].a) / totalnum) * 100) + "%");
				$("#pbm").css("width", ((parseInt(r['curpingfen'].b) / totalnum) * 100) + "%");
				$("#pcm").css("width", ((parseInt(r['curpingfen'].c) / totalnum) * 100) + "%");
				$("#pdm").css("width", ((parseInt(r['curpingfen'].d) / totalnum) * 100) + "%");
				$("#pem").css("width", ((parseInt(r['curpingfen'].e) / totalnum) * 100) + "%")
			};
			if (r['hadpingfen'] != undefined && r['hadpingfen'] != null) {
				hadpingfen = 1;
			}
			var PFbai = r['curpingfen'].pinfen * 10;
			if (PFbai > 0) {
				$("#rating-main").show();
				$("#rating-kong").hide();
				$("#fenshu").animate({
					'width': parseInt(PFbai) + "%"
				});
				$("#total").animate({
					'width': parseInt(PFbai) + "%"
				});
				$("#pingfen").html(r['curpingfen'].pinfen);
				$("#pingfen2").html(r['curpingfen'].pinfen);

			} else {
				$("#rating-main").hide();
				$("#rating-kong").show();
				$(".loadingg").addClass('nopingfen').html('暂时没有人评分，赶快从左边打分吧！');
			};
			if (r['loveid'] != null) {
				$("#love").hide();
				$("#yeslove").show();
			} else {
				$("#love").show();
				$("#yeslove").hide();
			}
			if (r['remindid'] != null) {
				$("#remind").hide();
				$("#yesremind").show();
			} else {
				$("#remind").show();
				$("#yesremind").hide();
			}
			if (curstars > 0) {
				var curnum = curstars - 1;
				$("ul.rating li:lt(" + curnum + ")").addClass("current");
				$("ul.rating li:eq(" + curnum + ")").addClass("current");
				$("ul.rating li:gt(" + curnum + ")").removeClass("current");
				var arr = new Array('很差', '较差', '还行', '推荐', '力荐');
				$("#ratewords").html(arr[curnum]);
			}
		},

	},
	'gbook': {
		//留言
		'load': function() {
			$('body').on("click", "#gb_types li", function(e) {
				$("#gb_types li").each(function() {
					$(this).removeClass('active');
				});
				$(this).addClass('active');
				$("#gb_type").val($(this).attr('val'));
			});
			$('body').on("click", "#gb-submit", function(event) {
				event.preventDefault();
				if ($("#gb_cid").val() == '') {
					$.showfloatdiv({
						txt: "请选择留言类型"
					}), $("#gb_cid").focus(), $.hidediv({});
					return false;
				}
				if ($("#gb_nickname").val() == '') {
					$.showfloatdiv({
						txt: "请输入您的昵称"
					}), $("#gb_nickname").focus(), $.hidediv({});
					return false;
				}
				if ($("#gb_content").val() == '') {
					$.showfloatdiv({
						txt: "请输入留言内容"
					}), $("#gb_content").focus(), $.hidediv({});
					return false;
				}
				$("#gbook-form").zanpiansub({
					curobj: $("#gb-submit"),
					txt: '数据提交中,请稍后...',
					onsucc: function(result) {
						$.hidediv(result);
						if (parseInt(result['code']) > 0) {
							zanpian.list.url(cms.root + "index.php?s=/home/gb/show");
						} else - 3 == parseInt(result["code"])
						$("#gbook-form img.validate").trigger('click');
					}
				}).post({
					url: cms.root + "index.php?s=/home/gb/add"
				});
				return false;
			})
		},
	},
'player': {
	//播放权限回调
	'vip_callback': function($vod_id,$vod_sid,$vod_pid,$status,$trysee,$tips) {
		if($status != 200){
			if($trysee > 0){
				window.setTimeout(function(){
					$.get(cms.root+'index.php?s=/home/vod/vip/type/trysee/id/'+$vod_id+'/sid/'+$vod_sid+'/pid/'+$vod_pid, function(html){
						var index='<div id="zanpiancms-player-vip"><div class="zanpiancms-player-box jumbotron">'+html+'</div></div>';																							
						$('#zanpiancms_player').html(index);
						//$('.zanpiancms-player-box').html(html).addClass("jumbotron");
						//zanpian.user.iframe();
						//$('#zanpiancms-player-vip .zanpiancms-player-iframe').hide();
					},'html');
				},1000*60*$trysee);
			}else{
				$('#zanpiancms-player-vip .zanpiancms-player-box').html($tips).addClass("jumbotron");
				$('#zanpiancms-player-vip .zanpiancms-player-iframe').hide();
			}
			//播放你密码
			$('body').on("click","#user-weixinpwd,#player-pwd",function(){
				$(this).text('Loading...');
				$pwd=$(".password").val();
				$.get(cms.root+'index.php?s=/home/vod/vip/type/pwd/id/'+$vod_id+'/sid/'+$vod_sid+'/pid/'+$vod_pid+'/pwd/'+$pwd, function(json){
					if(json.status == 200){
						zanpian.user.iframe();
					}else{
						$("#user-weixinpwd").text('播放');
						alert('密码错误或失效,请重新回复');
					}
				},'json');
			});	
			//支付影币按钮
			$('body').on("click","#user-price,#player-price",function(){
				$(this).text('Loading...');
				var obj=$(this);
				$.get(cms.root+'index.php?s=/home/vod/vip/type/ispay/id/'+$vod_id+'/sid/'+$vod_sid+'/pid/'+$vod_pid, function(json){
					if(json.status == 200){
						$.showfloatdiv({txt: '支付成功',cssname : 'succ'});
						$.hidediv();
						zanpian.user.iframe();
					}else if(json.status == 602){
						 obj.text('确定');
                         $.showfloatdiv({txt: json.info})
						 $.hidediv({})
						 setTimeout(function() {
				            zanpian.user.payment();
				        }, 1000);
					}else if(json.status == 500 || json.status == 501){
						//zanpian.user.login();
					}else{
						$('#zanpiancms-player-vip .zanpiancms-player-box').html(json.info).addClass("jumbotron");
					}
				},'json');
			});				
		}else{
			//拥有VIP观看权限
		}
	},		
},
	//播放记录
	'playlog': {
		'config': function() {
			historyList = [], cookiemember = "auth_sign", cookieName = "zanpian_playlog", loadTimes = true, takeTimes = true, len = 10;
		},
		'setCookie': function(c_name, value, expiredays, path) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=" + path
		},
		'getCookie': function(c_name) {
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
		'clearCookie': function(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = zanpian.playlog.getCookie(name);
			if (cval != null) {
				alert(cval)
				document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
			}
		},
		'removeTrim': function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "")
		},
		'getData': function() {
			var date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				data = year.toString() + month.toString() + day.toString();
			return data
		},
		'resetHistoryList': function() {
			historyList = zanpian.playlog.getCookie(cookieName);
			if (historyList != "") {
				historyList = JSON.parse(historyList)
			} else {
				historyList = []
			}
			return historyList
		},
		'isExist': function(cookieName) {
			if (document.cookie.indexOf(cookieName) != -1) {
				return true
			}
			return false
		},
		'getplaylog': function() {
			if (zanpian.playlog.isExist(cookiemember) && takeTimes) {
			$.ajax({
				type: "GET",
				dataType: "json",
				url: cms.root + "index.php?s=/home/playlog/lists",
				cache: false,
				timeout: 3000,
				success: function(data) {
					if (data.code > 0) {
						historyList = data.data;
						zanpian.playlog.setCookie(cookieName,JSON.stringify(historyList), 7, "/");
						zanpian.playlog.getHistoryItem(historyList)
					}else{
						historyList = zanpian.playlog.resetHistoryList();
						zanpian.playlog.getHistoryItem(historyList);
					}
				}
			})
				takeTimes = false
			}else {
				historyList = zanpian.playlog.resetHistoryList();
				zanpian.playlog.getHistoryItem(historyList)
			}			
		},
		'setplaylog': function(log_vid,log_sid, log_pid,log_title,log_maxnum,log_name,log_url) {
			if (zanpian.playlog.isExist(cookiemember) && loadTimes) {
			$.ajax({
				type: "POST",
				url: cms.root + "index.php?s=/home/playlog/set",
				data: {
					"log_vid": log_vid,
					"log_sid": log_sid,
					"log_pid": log_pid,
					"log_urlname": log_title,
					"log_maxnum": log_maxnum
				},
				dataType: "json",
				success: function(data) {
					console.log("操作成功")
				}
			})
			    loadTimes = false
			}else{
				if (zanpian.playlog.isExist(cookieName)) {
				      historyList = zanpian.playlog.resetHistoryList();
			    }
				log_time = zanpian.playlog.getData();			
				var flag = true;
				for (var i = 0; i < historyList.length; i++) {
					if (historyList[i].log_vid == log_vid) {
						historyList[i].log_vid = log_vid;
						historyList[i].log_sid = log_sid;
						historyList[i].log_pid = log_pid;
						historyList[i].log_maxnum = log_maxnum;
						historyList[i].log_name = log_name;
						historyList[i].log_title = log_title;
						historyList[i].log_url = log_url;
						historyList[i].log_palyurl = window.location.href;
						historyList[i].log_time = log_time;
						zanpian.playlog.setCookie(cookieName, JSON.stringify(historyList), 7, "/");
						flag = false;
						break
					}
				}
				if (flag) {
					var data = {
						"log_vid": log_vid,
						"log_sid": log_sid,
						"log_pid": log_pid,
						"log_maxnum": log_maxnum,
						"log_name": log_name,
						"log_title": log_title,
						"log_url": log_url,
						"log_palyurl": window.location.href,
						"log_time": log_time,
					};
					historyList[historyList.length] = data;
					if (historyList.length > len) {
						historyList.splice(0, 1)
					}
					zanpian.playlog.setCookie(cookieName, JSON.stringify(historyList), 7, "/")
				}			
			}
		},
		'delplaylog': function(){
			$(document).delegate("#delplaylog", "click", function(e) {
				var deleteId;
				var pl = historyList.length;
				var log_id = $(this).data("id");
				if (zanpian.playlog.isExist(cookiemember)) {
			        $.ajax({type: "POST",url: cms.root + "index.php?s=/home/playlog/del",data: {"log_id": log_id},dataType: "json",success: function(data) {console.log("操作成功")}})
				}
				$(this).parent().remove();
				for (var i = pl - 1; i >= 0; i--) {
					if (historyList[i].log_id == log_id) {
						deleteId = i;
						break
					}
				}
				if (--pl <= 0) {
					console.log("无观看记录")
				}
				historyList.splice(deleteId, 1);
				historyList = JSON.stringify(historyList);
				zanpian.playlog.setCookie(cookieName, historyList, 7, "/")
			});
			for (var i = 0; i < historyList.length; i++) {
				var watchID = historyList[i].log_id,
					wlh = window.location.href,
					wls = wlh.split("/"),
					showId = parseInt(wls[4]);
			}			
		},
		'clearplaylog': function(){
			$(document).delegate("#clearplaylog", "click", function(e) {
			    if (zanpian.playlog.isExist(cookiemember)) {
			        $.ajax({
			       type: 'get',
			       cache: false,
				   dataType:'json',
			       url: cms.root + 'index.php?s=/home/playlog/clear',
			       timeout: 5000,
			       success: function(data) {											 
					if (parseInt(data["code"]) > 0 || parseInt(data["rcode"]) > 0) {
						$("#playloglist").html('<li class="no_history">没有观看数据</li>')
					}
				}})
				}
				document.cookie = "zanpian_playlog=; path=/";
			})
		},		
		'getHistoryItem': function(pArray) {
			var nowDate = zanpian.playlog.getData(),
				html = "",
				p1 = "",
				p2 = "",
				p3 = "",
				p4 = "";
			for (var i = pArray.length - 1; i >= 0; i--) {
				switch (nowDate - pArray[i].log_time) {
				case 0:
					pArray[i].log_isend < 1 ? p1 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '<em>' + (pArray[i].log_title) + '</em></a><a  class="right" href="' + pArray[i].log_next + '" target="_blank"><em>下一集</em></a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>' : p1 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '<em>' + (pArray[i].log_title) + '</em></a><a class="right" href="' + pArray[i].log_palyurl + '" target="_blank"><em>继续观看</em></a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>';
					break;
				case 1:
					pArray[i].log_isend > 0 ? p2 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '</a><a href="' + pArray[i].log_palyurl + '" target="_blank"><em>' + (pArray[i].log_title) + '</em></a><a href="' + pArray[i].log_next + '" target="_blank">下一集</a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>' : p2 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '</a><a href="' + pArray[i].log_palyurl + '" target="_blank"><em>继续观看</em></a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>';
					break;
				case 2:
					pArray[i].log_isend > 0 ? p3 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '</a><a href="' + pArray[i].log_palyurl + '" target="_blank"><em>' + (pArray[i].log_title) + '</em></a><a href="' + pArray[i].log_next + '" target="_blank">下一集</a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>' : p3 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '</a><a href="' + pArray[i].log_palyurl + '" target="_blank"><em>继续观看</em></a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>';
					break;
				default:
					pArray[i].log_isend > 0 ? p4 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '</a><a href="' + pArray[i].log_palyurl + '" target="_blank"><em>' + (pArray[i].log_title) + '</em></a><a href="' + pArray[i].log_next + '" target="_blank">下一集</a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>' : p4 += '<li id=" ' + pArray[i].log_id + '" data-id="' + pArray[i].log_id + '"><a href="' + pArray[i].log_url + '" target="_blank">' + pArray[i].log_name + '</a><a href="' + pArray[i].log_palyurl + '" target="_blank"><em>继续观看</em></a><span class="delete" id="delplaylog" data-id="' + pArray[i].log_id + '"></span></li>';
				}
			}
			p1 = p1 != "" ? '<li class="h_today"><span>今天</span></li>' + p1 : p1;
			p2 = p2 != "" ? '<li class="h_other"><span>昨天</span></li>' + p2 : p2;
			p3 = p3 != "" ? '<li class="h_other"><span>前天</span></li>' + p3 : p3;
			p4 = p4 != "" ? '<li class="h_other"><span>更早</span></li>' + p4 : p4;
			if (pArray.length != 0) {
				html = p1 + p2 + p3 + p4

			} else {
				html = '<li class="no_history">没有观看数据</li>'
			}
			$("#playloglist").html(html)
		},
		'setHistory': function(log_vid, log_sid, log_pid, log_urlname, log_maxnum) {
		    if($(".playlog-set").eq(0).attr('data-pid')) {
				zanpian.playlog.setplaylog($(".playlog-set").attr('data-id'),$(".playlog-set").attr('data-sid'), $(".playlog-set").attr('data-pid'), $(".playlog-set").attr('data-title'), $(".playlog-set").attr('data-count'), $(".playlog-set").attr('data-name'),$(".playlog-set").attr('data-url'))
		    }
			$(document).delegate(".play_btn", "click", function(e) {

			});
		},
		'load': function() {
			zanpian.playlog.config();
			zanpian.playlog.setHistory();
			zanpian.playlog.delplaylog();
			zanpian.playlog.clearplaylog();
			$(".r_record").hover(function() {
				zanpian.playlog.getplaylog();
				$(".watch_record").show()
			}, function() {
				$(".watch_record").hide()
			})
		},
	},
	'top': {
		'load': function() {
			$(window).on('scroll', function() {
				var st = $(document).scrollTop();
				if (st > 0) {
					if ($('#main-container').length != 0) {
						var w = $(window).width(),
							mw = $('#main-container').width();
						if ((w - mw) / 2 > 70) $('#index-top').css({
							'left': (w - mw) / 2 + mw + 20
						});
						else {
							$('#index-top').css({
								'left': 'auto'
							});
						}
					}
					$('#index-top').fadeIn(function() {
						$(this).show()
					});
				} else {
					$('#index-top').fadeOut(function() {
						$(this).hide()
					});
				}
			});
			$('#index-top .top').on('click', function() {
				$('html,body').animate({
					'scrollTop': 0
				}, 500);
			});
			$('#index-top .qrcode_box').hover(function() {
				$('#index-top .qrcode').show();
			}, function() {
				$('#index-top .qrcode').hide();
			});
		},
	},
'mobile':{//移动端专用
	'jump': function(){
		if(zanpian.browser.useragent.mobile && cms.wapurl!=''){
			 window.location.href = cms.wapurl + zanpian.browser.path();
		}
	},
},
	
}
function setTab(name, cursel, n) {
	for (i = 1; i <= n; i++) {
		var menu = document.getElementById(name + i);
		var con = document.getElementById("con_" + name + "_" + i);
		menu.className = i == cursel ? "current" : "";
		con.style.display = i == cursel ? "block" : "none";
	}
}
zanpian.mobile.jump();
$(document).ready(function(){			   
	zanpian.cms.load();
	zanpian.user.load();
	zanpian.playlog.load();
	zanpian.cm.load();
	zanpian.love.load();
	zanpian.top.load();
	zanpian.gbook.load();
	zanpian.list.ajax();
})