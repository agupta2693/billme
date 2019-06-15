$(document).ready(function() {  
    
    $('#uploadBill').submit(function(e) {
        e.preventDefault(); 

        $("#output").empty().text("Finding Bill Amount...");  
  
        $(this).ajaxSubmit({  
  
            error: function(err) {  
                    $("#output").empty().text('Error: ' + err.responseText);  
            },  
  
            success: function(response) {  
                    console.log(response)  
                    $("#output").empty().text(response);  
            }  
        });  
    });

    $("#selectBill").change(function(){
        $("#output").empty();
    });


}); 