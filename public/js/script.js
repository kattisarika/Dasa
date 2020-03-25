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


    $("#signupbtn").click(function(){
        $(".error").hide();
          var emailaddressVal = $("#username").val();
        if(emailaddressVal == '') {
            $("#username").after('<span class="error">Please enter your email address.</span>');
            hasError = true;
        }else if(!emailReg.test(emailaddressVal)) {
            $("#username").after('<span class="error">Enter a valid email address.</span>');
            hasError = true;
        }


        if(hasError == true) { return false; }
    })


    $('#loginbtn').click(function() {  
 
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



      $("#usertaskform").submit(function (event) {
                console.log("All data captured from user task Page");
                event.preventDefault();
                
                var user = $('#hiddenname').val();
                var task1 = $("#task1").val();
                var task2 = $("#task2").val();
                var task3 = $("#task3").val();
                var usermind = $("#usermind").val();
                 console.log(date + "   " + task1 + "   " + task2 + " " + task3 + " " + usermind + user);
                $.ajax({
                    url: '/teenselfesteemthanks/tasklist',
                    cache: false,
                    type: 'POST',
                    data: {
                        user:user,
                        task1: task1,
                        task2: task2,
                        task3:task3,
                        usermind : usermind
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (response.redirectTo && response.msg == 'Just go there please') {
                            window.location = '/teenselfesteemthanks';
                        }
                        console.log("success");
                    }
                });
            });


    $('#editusertaskbtn').click(function(event){
          event.preventDefault();
          console.log("Am i comin in save button");
                var user = $('#hiddenname').val();
                var id = $('#hiddenid').val();
                var task1 = $("#task1").val();
                var task2 = $("#task2").val();
                var task3 = $("#task3").val();
                var usermind = $("#usermind").val();


                  console.log(date + "   " + task1 + "   " + task2 + " " + task3 + " " + usermind + user);

                 $.ajax({
                        url: '/teenselfesteemthanks/tasklist'+id,
                        cache: false,
                        type: 'put',
                        data: {
                            task1: task1,
                            task2: task2,
                            task3:task3,
                            usermind : usermind
                        },
                        dataType: 'json',
                        success: function (response) {  
                           // console.log(response);
                            if (response.redirectTo && response.msg == 'Just go there please') {
                                  window.location = '/teenselfesteemthanks';
                               
                              // if (response.redirectTo && response.msg == 'Just go there please') {
                               //          window.location = '/profile/mywishlist';
                               //              }
                                   console.log("success");
                               }
                             
                           
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                                console.log("Status: " , textStatus , "  ",  "Error: " ,  errorThrown); 
                     }       
                });
 
           });


});