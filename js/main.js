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
const floorList = [];
const liftList = [];

var liftCounter = 0;

var liftsQueue = new Map();

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


    qController(floor, direction);

    if(direction == "up")
    {
        upButtonEle.style.backgroundColor = "red";
    }
    else if(direction == "down")
    {
        downButtonEle.style.backgroundColor = "red";
    }

    console.log(liftsQueue);

}


function qController(floor, direction)
{
    
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
    
    /*
    if(lift.direction == "none")
    {
        lift.q.push(floor);
        lift.dirq.push(direction);
    }*/
    
    

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
        else if(lifts > 0 && floors<=0)
        {
            alert("invalid input");
            lifts = 0;
            floors = 0;
            return;
        }

        
        var floorLayout = document.getElementById("floor-layout");
        var floorLayoutString = "";
        var liftWidth = ((innerWidth-100)/lifts);
        var floorHeight = 200;
        var buildHeight = floors * floorHeight;

        for(var i=0,y=100;i<floors;i++,y=y+floorHeight)
        {
            floorList.push(new Item(0,y));

            floorLayoutString += "<div id='floor_"+i+"' class = 'floor'>" +
            "<hr>"

            if(i == 0)
            {
                floorLayoutString += "<button data-floor='"+i+"' data-direction='down' id='down_button_"+i+"' class='lift-button' style='background-color: white;' onclick='onFloor(this)'>Down</button>";
            }
            else if(i == floors-1)
            {
                floorLayoutString += "<button data-floor='"+i+"' data-direction='up' id='up_button_"+i+"'  class='lift-button' style='background-color: white;' onclick='onFloor(this)'>Up</button>"
                
            }
            else
            {
                floorLayoutString += "<button data-floor='"+i+"' data-direction='up' id='up_button_"+i+"'  class='lift-button' style='background-color: white;' onclick='onFloor(this)'>Up</button>"+
                "<br>"+
                "<button data-floor='"+i+"' data-direction='down' id='down_button_"+i+"' class='lift-button' style='background-color: white;' onclick='onFloor(this)'>Down</button>"
                
            }
            
            floorLayoutString += "</div>";
        }

        
        floorLayout.innerHTML = floorLayoutString;

        var liftLayout = document.getElementById("lift-layout");
        var liftLayoutString = "";

        for(var i=0,x=100;i<lifts;i++,x=x+liftWidth)
        {
            var y = (100+((floors-1)*floorHeight));
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

        
        //console.log(liftsQueue);
        

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
    return timediff * 2;

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

    console.log(await liftprom);

    var liftDoorElement = document.getElementById("lift_"+lift+"_door_2");
    liftDoorElement.style.marginLeft = "100%";
    
    let liftdoorprom = new Promise(function(resolve) {
        setTimeout(function() {
            // Code to execute after the delay
            resolve("door opened");
            //closeLiftDoors(lift,floor);
        }, 2000);
    })
    console.log(await liftdoorprom);
    
    liftDoorElement.style.marginLeft = "0%";

    let liftdoorcloseprom = new Promise(function(resolve) {
        setTimeout(function() {
            // Code to execute after the delay
            resolve("door closed");
            
            //closeLiftDoors(lift,floor);
        }, 2000);
    })
    console.log(await liftdoorcloseprom);

    liftsQueue.get(lift).is_travelling = false;
    liftsQueue.get(lift).q.shift();
    liftsQueue.get(lift).dirq.shift();

    var upButtonEle = document.getElementById("up_button_"+floor);
    var downButtonEle = document.getElementById("down_button_"+floor);

    if(direction == "up")
    {
        upButtonEle.style.backgroundColor = "white";
    }
    else if(direction == "down")
    {
        downButtonEle.style.backgroundColor ="white";
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
}, 1000);