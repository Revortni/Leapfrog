var imageChangeInterval;
var slideInterval;
var waitAfterSlideButtonPress;
var leftButton = document.getElementById('control-l');
var rightButton = document.getElementById('control-r');
var IMAGE_WIDTH;
var imageContainer = document.getElementsByClassName(
  'carousel-image-wrapper'
)[0];
var images = Array.from(imageContainer.getElementsByTagName('img'));
var totalImageCount = images.length;
var currentImageIndex = 0;

function addIndicatorNav() {
  var indicatorNav = document.getElementById('indicator-nav');
  images.forEach(function(val, index) {
    val.style.width = 100 / totalImageCount + '%';
    var dot = document.createElement('span');
    dot.position = index;
    dot.addEventListener('click', function() {
      pauseAutoSlideAfterButtonPress();
      animateSlide(this.position);
    });
    indicatorNav.appendChild(dot);
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

/* change image with sliding animation */
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
    imageContainer.style.marginLeft =
      currentPosition - displacement * slideFactor + '%';
    slideFactor += 0.1;
    if (slideFactor > 1) {
      currentImageIndex = destinationIndex;
      clearInterval(slideInterval);
    }
  }, 30);
}

/* Slide image after 2s */
function automaticSlideAfterDelay() {
  imageChangeInterval = setInterval(function() {
    animateSlide(currentImageIndex + 1);
  }, 2000);
}

/* removes all async tasks and resumes automatic slide*/
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
imageContainer.style.width = 100 * totalImageCount + '%';
IMAGE_WIDTH = 100;
addIndicatorNav();
automaticSlideAfterDelay();
