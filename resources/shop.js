var playerItems = [5];
var shopItems = [1, 2, 3, 4];

var playerItemsDisplay = [];
var shopItemsDisplay = [];

var playerID = 0
var shopID = 0

var socket = io.connect('http://10.0.2.15:33336');

var r = 0;
var rr = 0;
var index;
var who = "shop";
var send = []

socket.emit(
	'convert', shopItems[r]
);

socket.on('convert', function(name){
	var displayString = who + "ItemsDisplay"
	var string = who + "Items"
	
	console.log(displayString)
	console.log(string)
	
	displayString[r] = name
	r += 1
	
	if(r != string.length){
		socket.emit(
			'convert', string[r]
		);
	}
	else{
		for(r = 0; r < string.length; r++){
			var t = document.getElementById(string).innerHTML =
				document.getElementById(string).innerHTML
				+ "<p id='" + string + r + "' onclick='buy(" + r + ")'>" + displayString[r] + "</p>";
		}
	}
	
})

setTimeout(function(){
	console.log(rr)
	console.log(playerItems[rr])
	who = "player"
	socket.emit(
		'convert', playerItems[rr]
	);
}, 2000)

function update(){
	send = []
	for(i = 0; i < playerItems.length; i++){
		console.log(i)
		if(playerItems[i] != ""){
			var x = playerItems.slice(i, i + 1)
			x = x.toString()
			send.push(x)
		}
	}
}

function buy(num){

	console.log("buy")
	var item = document.getElementById('shopItems' + num).innerHTML
	var index = shopItemsDisplay.indexOf(item)

	
    document.getElementById('playerItems').innerHTML =
        document.getElementById('playerItems').innerHTML
        + "<p id='playerItems" + rr + "' onclick='sell(" + rr + ")'>" + shopItemsDisplay[num] + "</p>";
	
	playerItems.push(shopItems[num])
	shopItems[index] = ""
	
	playerItemsDisplay.push(shopItemsDisplay[num])
	shopItemsDisplay[index] = ""
	
	document.getElementById('shopItems' + num).innerHTML = ""
	rr += 1
	console.log(shopItems)
	console.log(shopItemsDisplay)
	update()
}
function sell(num){

	console.log("sell")
	var item = document.getElementById('playerItems' + num).innerHTML
	var index = playerItemsDisplay.indexOf(item)

	
    document.getElementById('shopItems').innerHTML =
        document.getElementById('shopItems').innerHTML
        + "<p id='shopItems" + r + "' onclick='buy(" + r + ")'>" + playerItemsDisplay[num] + "</p>";
	
	shopItems.push(playerItems[num])
	playerItems[index] = ""
	
	shopItemsDisplay.push(playerItemsDisplay[num])
	playerItemsDisplay[index] = ""
	
	document.getElementById('playerItems' + num).innerHTML = ""
	r += 1
	console.log(playerItems)
	console.log(playerItemsDisplay)
	
	update()
}

