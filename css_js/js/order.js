const electron = require('electron');
const { ipcRenderer } = electron;

//<<<<<<<<<<<<<<---globals---<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var dbordernum;
var ocount = 0;
var orderArr = [];
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
document.getElementById('orderbtn').addEventListener('click', () => {

    document.getElementById('orderbtn').disabled = true;
    document.getElementById('submit').disabled = true;
    ocount += 1;
    var newrow = document.createElement("tr");
    newrow.setAttribute("id", "row" + ocount);
    newrow.innerHTML = '<tr id="row' + ocount + '">' +
        '<td>' + ocount + '</td>' +
        '<td><select class="form-control" onchange="itemz(this)" id="categorylist' + ocount + '"></select></td>' +
        '<td id="appendtd'+ocount+'"><select class="form-control" onchange="price(this)" id="menuelist' + ocount + '"></select></td>' +
        '<td><input onchange="totalprice(this)" class="form-control" type="number" name="price" id="itemquantity' + ocount + '" min="1" value="1" required></td>' +
        '<td><input onchange="totalprice(this)" class="form-control" type="number" name="price" id="itemprice' + ocount + '" min="1" value="1" required></td>' +
        '<td><input class="form-control" type="number" name="price" id="totalitemprice' + ocount + '" min="1" value="1" required></td>' +
        '<td>' + '<i onclick="addfun(this)" id="addicon' + ocount + '" class="far fa-plus-square" style="color:rgb(53, 194, 18);display:inline;"></i><i onclick="editfun(this)" id="editicon' + ocount + '" class="far fa-edit" style="color: rgb(255, 238, 0);display:none;"></i><i id="afterediticon' + ocount + '" onclick="afteredit(this)" class="fas fa-pencil-alt" style="color:rgb(53, 194, 18);display:none;"></i><i id="delete' + ocount + '" onclick="odelete(this)" class="fas fa-trash-alt" style="color:rgb(209, 2, 2);display:inline;"></i>' + '</td>' +
        '</tr>';
    document.getElementById('tablebody').appendChild(newrow);
    ipcRenderer.send('loadCategories', true);
     
});
//------------------------------------------------------
function price(a) {
    const index = getIndex(a.id);
    ipcRenderer.send('getPrice', { "index": index, "str": document.getElementById('menuelist' + index).value });
};
//------------------------------------------------------
function itemz(a) {
    const index = getIndex(a.id);
    ipcRenderer.send('getItems', { "index": index, "str": document.getElementById('categorylist' + index).value });
};
//------------------------------------------------------
function totalprice(a) {
    const index = getIndex(a.id);
    var price = document.getElementById('itemprice' + index).value;
    var quantity = document.getElementById('itemquantity' + index).value;
    document.getElementById('totalitemprice' + index).value = price * quantity;
};
//------------------------------------------------------
function addfun(a) {
    const index = getIndex(a.id);
    orderArr.push({
        "index": index,
        "category": document.getElementById('menuelist' + index).value,
        "item": document.getElementById('categorylist' + index).value,
        "price": parseFloat(document.getElementById('itemprice' + index).value),
        "quantity": parseFloat(document.getElementById('itemquantity' + index).value),
        "totalprice": parseFloat(document.getElementById('totalitemprice' + index).value)
    });
    document.getElementById('orderbtn').disabled = false;
    document.getElementById('addicon' + index).style.display = "none";
    document.getElementById('editicon' + index).style.display = "inline";
    document.getElementById('afterediticon' + index).style.display = "none";
    document.getElementById('menuelist' + index).disabled = true;
    document.getElementById('categorylist' + index).disabled = true;
    document.getElementById('itemprice' + index).disabled = true;
    document.getElementById('itemquantity' + index).disabled = true;
    document.getElementById('totalitemprice' + index).disabled = true;
    document.getElementById('submit').disabled = false;
    // console.log(orderArr);



};
//------------------------------------------------------
function editfun(a) {
    const index = getIndex(a.id);
    document.getElementById('orderbtn').disabled = false;
    document.getElementById('addicon' + index).style.display = "none";
    document.getElementById('editicon' + index).style.display = "none";
    document.getElementById('afterediticon' + index).style.display = "inline";
    document.getElementById('menuelist' + index).disabled = false;
    document.getElementById('categorylist' + index).disabled = false;
    document.getElementById('itemprice' + index).disabled = false;
    document.getElementById('itemquantity' + index).disabled = false;
    document.getElementById('totalitemprice' + index).disabled = false;


};
//------------------------------------------------------
function afteredit(a) {
    const index = getIndex(a.id);
    orderArr[index - 1] = {
        "index": index,
        "type": document.getElementById('menuelist' + index).value,
        "price": parseFloat(document.getElementById('itemprice' + index).value),
        "quantity": parseFloat(document.getElementById('itemquantity' + index).value),
        "total": parseFloat(document.getElementById('totalitemprice' + index).value)
    }
    document.getElementById('orderbtn').disabled = false;
    document.getElementById('addicon' + index).style.display = "none";
    document.getElementById('editicon' + index).style.display = "inline";
    document.getElementById('afterediticon' + index).style.display = "none";
    document.getElementById('menuelist' + index).disabled = true;
    document.getElementById('categorylist' + index).disabled = true;
    document.getElementById('itemprice' + index).disabled = true;
    document.getElementById('itemquantity' + index).disabled = true;
    document.getElementById('totalitemprice' + index).disabled = true;

}
//-----Save---------------------------------------------
function save() {
    var saveobj = {
        "by": document.getElementById('bylist').value,
        "client": document.getElementById('clientlist').value,
        "address": document.getElementById('address').value,
        "order": orderArr,
        "total": parseFloat(document.getElementById('finaltotal').value),
        "discount": parseFloat(document.getElementById('finaldiscount').value),
        "afterdiscount": parseFloat(document.getElementById('finalarea').value),
        "in_progress": document.getElementById('progress').checked
    }

    ipcRenderer.send('saveOrder', saveobj);
    ipcRenderer.on('savedOrder', (event, lol) => { alert(lol) })
    // console.log(saveobj);
    location.reload();
};
//------------------------------------------------------
function odelete(a) {
    const index = getIndex(a.id);
    orderArr.splice(index - 1, 1);
    document.getElementById('row' + index).remove();
    if (document.getElementById('orderbtn').disabled = true) {
        document.getElementById('orderbtn').disabled = false;
    }
    // console.log(orderArr);
}
//------------------------------------------------------
function getIndex(id) {
    return id.match(/\d+/g).map(Number)[0];
}
//------------------------------------------------------
function submitfn() {
    var total = 0;
    if (orderArr.length != 0) {
        document.getElementById('orderbtn').disabled = true;
        document.getElementById('save').disabled = false;
        orderArr.forEach(element => {
            total += parseFloat(element.totalprice);
        });
        document.getElementById('finaltotal').value = total;
        discountfn(total);
    } else {
        alert('لم يتم ادخال بيانات');
    }
}
// Discount------------------------------------------------------
function discountfn(total) {
    document.getElementById('finalarea').value = total - parseFloat(document.getElementById('finaldiscount').value) * 0.01 * total;
}


//---------------------------------------------------------------------------------------------------------------------
document.getElementById('discountcheck').onchange = function () {
    document.getElementById('finaldiscount').disabled = !this.checked;
};
document.getElementById('addresscheck').onchange = function () {
    document.getElementById('address').disabled = this.checked;
    document.getElementById('clientlist').disabled = !this.checked;
};
//----------------------------------------------------------------------------------------------------------------------




window.addEventListener('DOMContentLoaded', (event) => {
    ipcRenderer.send('loadAccounts', true);
    ipcRenderer.send('loadClients', true);




});

ipcRenderer.on('loadedAccounts', (event, rec) => {
    rec.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element._doc.user + " (" + element._doc.state + ")";
        if (element._doc.state == 'user') { Option.defaultSelected = true }
        document.getElementById('bylist').add(Option);

    });
});

ipcRenderer.on('loadedClients', (event, rec) => {
    rec.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element._doc.client;
        if (element._doc.state == 'user') { Option.defaultSelected = true }
        document.getElementById('clientlist').add(Option);

    });
});


ipcRenderer.on('loadedItems', async (event, rec) => {
    var price = rec[0]._doc.price;
    document.getElementById('itemprice' + ocount).value = price;
    document.getElementById('totalitemprice' + ocount).value = price;
    rec.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element._doc.item;
        document.getElementById('menuelist' + ocount + '').add(Option);


    });
});

ipcRenderer.on('loadedCategories', async (event, rec) => {
    rec.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element;
        document.getElementById('categorylist' + ocount + '').add(Option);     
    });
    
})

ipcRenderer.on('sentPrice', (event, priceobj) => {
    document.getElementById('itemprice' + priceobj.index).value = priceobj.item[0]._doc.price;
    document.getElementById('totalitemprice' + priceobj.index).value = priceobj.item[0]._doc.price * document.getElementById('itemquantity' + priceobj.index).value;

})
ipcRenderer.on('sentItems', (event, recobj) => {
    restoremenu(recobj.index)
    recobj.items.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element._doc.item;
        document.getElementById('menuelist' + ocount + '').add(Option);     
    });
    document.getElementById('itemprice' + recobj.index).value = recobj.items[0]._doc.price;
    document.getElementById('totalitemprice' + recobj.index).value = recobj.items[0]._doc.price * document.getElementById('itemquantity' + recobj.index).value;

})

function restoremenu(index){
    document.getElementById("menuelist"+index+"").remove()
    const newmenu = document.createElement("select")
    newmenu.setAttribute("id","menuelist"+index+"")
    newmenu.setAttribute("class","form-control")
    newmenu.setAttribute("onchange","price(this)")
    document.getElementById("appendtd"+index+"").appendChild(newmenu)
}