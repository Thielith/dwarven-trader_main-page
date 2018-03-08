var playerItems = [5, 6];
var playerMoney = 29
var playerItemsDisplay = [];
var playerID = 0
var playerItemsPrice = [];

//playerID, playerMoney, {Item, Item Display, Price}
var player = [0, 29, {ItemID: 5, ItemName: undefined, Price: undefined}, {ItemID: 6, ItemName: undefined, Price: undefined}]

var shopItems = [1, 2, 3, 4];
var shopItemsDisplay = [];
var shopID = -1
var shopItemsPrice = [];

//shopID, {Item, Item Display, Price}
var shop = [-1, {ItemID: 1, ItemName: undefined, Price: undefined}, {ItemID: 2, ItemName: undefined, Price: undefined}, {ItemID: 3, ItemName: undefined, Price: undefined}, {ItemID: 4, ItemName: undefined, Price: undefined}]


var socket = io.connect('http://10.0.2.15:33336');

var r = 1;
var rr = 0;
var buyNum = 0;
var sellNum = 0;
var index;
var who = "shop";
var send = []

document.getElementById('playerMoney').innerHTML = playerMoney

function getData(){
	//For when theres a table for player info
	//player.push({})
	//player[i].ItemID = 90
	//console.log(player[i])
}

socket.emit(
	'convert', shop[r].ItemID
);

socket.on('convert', function(list){
	if(who == "shop"){
		shop[r].ItemName = list[0]
		shop[r].Price = list[1]
		r += 1
		
		if(r != shop.length - 1){
			socket.emit(
				'convert', shop[r].ItemID
			);
		}
		
		else{
			for(rr = 1; rr < shop.length; rr++){
				var t = document.getElementById('shopItems').innerHTML =
					document.getElementById('shopItems').innerHTML
					+ "<p id='shopItems" + rr + "' onclick='buy(" + rr + ")'>" + shop[rr].ItemName + "</p>";
				
				var tt = document.getElementById('shopItems').innerHTML =
					document.getElementById('shopItems').innerHTML
					+ "<p id='shopItems" + rr + "a'> ^" + shop[rr].Price + " Gold^</p>";
				buyNum = rr + 1
			}
			
			who = "player"
			r = 2
			rr = 0
			socket.emit(
				'convert', player[r].ItemID
			);
		}

	}

	else if(who == "player"){
		player[r].ItemName = list[0]
		player[r].Price = list[1]
		r += 1
		
		if(r != player.length){
			socket.emit(
				'convert', player[r].ItemID
			);
		}
		
		else{
			for(rr = 2; rr < player.length; rr++){
				var t = document.getElementById('playerItems').innerHTML =
					document.getElementById('playerItems').innerHTML
					+ "<p id='playerItems" + rr + "' onclick='sell(" + rr + ")'>" + player[rr].ItemName + "</p>";
				
				var tt = document.getElementById('playerItems').innerHTML =
					document.getElementById('playerItems').innerHTML
					+ "<p id='playerItems" + rr + "a'> ^" + player[rr].Price + " Gold^</p>";
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

	console.log(shop[num].ItemID)
	console.log(shop[num].ItemName)
	console.log(shop[num].Price)
	
	if(shop[num].Price > playerMoney){
		console.log("Too Expensive")
		var ytv = document.getElementById('shopItems' + num + "a").innerHTML
		document.getElementById('shopItems' + num + "a").innerHTML = "Too Expensive"
		setTimeout(function(){
			document.getElementById('shopItems' + num + "a").innerHTML = ytv
		}, 1000)
	}
	
	else{
		playerMoney -= parseInt(shop[num].Price)
		document.getElementById('playerMoney').innerHTML = playerMoney
		
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "' onclick='sell(" + sellNum + ")'>" + shop[num].ItemName + "</p>";
		
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "a'> ^" + shop[num].Price + " Gold^</p>";
		
		player.push({ItemID: undefined, ItemName: undefined, Price: undefined})
		player[player.length - 1].ItemID = shop[num].ItemID
		player[player.length - 1].ItemName = shop[num].ItemName
		player[player.length - 1].Price = shop[num].Price
		
		document.getElementById('shopItems' + num).innerHTML = ""
		document.getElementById('shopItems' + num + "a").innerHTML = ""
		sellNum += 1
		
		recordTransfer(playerID, shopID, shop[num].ItemID, 1, shop[num].Price)
		shopItems[num] = ""
		shopItemsDisplay[num] = ""
		shopItemsPrice[num] = ""
	}
}
function sell(num){
	console.log("sell")
	
	playerMoney += parseInt(player[num].Price)
	document.getElementById('playerMoney').innerHTML = playerMoney
	
    document.getElementById('shopItems').innerHTML =
        document.getElementById('shopItems').innerHTML
        + "<p id='shopItems" + buyNum + "' onclick='buy(" + buyNum + ")'>" + player[num].ItemName + "</p>";
	
	document.getElementById('shopItems').innerHTML =
		document.getElementById('shopItems').innerHTML
		+ "<p id='shopItems" + buyNum + "a'> ^" + player[num].Price + " Gold^</p>";
	
	shop.push({})
	shop[shop.length].ItemID = player[num].ItemID
	shop[shop.length].ItemName = player[num].ItemName
	shop[shop.length].Price = player[num].Price
	
	document.getElementById('playerItems' + num).innerHTML = ""
	document.getElementById('playerItems' + num + "a").innerHTML = ""
	buyNum += 1
	
	recordTransfer(shopID, playerID, player[num].ItemID, 1, player[num].Price)
	
	player[num].ItemID = ""
	player[num].ItemName = ""
	player[num].Price = ""
}

