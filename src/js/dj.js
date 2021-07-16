const $html = document.documentElement;
const $body = document.body; //querySelector("body");
const $viewportHeight = window.innerHeight;
document.documentElement.style.setProperty(
  "--vh",
  `${$viewportHeight / 100}px`
);

////////////////////////  キーボードユーザーかどうかを判定
function handleFirstTab(e) {
  if (e.keyCode === 9) {
    // タブキー
    $body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
  }
}
window.addEventListener("keydown", handleFirstTab);

///////////////////////// Loading Animation
function isLoaded() {
  $body.classList.add("is-loaded");
}

window.onload = event => {
  if ("IntersectionObserver" in window) {
    $html.classList.add("intersectionObserver");
  } else {
    var lazyImages = [].slice.call(
      document.querySelectorAll("img.lazyload")
    );
    lazyImages.forEach(function (image) {
      image.src = image.dataset.src;
      image.classList.remove("lazyload");
    });
  }

  setTimeout(function isFading() {
    $body.classList.add("is-fading");
    setTimeout(isLoaded, 1000);
  }, 600);
};

//////////////////////// Animate On Scroll
sal({ threshold: 0.5 });

///////////////////////// Blurry Background On Scroll
const $scrollTarget = document.getElementById("content");
const $bgImage = document.getElementById("bgImage");

let $scrollPosition = 0;
let $ticking = false;
let $scrollUnit = $viewportHeight / 10;

function fadeInOut($scrollPos) {
  let $scrolledAmount = $scrollPos / $scrollUnit;
  let $cleanNumber = Math.floor($scrolledAmount) / 10;
  let $opacityValue = 1.0 - $cleanNumber;
  $bgImage.style.setProperty("--bg-opacity", `${$opacityValue}`);
}

function makeTransparent() {
  $bgImage.style.setProperty("--bg-opacity", `0`);
}

$scrollTarget.addEventListener("scroll", function (e) {
  $scrollPosition = $scrollTarget.scrollTop;
  //throttle
  if (!$ticking) {
    window.requestAnimationFrame(function () {
      if ($scrollPosition < $viewportHeight) {
        fadeInOut($scrollPosition);
      } else {
        makeTransparent();
      }
      $ticking = false;
    });
    $ticking = true;
  }
});

///////////////////////////// Copy To Clipboard
let clipboard = new ClipboardJS(".copy-button");

function addCopyMessage($trigger) {
  $trigger.classList.add("copied");
}

function removeCopyMessage($trigger) {
  $trigger.classList.remove("copied");
}

clipboard.on("success", function (e) {
  let $trigger = e.trigger;
  addCopyMessage($trigger);
  e.clearSelection();
  setTimeout(function () {
    removeCopyMessage($trigger);
  }, 1000);
});

clipboard.on("error", function (e) {
  console.error("Action:", e.action);
  console.error("Trigger:", e.trigger);
});
