var login = new Vue({
	el: '#main',
	data: {
		userid: '',
		username: '',
		homeData: [],
		myCarData: [],
		myFavData:[],
		show: 1,
		updateCar:1,
		cardInfo: {
			cardInfo: '',
			oldPrice: '',
			nowPrice: '',
			buyDate: '',
			mileage: '',
			userid: ''
		},
		updateInfo: {
			cardInfo: '',
			oldPrice: '',
			nowPrice: '',
			buyDate: '',
			mileage: '',
			userid: ''
		}
		
	},
	mounted: function() {
		var _this = this;
		_this.init();
		_this.initHome();
	},
	methods: {
		init: function() {
			var _this = this;
			var userid = sessionStorage.getItem('userid');
			_this.cardInfo.userid = userid;
			var username = sessionStorage.getItem('username');
			_this.username = username;
		},
		logout:function()
		{
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('userid');
			window.location.href="/login"
		},
		initHome: function() {
			var _this = this;
			var param = {userid:_this.cardInfo.userid};
			if(_this.cardInfo.userid==null)
			{
				param.userid="-1";
			}
			
			$.ajax({
				type: "post",
				url: "/findCars",
				data:param,
				success: function(data) { //请求的返回成功的方法
					_this.homeData = JSON.parse(data);
				}
			});
		},
		initMyCar: function() {
			var _this = this;
			var param = {
				userid: _this.cardInfo.userid
			};
			$.ajax({
				type: "post",
				url: "/findMycar",
				data: param,
				success: function(data) { //请求的返回成功的方法
					_this.myCarData = JSON.parse(data);
				}
			});
		},
		initMyFav:function()
		{
			var _this = this;
			var param = {
				userid: _this.cardInfo.userid
			};
			$.ajax({
				type: "post",
				url: "/findMyFav",
				data: param,
				success: function(data) { //请求的返回成功的方法
					_this.myFavData = JSON.parse(data);
				}
			});
		},
		delFav:function(item)
		{
			var _this = this;
			var param = {carid:item.carid,userid:_this.cardInfo.userid};

		
			var		url="delFav";
			var		type="delete";
			$.ajax({
				type: type,
				url: url,
				data: param,
				success: function(data) { //请求的返回成功的方法
					if(data=="success")
					{
						alert("Operate Success");
						_this.initMyFav();
					}
				}
			});
		},
		deleteMycar:function(item)
		{
			var _this = this;
			var param = {
				carid: item.carid
			};
			$.ajax({
				type: "delete",
				url: "/deleteMycar",
				data: param,
				success: function(data) { //请求的返回成功的方法
					if(data=="success")
					{
						alert("Operate Success");
						_this.initMyCar();
					}
				}
			});
		},
		showChange:function(val)
		{
			var _this = this;
			_this.show=val;
			_this.updateCar=1;
			if(val==1)
			{
				_this.initHome();
			}else if(val==3)
			{
				_this.initMyCar();
			}else if(val==2)
			{
				_this.initMyFav();
			}
		},
		back:function()
		{
			var _this = this;
			_this.updateCar=1;
		},
		updateMycar:function(item)
		{
			var _this = this;
			_this.updateCar=0;
			_this.updateInfo=JSON.parse(JSON.stringify(item));
		},
		updateMyCarForm:function(){
			var _this = this;
			var newFile = $("#updateImage").val();
			if (_this.updateInfo.cardInfo == "" || _this.updateInfo.oldPrice == "" ||
				_this.updateInfo.nowPrice == "" ||
				_this.updateInfo.mileage == "" ||
				newFile == "") {
				alert("All info of updateInfo cannot be empty");
				return
			}
			var _this = this;
			var options = {
				//target: '#output',          //把服务器返回的内容放入id为output的元素中
				//beforeSubmit: showRequest,  //提交前的回调函数
				//url: url,                 //默认是form的action， 如果申明，则会覆盖
				//clearForm: true,          //成功提交后，清除所有表单元素的值
				//resetForm: true,          //成功提交后，重置所有表单元素的值
				//timeout: 3000,            //限制请求的时间，当请求大于3秒后，跳出请求
				url: "/updateMyCar",
				type: 'post',
				success: function(res) {
					if (res == "success") {
						alert("update success");
						_this.initMyCar();
						_this.updateCar=1;
					}
				}
			}
			$('#updateForm').ajaxSubmit(options);
		},
		addFav:function(item)
		{
			var _this = this;
			var param = {carid:item.carid,userid:_this.cardInfo.userid};
			var url="/addFav";
			var type="post";
			if(item.isCollect==true)
			{
					url="delFav";
					type="delete";
			}
			$.ajax({
				type: type,
				url: url,
				data: param,
				success: function(data) { //请求的返回成功的方法
					if(data=="success")
					{
						alert("Add To Your List Success");
						_this.initHome();
					}
				}
			});
		},
		publishCar: function() {

			var _this = this;
			var newFile = $("#cardImage").val();
			if (_this.cardInfo.cardInfo == "" || _this.cardInfo.oldPrice == "" ||
				_this.cardInfo.nowPrice == "" ||
				_this.cardInfo.mileage == "" ||
				newFile == "") {
				alert("All info of regist cannot be empty");
				return
			}
			var _this = this;
			var options = {
				//target: '#output',          //把服务器返回的内容放入id为output的元素中
				//beforeSubmit: showRequest,  //提交前的回调函数
				//url: url,                 //默认是form的action， 如果申明，则会覆盖
				//clearForm: true,          //成功提交后，清除所有表单元素的值
				//resetForm: true,          //成功提交后，重置所有表单元素的值
				//timeout: 3000,            //限制请求的时间，当请求大于3秒后，跳出请求
				url: "/publishCar",
				type: 'post',
				success: function(res) {
					if (res == "success") {
						_this.cardInfo = {
							cardInfo: '',
							oldPrice: '',
							nowPrice: '',
							mileage: '',
							desc: ''
						}
						alert("publish success");
					}
				}
			}
			$('#fileForm').ajaxSubmit(options);
		}

	}
});
