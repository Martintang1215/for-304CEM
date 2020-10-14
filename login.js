var login=new Vue({
  el: '#main',
  data: {
	loginForm:
	{
		username: '',
		password:''
	},
   registForm:
   {
   	username: '',
   	password:'',
	rePassword:'',
	phone:'',
	email:''
   },
   showForm:true
  },
  mounted:function()
  {
      var _this = this;
  },
  methods: {
	  toRegist:function(){
		   window.location.href="/regist"
	  },
	  toLogin:function(){
	  		   window.location.href="/login"
	  },
	  login:function()
	  {
		  var _this = this;
		  var username = this.loginForm.username;
		  var password= this.loginForm.password;
		  if(username==""||password=="")
		  {
			  alert("The username or password cannot be empty");
			  return
		  }
		  var param={'username':username,'password':password}
		  $.ajax({
				type : "post",
				url : "/login", 
				data:param,
				success : function(data) {//请求的返回成功的方法
					if(data!='error')
					{
						sessionStorage.setItem('userid', data)
						sessionStorage.setItem('username', username);
						location.href='/index'
					}else
					{
						alert("The username or password Incorrect")
					}
				}
			});
	  },
	  regist:function()
	  {
		  var _this = this;
		  for(var p in _this.registForm)
		  {
		   
			   if(_this.registForm[p]=='')
			   {
					alert("All info of regist cannot be empty");
					return
			   }
		   
		  }
		  if(_this.registForm.password!=_this.registForm.rePassword)
		  {
			  alert("The password and Re-type Password are not the same");
			  return
		  }
		  
		  var param = {
		  	'username': _this.registForm.username,
		  	'password': _this.registForm.password,
		  	'email': _this.registForm.email,
		  	'phone': _this.registForm.phone
		  }
		  $.ajax({
		  	type: "post",
		  	url: "/findByUsername",
		  	data: param,
		  	success: function(data) { //请求的返回成功的方法
		  		if (data == 'success') {
		  			$.ajax({
		  				type: "post",
		  				url: "/register",
		  				data: param,
		  				success: function(data) { //请求的返回成功的方法
		  					if (data == 'success') {
		  						alert("Regist success,please login");
								window.location.href="/login"
		  					} else {
		  						alert("Regist error");
		  					}
		  				}
		  			});
		  		}else
		  		{
		  			alert('The username is exist')
		  		}
		  	}
		  });
	  }
  }
});



