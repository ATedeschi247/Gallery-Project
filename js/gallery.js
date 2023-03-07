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

function swapPhoto() {                                                // This code goes through the JSON-made array of images. Due to how it
  if(mCurrentIndex >= mImages.images.length) {                        // repeats every 5 seconds, I don't need a for loop and can just alter the
    mCurrentIndex = 0;                                                // mCurrent Index within the function.
  } else {
    photo = mImages.images[mCurrentIndex];
    document.getElementById('photo').setAttribute('src', photo.imgPath);
    GalleryImage();
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
var mUrl = 'images.json';

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
  return function(e) {
    galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {                                             // This code searches for the 'extra.json' file via another XMLHttpRequest.
  mJson = new XMLHttpRequest();                                             // If it exists, sets mUrl to that extra.json file and runs fetchJSON.
  mJson.open('GET', 'extra.json');                                          // Otherwise, it leaves mUrl as 'images.json' and runs fetchJSON as that.
  mJson.onreadystatechange = function() {
    if(mJson.readyState == 4 && mJson.status == 200) {
      mUrl = 'extra.json';
      fetchJSON();
    }
    if(mJson.readyState == 4 && mJson.status != 200) {
      fetchJSON();
    }
  };
	mJson.send();
});

window.addEventListener('load', function() {
  
	console.log('window loaded');
  
}, false);
function fetchJSON() {                                                      // This gets the JSON file in question, iterates thorugh it, and
  mRequest.onreadystatechange = function() {                                // assigns each item to an item in the array mImages.
    if(this.readyState == 4 && this.status == 200) {
      mImages = JSON.parse(mRequest.responseText);
    }
  };
  mRequest.open('GET', mUrl);
  mRequest.send();
}

function GalleryImage() {                                                   // I used this function as a shorthand way to update the index.html
  //implement me as an object to hold the following data about an image:    // whenever I changed the mCurrentIndex.
	var location = photo.imgLocation;
	var description = photo.description;
	var date = photo.date;

  document.querySelector('.location').innerHTML = "Location: " + location;
  document.querySelector('.description').innerHTML = "Description: " + description;
  document.querySelector('.date').innerHTML = "Date: " + date.toString();
}
document.querySelector('.moreIndicator').addEventListener('click', function() {           // Changes rotation of .moreIndicator when clicked
  if(this.classList.contains('rot90')) {                                                  // via class change. Also implements the fade effect.
    this.classList.replace('rot90', 'rot270');
    $( ".details" ).first().fadeToggle( "slow", "linear" );

  } else {
    this.classList.replace('rot270', 'rot90');
    $( ".details" ).first().fadeToggle( "slow", "linear" );
  }
});

document.querySelector('#nextPhoto').addEventListener('click', function() {              // These functions add event listeners to each of the navigation
  if(mCurrentIndex == mImages.images.length) {                                                               // buttons and assigns them each their behaviors, altering
    mCurrentIndex = 0;                                                                   // the mCurrentIndex and running swapPhoto when needed.
    swapPhoto();
  } else {
    swapPhoto();
  }
});
document.querySelector('#prevPhoto').addEventListener('click', function() {
  if(mCurrentIndex <= 1) {
    mCurrentIndex = mImages.images.length - 1;
    swapPhoto();
  } else {
    mCurrentIndex -= 2;
    swapPhoto();
  }
});
