//playerID, playerMoney, {Item, Item Display, Price}
var player = [0, 29, {ItemID: 5, ItemName: undefined, Price: undefined}, {ItemID: 6, ItemName: undefined, Price: undefined}]

//shopID, {Item, Item Display, Price}
var shop = [-1, {ItemID: 1, ItemName: undefined, Price: undefined}, {ItemID: 2, ItemName: undefined, Price: undefined}, {ItemID: 3, ItemName: undefined, Price: undefined}, {ItemID: 4, ItemName: undefined, Price: undefined}]

var socket = io.connect('http://xx.x.x.xx:xxxxx'); // Editing this in case this IP can be used maliciously.
var r = 1;
var buyNum = 0;
var sellNum = 0;
var who = "shop";
var send = []

document.getElementById('playerMoney').innerHTML = player[1]

function getData(){
	//For when theres a table for player info (like stats and inventory)
}

socket.emit(
	'convert', shop[r].ItemID
);

socket.on('convert', function(list){
	if(who == "shop"){
		shop[r].ItemName = list[0]
		shop[r].Price = list[1]
		r += 1
		
		if(r != shop.length){
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
	for(i = 0; i < player.length; i++){
		console.log(i)
		if(player[i].ItemName != ""){
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
	var last = player.length - 1
	
	if(shop[num].Price > player[1]){
		console.log("Too Expensive")
		var ytv = document.getElementById('shopItems' + num + "a").innerHTML
		document.getElementById('shopItems' + num + "a").innerHTML = "Too Expensive"
		setTimeout(function(){
			document.getElementById('shopItems' + num + "a").innerHTML = ytv
		}, 1000)
	}
	
	else{
		player[1] -= parseInt(shop[num].Price)
		document.getElementById('playerMoney').innerHTML = player[1]
		
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "' onclick='sell(" + sellNum + ")'>" + shop[num].ItemName + "</p>";
		
		document.getElementById('playerItems').innerHTML =
			document.getElementById('playerItems').innerHTML
			+ "<p id='playerItems" + sellNum + "a'> ^" + shop[num].Price + " Gold^</p>";
		
		player.push({ItemID: undefined, ItemName: undefined, Price: undefined})
		player[last].ItemID = shop[num].ItemID
		player[last].ItemName = shop[num].ItemName
		player[last].Price = shop[num].Price
		
		document.getElementById('shopItems' + num).innerHTML = ""
		document.getElementById('shopItems' + num + "a").innerHTML = ""
		sellNum += 1
		
		recordTransfer(playerID, shopID, shop[num].ItemID, 1, shop[num].Price)
		shop[num].ItemID = ""
		shop[num].ItemName = ""
		shop[num].Price = ""
		
		console.log(shop)
	}
}
function sell(num){
	console.log("sell")
	var last = shop.length - 1
	
	player[1] += parseInt(player[num].Price)
	document.getElementById('playerMoney').innerHTML = player[1]
	
    document.getElementById('shopItems').innerHTML =
        document.getElementById('shopItems').innerHTML
        + "<p id='shopItems" + buyNum + "' onclick='buy(" + buyNum + ")'>" + player[num].ItemName + "</p>";
	
	document.getElementById('shopItems').innerHTML =
		document.getElementById('shopItems').innerHTML
		+ "<p id='shopItems" + buyNum + "a'> ^" + player[num].Price + " Gold^</p>";
	
	shop.push({ItemID: undefined, ItemName: undefined, Price: undefined})
	shop[last].ItemID = player[num].ItemID
	shop[last].ItemName = player[num].ItemName
	shop[last].Price = player[num].Price
	
	document.getElementById('playerItems' + num).innerHTML = ""
	document.getElementById('playerItems' + num + "a").innerHTML = ""
	buyNum += 1
	
	recordTransfer(shopID, playerID, player[num].ItemID, 1, player[num].Price)
	
	player[num].ItemID = ""
	player[num].ItemName = ""
	player[num].Price = ""
}

