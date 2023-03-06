// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
  requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
    mLastFrameTime = currentTime;
	}
  
	if ((currentTime - mLastFrameTime) > mWaitTime) {
    swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
let photo;

function swapPhoto() {
  photo = mImages.images[mCurrentIndex];
	document.getElementById('photo').setAttribute('src', photo.imgPath);
  GalleryImage();
  if(mCurrentIndex >= 4) {
    mCurrentIndex = 0;
  } else {
    mCurrentIndex++;
  }
}

// Counter for the mImages array
var mCurrentIndex = 1;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'extra.json';

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
  return function(e) {
    galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
  
  // This initially hides the photos' metadata information
	// $('.details').eq(0).hide();
	
});

window.addEventListener('load', function() {
  
	console.log('window loaded');
  
}, false);
fetchJSON();
function fetchJSON() {
  mRequest.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      mImages = JSON.parse(mRequest.responseText);
    }
  };
  mRequest.open('GET', mUrl);
  mRequest.send();
}

function GalleryImage() {
  //implement me as an object to hold the following data about an image:
	var location = photo.imgLocation;
	var description = photo.description;
	var date = photo.date;

  document.querySelector('.location').innerHTML = "Location: " + location;
  document.querySelector('.description').innerHTML = "Description: " + description;
  document.querySelector('.date').innerHTML = "Date: " + date.toString();
}
document.querySelector('.moreIndicator').addEventListener('click', function() {
  if(this.classList.contains('rot90')) {
    this.classList.replace('rot90', 'rot270');
    $( ".details" ).first().fadeToggle( "slow", "linear" );

  } else {
    this.classList.replace('rot270', 'rot90');
    $( ".details" ).first().fadeToggle( "slow", "linear" );
  }
});

document.querySelector('#nextPhoto').addEventListener('click', function() {
  swapPhoto();
});
document.querySelector('#prevPhoto').addEventListener('click', function() {
  if(mCurrentIndex == 1) {
    mCurrentIndex = 4;
    swapPhoto();
  } else {
    mCurrentIndex -= 2;
    swapPhoto();
  }
});