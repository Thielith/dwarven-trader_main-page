var playerItems = [];
var shopItems = [1, 2, 3, 4];
var playerID = 0
var shopID = 0
var rz = 0

var socket = io.connect('http://10.0.2.15:33336');

var r = 0;
var rr;
var index;
var send = []

socket.emit(
	'convert', shopItems[r]
);

socket.on('convert', function(name){
	shopItems[r] = name
	r += 1
	
	if(r != shopItems.length){
		socket.emit(
			'convert', shopItems[r]
		);
	}
	else{
		for(r = 0; r < shopItems.length; r++){
			var t = document.getElementById('shopItems').innerHTML =
				document.getElementById('shopItems').innerHTML
				+ "<p id='shopItems" + rz + "' onclick='buy(" + rz + ")'>" + shopItems[rz] + "</p>";
			rz += 1
			console.log(shopItems)
		}
	}
	
})



for(rr = 0; rr < playerItems.length; rr++){
	var t = document.getElementById('playerItems').innerHTML =
        document.getElementById('playerItems').innerHTML
        + "<p id='playerItems" + rr + "' onclick='sell(" + rr + ")'>" + playerItems[rr] + "</p>";
}

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
	var index = shopItems.indexOf(item)
	
    document.getElementById('playerItems').innerHTML =
        document.getElementById('playerItems').innerHTML
        + "<p id='playerItems" + rr + "' onclick='sell(" + rr + ")'>" + shopItems[num] + "</p>";
	
	playerItems.push(shopItems[num])
	shopItems[index] = ""
	
	document.getElementById('shopItems' + num).innerHTML = ""
	rr += 1
	update()
}
function sell(num){

	console.log("sell")
	var item = document.getElementById('playerItems' + num).innerHTML
	var index = playerItems.indexOf(item)
	
    document.getElementById('shopItems').innerHTML =
        document.getElementById('shopItems').innerHTML
        + "<p id='shopItems" + r + "' onclick='buy(" + r + ")'>" + playerItems[num] + "</p>";
	
	shopItems.push(playerItems[num])
	playerItems[index] = ""
	
	document.getElementById('playerItems' + num).innerHTML = ""
	r += 1
	console.log(shopItems)
	update()
}

