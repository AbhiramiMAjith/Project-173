var userid = "null"

AFRAME.registerComponent("markerhandler",{
    init:async function(){

        if (userid === "null"){
            this.askUserId()
        }
        var toys = await this.getToys()

        this.el.addEventListener("markerFound",()=>{
            if (userid !== "null"){
                var markerId = this.el.id
                console.log("Marker is found")
                this.handleMarkerFound(toys, markerId)
            }
        })
        this.el.addEventListener("markerLost",()=>{
            console.log("Marker is lost")
            this.handleMarkerLost()
        })
    },
    handleMarkerFound:function(toys, markerId){

        var toy = toys.filter(toy => toy.id=== markerId)[0]

        if(toy.is_out_of_stock === true){
            swal({
                icon : "warning",
                title : toy.toy_name.toUpperSace(),
                text : "This toy is out of stock",
                time : 2500,
                buttons : false
            })
        }
        else{
            var model = document.querySelector(`model-${toy.id}`)
            model.setAttribute("position", toy.model_geometry.position)
            model.setAttribute("rotation", toy.model_geometry.rotation)
            model.setAttribute("scale", toy.model_geometry.scale)

            model.setAttribute("visible", true)

            var description = document.querySelector(`description-${toy.id}`)
            description.setAttribute("visible", true)

            var pricePlane = document.querySelector(`price-${toy.id}`)
            pricePlane.setAttribute("visible", true)

            var buttonDiv = document.getElementById("button-div")
            buttonDiv.style.display = "flex"

            var orderSummaryButton = document.getElementById("order-summary-button")
            var orderButton = document.getElementById("order-button")

            var payButton = document.getElementById("pay-button")

            orderButton.addEventListener("click",()=>{
                var uid
                userid <= 9 ?(uid=`UO${userId}`) : `T${userId}`
                this.handleOrder(userId, toy)
                swal({
                    icon:"warning",
                    title : "Thanks for order!",
                    text : "  ",
                    buttons : false,
                    timer : 2000
                })
            })

            orderSummaryButton.addEventListener("click",()=>{
                this.handleOrderSummary()
            })
            payButton.addEventListener("click",()=>this.handlePayment())
        }
    },

    handleOrder:function(userNumber, toy){
        firebase
        .firestore()
        .collection("users")
        .doc(userNumber)
        .get()
        .then(doc =>{
            var details = doc.data()

            if (details["current_orders"][toy.id]){
                details["current_orders"][toy.id]["quantity"] += 1

                var current_quantity = details["current_orders"][toy.id]["quantity"]

                details["current_orders"][toy.id]["subtotal"] = current_quantity*toy.price
            }
            else{
                details["current_orders"][toy.id] = {
                    item : toy.toy_name,
                    price : toy.price,
                    quantity : 1,
                    subtotal : dish.price * 1
                }
            }
            details.total_bill += toy.price

            firebase
                .firestore()
                .collection("toys")
                .doc(doc.id)
                .update(details)
        })
    },

    handleMarkerLost: function(){
        var buttonDiv = document.getElementById("button-div")
        buttonDiv.style.display = "none"
    },
    getToys : async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get(then(snap =>{
            return snap.docs.map(doc => doc.data())
        }))
    },
    askUserId : function(){
        swal({
            title : "PLAY WITH TOYS!",
            content :{
                element : "input",
                attributes : {
                    placeHolder : "Type your user id :",
                    type : "number",
                    min : 1
                }
            },
            closeOnClickOutside : false,

        }).then(inputValue =>{
            userid = inputValue
        })
    },
    getOrderSummary : async function(uid){
        return await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc =>{doc.data})
    },
    handleOrderSummary : async function(){
        var uid
        userid <= 9 ? (uid = `UO${userid}`) : `U${userid}`

        var orderSummary = await this.getOrderSummary(userid)

        var modalDiv = getElementById("modal-div")
        modalDiv.style.display = "flex"

        var tableBodyTag = document.getElementById("bill-table-body")

        tableBodyTag.innerHTML = ""

        var current_orders = Object.keys(orderSummary.current_orders)

        current_orders.map(i=>{
            var tr= document.createElement('tr')

            var item = document.createElement("td")
            var price = document.createElement("td")
            var quantity = document.createElement("td")
            var subtotal = document.createElement("td")

            item.innerHTML = orderSummary.current_orders[i].item

            price.innerHTML = '$' + orderSummary.current_orders[i].price        
            price.setAttribute('class', "text-center")
    
            quantity.innerHTML = orderSummary.current_orders[i].quantity        
            quantity.setAttribute('class', "text-center")
    
            subtotal.innerHTML = '$' + orderSummary.current_orders[i].subtotal        
            subtotal.setAttribute('class', "text-center")
    
            tr.appendChild(item)
            tr.appendChild(price)
            tr.appendChild(quantity)
            tr.appendChild(subtotal)
    
            tableBodyTag.appendChild(tr)
        })

        var totalTr = document.createElement("tr")
    
        var td1 = document.createElement("td")
        td1.setAttribute("class", "no-line")
    
        var td2 = document.createElement("td")
        td2.setAttribute("class", "no-line")
    
        var td3 = document.createElement("td")
        td3.setAttribute("class", "no-line text-center")
    
        var strongTag = document.createElement("strong")
        strongTag.innerHTML= 'Total'
    
        td3.appendChild(strongTag)
    
        var td4 = document.createElement("td")
        td4.setAttribute('class', 'no-line text-right')
        td4.innerHTML = "$" + orderSummary.total_bill
    
        totalTr.appendChild(td1)
        totalTr.appendChild(td2)
        totalTr.appendChild(td3)
        totalTr.appendChild(td4)

        tableBodyTag.appendChild(totalTr)
    },
    handlePayment : async function(){
        document.getElementById("modal-div").style.display = "none"

        var uid
        userid <= 9 ? (uid = `UO${userid}`) : `  UO${userid}`

        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
            current_orders : {},
            total_bill : 0
        })
        .then(()=>{
            swal({
                icon : "succes",
                title : 'Thanks for Paying',
                text : "We have u enjoy the toys",
                timer : 2500,
                buttons : false
            })
        })
    },
    handleRating : async function(dish){
        var uid
        userid <= 9 ? (uid = `UO${userid}`) : `U${userid}`

        var orderSummary = this.getOrderSummary(uid)

        var current_orders = Object.keys(orderSummary.current_orders)

        if (current_orders.length > 0 && current_orders == toy.id){
            document.getElementById("rating-modal-div").style.display == 'flex'
            document.getElementById("rating-input").value =  "0"
            document.getElementById("feedback-input").value = "0"

            var saveRatingButton = document.getElementById("save-rating-button")
            saveRatingButton.addEventListener("click",()=>{
                document.getElementById("rating-modal-div").style.display = "none"

                var rating = document.getElementById("rating-input").value
                var feedback = document.getElementById("feedback-input").value

                firebase
                .firestore()
                .collection("toys")
                .doc(toy.id)
                .update({
                    review : feedback,
                    rating : rating
                })
                .then(()=>{
                    swal({
                        icon : success,
                        title : 'Thanks for rating!',
                        text : "Bye bye",
                        timer : 2500,
                        buttons : false
                    })
                })
            })
        }
    }
})