var playerItems = [5, 6];
var playerMoney = 29
var playerItemsDisplay = [];
var playerID = 0
var playerItemsPrice = [];

var shopItems = [1, 2, 3, 4];
var shopItemsDisplay = [];
var shopID = -1
var shopItemsPrice = [];

var socket = io.connect('http://10.0.2.15:33336');

var r = 0;
var rr = 0;
var buyNum = 0;
var sellNum = 0;
var index;
var who = "shop";
var send = []

document.getElementById('playerMoney').innerHTML = playerMoney

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
					+ "<p id='shopItems" + rr + "' onclick='buy(" + rr + ")'>" + shopItemsDisplay[rr] + "</p>";
				
				var tt = document.getElementById('shopItems').innerHTML =
					document.getElementById('shopItems').innerHTML
					+ "<p id='shopItems" + rr + "a'> ^" + shopItemsPrice[rr] + " Gold^</p>";
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
					+ "<p id='playerItems" + rr + "' onclick='sell(" + rr + ")'>" + playerItemsDisplay[rr] + "</p>";
				
				var tt = document.getElementById('playerItems').innerHTML =
					document.getElementById('playerItems').innerHTML
					+ "<p id='playerItems" + rr + "a'> ^" + playerItemsPrice[rr] + " Gold^</p>";
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

function recordTransfer(BuyerID, SellerID, ResourceID, Quantity, Price){
	var sendLine = [BuyerID, SellerID, ResourceID, Quantity, Price]
	console.log("sending information")
	socket.emit(
		'transaction', sendLine
	)
}

function buy(num){
	console.log("buy")
	var item = document.getElementById('shopItems' + num).innerHTML
	var index = shopItemsDisplay.indexOf(item)
	console.log(shopItemsPrice)
	
	if(shopItemsPrice[index] > playerMoney){
		console.log("Too Expensive")
		var ytv = document.getElementById('shopItems' + num + "a").innerHTML
		document.getElementById('shopItems' + num + "a").innerHTML = "Too Expensive"
		setTimeout(function(){
			document.getElementById('shopItems' + num + "a").innerHTML = ytv
		}, 1000)
	}
	
	else{
		playerMoney -= parseInt(shopItemsPrice[index])
		document.getElementById('playerMoney').innerHTML = playerMoney
		
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "' onclick='sell(" + sellNum + ")'>" + shopItemsDisplay[num] + "</p>";
		
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "a'> ^" + shopItemsPrice[num] + " Gold^</p>";
		
		playerItems.push(shopItems[num])
		playerItemsDisplay.push(shopItemsDisplay[num])
		playerItemsPrice.push(shopItemsPrice[num])
		
		document.getElementById('shopItems' + num).innerHTML = ""
		document.getElementById('shopItems' + num + "a").innerHTML = ""
		sellNum += 1
		
		recordTransfer(playerID, shopID, shopItems[num], 1, shopItemsPrice[num])
		shopItems[index] = ""
		shopItemsDisplay[index] = ""
		shopItemsPrice[index] = ""
	}
}
function sell(num){
	console.log("sell")
	var item = document.getElementById('playerItems' + num).innerHTML
	var index = playerItemsDisplay.indexOf(item)
	
	playerMoney += parseInt(playerItemsPrice[index])
	document.getElementById('playerMoney').innerHTML = playerMoney
	
    document.getElementById('shopItems').innerHTML =
        document.getElementById('shopItems').innerHTML
        + "<p id='shopItems" + buyNum + "' onclick='buy(" + buyNum + ")'>" + playerItemsDisplay[num] + "</p>";
	
	document.getElementById('shopItems').innerHTML =
		document.getElementById('shopItems').innerHTML
		+ "<p id='shopItems" + buyNum + "a'> ^" + playerItemsPrice[num] + " Gold^</p>";
	
	shopItems.push(playerItems[num])
	playerItems[index] = ""
	
	shopItemsDisplay.push(playerItemsDisplay[num])
	playerItemsDisplay[index] = ""
	
	shopItemsPrice.push(playerItemsPrice[num])
	playerItemsPrice[index] = ""
	
	document.getElementById('playerItems' + num).innerHTML = ""
	document.getElementById('playerItems' + num + "a").innerHTML = ""
	buyNum += 1
	
}

