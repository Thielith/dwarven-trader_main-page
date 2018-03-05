var playerItems = [5, 6];
var playerMoney = 0
var playerItemsDisplay = [];
var playerID = 0
var playerItemsPrice = [];

var shopItems = [1, 2, 3, 4];
var shopItemsDisplay = [];
var shopID = 0
var shopItemsPrice = [];

var socket = io.connect('http://10.0.2.15:33336');

var r = 0;
var rr = 0;
var buyNum = 0;
var sellNum = 0;
var index;
var who = "shop";
var send = []

socket.emit(
	'convert', shopItems[r]
);


socket.on('convert', function(list){
	if(who == "shop"){
		shopItemsDisplay[r] = list[0]
		shopItemsPrice[r] = list[1]
		r += 1
		
		if(r != shopItems.length){
			socket.emit(
				'convert', shopItems[r]
			);
		}
		
		else{
			for(rr = 0; rr < shopItems.length; rr++){
				var t = document.getElementById('shopItems').innerHTML =
					document.getElementById('shopItems').innerHTML
					+ "<p id='shopItems" + rr + "' onclick='buy(" + rr + ")'>" + shopItemsDisplay[rr] + ": " + shopItemsPrice[rr] + " Gold</p>";
				var tt = document.getElementById('shopItems').innerHTML =
					document.getElementById('shopItems').innerHTML
					+ "<p id='shopItems" + rr + "'>" + shopItemsPrice[rr] + " Gold</p>";
				buyNum = rr + 1
			}
			
			who = "player"
			r = 0
			rr = 0
			socket.emit(
				'convert', playerItems[r]
			);
		}

	}

	else if(who == "player"){
		playerItemsDisplay[r] = list[0]
		playerItemsPrice[r] = list[1]
		r += 1
		
		if(r != playerItems.length){
			socket.emit(
				'convert', playerItems[r]
			);
		}
		
		else{
			for(rr = 0; rr < playerItems.length; rr++){
				var t = document.getElementById('playerItems').innerHTML =
					document.getElementById('playerItems').innerHTML
					+ "<p id='playerItems" + rr + "' onclick='sell(" + rr + ")'>" + playerItemsDisplay[rr] + ": " + playerItemsPrice[rr] + " Gold</p>";
				sellNum = rr + 1
			}
		}
	}
})

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

function recordTransfer(){
	
}

function buy(num){

	console.log("buy")
	var item = document.getElementById('shopItems' + num).innerHTML
	var index = shopItemsDisplay.indexOf(item)
	
	console.log(item)
	console.log(index)
	console.log(shopItemsPrice[sellNum])
	console.log(playerMoney)
	
	if(shopItemsPrice[index] > playerMoney){
		console.log("Too Expensive")
	}
	
	else{
	
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "' onclick='sell(" + sellNum + ")'>" + shopItemsDisplay[num] + ": " + shopItemsPrice[sellNum] + " Gold</p>";
		
		playerItems.push(shopItems[num])
		shopItems[index] = ""
		
		playerItemsDisplay.push(shopItemsDisplay[num])
		shopItemsDisplay[index] = ""
		
		document.getElementById('shopItems' + num).innerHTML = ""
		sellNum += 1
		console.log(shopItems)
		console.log(shopItemsDisplay)
	}
}
function sell(num){

	console.log("sell")
	var item = document.getElementById('playerItems' + num).innerHTML
	var index = playerItemsDisplay.indexOf(item)
	
    document.getElementById('shopItems').innerHTML =
        document.getElementById('shopItems').innerHTML
        + "<p id='shopItems" + buyNum + "' onclick='buy(" + buyNum + ")'>" + playerItemsDisplay[num] + ": " + playerItemsPrice[num] + " Gold</p>";
	
	shopItems.push(playerItems[num])
	playerItems[index] = ""
	
	shopItemsDisplay.push(playerItemsDisplay[num])
	playerItemsDisplay[index] = ""
	
	document.getElementById('playerItems' + num).innerHTML = ""
	buyNum += 1
	
	playerMoney += playerItemsPrice[index]
	console.log(playerItems)
	console.log(playerItemsDisplay)
	
}

