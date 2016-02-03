var JL = (function() {

  var JL = {};

  function init () {

    var start = null;
    var element = document.getElementById("main-header");
    var scrollPosition = window.scrollY;
    var halfWindowHeight = window.innerHeight / 2;
    var rAFstarted = false;

    var scrollnimates = [].slice.call(document.getElementsByClassName('scrollnimate'));

    var scrollSet = [];

    // check if storage is supported
    localStore.loadLocalSettings();

    // bring up trophies
    achievements.makeScreen();

    // listen for hash changes (route changes)
    window.addEventListener("hashchange", function(){
      checkRoute();
    }, false);
    checkRoute();

    scrollnimates.forEach( function ( sn ) {
      var clientOffsets = sn.getBoundingClientRect();
      sn.animationOffset = clientOffsets.top + scrollPosition;
      sn.magicNumber = sn.dataset.magicNumber || sn.getAttribute("data-magic-number") || "-14";
    } );


    /*
     * The rAF function
    */
    function step(timestamp) {


      if (!start) start = timestamp;
      var progress = timestamp - start;
      var scrollPoint = window.scrollY;



      scrollnimates.forEach( function ( sn ) {
        //sn.animationOffsets == main.he
        if ( scrollPoint > ( sn.animationOffset - halfWindowHeight * 2 ) && scrollPoint < ( sn.animationOffset + halfWindowHeight ) ) {
          var magicPoint = ( scrollPoint - ( sn.animationOffset - halfWindowHeight ) ) / sn.magicNumber;
          var up = magicPoint  + 'px';

          sn.style.webkitTransform = 'translateY('+up+')';
          sn.style.MozTransform = 'translateY('+up+')';
          sn.style.msTransform = 'translateY('+up+')';
          sn.style.OTransform = 'translateY('+up+')';
          sn.style.transform = 'translateY('+up+')';
        }

      } );


      window.requestAnimationFrame(step);

    }

    if ( !rAFstarted ) {
      rAFstarted = true;
      window.requestAnimationFrame(step);
    }


    function checkRoute() {
      var location = window.location.hash;
      if ( location === '#/cv' ) {
        document.body.classList.add("lock");
        document.body.classList.add("cv");
      }
      console.log(location);
    }


    /* HOVER PICTURES */
    var lastKeyUpAt = 0;
    var hover_picture = document.getElementById("hover-picture");

    function checkFanicer () {
       var keyDownAt = new Date();
       setTimeout(function() {
           if (keyDownAt > lastKeyUpAt)
               achievements.activateAchievement("FANCIER");

       }, 10000);
    }

    function checkFanicerEnd () {
       lastKeyUpAt = new Date();
    }

    // add event listener for achievement
    if ( hover_picture ) {
      hover_picture.addEventListener("mousedown", checkFanicer, false);
      hover_picture.addEventListener("mouseup", checkFanicerEnd, false);
    }
    /* END HOVER PICTURES */


  }

  var errorBag = {
    errorBox: document.getElementById("error-box"),
    display: function (error, name) {
      var self = this;

      // activate achievement
      setTimeout(function() {
        self.errorBox.classList.add('activate');
        self.errorBox.innerHTML ='<div class=error><div class=name>' + name + '</div> ' + error + '</div>';
      }, 50);

      // remove achievement
      setTimeout(function() {
        self.errorBox.classList.remove('activate');
      }, 18000);

    }
  };

  // var avatars = {
  //   aBig: document.getElementById('avatar-is'),
  //   aSmall: document.getElementById('avatar-is-small'),
  //   currentAvatarIdx: 0,
  //   avatarList: [
  //
  //     '/img/icons/male1.svg',
  //     '/img/icons/male3.svg',
  //     '/img/icons/male4.svg',
  //
  //     '/img/icons/female1.svg',
  //     '/img/icons/female2.svg',
  //     '/img/icons/female3.svg',
  //     '/img/icons/female4.svg',
  //
  //
  //
  //     '/img/icons/female5.svg',
  //     '/img/icons/female6.svg',
  //     '/img/icons/female7.svg',
  //
  //     '/img/icons/male5.svg',
  //     '/img/icons/male2.svg',
  //
  //     '/img/icons/male8.svg',
  //     '/img/icons/male6.svg',
  //     '/img/icons/male7.svg',
  //
  //
  //   ],
  //   swapRight: function (e) {
  //
  //     e.stopPropagation();
  //
  //     var _next = parseInt(this.currentAvatarIdx) + 1;
  //
  //     if ( _next >= this.avatarList.length ) {
  //       _next = 0;
  //     }
  //
  //     this.aBig.src = this.avatarList[_next];
  //     this.aSmall.src = this.avatarList[_next];
  //     this.currentAvatarIdx = _next;
  //     localStore.saveChange("avatar", _next);
  //
  //   },
  //   swapLeft: function (e) {
  //
  //     e.stopPropagation();
  //
  //     var _next = parseInt(this.currentAvatarIdx) - 1;
  //
  //     if ( _next < 0 ) {
  //       _next = this.avatarList.length - 1 ;
  //     }
  //
  //     this.aBig.src = this.avatarList[_next];
  //     this.aSmall.src = this.avatarList[_next];
  //     this.currentAvatarIdx = _next;
  //     localStore.saveChange("avatar", _next);
  //
  //
  //   },
  //   updateAvatarPicture : function () {
  //     this.aBig.src = this.avatarList[this.currentAvatarIdx];
  //     this.aSmall.src = this.avatarList[this.currentAvatarIdx];
  //   }
  //
  // };


  var achievements = {
    aBox: document.getElementById('achievement-box'),
    aMents: document.getElementById('achievements'),
    aList: document.getElementById('achievements-list'),
    scoreBox: document.getElementById('score-box'),
    scoreAch: document.getElementById('score-ach'),
    activated: [],
    all: [
      'HOVERER',
      'BEATMAKER',
      'ROCKSTAR',
      'COMPOSER',
      'JSTESTER',
      'LULLABY',
      'EXPERTCOMPOSER',
      'KEYSAMPLE',
      'RECRUITER',
      'SAAVYRECRUITER',
      'HUECHANGER',
      'USETHESOURCE',
      'HUNTRESS',
      'FANCIER',
    ],
    details: [
      {
        toAchieve: 'Hover over a hotspot',
        points: '10',
      },
      {
        toAchieve: 'Activate the keyboard',
        points: '20',
      },
      {
        toAchieve: 'Play Coldplay - Clocks',
        points: '200',
      },
      {
        toAchieve: 'Play Bach - Minuet in G major',
        points: '150',
      },
      {
        toAchieve: 'Play the JSTESTER combo',
        points: '1250',
      },
      {
        toAchieve: 'Play A Lamb Lullaby in A',
        points: '50',
      },
      {
        toAchieve: 'Play Für Elise',
        points: '250',
      },
      {
        toAchieve: 'Play the KEYSAMPLE combo',
        points: '150',
      },
      {
        toAchieve: 'Click the CV link',
        points: '5',
      },
      {
        toAchieve: 'Download the CV',
        points: '25',
      },
      {
        toAchieve: 'Unlock the Hue Changing hotpot',
        points: '100',
      },
      {
        toAchieve: 'View the source code on Github',
        points: '30',
      },
      {
        toAchieve: 'Peruse the portfolio',
        points: '200',
      },
      {
        toAchieve: 'Engage in extended gazing',
        points: '500',
      },
    ],
    achieving: false,
    removeTimeout: null,

    activateAchievement: function(achievement) {

      var self = this;
      var actiDx = this.all.indexOf(achievement);
      if ( actiDx > -1 ) {

        // show and add if its not been achived
        if (this.activated.indexOf(actiDx) == -1) {

          if ( this.removeTimeout ) {
            clearTimeout(this.removeTimeout);
          }

          if ( this.achieving ) {
            this.removeAchievements();
          }

          if ( actiDx === 7 ) {
            // keysampler activatd
            console.log('open video');
          }


          // activate achievement
          setTimeout(function() {
            self.achieving = true;
            self.aBox.classList.add('activate');
            self.aMents.innerHTML ='<div class=achievement><span class=name>' + achievement + '</span> unlocked!</div>';
          }, 50);


          // remove achievement
          this.removeTimeout = setTimeout(function() {
            self.removeAchievements();
          }, 6000);


          this.activated.push(actiDx);

          // change achievements screen
          this.clearScreen();
          this.makeScreen();

          localStore.saveChange('achievements', JSON.stringify(this.activated));

        } else if ( actiDx > 1 && actiDx < 8) {
          // SONGS
          if ( this.removeTimeout ) {
            clearTimeout(this.removeTimeout);
          }

          setTimeout(function() {
            self.achieving = true;
            self.aBox.classList.add('activate');
            self.aMents.innerHTML ='<div class=achievement>Nice Job!  You`ve achieved that one.</div>';
          }, 50);


          // remove achievement
          this.removeTimeout = setTimeout(function() {
            self.removeAchievements();
          }, 5000);
        }

      }
      return false;
    },
    stopClose: function (e) {
      e.stopPropagation();
    },
    removeAchievements : function() {
      this.achieving = false;
      this.aBox.classList.remove('activate');
    },
    launchScreen : function (e) {
      e.stopPropagation();
      document.body.classList.add("lock");
      document.body.classList.add("achievements");
    },
    removeScreen : function () {
      document.body.classList.remove("lock");
      document.body.classList.remove("cv");
      document.body.classList.remove("achievements");
      window.location.hash = "#/";
    },
    toggleScreen : function () {
      document.body.classList.toggle("lock");
    },
    makeScreen : function () {
      var self = this;
      var indexC = 0;
      var activatedCount = 0;
      var score = 0;
      this.all.forEach( function ( achievement ) {
        var activated = false;
        if (self.activated.indexOf(indexC) > -1) {
          activated = 'activated';
          activatedCount++;
          score += parseInt(self.details[indexC].points);
        }
        var div = document.createElement("div");
        div.className = "achs " + activated;
        div.onclick = function() { self.stopClose(event); };
        div.innerHTML = "<div class='title'>"+achievement+"</div><div class='points'>" + self.details[indexC].points + "</div><div class='toAchieve'>" + self.details[indexC].toAchieve + "</div>";
        self.aList.appendChild(div);
        indexC++;
      } );
      this.scoreBox.innerHTML = activatedCount + " <small>of</small> " + this.all.length;
      this.scoreAch.innerHTML = score;
    },
    clearScreen : function () {
      while (this.aList.firstChild) {
        this.aList.removeChild(this.aList.firstChild);
      }
    }

  };

  /*
   *  Opening, playing the keyboard, and displaying tunes on screen
   *
  */
  var keys = {
    keyEle: document.getElementById('keys'),
    keyBox: document.getElementById('key-box'),
    keyLandText: document.getElementById('key-landing'),
    keyTuneBox: document.getElementById('key-tune'),
    audio: {},
    tune: [],
    listeners: false,
    tuneLocks: [
      ["asharp", "fsharp", "gsharp", "asharp", "fsharp", "gsharp"],
      ["a", "g", "f", "g", "a", "a", "a"],
      ["dsharp", "asharp", "g", "dsharp", "asharp", "g", "dsharp"],
      ["e", "dsharp", "e", "dsharp", "e", "b", "d", "c", "a"],
      ["g", "c", "d", "e", "f", "g", "c", "c"],
      ["c", "csharp", "d", "dsharp", "e", "f", "fsharp", "g", "gsharp"],
    ],
    tuneSuccess: [
      {
        title: 'First test song',
        points: 100,
        author: '',
        achievement: 'JSTESTER',
      },
      {
        title: 'Mary had a little lamb',
        points: 10,
        author: '',
        achievement: 'LULLABY',
      },
      {
        title: 'Clocks',
        points: 40,
        author: 'Coldplay',
        achievement: 'ROCKSTAR',
      },
      {
        title: 'Fur Elise',
        points: 40,
        author: 'Ludwig van Beethoven',
        achievement: 'EXPERTCOMPOSER',
      },
      {
        title: 'Minuet in G major',
        points: 40,
        author: 'Bach',
        achievement: 'COMPOSER',
      },
      {
        title: 'Arpeggio',
        points: 50,
        author: '',
        achievement: 'KEYSAMPLE',
      },
    ],
    deactivate: function () {
      var self = this;
      this.keyLandText.classList.remove("disappear");
      this.keyBox.classList.remove("rearrange");
      setTimeout(function(){
        self.keyEle.classList.remove("activate");
        self.keyLandText.classList.remove("activate");
      }, 500);
    },
    activate: function() {
      var self = this;
      this.keyEle.classList.add("activate");
      this.keyLandText.classList.add("activate");
      setTimeout(function(){
        self.keyLandText.classList.add("disappear");
        self.keyBox.classList.add("rearrange");
      }, 500);

      if ( !this.listeners ) {
        this.activateKeyListeners();
      }

    },
    activateKeyListeners : function() {

      var self = this;
      document.getElementById("c").addEventListener("click", function() { self.playNote("c"); }, false);
      document.getElementById("csharp").addEventListener("click", function() { self.playNote("csharp"); }, false);
      document.getElementById("d").addEventListener("click", function() { self.playNote("d"); }, false);
      document.getElementById("dsharp").addEventListener("click", function() { self.playNote("dsharp"); }, false);
      document.getElementById("e").addEventListener("click", function() { self.playNote("e"); }, false);
      document.getElementById("f").addEventListener("click", function() { self.playNote("f"); }, false);
      document.getElementById("fsharp").addEventListener("click", function() { self.playNote("fsharp"); }, false);
      document.getElementById("g").addEventListener("click", function() { self.playNote("g"); }, false);
      document.getElementById("gsharp").addEventListener("click", function() { self.playNote("gsharp"); }, false);
      document.getElementById("a").addEventListener("click", function() { self.playNote("a"); }, false);
      document.getElementById("asharp").addEventListener("click", function() { self.playNote("asharp"); }, false);
      document.getElementById("b").addEventListener("click", function() { self.playNote("b"); }, false);


      this.audio.c = new Audio("/media/c.mp3");
      this.audio.csharp = new Audio("/media/csharp.mp3");
      this.audio.d = new Audio("/media/d.mp3");
      this.audio.dsharp = new Audio("/media/dsharp.mp3");
      this.audio.e = new Audio("/media/e.mp3");
      this.audio.f = new Audio("/media/f.mp3");
      this.audio.fsharp = new Audio("/media/fsharp.mp3");
      this.audio.g = new Audio("/media/g.mp3");
      this.audio.gsharp = new Audio("/media/gsharp.mp3");
      this.audio.a = new Audio("/media/a.mp3");
      this.audio.asharp = new Audio("/media/asharp.mp3");
      this.audio.b = new Audio("/media/b.mp3");

      this.audioPlaying = null;

      this.listeners = true;

    },
    playNote: function (note) {

      var self = this;

      if(note === "c") {
        this.audioPlaying = this.audio.c;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 1;
      }
      if(note === "csharp") {
        this.audioPlaying = this.audio.csharp;
        this.audioPlaying.currentTime = 0.08;
        this.audioPlaying.volume = 0.95;
      }
      if(note === "d") {
        this.audioPlaying = this.audio.d;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 0.95;
      }
      if(note === "dsharp") {
        this.audioPlaying = this.audio.dsharp;
        this.audioPlaying.currentTime = 0.15;
        this.audioPlaying.volume = 0.75;
      }
      if(note === "e") {
        this.audioPlaying = this.audio.e;
        this.audioPlaying.currentTime = 0.15;
        this.audioPlaying.volume = 0.65;
      }
      if(note === "f") {
        this.audioPlaying = this.audio.f;
        this.audioPlaying.currentTime = 0.15;
        this.audioPlaying.volume = 0.65;
      }
      if(note === "fsharp") {
        this.audioPlaying = this.audio.fsharp;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 0.55;
      }
      if(note === "g") {
        this.audioPlaying = this.audio.g;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 0.5;
      }
      if(note === "gsharp") {
        this.audioPlaying = this.audio.gsharp;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 0.45;
      }
      if(note === "a") {
        this.audioPlaying = this.audio.a;
        this.audioPlaying.currentTime = 0.35;
        this.audioPlaying.volume = 0.45;
      }
      if(note === "asharp") {
        this.audioPlaying = this.audio.asharp;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 0.4;
      }
      if(note === "b") {
        this.audioPlaying = this.audio.b;
        this.audioPlaying.currentTime = 0.25;
        this.audioPlaying.volume = 0.4;
      }

      this.audioPlaying.pause();

      setTimeout(function() {
        self.audioPlaying.play();
      }, 10);

      var spanNote = document.createElement('span');
      spanNote.id = "tune" + this.tune.length;
      spanNote.innerText = note.replace("sharp", "#");


      this.tune.push(note);
      var tuneCheck = this.checkTune();
      if ( tuneCheck !== false ) {
        tuneCheck = parseInt(tuneCheck);
        this.tune = [];
        this.keyTuneBox.appendChild(spanNote);
        setTimeout( function() {
          self.clearTuneDisplay();
        }, 1500 );
        console.log("success", tuneCheck, this.tuneSuccess[tuneCheck]);
        achievements.activateAchievement(this.tuneSuccess[tuneCheck].achievement);
        return;
      }
      this.keyTuneBox.appendChild(spanNote);

      if(this.tune.length > 9) {
        this.tune = [];
        this.clearTuneDisplay();
        this.playNote(note);
      }
    },
    checkTune: function() {
      self = this;
      var index = 0;
      var success = false;
      this.tuneLocks.forEach(function(tuneMatch) {
        var is_same = tuneMatch.length == self.tune.length && tuneMatch.every(function(element, index) {
            return element === self.tune[index];
        });
        if ( is_same ) {
          success = ""+index+"";
        }
        index++;
      });

      return (success) ? success : false;

    },
    clearTuneDisplay: function() {
      while (this.keyTuneBox.firstChild) {
        this.keyTuneBox.removeChild(this.keyTuneBox.firstChild);
      }
    },
    clearTuneAndDisplay: function () {
      if ( !this.tune.length ){
        this.deactivate();
        return;
      }
      this.clearTuneDisplay();
      this.tune = [];
    }
  };

  var pictures = {
    rotatingEle : null,
    hueRotate : function (id) {

      var element = document.getElementById(id);
      var rotation = 90;
      if ( this.rotatingEle  && element === this.rotatingEle ) {
        var _rot = parseInt(this.rotatingEle.getAttribute('data-rotation')) + 90;
        rotation = ( _rot > 360 ) ? 0 : _rot;
      }
      element.setAttribute("data-rotation", rotation);
      this.rotatingEle = element;
      achievements.activateAchievement('HUECHANGER');
    }
  };


  var localStore = {

    storeLoaded: false,

    supportLocalStorage: function() {

      if (!window.localStorage) {
        console.log("LocalStorage not supported by the browser");
        this.storeLoaded = true;
        errorBag.display("LocalStorage not supported", "Storage Error");
        return false;
      }

      try {
          localStorage.setItem('testItem', 1);
      } catch (e) {
          console.log("LocalStorage not supported by the browser - Possible viewing in Private Mode");
          errorBag.display("If browsing in Private mode consider switching", "Storage Error.  Unable to save data.");
          this.storeLoaded = true;
          return false;
      }

      return true;

    },
    loadLocalSettings: function () {

      if(!this.supportLocalStorage()) {
        return false;
      }

      /* Load Achivements Options */
      var loadedAs = localStorage.getItem('achievements');
      loadedAs = JSON.parse(loadedAs);

      if (loadedAs) {
        achievements.activated = loadedAs;
      } else {
        localStorage.setItem('achievements', JSON.stringify(achievements.activated));
      }


      // var loadedAvatar = localStorage.getItem('avatar');
      //
      // if (loadedAvatar) {
      //   avatars.currentAvatarIdx = parseInt(loadedAvatar);
      //   avatars.updateAvatarPicture();
      // } else {
      //   localStorage.setItem('avatar', avatars.currentAvatarIdx);
      // }


      this.storeLoaded = true;
      return true;

    },


    saveChange: function(item, value) {

      try {
        localStorage.setItem(item, value);
      } catch(e) {
        console.log("Unable to save local storage item", item, value);
        return false;
      }

      return true;

    }
  };



  // add objects to JL
  JL.keys = keys;
  JL.achievements = achievements;
  JL.errorBag = errorBag;
  JL.pictures = pictures;
  // JL.avatars = avatars;


  // start the app
  document.addEventListener("DOMContentLoaded", init);


  // // add JL to the window
  // window.JL = JL;
  return JL;

})();
