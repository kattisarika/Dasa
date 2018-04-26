$(document).ready(function() { 
 
    $('#submit').click(function() {  
 
        $(".error").hide();
        var hasError = false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        var emailaddressVal = $("#username").val();
        if(emailaddressVal == '') {
            $("#username").after('<span class="error">Please enter your email address.</span>');
            hasError = true;
        }else if(!emailReg.test(emailaddressVal)) {
            $("#username").after('<span class="error">Enter a valid email address.</span>');
            hasError = true;
        }


        if(hasError == true) { return false; }
 
    });


    $('#login').click(function() {  
 
        $(".error").hide();
        var hasError = false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        var emailaddressVal = $("#username").val();
        if(emailaddressVal == '') {
            $("#username").after('<span class="error">Please enter your email address.</span>');
            hasError = true;
        }else if(!emailReg.test(emailaddressVal)) {
            $("#username").after('<span class="error">Enter a valid email address.</span>');
            hasError = true;
        }


        if(hasError == true) { return false; }
 
    });


    $('#userdetailsbtn').click(function() {

    	$(".error").hide();
        var hasError = false;

         var isChecked = $('#rdSelect').prop('checked');

    });

    $('#resetbtn').click(function(){
    	  $(".error").hide();
       	  var hasError = false;

       	  var emailaddressVal = $("#username").val();
        if(emailaddressVal == '') {
            $("#username").after('<span class="error">Please enter your email address.</span>');
            hasError = true;
        }else if(!emailReg.test(emailaddressVal)) {
            $("#username").after('<span class="error">Enter a valid email address.</span>');
            hasError = true;
        }
        
         var password = $("#updatepassword").val();
         if(password == '') {
         	$("#updatepassword").after('<span class="error">Please enter your password.</span>');
            hasError = true;
         }
         var password1 = $("#confpassword").val();
         if(password1 == '') {
         	$("#confpassword").after('<span class="error">Please enter your password.</span>');
            hasError = true;
         }

        


        if(hasError == true) { return false; }


    });
});