var amount = 0
var x = 0

function close() // no ';' here
{
    var elem = document.getElementById("reveil");
    if (elem.value=="closed"){
		elem.value = "open"; 
		document.getElementById("content").style.display = "block";
	}
    else{
		elem.value = "closed";
		document.getElementById("content").style.display = "none";
	} 
	console.log(elem.value)
}


function counter(){
	
	amount += 1
	console.log(amount)
	document.getElementById("counter").innerHTML = amount;
	if(amount >= 5){
		if(amount >= 10){
			document.getElementById("Achievemnt").innerHTML = "You clicked 10 times!";
		}
		else{
			document.getElementById("Achievemnt").innerHTML = "You clicked 5 times!";
		}
	}
}

function change(){
	x += 1
	console.log(x)
	if(x == 2){
		console.log("ok")
		location.href = "http://google.com";
	}
}