/* ///// ブレイクポイント ///// */
var $breakPoint1 = 768,
	$breakPoint2 = 1140;

var $body = $('body'),
	$nav = $('#jmHeaderNav'),
	$navMenu = $('#jmHeaderNavMenu'),
	$activeClass = 'is-active';


/* ///// 【アクセシビリティ】キーボードユーザー判定 ///// */
function keyboardUser(e) {
	if (e.keyCode === 9) { // tabキー
		$('body').addClass('keyboard-user');
		pcMenu(true, true); //キーボードユーザーの場合は第2引数をtrueにしてメニューを再設定
		$(window).off('.keyboardUser');
	}
}

$(window).on('keydown.keyboardUser', keyboardUser);


/* ///// ヘッダーナビゲーション ///// */
//【SP】
function spMenu(activate) {

	if (activate) { //SPメニューを有効化
		var menuIsOpen = false;
		var scrollPos;


		//ハンバーガーメニュー開閉
		$('#jmHeaderNavToggle').off().on('click', function () {
			if (menuIsOpen) {
				$body.removeClass('is-fixed').css({ top: 'auto' });
				$nav.removeClass($activeClass);
				$(this).attr('aria-expanded', false);
				$(window).scrollTop(scrollPos);
				menuIsOpen = false;
			} else {
				scrollPos = $(window).scrollTop();
				$body.addClass('is-fixed').css({ top: - scrollPos });
				$nav.addClass($activeClass);
				$(this).attr('aria-expanded', true);
				menuIsOpen = true;
			}
		});

		//ハンバーガーメニュー内アコーディオン開閉
		$('.jm-nav__menuBtn').off().on('click', function () {
			var $parent = $(this).parents('.jm-nav__menuItem');
			$parent.toggleClass($activeClass).find('.jm-nav__submenu').finish().slideToggle();

		});

	} else { //SPメニューを無効化

		$nav.removeClass($activeClass);
		$('.jm-nav__menuItem').removeClass($activeClass);
		$('.jm-nav__submenu').attr('style', '');
		$body.removeClass('is-fixed');
	}
}


//【PC】
function pcMenu(activate, keyboard) {

	if (typeof keyboard === 'undefined') keyboard = false; //第2引数が未指定の場合はfalse

	if (activate) { //PCメニューを有効化
		var menuIsOpen = false; //メニューがすでに開いているか
		var subMenuTimer;

		$('.jm-nav__menuItem.has-sub').off().on({
			'mouseenter': function () {
				if (subMenuTimer) {
					clearInterval(subMenuTimer);
				}
				menuIsOpen = true;
				$(this).addClass($activeClass);
				$nav.addClass($activeClass);
			},
			'mouseleave': function () {
				menuIsOpen = false;
				$(this).removeClass($activeClass);

				subMenuTimer = setInterval(function () {
					if (!menuIsOpen) {
						$nav.removeClass($activeClass);
						clearInterval(subMenuTimer);
					}
				}, 100);
			}
		});


		if (keyboard) { //キーボードユーザーの場合

			//メニュー内の要素がフォーカスされたらメニューを開く
			$('.jm-nav__menuItem.has-sub').off().on('focusin', function (e) {
				var $this = $(this);

				if (!$this.hasClass($activeClass)) {
					$this.addClass($activeClass);
				}

				if (!$nav.hasClass($activeClass)) {
					$nav.addClass($activeClass);
				}
			}).on('focusout', function (e) {
				var $this = $(this);

				setTimeout(function () { //focusoutイベント中はfocusが検出されないので必要

					//予要素がフォーカスされていない場合
					if ($this.find('a:focus').length === 0) {
						$this.removeClass($activeClass);
					}

					//メニュー内のどの要素にもフォーカスされていない場合
					if ($('a:focus').closest('.jm-nav__menuItem.has-sub').length === 0) {
						$nav.removeClass($activeClass);
					}
				}, 0);
			});
		}

	} else {  //PCメニューを無効化

		$('.jm-nav__menuItem.has-sub').off();
		$('.jm-nav__menuItem.has-sub').removeClass($activeClass);
		$nav.removeClass($activeClass);

	}

}

function getMenuMode() {
	var windowWidth = window.innerWidth;

	if (windowWidth >= $breakPoint2) { //1140px〜
		return 'pc';
	} else if (windowWidth >= $breakPoint1 && windowWidth < $breakPoint2) { //768px〜1139px
		return 'sp'; //タブレットもSPメニュー
	} else if (windowWidth < $breakPoint1) { //〜767px
		return 'sp';
	}
}

function setMenuModeAttr(mode) {
	$nav.attr('data-mode', mode);
}

//初期メニュー設定
var menuMode = getMenuMode();
setMenuModeAttr(menuMode);

if (menuMode === 'sp') {
	spMenu(true);
} else if (menuMode === 'pc') {
	pcMenu(true);
}

//画面リサイズ対応
var resizeTimer = false;
$(window).on('resize', function () {

	if (resizeTimer) { //連続でリサイズイベントが発火してしまうのを防ぐ
		clearTimeout(resizeTimer);
	}

	resizeTimer = setTimeout(function () {
		$footerPosition = $jmFooter.offset().top;

		var oldMenuMode = menuMode;
		menuMode = getMenuMode();

		if (oldMenuMode !== menuMode) { //SPからPCに、またはPCからSPに変わったときだけモードを変更

			setMenuModeAttr(menuMode);

			if (oldMenuMode === 'pc' && menuMode === 'sp') {
				spMenu(true);
				pcMenu(false);
			} else if (oldMenuMode === 'sp' && menuMode === 'pc') {
				spMenu(false);
				pcMenu(true);
			}
		}
	}, 100);
});


/* ///// 下部追従ボタン・トップに戻るボタン ///// */

var $jmPageTop = $("#jmPageTop"),
	$jmPageTopTrigger = $jmPageTop.find('a'),
	$jmBottomBtn = $("#jmBottomBtn"),
	$windowHeight = $(window).height(), //ビューポートの高さ
	$scrollPosition,
	$slideUp = false,
	$fadeOut = false;

var $jmFooter = $('#jmFooter');
var $footerPosition = 0;

function bottomNavDisplay($footerPosition) {
	$scrollPosition = $(window).scrollTop();
	$slideUpPosition = 150;

	//ページトップに戻るボタンが表示されたら、上にスライド
	if ($scrollPosition >= $slideUpPosition) {
		if (!$slideUp) {
			bottomBtnSlideUp();
		}
	} else {
		if ($slideUp) {
			bottomBtnSlideDown();
		}
	}

	//フッター付近にスクロールしたらフェードアウト
	var $winScrollPosition = $windowHeight + $scrollPosition;

	if ($winScrollPosition >= $footerPosition) {
		if (!$fadeOut) {
			bottomBtnFadeOut();
		}
	} else {
		if ($fadeOut) {
			bottomBtnFadeIn();
		}
	}

}

function bottomBtnSlideUp() {
	$jmBottomBtn.addClass('is-slideUp');
	$jmPageTop.fadeIn(300);
	$slideUp = true;
}

function bottomBtnSlideDown() {
	$jmBottomBtn.removeClass('is-slideUp');
	$jmPageTop.fadeOut(300);
	$slideUp = false;
}

function bottomBtnFadeOut() {
	$jmBottomBtn.addClass('is-fadeOut');
	$fadeOut = true;
}

function bottomBtnFadeIn() {
	$jmBottomBtn.removeClass('is-fadeOut');
	$fadeOut = false;
}

// ページが完全に読み込み終了したらフッターの位置を取得
$(window).on('load', function () {
	$footerPosition = $jmFooter.offset().top;

});

$(window).on("scroll", function () {
	bottomNavDisplay($footerPosition);
});


//ページトップに戻るボタン
function smoothScroll($element) {
	var speed = 500;

	$element.on('click', function () {
		var href = $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$('body, html').animate({ scrollTop: position }, speed, 'swing');
		return false;
	});
}

smoothScroll($jmPageTopTrigger);


/* ///// スライダー ///// */

/* KV */
var $sKvCnt = $('#slideKvContainer'),
	$sKv = $('#slideKv');

$sKv.on('init', function () {
	$sKvCnt.addClass('initialized');
});

$sKv.slick({
	autoplay: true,
	// pauseOnHover: false,
	infinite: true,
	slidesToShow: 1,
	arrows: true,
	appendArrows: $sKvCnt,
	dots: true,
	appendDots: $sKvCnt,
	waitForAnimate: false,
	responsive: [
		{
			breakpoint: 768,
			settings: {
				arrows: false,
			}
		}
	],
});

//最初のスライドに戻るときにアニメーションが効かなくなるので対応
$sKv.on("beforeChange", function (event, slick, currentSlide, nextSlide) {

	$sKv.find(".slick-slide").each(function (index, el) {
		var $this = $(el);
		var slickindex = $this.attr("data-slick-index");
		if (nextSlide == slick.slideCount - 1 && currentSlide == 0) {
			if (slickindex == "-1") {
				$this.addClass("slick-active-next");
			} else {
				$this.removeClass("slick-active-next");
			}
		} else if (nextSlide == 0) {
			if (slickindex == slick.slideCount) {
				$this.addClass("slick-active-next");
			} else {
				$this.removeClass("slick-active-next");
			}
		} else {
			$this.removeClass("slick-active-next");
		}
	});
});


/* おすすめポイント */
var $sRecommendCnt = $('#slideRecommendContainer'),
	$sRecommend = $('#slideRecommend');

$sRecommend.on('init', function () {
	$sRecommendCnt.addClass('initialized');
});

$sRecommend.slick({
	autoplay: true,
	infinite: true,
	slidesToShow: 5,
	centerMode: false,
	arrows: false,
	dots: true,
	appendDots: $sRecommendCnt,
	responsive: [
		{
			breakpoint: 1330,
			settings: {
				centerMode: false,
				slidesToShow: 4,
			}
		},
		{
			breakpoint: 900,
			settings: {
				centerMode: false,
				slidesToShow: 3,
			}
		},
		{
			breakpoint: 700,
			settings: {
				centerMode: false,
				slidesToShow: 2,
			}
		},
		{
			breakpoint: 550,
			settings: {
				slidesToShow: 1,
				centerMode: true,
				centerPadding: '32px',
			}
		},
		{
			breakpoint: 350,
			settings: {
				slidesToShow: 1,
				centerMode: true,
				centerPadding: '16px',
			}
		}
	],
});


/* 特典・キャンペーン */
var $sCampaignCnt = $('#slideCampaignContainer'),
	$sCampaign = $('#slideCampaign');

$sCampaign.on('init', function () {
	$sCampaignCnt.addClass('initialized');
});

$sCampaign.slick({
	autoplay: true,
	infinite: true,
	slidesToShow: 4,
	arrows: true,
	appendArrows: $sCampaignCnt,
	dots: true,
	appendDots: $sCampaignCnt,
	responsive: [
		{
			breakpoint: 1140,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		}
	],
});


/* ///// LP おすすめポイント ///// */

var $recPointBtn = $('#recPointBtn'),
	$recPointClose = $('#recPointClose'),
	$recPoint = $('#recPoint');

if ($recPoint.length) {
	$recPointBtn.on('click', function (e) {

		$recPoint.addClass('is-active');
		$body.addClass('is-fixed');

		$recPoint.find($('.js-scroll')).on('click', function (e) {
			$recPoint.removeClass('is-active');
			$body.removeClass('is-fixed');
		});

		$recPointClose.off().on('click', function (e) {
			$recPoint.removeClass('is-active');
			$body.removeClass('is-fixed');
		});

	});
}
