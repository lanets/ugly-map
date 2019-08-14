let name;
let status;
let id;
let x, y;
let dragging;
let radius;

let offsetX, offsetY;

function Node(name, x, y, status) {
    this.name = name;
    this.status = status;
    this.x = x;
    this.y = y;
    this.dragging = false;
    this.radius = 50;

    if (this.status === '0') this.color = color('red');
    else if (this.status === '1') this.color = color('green');

    this.draw = function (x, y ,radius) {

        fill(this.color);

        circle(x, y, radius);

        textAlign(CENTER, CENTER);
        text(this.name, x, y + radius);

    };

    this.move = function (x, y) {
        if (this.dragging === true) {
            this.x = x;
            this.y = y;
        }
    };

    this.activate = function () {
        this.dragging = true;
    };

    this.deactivate = function () {
        this.dragging = false;
    };

    this.isClicked = function (x, y) {
        let d = dist(x, y, mouseX, mouseY);
        return (d < this.radius);
    };
}