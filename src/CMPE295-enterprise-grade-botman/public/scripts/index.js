$(document).ready(function() {
	$("#cancel-button").click(function(){
       $("#login-container").hide();
    });
	
	$("#login-button-section").click(function(){
       $("#login-container").show();
    });
	
	$("#login-button-header").click(function(){
       $("#login-container").show();
    })
});