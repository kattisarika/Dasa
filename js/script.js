jQuery(document).ready(function ($) {
    $('.showsong1').hide()
    $('.contactus').hide()
    $('.yoursong').hide()
    $('.login').hide()
    $('a[href^="#"]').on('click', function (event) {
        $(".showsong").hide();
        $('.contactus').hide()
        $('.yoursong').hide()
        $('.login').hide()
        var target = $(this).attr('href');
        console.log(target);
        $('.showsong1' + target).toggle();
    });

});

$(function () {

    $("#home").on("click", function (e) {
        $(".yoursong").hide()
        $(".login").hide()
        $(".contactus").hide()
        $(".showsong1").hide();
        $(".showsong").show();


    });

    $("#yoursong").on("click", function (e) {
        $('.showsong').hide()
        $('.showsong1').hide()
        $(".contactus").hide()
        $(".login").hide()
        $(".yoursong").show();
    });



    $("#login").on("click", function (e) {
        $(".showsong").hide()
        $(".showsong1").hide()
        $(".yoursong").hide()
        $(".contactus").hide()
        $(".login").show()
    });


    $('#contactus').on("click", function (e) {
        $(".showsong").hide()
        $(".showsong1").hide()
        $(".yoursong").hide()
        $(".login").hide()
        $(".contactus").show()

    });



});
