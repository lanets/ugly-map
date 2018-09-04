let mysquare;
let switches = [];
let switchesJSON = [];
let sw;
let dragging = false;
let bg;

function preload() {
    // var url = 'http://10.0.99.27:9090/api/v1/query?query=up%7Binstance%3D%6010.0.42.11%60%7D'
    var url = 'http://10.0.99.27:9090/api/v1/query?query=up'
    loadJSON(url, drawJSON)
    swiches = loadStrings("swiches.txt");
}

function setup() {
    createCanvas(1599, 611);
    bg = loadImage("./DHMTL18.png");
    mysquare = new MeSquare("asdf", 100, 100);
    for (let i = 0; i < swiches.length; i++){
        switches.push(new MeSquare(swiches[i], i*10, i*10));
    }
}

function draw() {
    background(bg);
    // ellipse(50, 50, 80, 80);

    for (let i = 0; i < switches.length; i++){
        switches[i].display();
        switches[i].mouseOver();
    }
    if (dragging){
        sw.move(mouseX, mouseY, 5);
    }
}

function drawJSON(data) {
    var instance = data.data.result;
    for (var i = 0; i < instance.length; i++) {
        if (instance[i].value[1] == 1) {
            console.log(instance[i].metric.instance + " - UP: " + instance[i].value[1]);
        } else {
            console.log(instance[i].metric.instance + " - DOWN: " + instance[i].value[1]);
        }
    }
}

function saveFile() {
    for (let i = 0; i < switches.length; i++){
        switchesJSON.push(JSON.stringify(switches[i].objJSON));
    }
    // NEED TO SAVE TO FILE HERE!!!!
    saveJSON(switchesJSON, 'switches.json')

    console.log(switchesJSON);
}

function MeSquare(host, x, y) {
    this.host = host;
    this.pos = createVector(x, y);
    this.size = createVector(10, 10);
    this.dragging = false;
    this.objJSON = { "host":  this.host , "posX":  this.pos.x , "posY":  this.pos.y };


    this.display = function() {
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    this.mouseOver = function() {
        // check if the mouse is inside the bounding box and tickle if so
        if ( mouseX >= this.pos.x && mouseX <= this.pos.x + this.size.x &&
            mouseY >= this.pos.y && mouseY <= this.pos.y + this.size.y) {
                return true;
            }
    }

    this.move = function(posX, posY, damping) {
        var dif = this.pos.y - posY;
        if (abs(dif) > 1) {
            this.pos.y -= dif/damping;
        }
        dif = this.pos.x - posX;
        if (abs(dif) > 1) {
            this.pos.x -= dif/damping;
        }

  }
}

function mousePressed() {
  // Did I click on the rectangle?

  for (let i = 0; i < switches.length; i++){
      if (switches[i].mouseOver()) {
          console.log(switches[i]);
          sw = switches[i];
          switches[i].dragging = true;
          dragging = true;

          break;
      }
  }
}

function mouseReleased() {
  // Quit dragging
  for (let i = 0; i < swiches.length; i++){
      dragging = false;
      switches[i].dragging = false;
  }
  saveFile();
}
