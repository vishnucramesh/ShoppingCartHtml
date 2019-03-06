var products= [];
var offers= [];
freeItem = {}


var environment= "https://myapplication-664ba.firebaseapp.com/";



fetch(environment + 'products.json')
  .then(response => response.json())
  .then(json => {
    products=json.items;
    displayItems(json.items);
    displayCart(json.items);
  });

  fetch(environment + 'offers.json')
  .then(response => response.json())
  .then(json => {
    offers=json.offers;
    displayOffers(offers);
  });

  displayItems = (data) =>{
    console.log(data)
    var title = document.createElement("H2")                
    var text = document.createTextNode("Items");     
    title.appendChild(text);  
    document.body.appendChild(title);  
    var tableItems = document.createElement('table');
    document.body.appendChild(tableItems);
    for (var i = 0; i < data.length; i++){
        var tr = document.createElement('tr');   
    
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
    
        var element1 = document.createTextNode(data[i].name);
        var element2 = document.createTextNode(data[i].price);
    
        td1.appendChild(element1);
        td2.appendChild(element2);
        tr.appendChild(td1);
        tr.appendChild(td2);
    
        tableItems.appendChild(tr);
    }
  }

  displayOffers = (data) =>{
    var title = document.createElement("H2")                
    var text = document.createTextNode("Offers");     
    title.appendChild(text);  
    document.body.appendChild(title);  
    var offerList = document.createElement('ul');
    document.body.appendChild(offerList);
    for (var i = 0; i < data.length; i++){
        var item = document.createElement('li');   
        if(data[i].category == "per number"){
            if(data[i].type == "price-discount" ){
                var text = document.createTextNode('If you buy ' + data[i].count +' ' + data[i].name +' you will get each for ' + data[i].price);
            }else if(data[i].type == "pay-count-discount"){
                var text = document.createTextNode('If you buy ' + data[i].count +' ' + data[i].name +' you only have to pay for ' + data[i].payCount);
            }
        }else if(data[i].category == "per item"){
            if(data[i].type == "other-item-free" ){
                var text = document.createTextNode('If you buy ' + data[i].count +' ' + data[i].name +' you will get ' + data[i].payCount + ' ' + data[i].itemName+' as free');
            }
        }
        item.appendChild(text);
        offerList.appendChild(item)
    }
  }

  displayCart = (data) => {
    var title = document.createElement("H2")                
    var text = document.createTextNode("What would you like to buy?");     
    title.appendChild(text);  
    document.body.appendChild(title);     
    var tableItems = document.createElement('table');
    document.body.appendChild(tableItems);
    for (var i = 0; i < data.length; i++){
        var tr = document.createElement('tr');   
    
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
    
        var element1 = document.createTextNode(data[i].name);
        var element2 = document.createElement("INPUT");;
        element2.setAttribute("type", "number");
        element2.setAttribute("id", data[i].name);
        element2.value = 0;
        td1.appendChild(element1);
        td2.appendChild(element2);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tableItems.appendChild(tr);
    }
    var button = document.createElement('button');
    var text = document.createTextNode("buy");
    button.appendChild(text);
    button.setAttribute("onclick", "buttonClicked()");
    document.body.appendChild(button);
  }

  buttonClicked= () =>{
      freeItem = {};
      var total = 0;
    for (var i = 0; i < products.length; i++){
        itemCount = document.getElementById(products[i].name).value;
        itemPrice = products[i].price;
        var offerApplied = false;
        if(itemCount != 0){
            console.log(freeItem)
            if(freeItem[products[i].name]){
                if(freeItem[products[i].name]<=itemCount){
                    itemCount=itemCount-freeItem[products[i].name];
                    freeItem[products[i].name]=0;
                }else{
                    itemCount=0;
                    freeItem[products[i].name]=freeItem[products[i].name]-itemCount;
                }     
            }
            for (var j = 0; j < offers.length; j++){
                if(offers[j].name == products[i].name && offers[j].count <= itemCount){
                    if(offers[j].category == "per number"){
                        if(offers[j].type == "price-discount" ){
                            total= total+ (itemCount * offers[i].price);
                            offerApplied = true;
                        }else if(offers[j].type == "pay-count-discount"){
                            var payable = (parseInt(itemCount/offers[j].count)*2)+(itemCount%offers[j].count);
                            total= total+ (payable * itemPrice);
                            offerApplied = true;
                        }
                    }else if(offers[j].category == "per item"){
                        if(offers[j].type == "other-item-free" ){
                            console.log("working")
                            freeItem[offers[j].itemName] = itemCount/offers[j].count;
                            offerApplied = false;
                        }
                    }
                }
            }
            if(offerApplied == false){
                total = total + ( itemCount * itemPrice )
            }
        }
    }
    if(!document.getElementById('total')){
        var totalTitle = document.createElement("h4")
        var text = document.createTextNode("Grand Total");     
        totalTitle.appendChild(text);  
        document.body.appendChild(totalTitle); 
        var title = document.createElement("H2")
        title.setAttribute("id","total")            
        var text = document.createTextNode(total.toString());     
        title.appendChild(text);  
        document.body.appendChild(title);  
        var title = document.createElement("H4")
        title.setAttribute("id","free")       
        if(freeItem.length == 0){
            var text = document.createTextNode(total.toString());     
        } else{
            var text = document.createTextNode(getFreeItems());     
        }    
        title.appendChild(text);  
        document.body.appendChild(title);    
    }else{
        document.getElementById('total').innerHTML= total.toString();   
            document.getElementById('free').innerHTML= getFreeItems();   
    }
    window.scrollTo(0,document.body.scrollHeight);
     
}

getFreeItems = () =>{
    var temp="";
    var items = Object.keys(freeItem);
    for(var i = 0; i< items.length; i++){
        if(temp == ""){
            if(freeItem[items[i]]>0){
                temp = freeItem[items[i]].toString() + ' ' +items[i];
            }
        }else{
            if(freeItem[items[i]]()>0){
                temp = temp + ',' +freeItem[items[i]].toString() + ' ' +items[i];
            }
        }     
    }
    return temp==""?"":'Free!! '+temp;
}