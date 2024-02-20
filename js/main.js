class Item{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}



class liftQItem {
    constructor(is_travelling,direction, q, dirq)
    {
        this.direction = direction;
        this.is_travelling = is_travelling;
        this.q = q;
        this.dirq = dirq;
    }
}


var lifts = 0;
var floors = 0;
var floorList = [];
var liftList = [];

var liftCounter = 0;

var liftsQueue = new Map();

var dispatcherQF = [];
var dispatcherQD = [];

function onFloor(button) {

    if(lifts<=0)
    {
        return;
    }

    var floor = parseInt(button.getAttribute("data-floor"));
    var direction = button.getAttribute("data-direction");
    
    var upButtonEle = document.getElementById("up_button_"+floor);
    var downButtonEle = document.getElementById("down_button_"+floor);
    
    if(direction == "up" && upButtonEle.style.backgroundColor == "red")
    {
        return;
    }
    else if(direction == "down" && downButtonEle.style.backgroundColor == "red")
    {
        return;
    }   

    dispatcherQF.push(floor);
    dispatcherQD.push(direction);
    //qController(floor, direction);

    if(direction == "up")
    {
        upButtonEle.style.backgroundColor = "red";
    }
    else if(direction == "down")
    {
        downButtonEle.style.backgroundColor = "red";
    }

    //console.log(liftsQueue);

}


function qController(floor, direction)
{
    var lift1 = finClosestLiftInSameDirSameFlo(floor, direction);
    if(lift1 == "not found")
    {
        console.log("not found 1st");
        
    }
    else
    {
        console.log(lift1);
        liftsQueue.get(lift1).q.push(floor);
        liftsQueue.get(lift1).dirq.push(direction);
        console.log("first");
        return ;
    }
    


    var lift2 = findClosestEmptyLift(floor, direction);
    if(lift2 == "not found")
    {
        console.log("not found 2st");
    }
    else
    {
        console.log(lift2);
        liftsQueue.get(lift2).q.push(floor);
        liftsQueue.get(lift2).dirq.push(direction);
        console.log("second");
        return ;
    }


    var lift3 = findClosestLiftInSameDir(floor, direction);
    if(lift3 == "not found")
    {
        console.log("not found 3rd");
    }
    else
    {
        console.log(lift3);
        liftsQueue.get(lift3).q.push(floor);
        liftsQueue.get(lift3).dirq.push(direction);
        console.log("third");
        return ;
    }


    var lift4 = findAnyLift(floor,direction);
    console.log(lift4);
    liftsQueue.get(lift4).q.push(floor);
    liftsQueue.get(lift4).dirq.push(direction);
    console.log("fourth");

    /*
    var lift  = liftsQueue.get(liftCounter%lifts);
    
    if(lift.dirq == 0)
    {
        lift.q.push(floor);
        lift.dirq.push(direction);
    }
    else
    {
        if(direction == lift.dirq[lift.dirq.length-1])
        {
            if(direction == "down" &&  lift.q[lift.q.length-1] < floor)
            {
                liftCounter++;
                lift  = liftsQueue.get(liftCounter%lifts);
                lift.q.push(floor);
                lift.dirq.push(direction);
            }
            else if(direction == "up" &&  lift.q[lift.q.length-1] > floor)
            {
                liftCounter++;
                lift  = liftsQueue.get(liftCounter%lifts);
                lift.q.push(floor);
                lift.dirq.push(direction);
            }
            else
            {
                lift.q.push(floor);
                lift.dirq.push(direction);
            }
        }
        else
        {
            liftCounter++;
            lift  = liftsQueue.get(liftCounter%lifts);
            lift.q.push(floor);
            lift.dirq.push(direction);
        }
    }
    */
    /*
    if(lift.direction == "none")
    {
        lift.q.push(floor);
        lift.dirq.push(direction);
    }*/
    
    

}

function sortLiftsWithDiff(resListLift, resListDiff)
{
    for(var i=0;i<resListDiff.length;i++)
    {
        
        for(var j=0;j<resListDiff.length;j++)
        {
            if(resListDiff[j] > resListDiff[i])
            {
                var temp = resListDiff[i];
                resListDiff[i] = resListDiff[j];
                resListDiff[j] = temp;

                var temp2 = resListLift[i];
                resListLift[i] = resListLift[j];
                resListLift[j] = temp2; 
            }
        }
    }

    
}


function finClosestLiftInSameDirSameFlo(floor, direction) {

    var resListLift = [];
    var resListDiff = [];
    
    for(var i=0;i<lifts;i++)
    {
        //liftsQueue.get(i).q.length > 0
        if(direction == "up" && liftsQueue.get(i).is_travelling)
        {
            var lastLiftDir = liftsQueue.get(i).dirq[liftsQueue.get(i).dirq.length-1];
            var lastFloorY = floorList[liftsQueue.get(i).q[liftsQueue.get(i).q.length-1]].y;
            //var lastFloorY = liftList[i].y;
            var currFloorY = floorList[floor].y;
            var diff = lastFloorY - currFloorY;
            if(diff >= 0 && lastLiftDir == direction)
            {
                resListDiff.push(diff);
                resListLift.push(i);
            }
        }
        else if(direction == "down" && liftsQueue.get(i).is_travelling)
        {   
            var lastLiftDir = liftsQueue.get(i).dirq[liftsQueue.get(i).dirq.length-1];
            var lastFloorY = floorList[liftsQueue.get(i).q[liftsQueue.get(i).q.length-1]].y;
            //var lastFloorY = liftList[i].y;
            var currFloorY = floorList[floor].y;
            //var diff = currFloorY - lastFloorY;
            var diff = lastFloorY - currFloorY;
            if(diff <=  0 && lastLiftDir == direction)
            {
                resListDiff.push(diff);
                resListLift.push(i);
            }
        }
    }


    sortLiftsWithDiff(resListLift,resListDiff);


    if(resListLift.length > 0)
    {
        return resListLift[0];
    }
    else
    {
        return "not found"; 
    }


    
}

function findClosestEmptyLift(floor, direction) {

    var resListLift = [];
    var resListDiff = [];

    for(var i=0;i<lifts;i++)
    {
        var liftY = liftList[i].y;        
        var floorY = floorList[floor].y;
        var diff = Math.abs(liftY - floorY);
        if(!liftsQueue.get(i).is_travelling)
        {
            resListLift.push(i);
            resListDiff.push(diff);
        }

    }

    sortLiftsWithDiff(resListLift,resListDiff);

    if(resListLift.length > 0)
    {
        return resListLift[0];
    }
    else
    {
        return "not found"; 
    }

}

function findClosestLiftInSameDir(floor, direction) {

    var resListLift = [];
    var resListDiff = [];
    console.log("here");
    for(var i=0;i<lifts;i++)
    {
        if(liftsQueue.get(i).q.length > 0)
        {
            
            var lastLiftDir = liftsQueue.get(i).dirq[liftsQueue.get(i).dirq.length-1];
            var lastFloorY = floorList[liftsQueue.get(i).q[liftsQueue.get(i).q.length-1]].y;
            //var lastFloorY = floorList[liftsQueue.get(i).q[0]].y;  
            var currFloorY = floorList[floor].y;
            var diff = Math.abs(lastFloorY - currFloorY);
            if(direction == lastLiftDir)
            {
                resListLift.push(i);
                resListDiff.push(diff);
            }
        }
    }

    sortLiftsWithDiff(resListLift,resListDiff);

    if(resListLift.length > 0)
    {
        return resListLift[0];
    }
    else
    {
        return "not found"; 
    }

}

function findAnyLift(floor, direction)
{
    var liftIndex = Math.floor(Math.random() * lifts);
    return liftIndex;
}

function getDirection(one, two)
{

    if(one - two <= 0)
    {
        return "up";
    }
    else
    {
        return "down";
    }
}



function myFunction() {
    
    lifts = parseInt(document.getElementById("lifts").value);
    floors = parseInt(document.getElementById("floors").value);
    
    if(!isNaN(lifts) && !isNaN(floors))
    {

        if(lifts <0 || floors <0)
        {
            alert("invalid input")
            lifts =0;
            floors =0;
            return;
        }
        else if(lifts > 0 && floors<=1)
        {
            alert("invalid input");
            lifts = 0;
            floors = 0;
            return;
        }

        
        floorList = [];
        liftList = [];
        liftCounter = 0;
        liftsQueue = new Map();
        
        var floorLayout = document.getElementById("floor-layout");
        var floorLayoutString = "";
        //var liftWidth = ((innerWidth-100)/lifts);
        var liftWidth = 200;
        var floorHeight = 200;
        var buildHeight = floors * floorHeight;
        var floorWidth = 100 + (liftWidth*lifts);

        if(floorWidth < innerWidth)
        {
            floorWidth = innerWidth;
        }

        for(var i=0,y=250;i<floors;i++,y=y+floorHeight)
        {
            floorList.push(new Item(0,y));

            floorLayoutString += "<div id='floor_"+i+"' class = 'floor' style='width:"+floorWidth+"px;'>" +
            "<hr>"+
            "<div style='height:100%;display:flex;flex-direction:column;justify-content:center;'>"

            if(i == 0)
            {
                floorLayoutString += "<button data-floor='"+i+"' data-direction='down' id='down_button_"+i+"' class='lift-button' style='background-color: #6992AE;' onclick='onFloor(this)'>Down</button>";
            }
            else if(i == floors-1)
            {
                floorLayoutString += "<button data-floor='"+i+"' data-direction='up' id='up_button_"+i+"'  class='lift-button' style='background-color: #6992AE;' onclick='onFloor(this)'>Up</button>"
                
            }
            else
            {
                floorLayoutString += "<button data-floor='"+i+"' data-direction='up' id='up_button_"+i+"'  class='lift-button' style='background-color: #6992AE;' onclick='onFloor(this)'>Up</button>"+
                "<br>"+
                "<button data-floor='"+i+"' data-direction='down' id='down_button_"+i+"' class='lift-button' style='background-color: #6992AE;' onclick='onFloor(this)'>Down</button>"
                
            }
            
            floorLayoutString += "<br><h3 style='margin-left:20px;width:100px;text-align:center;'>Floor: "+(floors-i)+"</h3></div></div>";
        }

        
        floorLayout.innerHTML = floorLayoutString;

        var liftLayout = document.getElementById("lift-layout");
        var liftLayoutString = "";

        for(var i=0,x=120;i<lifts;i++,x=x+liftWidth)
        {
            var y = (250+((floors-1)*floorHeight));
            liftList.push(new Item(x,y));
            liftsQueue.set(i, new liftQItem(false,"none", [], []));
            
            var doorColor = getRandomColor();

            liftLayoutString += "<div id='lift_"+i+"' class='lift' style='background-color:"+"none"+";left:"+x+"px;width:"+liftWidth+"px;top:"+y+"px;'>"+
            "<div class='lift-background'>"+
            "<div id='lift_"+i+"_door_1' class='lift-door' style='background-color:"+doorColor+";height:100%;width:50%;'></div>"+
            "<div id='lift_"+i+"_door_2' class='lift-door' style='background-color:"+doorColor+";height:100%;width:50%;float:left;'></div>"+
            "</div>"+
            "</div>";
        }
        
        liftLayout.innerHTML = liftLayoutString;

        
        console.log(liftList);
        console.log(floorList);
        

    }
    else
    {
        lifts = 0;
        floors = 0;
        alert("invalid input")
    }

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function findTime(lift, floor) {
    var floorY = floorList[floor].y;
    var liftY = parseInt(document.getElementById("lift_"+lift).style.top);
    var timediff = Math.abs(floorY-liftY) / 100;
    return timediff;

}




async function makeLiftTravel(lift, floor,direction){

    var timediff = findTime(lift,floor);

    var liftElement = document.getElementById("lift_"+lift);
    liftElement.style.transitionDuration = timediff + "s";
    liftElement.style.top = floorList[floor].y +"px";

    let liftprom = new Promise(function(resolve) {
        setTimeout(function() {
            // Code to execute after the delay
            resolve("lift sent");
            //openLiftDoors(lift,floor);
        }, timediff*1000);
    })

    var a = await liftprom;
    
    var liftDoorElement = document.getElementById("lift_"+lift+"_door_2");
    liftDoorElement.style.marginLeft = "100%";
    
    let liftdoorprom = new Promise(function(resolve) {
        setTimeout(function() {
            // Code to execute after the delay
            resolve("door opened");
            //closeLiftDoors(lift,floor);
        }, 2000);
    })
    var b = await liftdoorprom;
    
    liftDoorElement.style.marginLeft = "0%";

    let liftdoorcloseprom = new Promise(function(resolve) {
        setTimeout(function() {
            // Code to execute after the delay
            resolve("door closed");
            
            //closeLiftDoors(lift,floor);
        }, 2000);
    })
    var c = await liftdoorcloseprom;

    liftsQueue.get(lift).is_travelling = false;
    liftsQueue.get(lift).q.shift();
    liftsQueue.get(lift).dirq.shift();
    liftList[lift].y =  floorList[floor].y;
    var upButtonEle = document.getElementById("up_button_"+floor);
    var downButtonEle = document.getElementById("down_button_"+floor);
    //console.log(liftList);

    if(direction == "up")
    {
        upButtonEle.style.backgroundColor = "#6992AE";
    }
    else if(direction == "down")
    {
        downButtonEle.style.backgroundColor ="#6992AE";
    }
    
    
}



setInterval(function() {
    // Code to execute repeatedly
    for(var i=0;i<lifts;i++)
    {
        if(!liftsQueue.get(i).is_travelling && liftsQueue.get(i).q.length > 0)
        {
            liftsQueue.get(i).is_travelling = true;
            makeLiftTravel(i, liftsQueue.get(i).q[0], liftsQueue.get(i).dirq[0]);
        }
    }

    /* Debug
    var log = document.getElementById("log");
    var logStr = "<br>";

    for(var i=0;i<lifts;i++)
    {
        logStr += "[" + i + " - direction: " + liftsQueue.get(i).direction + ", is_travelling: " + liftsQueue.get(i).is_travelling + ", q: " + liftsQueue.get(i).q + ", dirq: " + liftsQueue.get(i).dirq +"<br>";
    }

    logStr += "<br>";

    log.innerHTML = logStr;
    */

}, 1000);


setInterval(function() {

    if(dispatcherQF.length > 0)
    {
        qController(dispatcherQF.shift(), dispatcherQD.shift());
    }

}, 500);


