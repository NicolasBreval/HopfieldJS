
// GLOBAL VARIABLES ////////////////////

/** If is true, user cannot set training pattern grid */
var BLOCKED = true;

/** Current Hopfield Network */
var NETWORK = null;


// FUNCTIONS //////////////////////////

/**
 * This function is called at application start and when user sets 
 * pattern size. Obtain pattern height and width, redraw grids in 
 * application, delete previous HopfieldNetwork and creates another one
 */
function createGrids() {
    // Clear previous grids
    $("#inputGrid").empty();
    $("#outputGrid").empty();

    // Set size for new grids
    let columns = (new Array(parseInt($("#width").val()))).fill("1fr").join(" ");
    let rows = (new Array(parseInt($("#height").val()))).fill("1fr").join(" ");

    $("#inputGrid").css("grid-template-columns", `${columns}`);
    $("#inputGrid").css("grid-template-rows", `${rows}`);
    $("#outputGrid").css("grid-template-columns", `${columns}`);
    $("#outputGrid").css("grid-template-rows", `${rows}`);

    let grids = parseInt($("#width").val()) * parseInt($("#height").val());

    for (let i = 0; i < grids; i++) {
        $("#inputGrid").append(`<div id="input${i}" style="background-color: white;" onmouseover=paint(this)></div>`);
        $("#outputGrid").append(`<div id="output${i}" style="background-color: white;"></div>`);
    }

    NETWORK = new HopfieldNetwork(parseInt($("#width").val()) * parseInt($("#height").val()));
}

/**
 * Paints all training patterns in a modal window
 */
function paintPatternsInModal() {
    // Delete previous printed data
    $("#patternsModal > div > div > div.modal-body").empty();

    for (let i = 0; i < NETWORK.trainingPatterns.length; i++) {
        let pattern = NETWORK.trainingPatterns[i];

        let columns = (new Array(parseInt($("#width").val()))).fill("1fr").join(" ");
        let rows = (new Array(parseInt($("#height").val()))).fill("1fr").join(" ");
        let elements = pattern.data[0].map(function(item, index) {
            return `<div id="modal${i}${index}" style="background-color: ${item == 1 ? "white" : "black"};"></div>`
        })


        $("#patternsModal > div > div > div.modal-body").append(`<div class="grid" style="grid-template-columns: ${columns}; grid-template-rows: ${rows}">${elements.join("")}</div>`);
    }
}

/**
 * Changes color of a square inside div. If square is white, 
 * changes to black, else, square not changes. This function 
 * only applies to input pattern grid.
 * 
 * @param {HTMLElement} square 
 */
function paint(square) {
    if (!BLOCKED) {
        $(`#${square.id}`).css("background-color", "black");
    }
}

/**
 * Changes current input grid status, blocked or not blocked.
 */
function changeGridStatus() {
    BLOCKED = !BLOCKED;
    $("#blockGrid").text(BLOCKED ? "Unblock" : "Block");
}

/**
 * Changes all square inside grids to white background.
 */
function clearGrids() {
    $("#inputGrid > div").each(function(index, item) {
        $(item).css("background-color", "white");
    });

    $("#outputGrid > div").each(function(index, item) {
        $(item).css("background-color", "white");
    });
}

function inputGridToMatrix() {
    let data = $("#inputGrid > div")
        .map(function(index, item){ 
            let color = $(item).css("background-color"); 
            return color == "rgb(255, 255, 255)" ? 1 : -1;
        });

    let matrix = new Matrix(1, parseInt($("#height").val()) * parseInt($("#width").val()), [data]);

    return matrix;
}

/**
 * Trasnform input grid to 2-dimension array and train the network
 */
function trainNetwork() {
    let trainData = inputGridToMatrix();
    NETWORK.train(trainData);
}

/**
 * Transform input grid to 2-dimension array and predict with network
 */
function predictPattern() {
    let dataForPrediction = inputGridToMatrix();
    let prediction = NETWORK.predict(dataForPrediction);

    $("#outputGrid > div").each(function(index, item) {
        $(item).css("background-color", prediction.data[0][index] == 1 ? "white" : "black");
    });
}

/**
 * Deletes current network and creates another without training
 */
function clearNetwork() {
    NETWORK = new HopfieldNetwork(parseInt($("#width").val()) * parseInt($("#height").val()));
}


window.onload = function() {
    createGrids();
    $("#blockGrid").text(BLOCKED ? "Unblock" : "Block");
}