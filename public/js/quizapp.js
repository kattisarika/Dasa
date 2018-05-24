//on StartQuiz click, its an empty div with the next button present
//when i click on Next button:-
// It takes me to the questionsArray[0],
//loops through the questionsArray ,builds the buildeachchoiceHTML





var questionsArray = [
    {
        questionText: "Inside which HTML element do we put the JavaScript?",
        choices: ["&#60;js&#62;", "&#60;javascript&#62;", "&#60;scripting&#62;", "&#60;script&#62;"],
        answer: 3
    },

    {
        questionText: "What is the correct JavaScript syntax to change the content of the HTML element below? <p id=\"demo\">This is a demonstration.</p>",
        choices: ["document.getElementByName('p').innerHTML = 'Hello World!';", "document.getElementById('demo').innerHTML = 'Hello World!';", "#demo.innerHTML='Hello World!'", "document.getElement('p').innerHTML = 'Hello World!';"],
        answer: 1
    },
    {
        questionText: "Where is the correct place to insert a JavaScript?",
        choices: ["Both the &#60;head&#62; section and the &#60;body&#62; section are correct", "The &#60;head&#62; section", "The &#60;body&#62; section"],
        answer: 0
    },
    {
        questionText: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choices: ["&#60;script href='xxx.js'&#62;", "&#60;script src='xxx.js'&#62;", "&#60;script name='xxx.js'&#62;"],
        answer: 1
    },
    {
        questionText: "The external JavaScript file must contain the <script> tag",
        choices: ["True", "False"],
        answer: 1
    },
    {
        questionText: "How do you write \"Hello World\" in an alert box?",
        choices: ["msg('Hello World');", "msgBox('Hello World');", "alertBox('Hello World');", "alert('Hello World');"],
        answer: 3
    },
    {
        questionText: "How do you create a function in JavaScript?",
        choices: ["function=myFunction&#40;&#41;", "function:myFunction", "function myFunction&#40;&#41; "],
        answer: 2
    },
    {
        questionText: "How do you call a function named \"myFunction\"?",
        choices: ["call myFunction()", "myFunction()", "call function myFunction()"],
        answer: 1
    },
    {
        questionText: "How to write an IF statement in JavaScript?",
        choices: ["if i = 5", "if i = 5 then", "if i == 5 then", "if (i == 5)"],
        answer: 1
    },
    {
        questionText: "How to write an IF statement for executing some code if \"i\" is NOT equal to 5?",
        choices: ["if (i &#60;&#62; 5)", "if (i != 5)", "if i &#60;&#62; 5", "if i =! 5 then "],
        answer: 1
}]

var currentQuestionNumber = 0;
var totalNumberOfQuestion = questionsArray.length;
var totalNumberOfCorrectAnswers = 0;
var checkedanswer = "";
var score = 0;
var answerSelected = "";
var msg = "";
var questionNum = "";




function quizQuestionDisplay(questionsArray, answerselected) {

    //console.log(questionsArray[currentQuestionNumber]);


    $('#question').text(questionsArray[currentQuestionNumber].questionText);
    $('#choices').empty();
    $('.question-number').empty();
    //2.2 - the get the total number of choices for the current question
    var totalNumberOfChoices = questionsArray[currentQuestionNumber].choices.length;
    //2.3 - loop through all the choices and append them to the choices container
    //console.log('totalNumberOfChoices' + totalNumberOfChoices);

    for (var i = 0; i < totalNumberOfChoices; i++) {
        //console.log("am i coming in the for loop");
        //2.3.1 - loop thru the answer choices and create a dynamically generated row for each of them
        var buildEachChoiceHTML = "<input type='radio' class='option' name='option' value=" + i + " required='required'> " + questionsArray[currentQuestionNumber].choices[i] + "</br>";
        //2.3.2 append that row to the choices container in html
        //console.log(buildEachChoiceHTML);
        $('#choices').append(buildEachChoiceHTML);

    }

    questionNumber = "<span>" + "Question" + " " + (currentQuestionNumber + 1) + " " + "of " + 10 + "</span>";
    $('.question-number').append(questionNumber);






    currentQuestionNumber++;

    if (currentQuestionNumber === questionsArray.length) {
        $('.quiz-section').hide();
        $('.results').show();
        if (score < 5) {
            msg = "Please try again, It seems like you are in the beginning of your journey!";
        } else if (score > 5 && score < 8) {
            msg = "Well Done! Hang in there and keep practicing";
        } else {
            msg = "You made it to the next level";
        }
        var buildResultHTML = "<span>" + msg + " Your score is " + score + "</span>";
        $('.results').append(buildResultHTML);
    }




}



$(document).ready(function (event) {

    $('.quiz-section').hide();
    $('.results').hide();

    $('#question').empty();
    $('#choices').empty();

    $(".button-start").click(function (event) {
        $('.results').hide();
        $('.start').hide();
        $('.quiz-section').show();
        quizQuestionDisplay(questionsArray);
    });

    $('.button-next').click(function () {
         var hasError = false;

        answerselected = $("input[class='option']:checked").val();
        if (typeof answerselected === 'undefined' || !answerselected) {
                // $("#questionNumberDisplay1").after('<span class="error">Select one of the multiple choice questions</span>');

            //alert("Please select one of the options above");
        } else {
           // $("#questionNumberDisplay1").remove(); 
            quizQuestionDisplay(questionsArray, answerselected);
            // alert($('input:radio[name=option]:checked').val());
            console.log(answerselected);
            if (parseInt(answerselected) === questionsArray[currentQuestionNumber].answer) {
                score++;

            }
        }
        
    });

    $(".button-try").click(function (event) {
        currentQuestionNumber = 0;
        totalNumberOfQuestion = questionsArray.length;
        totalNumberOfCorrectAnswers = 0;
        checkedanswer = "";
        score = 0;
        answerSelected = "";
        msg = "";
        questionNum = "";
        $('.results').hide();
        $('.quiz-section').hide();
        $('.start').show();

    });
})

//$('document').on('click', '.button-next', quizQuestionDisplay(questionsArray));
