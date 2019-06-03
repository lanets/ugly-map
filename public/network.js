let data;
let nodes = new Map();

function preload() {
    const URL = "http://172.16.45.19:9090/api/v1/query?query=up";

    res = loadJSON(URL);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadData();

}

function draw() {
    background(255);

    for (let node of nodes.values()) {
        node.display();
    }
}

function mouseDragged() {
    for (let node of nodes.values()) {
        node.move();
    }
}

function mousePressed() {
    for (let node of nodes.values()) {
        if (node.isClicked()) {
            node.activate();
            break;
        }
    }
}

function mouseReleased() {
    for (let node of nodes.values()) {
        node.deactivate();
    }
}

function loadData() {
    data = res.data.result;
    for (let i = 0; i < data.length; i++) {
        let r = data[i];

        if (!nodes.has(r.metric.instance)) {
            nodes.set(r.metric.instance, new Node(r.metric.instance, 50, 50));
        }
        nodes.get(r.metric.instance).setStatus(r.value[1]);
    }

}

function exportPos() {
    for (let node of nodes.values()) {
        
    }
}