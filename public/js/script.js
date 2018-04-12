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
