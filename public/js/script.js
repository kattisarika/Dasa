jQuery(document).ready(function ($) {
        $('.showsong1').hide()
        $('.contactus').hide()
        $('.yoursong').hide()
        $('.login').hide()

    $('.toggle').click(function() {
        $('.showsong').hide()
        var $toggled = $(this).attr('href');
        $($toggled).siblings(':visible').hide();
        $($toggled).toggle("slide", {direction: 'up'}, 1000);
        $($toggled).toggle();
        //return false;
  });


    $("#login-form").submit(function(event){
            console.log("All data captured from login page");
            var username = $("#username").val();
            var passwd = $("#password").val();
           if(!$("#username").val()){
            if(username === '' || username.length=== 0){
              if ($("#username").parent().next(".validation").length == 0) {
              $("#username").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter email address</div>");
                  }
             }
            }else {
                $("#username").parent().next(".validation").remove(); // remove it
            }

            if(!$("#password").val()){
           if(pass === '' || pass.length=== 0){
            if ($("#password").parent().next(".validation").length == 0) {
              $("#password").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter password</div>");
                 }
              }
            }else {
                $("#password").parent().next(".validation").remove(); // remove it
            }

            event.preventDefault();
            $("#username").focus();
             $.ajax({
                url: '/login',
                cache: false,
                type: 'POST',
                data: {
                    username: username,
                    password: pass
                },
                dataType: 'json',
                success: function (response) {
                    if (response.redirectTo && response.msg == 'Just go there please') {
                        window.location = '/mywelcomepage';
                    }
                    console.log("success");
            }
       });
  });




$("#signup-form").submit(function(event){
            console.log("All data captured from login page");
            var username = $("#name").val();
            var email = $("#email").val();
            var passwd = $("#password").val();
            var confpassword = $("#confpassword").val();

           



           if(!$("#name").val()){
            if(username === '' || username.length=== 0){
              if ($("#name").parent().next(".validation").length == 0) {
              $("#name").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter email address</div>");
                  }
             }
            }else {
                $("#name").parent().next(".validation").remove(); // remove it
            }

            if(!$("#email").val()){
           if(email === '' || email.length=== 0){
            if ($("#email").parent().next(".validation").length == 0) {
              $("#email").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter password</div>");
                 }
              }
            }else {
                $("#email").parent().next(".validation").remove(); // remove it
            }


            if(!$("#password").val()){
           if(passwd === '' || passwd.length=== 0){
            if ($("#password").parent().next(".validation").length == 0) {
              $("#password").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter password</div>");
                 }
              }
            }else {
                $("#password").parent().next(".validation").remove(); // remove it
            }


              if(!$("#confpassword").val()){
           if(confpassword === '' || confpassword.length=== 0){
            if ($("#confpassword").parent().next(".validation").length == 0) {
              $("#confpassword").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter password</div>");
                 }
              }
            }else {
                $("#confpassword").parent().next(".validation").remove(); // remove it
            }



             if($("#password").val() && $("#confpassword").val()){
              if(passwd === '' || passwd.length=== 0 || confpassword === '' || confpassword.length=== 0){
                  if ($("#password").parent().next(".validation").length == 0) {
              $("#password").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Passwords dont match</div>");
                 }
              }
            }else {
                $("#password").parent().next(".validation").remove(); // remove it
            }  


            event.preventDefault();
            $("#name").focus();
             $.ajax({
                url: '/sign',
                cache: false,
                type: 'POST',
                data: {
                    username: username,
                    password: pass
                },
                dataType: 'json',
                success: function (response) {
                    if (response.redirectTo && response.msg == 'Just go there please') {
                        window.location = '/mywelcomepage';
                    }
                    console.log("success");
            }
       });
  });



    $("#userdetails-form").addEventListener("submit", function(event){
            console.log("All data captured from userdetails page");
            var username = $("#username").val();
            var passwd = $("#password").val();
           if(!$("#username").val()){
            if(username === '' || username.length=== 0){
              if ($("#username").parent().next(".validation").length == 0) {
              $("#username").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter email address</div>");
                  }
             }
            }else {
                $("#username").parent().next(".validation").remove(); // remove it
            }

            if(!$("#password").val()){
           if(pass === '' || pass.length=== 0){
            if ($("#password").parent().next(".validation").length == 0) {
              $("#password").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter password</div>");
                 }
              }
            }else {
                $("#password").parent().next(".validation").remove(); // remove it
            }

            event.preventDefault();
            $("#username").focus();
             $.ajax({
                url: '/login',
                cache: false,
                type: 'POST',
                data: {
                    username: username,
                    password: pass
                },
                dataType: 'json',
                success: function (response) {
                    if (response.redirectTo && response.msg == 'Just go there please') {
                        window.location = '/mywelcomepage';
                    }
                    console.log("success");
            }
       });
  });

$(function () {




$('#changetabbutton').click(function(e){
         e.preventDefault();
        $('#mytabs a[href="#second"]').tab('show');
    })



    $("#home").on("click", function (e) {
        $("#mainpage").hide()
        $("#mainpics").hide()
        $(".yoursong").hide();
        $(".login").hide()
        $(".contactus").hide()
        $(".showsong1").hide();
        $(".showsong").show();


    });

    $("#yoursong").on("click", function (e) {
         $("#mainpage").hide()
        $('.showsong').hide()
        $('.showsong1').hide()
        $(".contactus").hide()
        $(".login").hide()
        $(".yoursong").show();
    });



    $("#login").on("click", function (e) {
         $("#mainpage").hide();
        $("#mainpics").hide()
        $(".showsong").hide()
        $(".showsong1").hide()
        $(".yoursong").hide()
        $(".contactus").hide()
        $(".login").show()
    });


    $('#contactus').on("click", function (e) {
         $("#mainpage").hide()
        $("#mainpics").hide()
        $(".showsong").hide()
        $(".showsong1").hide()
        $(".yoursong").hide()
        $(".login").hide()
        $(".contactus").show()

    });



});
