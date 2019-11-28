function ImageCarousel(id, params) {
  var IMAGE_WIDTH = 100;
  this.id = id;
  var that = this;
  this.holdTime = params.holdTime || 1000;
  this.transitionTime = params.transitionTime || 500;
  this.holdTimeout = null;
  this.slideInterval = null;
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

  /* Slide image after hold time */
  this.automaticSlideAfterDelay = function() {
    that.animateSlide(currentImageIndex + 1);
  };

  /* hold for 'holdTime' and slide */
  this.holdSlide = function() {
    this.holdTimeout = setTimeout(function() {
      that.automaticSlideAfterDelay();
    }, this.holdTime);
  };

  this.animateSlide = function(destinationIndex) {
    var slidePortion = 0;
    var slideImageByFactorEachInterval = 1 / 100;
    if (destinationIndex < 0) {
      destinationIndex = this.totalImageCount - 1;
    }
    destinationIndex = destinationIndex % this.totalImageCount;
    this.setIndicatorDot(destinationIndex);
    var currentPosition = -currentImageIndex * IMAGE_WIDTH;
    var displacement = (destinationIndex - currentImageIndex) * IMAGE_WIDTH;
    this.slideInterval = setInterval(function() {
      if (slidePortion > 1) {
        clearInterval(that.slideInterval);
        that.holdSlide();
      }
      that.carouselImageWrapper.style.marginLeft =
        currentPosition - displacement * slidePortion + '%';
      slidePortion += slideImageByFactorEachInterval;
      currentImageIndex = destinationIndex;
    }, this.transitionTime * slideImageByFactorEachInterval);
  };

  /* removes all async tasks and resumes automatic slide*/
  this.pauseAutoSlideAfterButtonPress = function() {
    clearInterval(this.slideInterval);
    clearTimeout(this.holdTimeout);
  };

  /* Slide Button Controls */
  this.buttonClickHandler = function(param) {
    this.pauseAutoSlideAfterButtonPress();
    this.animateSlide(currentImageIndex + param.shift);
  };
}

var imageCarousel1 = new ImageCarousel('carousel1', {
  holdTime: 500,
  transitionTime: 1000
});
imageCarousel1.init();
var imageCarousel2 = new ImageCarousel('carousel2', {
  holdTime: 3000,
  transitionTime: 500
});
imageCarousel2.init();
var imageCarousel3 = new ImageCarousel('carousel3', {
  holdTime: 3000,
  transitionTime: 3000
});
imageCarousel3.init();
