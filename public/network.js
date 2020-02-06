const URL = "/api/v1/nodes";

let nodes = [];
let canvas;
let networkMap;
const mappa = new Mappa('Leaflet');
let editingMode;
let b = true;
let refreshing;

const options = {
    lat: 72,
    lng: -55,
    zoom: 3.3,
    style: `tiles/{z}/{x}/{y}.png`
};

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    networkMap = mappa.tileMap(options);
    networkMap.overlay(canvas);
    background('BLACK');
    setInterval(function(){
        if(refreshing) loadJSON(URL, d => loadNodes(d));
    }, 5000);

}

function draw() {
    clear();
    editingMode = document.getElementById("editingBox").checked;
    displayNames = document.getElementById("displayNamesBox").checked;
    refreshing = document.getElementById("refreshingBox").checked;



    if (networkMap.ready) {
        if (b) {
            loadJSON(URL, d => loadNodes(d));
            console.log(networkMap);
            b = false;
        }

        if (editingMode) networkMap.map.dragging.disable();
        if (!editingMode) networkMap.map.dragging.enable();

        for (let node of nodes) {
            node.displayNames = displayNames;
            let pos = networkMap.latLngToPixel(node.x, node.y);
            node.draw(pos.x, pos.y, 20*log(networkMap.map.getZoom()));
        }
    }
}

function mouseDragged() {
    if (editingMode) {
        for (let node of nodes) {
            let pos = networkMap.pixelToLatLng(mouseX, mouseY);
            node.move(pos.lat, pos.lng);
        }
    }
}

function mousePressed() {
    for (let node of nodes) {
        let p = networkMap.latLngToPixel(node.x, node.y);
        if (node.isClicked(p.x, p.y)) {
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

function savePositions() {
    console.log("CLICKED");

    let data = [];

    for (let node of nodes) {
        data.push({
            instance: node.name,
            pos: {
                x: node.x,
                y: node.y
            }
        })
    }

    fetch("/api/v1/nodes", {
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
    nodes = [];

    for (let o of obj) {

        if (o.pos.x === null || o.pos.y === null) {
            let center = networkMap.map.getCenter();
            nodes.push(new Node(o.name, center.lat, center.lng, o.status));
        } else {
            nodes.push(new Node(o.name, o.pos.x, o.pos.y, o.status));
        }
    }
    console.log(nodes);
}
