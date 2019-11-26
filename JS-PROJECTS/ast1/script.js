var imageContainer = document.getElementsByClassName(
  'carousel-image-wrapper'
)[0];
var images = Array.from(imageContainer.getElementsByTagName('img'));
var totalImageCount = images.length;
var currentImageIndex = 0;
var leftButton = document.getElementById('control-l');
var rightButton = document.getElementById('control-r');
var imageChangeInterval;
var slideInterval;
var waitAfterSlideButtonPress;
var IMAGE_WIDTH = 300;

function addBulletNavigation() {
  var parent = document.getElementById('bulletNavigation');
  images.forEach(function(value, index) {
    var bullet = document.createElement('span');
    bullet.position = index;
    bullet.addEventListener('click', function() {
      pauseAutoSlideAfterButtonPress();
      setSlideImage(this.position);
    });
    parent.appendChild(bullet);
  });
}

function getAbsoluteIndex(position) {
  return (position + totalImageCount) % totalImageCount;
}

/* Set index of image to be shown */
function setSlideImage(position = 0) {
  images.forEach(function(image, index) {
    image.style.left = (index - position) * IMAGE_WIDTH + 'px';
  });
}
function animateSlide() {
  var shift = 0;
  var factor = 1;
  if (currentImageIndex >= totalImageCount - 1) {
    factor = -currentImageIndex;
  }
  slideInterval = setInterval(function() {
    images.forEach(function(image, index) {
      image.style.left =
        (index - currentImageIndex - factor * shift) * IMAGE_WIDTH + 'px';
    });
    shift += 0.2;
    if (shift > 1) {
      clearInterval(slideInterval);
      currentImageIndex = getAbsoluteIndex(currentImageIndex + 1);
    }
  }, 50);
}

/* Slide image after 2s */
function automaticSlideAfterDelay() {
  imageChangeInterval = setInterval(function() {
    animateSlide();
  }, 2000);
}

function pauseAutoSlideAfterButtonPress() {
  clearInterval(slideInterval);
  clearTimeout(waitAfterSlideButtonPress);
  clearInterval(imageChangeInterval);
  waitAfterSlideButtonPress = setTimeout(function() {
    automaticSlideAfterDelay();
  }, 2000);
}

/* Slide Button Controls */
leftButton.onclick = function() {
  currentImageIndex = getAbsoluteIndex(currentImageIndex - 1);
  animateSlide(currentImageIndex);
  pauseAutoSlideAfterButtonPress();
};

rightButton.onclick = function() {
  currentImageIndex = getAbsoluteIndex(currentImageIndex + 1);
  setSlideImage(currentImageIndex);
  pauseAutoSlideAfterButtonPress();
};

/* Execution Start */
addBulletNavigation();
setSlideImage(0);
automaticSlideAfterDelay();
