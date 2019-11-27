function ImageCarousel(id, holdTime, transitionTime) {
  var IMAGE_WIDTH = 100;
  this.holdTime = holdTime;
  this.transitionTime = transitionTime;
  var imageChangeInterval = null;
  var slideInterval = null;
  var waitAfterSlideButtonPress = null;
  this.leftButton = null;
  this.rightButton = null;
  var carouselContainer = document.getElementById(id);
  this.carouselImageWrapper = document.getElementsByClassName(
    'carousel-image-wrapper'
  )[0];
  currentImageIndex = 0;
  var id = id;
  var that = this;

  this.init = function() {
    //get Elements
    var carouselContainer = document.getElementById(id);
    this.carouselImageWrapper = carouselContainer.getElementsByClassName(
      'carousel-image-wrapper'
    )[0];
    this.images = Array.from(
      this.carouselImageWrapper.getElementsByTagName('img')
    );
    this.createElements();
    this.leftButton = carouselContainer.getElementsByClassName(
      'control-left'
    )[0];

    this.rightButton = carouselContainer.getElementsByClassName('control-r')[0];

    //initialize values
    this.totalImageCount = this.images.length;
    this.waitAfterSlideButtonPress = null;
    this.carouselImageWrapper.width = 100 * this.totalImageCount + '%';
    var currentImageIndex = 0;
    this.rightButton.onclick = this.buttonClickHandler.bind(this, {
      shift: 1
    });
    this.leftButton.onclick = this.buttonClickHandler.bind(this, {
      shift: -1
    });
    this.images = Array.from(
      this.carouselImageWrapper.getElementsByTagName('img')
    );
    this.totalImageCount = this.images.length;

    this.setContainerHeight();
    this.setImageWidth();
    this.automaticSlideAfterDelay();
  };

  this.createElements = function() {
    this.addIndicatorNav();
    addNavButton('left');
    addNavButton('right');
  };

  this.setContainerHeight = function() {
    var maxHeight = 0;
    this.images.forEach(function(val) {
      console.log(val);
      var temp = val.height;
      if (temp > maxHeight) {
        maxHeight = temp;
      }
    });
    carouselContainer.style.height = maxHeight + 'px';
  };

  this.setImageWidth = function() {
    that.images.forEach(function(val) {
      val.width = 100 / that.totalImageCount + '%';
    });
  };

  function addNavButton(param) {
    var button = document.createElement('div');
    var icon = document.createElement('i');
    if (param == 'left') {
      icon.classList.add('fa', 'fa-chevron-' + param);
      button.classList.add('control-' + param);
      button.id = 'control-' + param;
      button.appendChild(icon);
    }
    carouselContainer.appendChild(button);
  }

  this.addIndicatorNav = function() {
    var indicatorNav = document.createElement('div');
    indicatorNav.classList.add('indicator-nav');
    indicatorNav.id = 'indicator-nav';
    carouselContainer.appendChild(indicatorNav);
    this.images.forEach(function(val, index) {
      var dot = document.createElement('span');
      dot.position = index;
      dot.addEventListener('click', function() {
        pauseAutoSlideAfterButtonPress();
        animateSlide(that.position);
      });
      indicatorNav.appendChild(dot);
    });
  };

  setIndicatorDot = function(position) {
    var parent = document.getElementById('indicator-nav');
    var indicator = Array.from(parent.children);
    indicator.forEach(function(val, index) {
      if (position == index) {
        val.classList.add('active');
        return;
      }
      val.classList.remove('active');
    });
  };

  animateSlide = function(destinationIndex) {
    var slideFactor = 0;
    if (destinationIndex < 0) {
      destinationIndex = that.totalImageCount - 1;
    }
    destinationIndex = destinationIndex % that.totalImageCount;
    setIndicatorDot(destinationIndex);
    var currentPosition = -currentImageIndex * IMAGE_WIDTH;
    var displacement = (destinationIndex - currentImageIndex) * IMAGE_WIDTH;
    slideInterval = setInterval(function() {
      that.carouselImageWrapper.style.left =
        currentPosition - displacement * slideFactor + '%';
      slideFactor += 0.1;
      if (slideFactor > 1) {
        currentImageIndex = destinationIndex;
        clearInterval(slideInterval);
      }
    }, 30);
  };

  /* Slide image after 2s */
  this.automaticSlideAfterDelay = function() {
    imageChangeInterval = setInterval(function() {
      animateSlide(currentImageIndex + 1);
    }, 2000);
  };

  /* removes all async tasks and resumes automatic slide*/
  this.pauseAutoSlideAfterButtonPress = function() {
    clearInterval(slideInterval);
    clearInterval(imageChangeInterval);
    clearTimeout(waitAfterSlideButtonPress);
    waitAfterSlideButtonPress = setTimeout(function() {
      automaticSlideAfterDelay();
    }, 0);
  };

  /* Slide Button Controls */
  this.buttonClickHandler = function(param) {
    this.pauseAutoSlideAfterButtonPress();
    animateSlide(currentImageIndex + param.shift);
  };
}

var imageCarousel = new ImageCarousel('carousel1', 1500, 100);
imageCarousel.init();
