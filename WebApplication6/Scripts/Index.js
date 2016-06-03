function newWaitImg(id) {
    var img = {
        "id": id,
        "state": "on",
        "hide": function () {
            $(this.id).hide();
            this.state = "off";
        },
        "show": function () {
            $(this.id).show();
            this.state = "on";
        },
        "toggle": function () {
            if (this.state == "on") {
                this.hide();
            } else {
                this.show();
            }
        }
    };
    return img;
};

var cycleID = 0,
    responseArray = [],
    userName = window.location.href,
    incorrectResponse = false;

userName = userName.split("/").pop();


function response(cycleID, TgtOrDecoy, TimeToShow, ClickOrNot, ReactionTime) {
    this.cycleID = cycleID;
    this.TgtOrDecoy = TgtOrDecoy;
    this.TimeToShow = TimeToShow;
    this.Response = ClickOrNot;
    this.ReactionTime = ReactionTime;
    this.User = userName;
    return this;
}

var awaitImg = newWaitImg("#responseTime"),
    target = newWaitImg("#target"),
    decoy = newWaitImg("#decoy");

awaitImg.toggle();
target.toggle();
decoy.toggle();

$("#beginButton").click(function () {
    var instructions = $("#instructions");
    instructions.hide();
    cycleID++;
    displayCycleID();
    var targetOrDecoy = randomizeBinary(randomizeBinaryRange),
        timeDelay = randomizeTimer(randomizeAwaitRange);
    if (targetOrDecoy == 0) {
        setTimeout(function () {
            //set record time with max reaction time
            var responseType = "target";
            recordReaction(target, responseType, timeDelay, cycleID);
        }, timeDelay);
    } else {
        setTimeout(function () {
            var responseType = "decoy";
            recordReaction(decoy, responseType, timeDelay, cycleID);
        }, timeDelay);
    }
});

function beginNextResponse() {
    var targetOrDecoy = randomizeBinary(randomizeBinaryRange),
        timeDelay = randomizeTimer(randomizeAwaitRange);
    cycleID++;
    if (targetOrDecoy == 0) {
        setTimeout(function () {
            awaitImg.toggle();
            if (incorrectResponse == true) {
                incorrectResponse = false;
                $(".Incorrect").remove();
                $("#responseTime").off();
            }
            var responseType = "target";
            recordReaction(target, responseType, timeDelay, cycleID);
        }, timeDelay);
    } else {
        setTimeout(function () {
            awaitImg.toggle();
            if (incorrectResponse == true) {
                incorrectResponse = false;
                $(".Incorrect").remove();
                $("#responseTime").off();
            }
            var responseType = "decoy";
            recordReaction(decoy, responseType, timeDelay, cycleID);
        }, timeDelay);
    }
}

function displayCycleID() {
    if (cycleID < 26) {
        $("#cycleIndicator").text("Cycle " + cycleID + " of 25");
    }
}
var randomizeBinaryRange = {
    "min": 0.4,
    "max": 1.0
},
randomizeAwaitRange = {
    "min": 0.2,
    "max": 0.7
};

//binary selector
function randomizeBinary(option) {
    var min = option.min,
        max = option.max,
        selector = Math.floor((Math.random() * (max - min + 1)) + min);
    return selector;
}

//time selector
function randomizeTimer(option) {
    var min = option.min,
        max = option.max,
        selector = ((Math.random() * (max - min) + min) * 1000).toPrecision(3);
    return selector;
}

function recordReaction(decision, responseType, timeDelay, cycleID) {
    // if cycleID > 25 fill and submit form, otherwise normal behavior
    displayCycleID();
    if (cycleID > 25) {
        // disable listeners
        $(awaitImg.id).off("click");
        $(target.id).off("click");
        $(decoy.id).off("click");
        // fill form
    } else {
        decision.toggle();
        var start = Date.now(),
            ClickOrNot = false,
            end;
        if (responseType == "target") {
            $(decision.id).click(function () {
                $(decision.id).off("click");
                ClickOrNot = true;
                end = Date.now();
                var responseTime = end - start;
                var responseString = responseTime + " milliseconds";
                $("#responseTimeinMS").text(responseString);
                decision.toggle();
                awaitImg.toggle();
                var responseDetails = new response(cycleID, responseType, timeDelay, ClickOrNot, responseTime);
                responseArray.push(responseDetails);
                setTimeout(function () { beginNextResponse(); }, 1500);
            });
        } else {
            $(decision.id).click(function () {
                $(decision.id).off("click");
                ClickOrNot = true;
                end = Date.now();
            });
            var responseTime = end - start;
            setTimeout(function () {
                var decoyTime = isNaN(end) ? 0 : end - start;
                if (decoyTime == 0) {
                    $("#responseTimeinMS").text("0 milliseconds");
                    decision.toggle();
                    awaitImg.toggle();
                } else {
                    $("#responseTime").prepend('<h1 class="Incorrect text-center "></h1>');
                    $(".Incorrect").text("Missed Target");
                    var responseString = decoyTime + " ms";
                    $("#responseTimeinMS").text(responseString);
                    decision.toggle();
                    awaitImg.toggle();
                    incorrectResponse = true;
                }
                var responseDetails = new response(cycleID, responseType, timeDelay, ClickOrNot, decoyTime);
                responseArray.push(responseDetails);
                var second = Date.now();
                setTimeout(function () {
                    
                    beginNextResponse()
                }, 1500);
                
            }, 3000);
        }
    }
}
function fillForm(responses) {
    if (responses[0].User == "ReactionTimer") {
        return
    } else {
        var data = JSON.stringify(responses);
        //$.post("https://insightcountsgonogo.firebaseio.com/", data);
        return
    }
}