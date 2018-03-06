var mysql = require('mysql'); 
var io = require('socket.io').listen(33336);
const {exec} = require('child_process');

var delay = 3300

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "asdf",
	database: "DwarvenTrader"
})


io.sockets.on('connection', function (socket) {
	var clientIp = socket.request.connection.remoteAddress;
	console.log("Someone From " + clientIp + " Connected")
	
	socket.on('convert', function(item){
		var sendLine = []
		var sql = "SELECT * FROM list_of_items WHERE ItemID = " + item + ";"
		con.query(sql, function(err, result){
			if (err) throw err;
			console.log(result)
			var s = result[0].ItemName
			s = s.toString()
			var p = result[0].Price
			p = p.toString()
			
			sendLine.push(s)
			sendLine.push(p)
			
			socket.emit(
				'convert', sendLine
			);
			
		})

	})
	
	//Edit-Update Transaction Database
	socket.on('transaction', function (info) {
		var sendLine = ""
		
		for(i = 0; i < info.length; i++){
			sendLine += info[i] + " "
		}
		
		sendLine += "transaction"
		
		var e = 'python database.py ' + sendLine
		console.log(e)
		//exec(e);
	});
	
	//Update Client Info
	socket.on('sendData', function(string){
		sendData(string)
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
