var imageChangeInterval;
var slideInterval;
var waitAfterSlideButtonPress;
var leftButton = document.getElementById('control-l');
var rightButton = document.getElementById('control-r');
var IMAGE_WIDTH = 300;
var imageContainer = document.getElementsByClassName(
  'carousel-image-wrapper'
)[0];
var images = Array.from(imageContainer.getElementsByTagName('img'));
var totalImageCount = images.length;
var currentImageIndex = 0;

function addIndicatorNav() {
  var parent = document.getElementById('indicator-nav');
  images.forEach(function(val, index) {
    var bullet = document.createElement('span');
    bullet.position = index;
    bullet.addEventListener('click', function() {
      pauseAutoSlideAfterButtonPress();
      animateSlide(this.position);
    });
    parent.appendChild(bullet);
  });
}

function setIndicatorDot(position) {
  var parent = document.getElementById('indicator-nav');
  var indicator = Array.from(parent.children);
  indicator.forEach(function(val, index) {
    if (position == index) {
      val.classList.add('active');
      return;
    }
    val.classList.remove('active');
  });
}

/* change image with animated sliding */
function animateSlide(destinationIndex) {
  var slideFactor = 0;
  if (destinationIndex < 0) {
    destinationIndex = totalImageCount - 1;
  }
  destinationIndex = destinationIndex % totalImageCount;
  setIndicatorDot(destinationIndex);
  var currentPosition = -currentImageIndex * IMAGE_WIDTH;
  var displacement = (destinationIndex - currentImageIndex) * IMAGE_WIDTH;
  slideInterval = setInterval(function() {
    imageContainer.style.left =
      currentPosition - displacement * slideFactor + 'px';
    slideFactor += 0.2;
    if (slideFactor > 1) {
      currentImageIndex = destinationIndex;
      clearInterval(slideInterval);
    }
  }, 100);
}

/* Slide image after 2s */
function automaticSlideAfterDelay() {
  imageChangeInterval = setInterval(function() {
    animateSlide(currentImageIndex + 1);
  }, 2000);
}

/* Stop all async tasks and resume automatic slide*/
function pauseAutoSlideAfterButtonPress() {
  clearInterval(slideInterval);
  clearInterval(imageChangeInterval);
  clearTimeout(waitAfterSlideButtonPress);
  waitAfterSlideButtonPress = setTimeout(function() {
    automaticSlideAfterDelay();
  }, 0);
}

/* Slide Button Controls */
leftButton.onclick = function() {
  pauseAutoSlideAfterButtonPress();
  animateSlide(currentImageIndex - 1);
};

rightButton.onclick = function() {
  pauseAutoSlideAfterButtonPress();
  animateSlide(currentImageIndex + 1);
};

/* Execution Start */
imageContainer.style.width = IMAGE_WIDTH * totalImageCount + 'px';
addIndicatorNav();
automaticSlideAfterDelay();
