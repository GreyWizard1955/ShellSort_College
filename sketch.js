let canvas;

let base = 360;
let count = base;

let ll = 0.30;
let llD = 0.03;
let mU = 7;
let lR_w;
let lR_h;
let colors, sort1, sort2, state, stateCount;

let compares = 0;
let swaps = 0;
let lastSwaps = 0;
let gaps = 0;
let gapArray = [];

let i, j, k;
let ox, oy;
let swapped, toSwap;
let gap;
let len;
let begDate, midDate, endDate;
let begTime, midTime, endTime;
let click, ding;
let sounds = true;
let blipSounded = false;
let nbsp = "&nbsp";
let osc_main;
let osc_blip;
let frq = 600;
let fInc = 10;
let fDec = 50; //100;
let aDef = 0.25;
let aMin = 0.005; // 0.010;
let aDec = 0.01; // 0.0025;
let amp = aDef;

function preload() {
  click = loadSound('sounds/click.mp3');
  ding = loadSound('sounds/ding.mp3');
  osc_blip = new p5.Oscillator();
  osc_main = new p5.Oscillator();
  if (sounds) {
    osc_blip.start();
    osc_blip.stop();
    osc_main.start();
    osc_main.freq(frq);
    osc_main.amp(amp);
  } else {
    osc_blip.stop();
    osc_main.stop();
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  strokeWeight(8);
  sort1 = 'Shell Sort';
  sort2 = 'The method that I was taught in college';
  colors = [];
  stateCount = 0;
  state = 'Shuffling';
  for (let i = 0; i < count; i++) {
    colors.push(i / count * base);
  }
  j = 0;
  begDate = new Date();
  begTime = begDate.getTime();
}

function draw() {
  background(0);
  if (state === 'Shuffling') {
    if (stateCount >= count) {
      state = 'Sorting';
      stateCount = 0;
      if (gap == undefined) {
        click.play();
        gaps++;
        len = colors.length;
        gap = floor(len / 2);
        gapArray[0] = [];
        gapArray[0][0] = gap;
        gapArray[0][1] = 1;
        i = 0;
        j = len - gap;
        swapped = true;
        if (sounds) {
          osc_main.freq(frq);
          osc_main.amp(amp);
        } else {
          osc_main.stop();
        }
        blipSounded = false;
        midDate = new Date();
        midTime = midDate.getTime();
      }
    } else {
      myShuffle(colors);
    }
  } else if (state === 'Sorting') {
    if (i >= 0) {
      if (i <= j) {
        mySort(colors);
        if (amp > aMin) {
          amp -= aDec;
          if (sounds) {
            osc_main.amp(amp);
          } else {
            osc_main.stop();
          }
        }
        i++;
      } else {
        if (swapped) {
          click.play();
          gaps++;
          i = 0;
          j = len - gap;
          swapped = false;
          frq += fInc;
          amp = aDef;
          gapArray[gapArray.length - 1][1]++;
          if (sounds) {
            osc_main.freq(frq);
            osc_main.amp(amp);
          } else {
            osc_main.stop();
          }
          lastSwaps = swaps;
          blipSounded = true;
        } else {
          click.play();
          gap = floor(gap / 2);
          if (gap > 0) {
            gapArray[gapArray.length] = [];
            gapArray[gapArray.length - 1][0] = gap;
            gapArray[gapArray.length - 1][1] = 1;
            gaps++;
            i = 0;
            j = len - gap;
            swapped = false;
            frq -= fDec;
            amp = aDef;
            if (sounds) {
              osc_main.freq(frq);
              osc_main.amp(amp);
            } else {
              osc_main.stop();
            }
            lastSwaps = swaps;
            blipSounded = true;
          } else {
            osc_main.stop();
            endDate = new Date();
            endTime = endDate.getTime();
            console.log('Gap Len       Number');
            console.log('-------       ------');
            let sum = 0;
            for (let i = 0; i < gapArray.length; i++) {
              sum += gapArray[i][1];
              console.log(padStr(gapArray[i][0],' ',5,true) + '        ' + padStr(gapArray[i][1],' ',6,true));
            }
            console.log('-------       ------');
            console.log('Total        ' + padStr(sum,' ',6,true));
            console.log('');
            console.log('Shuffle Seconds: ', secondsToHMS((midTime - begTime) / 1000));
            console.log('Sorting Seconds: ', secondsToHMS((endTime - midTime) / 1000));
            console.log('Total   Seconds: ', secondsToHMS((endTime - begTime) / 1000));
            state = 'Done!!!'
            ding.play();
            noLoop();
          }
        }
      }
    }
  }
  stateCount++;
  translate(width / 2, height / 2);
  push();
  rotate(-HALF_PI);
  let hw = width / 2;
  let hh = height / 2;
  let m = min(width, height) * 0.4;
  colors.forEach((hu, z, arr) => {
    stroke(hu, 100, 100);
    let t = z / arr.length;
    var tau = t * TAU;
    let x, y;
    if (z == i || z == i + gap) {
      x = cos(tau) * (m + mU);
      y = sin(tau) * (m + mU);
      ox = x * (ll - llD);
      oy = y * (ll - llD);
    } else {
      x = cos(tau) * m;
      y = sin(tau) * m;
      ox = x * ll;
      oy = y * ll;
    }
    line(ox, oy, x, y);
    if (z == 0) {
      stroke(0);
      text('>', x + 25, y);
    }
  });
  pop();

  stroke(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(state, 0, 0);
  textAlign(LEFT);
  lR_w = -width / 2.5;
  lR_h = -height / 2.6;
  textSize(24);
  text(sort1, lR_w - 25, lR_h - 50);
  textSize(16);
  text(sort2, lR_w - 25, lR_h - 25);
  lR_w = width / 2.5;
  lR_h = height / 2.6;
  textSize(14);
  text('Frequency: ', lR_w - 75, lR_h - 80);
  if (gap == undefined) {
    text('Shuffling: ', lR_w - 75, lR_h - 40);
  } else {
    text('Gap length: ', lR_w - 75, lR_h - 40);
  }
  text('# of Gaps: ', lR_w - 75, lR_h);
  text('Compares: ', lR_w - 75, lR_h + 20);
  text('Swaps: ', lR_w - 75, lR_h + 40);
  text('Last Swaps: ', lR_w - 225, lR_h + 40);
  text('S/C (%): ', lR_w - 75, lR_h + 60);
  textAlign(RIGHT);
  if (state == 'Shuffling') {
    text('Random', lR_w + 75, lR_h - 80);
  } else {
    text(frq, lR_w + 75, lR_h - 80);
  }
  if (gap == undefined) {
    text(stateCount, lR_w + 75, lR_h - 40)
  } else {
    text(gap, lR_w + 75, lR_h - 40);
  }
  text(gaps, lR_w + 75, lR_h);
  text(compares, lR_w + 75, lR_h + 20);
  text(swaps, lR_w + 75, lR_h + 40);
  text(lastSwaps, lR_w - 90, lR_h + 40);
  if (compares > 0) {
    text(nf((swaps / compares) * 100, 0, 4) + '%', lR_w + 75, lR_h + 60);
  }
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function myShuffle(arr) {
  var i = floor(random(arr.length));
  var j = floor(random(arr.length));
  swap(arr, i, j);
  if (sounds) {
    osc_main.freq(floor(random(80, 300) + 1) * 5);
  }
}

function mySort(arr) {
  shellSort(arr);
  // ShellSort(arr);
}

function shellSort(arr) {
  compares++;
  if ((arr[i] > arr[i + gap])) {
    swaps++;
    if (blipSounded) {
      if (sounds) {
        blip(220, 3520, true, 0, 250); // Musical Frequency
        // blip(220, 3520, false, 25, 250); // Straight Frequency
      }
      blipSounded = !blipSounded;
    }
    swap(arr, i, i + gap);
    swapped = true;
  }
  return arr;
}

// Original sort
function ShellSort(arr) {
  gap = floor(arr.length / 2);
  while (gap > 0) {
    swapped = true;
    while (swapped == true) {
      swapped = false;
      for (var i = 0; i < (arr.length - gap); i++) {
        if ((arr[i] > arr[i + gap])) {
          swap(arr, i, i + gap);
          swapped = true;
        }
      }
    }
    gap = floor(gap / 2);
  }
  return arr;
}

function secondsToHMS(secs) {
  let sPd = 86400;
  let sPh = 3600;
  let sPm = 60;
  var d = Math.floor(secs / sPd);
  var h = Math.floor(secs % sPd / sPh);
  var m = Math.floor(secs % sPd % sPh / sPm);
  var s = Math.floor(secs % sPd % sPh % sPm);
  var l = (secs % sPd % sPh % sPm) - s;

  var dDisplay = padStr(d, '0', 2, true);
  var hDisplay = padStr(h, '0', 2, true);
  var mDisplay = padStr(m, '0', 2, true);
  var sDisplay = padStr(s, '0', 2, true);
  var lDisplay = nf(l, 0, 3).substring(2, 5);
  return 'd' + dDisplay + ':h' + hDisplay + ':m' + mDisplay + ':s' + sDisplay + '.' + lDisplay;
}

function padStr(s, pad, len, left) {
  var p = "";
  for (var i = 0; i < len; i++) {
    p += pad;
  }
  if (left == true) {
    p += s;
    s = p.substring(p.length - len);
  } else {
    s += p;
    s = s.substring(0, len)
  };
  return s;
}

function spacing(s) {
  var t = "";
  for (var i = 0; i < s.length; i++) {
    if (s[i] == ' ') {
      t += nbsp;
    } else {
      t += s[i];
    }
  }
  return t;
}

function blip(bFrq, eFrq, musical, fInc, duration) {
  var tDec;
  if (musical) {
    tDec = 5;
  } else {
    tDec = 1;
  }
  var tLeft = 50;
  if (sounds) {
    osc_blip.start();
    for (var i = bFrq; i < eFrq;) {
      osc_blip.freq(i);
      osc_blip.amp(aDef);
      delay(tDec);
      duration -= tDec;
      if (musical) {
        i *= pow(2, (1 / 12));
      } else {
        i += fInc;
      }
    }
    osc_blip.stop();
    duration = min(duration, tLeft);
  }
}

function delay(ms) {
  var cur_d = new Date();
  var cur_ticks = cur_d.getTime();
  var ms_passed = 0;
  while (ms_passed < ms) {
    // console.log('IN DELAY...');
    var d = new Date(); // Possible memory leak?
    var ticks = d.getTime();
    ms_passed = ticks - cur_ticks;
    // d = null; // Prevent memory leak?
  }
}

function keypressed() {
  if (key = 'S') {
    sounds = !sounds;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
