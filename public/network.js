const URL = "http://localhost:3000/api/v1/nodes";

let nodes = [];

function preload() {
    img = loadImage("assets/map.jpg");
    loadJSON(URL, d => loadNodes(d));
}

function savePositions() {
    console.log("CLICKED");

    var data = [];

    for (let node of nodes) {
        data.push({
            instance: node.name,
            pos: {
                x: node.x,
                y: node.y
            }
        })
    }

    fetch("http://localhost:3000/api/v1/nodes", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(res => console.log(res))
}


function loadNodes(obj) {
    console.log(obj.length);
    nodes = [];

    for (let o of obj) {
        nodes.push(new Node(o.name, o.pos.x, o.pos.y, o.status));
    }
}

function setup() {
    createCanvas(1920, 1080);
}

function draw() {
    background(255);
    image(img,0,0);
    for (let node of nodes) {
        node.display();
    }
}

function mouseDragged() {
    for (let node of nodes) {
        node.move();
    }
}

function mousePressed() {
    for (let node of nodes) {
        if (node.isClicked()) {
            node.activate();
            break;
        }
    }
}

function mouseReleased() {
    for (let node of nodes) {
        node.deactivate();
    }
}
