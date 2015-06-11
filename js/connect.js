var sessionStorage = window.sessionStorage;
var localStorage = window.localStorage;

var URL = 'http://192.168.199.191:9000/authentication/';   //路由地址


function isConnected(){
	$.ajax({
		url: URL + 'isConnected/?sessionID='+ localStorage.sessionID,
		type: 'GET',
		dataType: 'json',
		data: "",
	})
	.done(function() {
		console.log("Already connected.");
		window.location.href = 'control.html';
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}
function connecting(){    //持续尝试连接
	console.log('selfID:' + localStorage.selfID);
	console.log('firstLogin:' + localStorage.firstLogin);
	console.log('sessionID:' + localStorage.sessionID);
	//isConnected();    //是否已经连接
	$.ajax({
		url: URL + 'connect?selfID='+localStorage.selfID+'&timeout='+500000,
		type: 'GET',
		dataType: 'json',
		data: "",
	})
	.done(function(data) {
		$('#state').attr('src','./images/ok.png');
			$('#state').attr('width','50px;');
			$('#retry').css('display', 'none');
			$('#confirm').css('display', 'block');

			localStorage.sessionID = data.sessionID;
			localStorage.remainingTimeout = data.remainingTimeout;
	})
	.fail(function() {
		setTimeout(function(){
			$('#state').attr('src','./images/failed.png');
			$('#state').attr('width','50px;');
			$('#retry').css('display','block');
			$('#confirm').css('display', 'none');
			console.log("Connect To Robot Failed!");
		}, 1000);
		

	})
	.always(function() {
	});
}

$("#retry").click(function(event) {    //连接失败，点击重试
	$('#state').attr('src','./images/waiting.png');
	$('#state').attr('width','130px');
	$('#retry').css('display','none');
	connecting();
});
$("#confirm").click(function(event){   //已经连接成功，点击确定，跳转到控制界面
	window.location.href="control.html";
})

function unpair(){   //解除配对
	$.ajax({
			url: URL + 'unpair?selfID='+localStorage.selfID,
			type: 'GET',
			dataType: 'json',
			data: "",
		})
		.done(function() {  //unpair成功

		})
		.fail(function(data) { 
			if (data.status == 400) {  //unpair不成功,可能由于没有改selfID
				 console.log('unpair failed');
			}
		})
		.always(function(data) {
			if(data.status == 200){
				localStorage.firstLogin = true;
				window.location.href = "index.html";
				console.log("unpair success");
			}
		});
}

$('#unpair-submit').click(function(event) {
	unpair();       //点击进行解除配对
});