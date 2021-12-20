var breakpointLg = 1024;
var breakpointMd = 750;
var windowWidth = window.innerWidth;
var $body = $('body');
var $isLoaded = false;


function handleFirstTab(e) {
	if (e.keyCode === 9) {
		document.body.classList.add("user-is-tabbing");
		window.removeEventListener("keydown", handleFirstTab);
	}
}

window.addEventListener("keydown", handleFirstTab);


/* ----------- モーダル ----------- */

function openModalAnimation(target) {

  var tl = gsap.timeline();
  tl.to(target, {
    autoAlpha: 1,
    duration: .3,
    ease: "power2.out"
  })
	.fromTo(target + " .modal-animation", {
		autoAlpha: 0,
		y: 15
	}, {
		stagger: .1,
		autoAlpha: 1,
		duration: .3,
		y: 0,
		ease: "power2.out"
	});
}

function closeModalAnimation(target) {

  var tl = gsap.timeline({ defaults: { ease: "power4.out" }, onComplete: removeImgFromModal });
	tl.to(target + " .modal-animation", {
		stagger: .1,
		autoAlpha: 0,
		duration: .3,
		y: 15
	})
  .to(target, {
    autoAlpha: 0,
    duration: .4,
	}, "-=.15");
}

function removeImgFromModal() {
  gifBig.find('img').attr('src', '');
}

var gifModal = $('#gifModal');
var gifBig = gifModal.find('.modal-content');
var gifLink = $('.gif-link');

gifLink.on('click', function (e) {

	var gif = $(this).find('img').attr('src');

	openModalAnimation('#gifModal');
  gifBig.find('img').attr('src', gif);
	$body.attr('data-modal','open');

  gifModal.on('click', function () {
		closeModalAnimation('#gifModal');
		$body.attr('data-modal', 'close');
  })

});



/* ----------- 右クリック阻止 ----------- */

// $("img").on('contextmenu', function (e) {
// 	return false;
// });
$(".main").on('contextmenu', function (e) {
	// console.log(e);
	return false;
});


/* ----------- YouTube ----------- */

var player1, player2, player3, player4;

function onYouTubeIframeAPIReady() {
	player1 = new YT.Player('video1', {
		width: '640',
		height: '390',
		videoId: 'F5bQ6tDB2aY',
		events: {
			'onReady': function (event) {
				openModal(event.target, 'video1');
			}
		}
	});
	player2 = new YT.Player('video2', {
		width: '640',
		height: '390',
		videoId: '_9JUeZXzd-E',
		events: {
			'onReady': function (event) {
				openModal(event.target, 'video2');
			}
		}
	});
	player3 = new YT.Player('video3', {
		width: '640',
		height: '390',
		videoId: 's-M8ylBnkx4',
		events: {
			'onReady': function (event) {
				openModal(event.target, 'video3');
			}
		}
	});
	player4 = new YT.Player('video4', {
		width: '640',
		height: '390',
		videoId: 'v7D4K5g0WzI',
		events: {
			'onReady': function (event) {
				openModal(event.target, 'video4');
			}
		}
	});
}

function openModal(player, elementId) {
	var $parent = $('#' + elementId + 'Wrapper');

	$parent.on("click", function (e) {

		if ($(this).hasClass('is-inline')) {
			//モーダルなし
		} else {
			openModalAnimation('#vidModal');
			$('#vidModal').find('#' + elementId).addClass('is-active');
			$body.attr('data-modal', 'open');
			player.playVideo();

			$('#vidModal').on('click', function (e) {
				e.stopPropagation();
				closeModalAnimation('#vidModal');
				$('#vidModal').find('#' + elementId).removeClass('is-active');
				$body.attr('data-modal', 'close');
				player.pauseVideo();
			})

		}

	});

}


function youtubeInit() {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}




/* ----------- Intersection Observer ----------- */
document.addEventListener("DOMContentLoaded", function () {
	var lazyBackgrounds = [].slice.call(document.querySelectorAll(".js-anim"));

	var options = {
		rootMargin: '0px',
		threshold: 0.2
	}

	var lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					lazyBackgroundObserver.unobserve(entry.target);
				}
			});
		}, options);
		lazyBackgrounds.forEach(function (lazyBackground) {
			lazyBackgroundObserver.observe(lazyBackground);
		});

});




/* ----------- スムーズスクロール ----------- */

$('a[href^="#"]').click(function () {
	var speed = 600;
	var href = $(this).attr("href");
	var target = $(href == "#" || href == "" ? 'html' : href);
	var position = target.offset().top;
	$("html, body").animate({ scrollTop: position }, speed, "swing");
	return false;
});



/* ----------- KV アニメーション ----------- */


function addFadeInCLass() {
	document.body.classList.add("is-fadein");
}

function kvAnimSP() {
	var tl = gsap.timeline({ onComplete: addFadeInCLass });
	tl.delay(1);
	tl.to('.kv-sp-anim', {
		stagger: .6,
		autoAlpha: 1,
		duration: 1,
		ease: "power2.out"
	});
}

function kvAnimPC() {
	var tl = gsap.timeline({ onComplete: addFadeInCLass });
	tl.delay(1);
	tl.to('.kv-pc-anim', {
		stagger: .3,
		autoAlpha: 1,
		duration: .6,
		ease: "power2.out"
	});
}


/* ----------- On Load ----------- */

function onLoad() {

	if (!$isLoaded) {
		document.body.classList.add("is-loaded");
		youtubeInit();
		loadScreen();

		if (windowWidth >= breakpointMd) { //PC
			kvAnimPC();
		} else { //SP
			kvAnimSP();
		}

		$isLoaded = true;
	}

}

//全ての読み込みが完了したら実行
window.onload = function () {

	var loadTime = new Date().getTime();

	if (loadTime - initTime <= 3000) {
		setTimeout(onLoad, 3000 - (loadTime - initTime));
		return;
	} else {
		onLoad();
	}

};


//10秒たったら強制的にロード画面を非表示
setTimeout(onLoad, 10000);


function loadScreen() {
	closeModalAnimation('#loadModal');
	$body.attr('data-modal', 'close');
}


function loadGifOnResize() {

	//PCとSPのレイアウトの違いのせいでロードしていないgifをリサイズイベントが一回でもあったらロードしておく。
	var thisLayout = isSP ? 'sp' : 'pc';
	var otherLayout = isSP ? 'pc' : 'sp';

	$.each([5, 17], function (i, v) {
		var otherTarget = $('.grid-size-' + otherLayout + '-none[data-grid-index="' + v + '"]').find('img');

		otherTarget.each(function (i) {
			var src = $(this).attr('src');
			var parent = $(this).closest('.gifgrid');
			var child = parent.find('.grid-size-' + thisLayout + '-none[data-grid-index="' + v + '"] img');
			child.attr('src', src);
		});
	});


}

/* ----------- On Resize ----------- */
var resized = false;

window.onresize = function () {

	if (!resized) {
		loadGifOnResize();
		document.body.classList.add("is-resized");
		resized = true;
	}

};
