AFRAME.registerComponent("create-buttons",{
    init:function(){
        var button1 = document.createElement("button")
        button1.innerHTML="ORDER NOW"
        button1.setAttribute("id","order-button")
        button1.setAttribute("class","btn btn-danger ml-3 mr-3")

        var button2 = document.createElement("button")
        button1.innerHTML="ORDER SUMMARY"
        button1.setAttribute("id","order-summary-button")
        button1.setAttribute("class","btn btn-danger ml-3 mr-3")

        var buttonDiv = document.getElementById("button-div")
        buttonDiv.appendChild(button1)
        buttonDiv.appendChild(button2)
    }
})