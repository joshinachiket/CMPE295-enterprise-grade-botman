$(document).ready(function() {

    $("bot-delete-model-container").hide();
    $("#add-bot").click(function(){
        $("#bot-create-model-container").show();
    });

    $("#close-bot-model").click(function(){
        $("#bot-create-model-container").hide();
    });
    $("#create-bot-button").click(function () {
       $("#bot-create-model-container").hide();
    });
});