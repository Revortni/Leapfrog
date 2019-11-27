function ImageCarousel(id, holdTime, transitionTime) {
  var IMAGE_WIDTH = 100;
  this.id = id;
  var that = this;
  this.holdTime = holdTime;
  this.transitionTime = transitionTime;
  this.imageChangeInterval = null;
  this.slideInterval = null;
  this.waitAfterSlideButtonPress = null;
  this.carouselContainer = null;
  this.carouselImageWrapper = null;
  this.leftButton = null;
  this.rightButton = null;
  this.indicatorWrapper = null;
  var currentImageIndex = 0;
  this.images = null;

  this.init = function() {
    /*get Elements*/
    this.carouselContainer = document.getElementById(this.id);
    this.carouselImageWrapper = this.carouselContainer.getElementsByClassName(
      'carousel-image-wrapper'
    )[0];
    this.images = Array.from(
      this.carouselImageWrapper.getElementsByTagName('img')
    );
    this.createElements();

    /*Set Elements*/
    this.totalImageCount = this.images.length;

    this.carouselImageWrapper.style.width = 100 * this.totalImageCount + '%';
    this.rightButton.onclick = this.buttonClickHandler.bind(this, {
      shift: 1
    });
    this.leftButton.onclick = this.buttonClickHandler.bind(this, {
      shift: -1
    });

    //set dimensions
    this.setImageWidth();

    //start slide
    this.automaticSlideAfterDelay();
  };

  this.createElements = function() {
    this.indicatorWrapper = addIndicatorNav();
    this.leftButton = addNavButton('left');
    this.rightButton = addNavButton('right');
  };

  function addIndicatorNav() {
    var indicatorNav = document.createElement('div');
    indicatorNav.classList.add('indicator-nav');
    indicatorNav.id = 'indicator-nav';
    that.images.forEach(function(val, index) {
      var dot = document.createElement('span');
      dot.position = index;
      dot.addEventListener('click', function() {
        that.pauseAutoSlideAfterButtonPress();
        that.animateSlide(this.position);
      });
      indicatorNav.appendChild(dot);
    });
    that.carouselContainer.appendChild(indicatorNav);
    return indicatorNav;
  }

  function addNavButton(param) {
    var button = document.createElement('div');
    var icon = document.createElement('i');
    icon.classList.add('fa', 'fa-chevron-' + param);
    button.classList.add('control-button', 'control-' + param);
    button.id = 'control-' + param;
    button.appendChild(icon);
    that.carouselContainer.appendChild(button);
    return button;
  }

  this.setImageWidth = function() {
    this.images.forEach(function(val) {
      val.style.width = 100 / that.totalImageCount + '%';
    });
  };

  this.setIndicatorDot = function(position) {
    var indicator = Array.from(this.indicatorWrapper.children);
    indicator.forEach(function(val, index) {
      if (position == index) {
        val.classList.add('active');
        return;
      }
      val.classList.remove('active');
    });
  };

  /* Slide image after 2s */
  this.automaticSlideAfterDelay = function() {
    this.imageChangeInterval = setInterval(function() {
      that.animateSlide(currentImageIndex + 1);
    }, holdTime);
  };

  this.animateSlide = function(destinationIndex) {
    var slideFactor = 0;
    if (destinationIndex < 0) {
      destinationIndex = this.totalImageCount - 1;
    }
    destinationIndex = destinationIndex % this.totalImageCount;
    this.setIndicatorDot(destinationIndex);
    var currentPosition = -currentImageIndex * IMAGE_WIDTH;
    var displacement = (destinationIndex - currentImageIndex) * IMAGE_WIDTH;
    this.slideInterval = setInterval(function() {
      if (slideFactor >= 1) {
        clearInterval(that.slideInterval);
      }
      that.carouselImageWrapper.style.marginLeft =
        currentPosition - displacement * slideFactor + '%';
      slideFactor += 0.05;

      currentImageIndex = destinationIndex;
    }, transitionTime);
  };

  /* removes all async tasks and resumes automatic slide*/
  this.pauseAutoSlideAfterButtonPress = function() {
    clearInterval(this.slideInterval);
    clearInterval(this.imageChangeInterval);
    clearTimeout(this.waitAfterSlideButtonPress);
    this.waitAfterSlideButtonPress = setTimeout(function() {
      that.automaticSlideAfterDelay();
    }, 0);
  };

  /* Slide Button Controls */
  this.buttonClickHandler = function(param) {
    this.pauseAutoSlideAfterButtonPress();
    this.animateSlide(currentImageIndex + param.shift);
  };
}

var imageCarousel1 = new ImageCarousel('carousel1', 1000, 10);
imageCarousel1.init();
var imageCarousel2 = new ImageCarousel('carousel2', 2000, 20);
imageCarousel2.init();
var imageCarousel3 = new ImageCarousel('carousel3', 3000, 50);
imageCarousel3.init();
