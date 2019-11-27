var imageChangeInterval;
var slideInterval;
var waitAfterSlideButtonPress;
var carouselContainer = document.getElementById('carousel1');
var leftButton = addNavButton('left');
var rightButton = addNavButton('right');
var IMAGE_WIDTH;
var imageContainer = document.getElementsByClassName(
  'carousel-image-wrapper'
)[0];
var images = Array.from(imageContainer.getElementsByTagName('img'));
var totalImageCount = images.length;
var currentImageIndex = 0;

function addIndicatorNav() {
  var indicatorNav = document.createElement('div');
  indicatorNav.classList.add('indicator-nav');
  indicatorNav.id = 'indicator-nav';
  imageContainer.parentElement.appendChild(indicatorNav);
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
function addNavButton(param) {
  var button = document.createElement('div');
  var icon = document.createElement('i');
  icon.classList.add('fa', 'fa-chevron-' + param);
  button.classList.add('control-button');
  button.style[param] = 5 + 'px';
  button.id = 'control-' + param;
  button.appendChild(icon);
  carouselContainer.appendChild(button);
  return button;
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
    imageContainer.style.left =
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

function setContainerHeight() {
  var maxHeight = 0;
  images.forEach(function(val) {
    var temp = val.height;
    if (temp > maxHeight) {
      maxHeight = temp;
    }
  });
  carouselContainer.style.height = maxHeight + 'px';
}

/* Execution Start */
setContainerHeight();
imageContainer.style.width = 100 * totalImageCount + '%';
IMAGE_WIDTH = 100;
addIndicatorNav();
automaticSlideAfterDelay();
