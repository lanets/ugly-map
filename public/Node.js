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

    this.display = function () {

        let c = color('red');

        if (this.status === '1') {
            c = color('green');
        }

        fill(c);
        circle(this.x, this.y, this.radius);

        textAlign(CENTER, CENTER);
        text(this.name, this.x, this.y + this.radius);

    };

    this.move = function () {
        if (this.dragging == true) {
            let d = dist(mouseX, mouseY, this.x, this.y);

            this.x = mouseX;
            this.y = mouseY;
        }
    };

    this.activate = function () {
        this.dragging = true;
    };

    this.deactivate = function () {
        this.dragging = false;
    };

    this.isClicked = function () {
        let d = dist(mouseX, mouseY, this.x, this.y);
        return (d < this.radius ? true : false);
    };

    this.setStatus = function (status) {
        this.status = status;
    };
}