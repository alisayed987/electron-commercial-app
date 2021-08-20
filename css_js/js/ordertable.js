const electron = require('electron');
const { ipcRenderer } = electron;

//<<<<<<<<<<<<<<---globals---<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
let pages = 0;
let page_size = 5;
let current_page = 1;
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

window.onload = (e)=>{
    ipcRenderer.send("get-query-options")
}

window.addEventListener('DOMContentLoaded', (event) => {
    updatePages()
    query();
});
//--------------------------------------------------------
function pageSizeChange(athis){
    page_size = parseInt(athis.value);
    
    restoreTable()
    query()
    updatePages()

}
//----------------------------------------------------------------------------------

// function getpage(N,S){
//     ipcRenderer.send('loadOrders', {pageNum:N,pageSize:S});
// }
// Main function ----------------------------------------------------------------------------------

ipcRenderer.on('loadedOrders', (event, rec) => {
    restoreTable()
    const recArray = JSON.parse(rec);
    var ocount = 0;
    recArray.forEach(element => {
        ocount += 1;
        var newrow = document.createElement("tr");
        newrow.setAttribute("id", "row" + ocount);
        newrow.setAttribute("data-toggle","collapse");
        newrow.setAttribute("data-target","#order"+ocount);
        newrow.setAttribute("class","accordian-toggle");
        newrow.innerHTML = '<tr> ' +
            '<td id="id'+ocount+'"style="display:none">'+element._id+'</td>'+
            '<td>' + ocount + '</td>' +
            '<td>'+element.by+'</td>'+
            '<td>'+(element.name?element.name:'-')+'</td>'+
            '<td>'+(element.client?element.client:'-')+'</td>'+
            '<td>'+(element.address?element.address:'-')+'</td>'+
            '<td>'+((new Date(element.time_stamp)).toLocaleTimeString('it-IT'))+'</td>'+
            '<td id="showOrder'+ocount+'">' +'<i class="far fa-caret-square-down"></i>'+'order' +'</td>'+
            '<td>'+element.total+'</td>'+
            '<td>'+(element.discount?element.discount:'-')+'</td>'+
            '<td>'+(element.afterdiscount?element.afterdiscount:'-')+'</td>'+
            '<td>'+ (element.in_progress?'<i class="fa fa-check" aria-hidden="true"></i>':'<i class="fa fa-times" aria-hidden="true"></i>') +'</td>'+
            '<td>'+ (element.paid?'<i class="fa fa-check" aria-hidden="true"></i>':'<i class="fa fa-times" aria-hidden="true"></i>') +'</td>'+
            '<td>' +'<i onclick="editfun(this)" id="editicon' + ocount + '" class="far fa-edit" style="color: rgb(255, 238, 0);display:inline;"></i><i id="afterediticon' + ocount + '" onclick="afteredit(this)" class="fas fa-pencil-alt" style="color:rgb(53, 194, 18);display:none;"></i><i id="delete' + ocount + '" onclick="odelete(this)" class="fas fa-trash-alt" style="color:rgb(209, 2, 2);display:inline;"></i>' + '</td>' +
            '</tr>'
        // console.log(newrow)
        document.getElementById('tablebody').appendChild(newrow);

        var collapse_row = document.createElement("tr");
        var tdata = document.createElement("td");
        tdata.setAttribute("colspan","12");
        tdata.setAttribute("class","hiddenRow");
        tdata.innerHTML += 
            '<div id="order'+ ocount+'" class="accordian-body collapse" style="width:100%">'+
            // '<pre>'+'-'+ele.index+'-   '+'صنف:'+ ele.type +'          '+'سعر:'+ ele.price +'          '+ 'كمية:' + ele.quantity+'          ' +'السعر الكلي:'+ele.totalprice+ '</pre>'+
            '<table style="margin:auto;width:60%; min-width:300px;"><thead><tr>'+
                        '<th>-</th>'+
                        '<th>الفئة</th>'+
                        '<th>الصنف</th>'+
                        '<th>الكمية</th>'+
                        '<th>السعر</th>'+
                        '<th>السعر الكلي</th>'+
                    '</tr></thead>'+
                '<tbody id="table'+ocount+'">'+'</tbody>'+
            '</table>'+
            '</div>'

        collapse_row.appendChild(tdata);
        document.getElementById('tablebody').appendChild(collapse_row);
        element.order.forEach((ele,index) => {
            var orderRow = document.createElement("tr");
            var inner_td = document.createElement("td");
            orderRow.innerHTML='<tr> ' +
            '<td>' + (index+1) + '</td>' +
            '<td>'+ele.category+'</td>'+
            '<td>'+ele.item+'</td>'+
            '<td>'+ele.quantity+'</td>'+
            '<td>'+ele.price+'</td>'+
            '<td>'+ele.total+'</td>'+
            '</tr>'
            // console.log(orderRow)
            document.getElementById("table"+ocount).append(orderRow)
        });
        

    });
});

//------------------------------------------------------

// //------------------------------------------------------
function editfun(these) {
    const offset = getIndex(these.id);
    // console.log(document.getElementById('id'+offset).innerHTML);
    ipcRenderer.send('editWindow',document.getElementById('id'+offset).innerHTML);

};
//------------------------------------------------------------------
function odelete(a) {
    console.log(a.id)
    const offset = getIndex(a.id);
    var answer = window.confirm("تاكيد المسح؟");
    if(answer){
        ipcRenderer.send('deleteOrder',document.getElementById('id'+offset).innerHTML)
        reload()
    }
}
// //------------------------------------------------------
function getIndex(id) {
    return id.match(/\d+/g).map(Number)[0];
}
//-------------------------------------------------------
function reload(){
    location.reload();
}
// delete table contents --------------------------------------------------------------
function restoreTable(){
    document.getElementById("tablebody").remove()
    const newbody = document.createElement("tbody")
    newbody.setAttribute("id","tablebody")
    document.getElementById("maintable").appendChild(newbody)
}
//table pagination-------------------------------------------
function updatePages(){
    var qobj = {}
    if(document.getElementById("q_by").value!="-")  qobj["by"] = document.getElementById("q_by").value
    if(document.getElementById("q_client").value!="-")  qobj["client"] = document.getElementById("q_client").value
    if(document.getElementById("q_name").value!="-")  qobj["name"] = document.getElementById("q_name").value
    qobj["in_progress"] = document.getElementById("q_progress").checked
    qobj["paid"] = document.getElementById("q_paid").checked
    var date = document.getElementById("q_date").value
    if(date == "day1") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate());
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day2") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-1);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day3") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-2);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day7") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-6);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day15") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-14);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "month") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-29);
        qobj["time_stamp"] = {"$gte": d}
    }
    console.log(qobj)
    ipcRenderer.send('countQuery',qobj)
    ipcRenderer.on('countedQuery',(e,rec)=>{
        console.log("rec",rec)
        current_page = 1;
        pages = Math.ceil(rec/page_size)
        document.getElementById("pagespan").innerHTML = " صفحة "+current_page + " من " +pages 
    })
}

// Next & previous buttons ----------------------------------------------------------------------
function previousPage(){
    if(current_page>1) {
        current_page-=1;
        restoreTable();
        // getpage(current_page,page_size)
        query()
        document.getElementById("pagespan").innerHTML = " صفحة "+current_page + " من " +pages 
    }
}

function nextPage(){
    if(current_page<pages) {
        current_page+=1;
        restoreTable();
        // getpage(current_page,page_size);
        query()
        document.getElementById("pagespan").innerHTML = " صفحة "+current_page + " من " +pages 
}
}

// Date-------------------------------------------------------------------------------------------


// Query -----------------------------------------------------------------------------------------
ipcRenderer.on("send-query-data",(event,res)=> {
    res.by.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element;
        document.getElementById('q_by').add(Option);
    });
    res.client.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element;
        document.getElementById('q_client').add(Option);
    });
    res.name.forEach(element => {
        var Option = document.createElement("option");
        Option.text = element;
        document.getElementById('q_name').add(Option);
    });
})

function query(){
    var qobj = {}
    if(document.getElementById("q_by").value!="-")  qobj["by"] = document.getElementById("q_by").value
    if(document.getElementById("q_client").value!="-")  qobj["client"] = document.getElementById("q_client").value
    if(document.getElementById("q_name").value!="-")  qobj["name"] = document.getElementById("q_name").value
    qobj["in_progress"] = document.getElementById("q_progress").checked
    qobj["paid"] = document.getElementById("q_paid").checked
    var date = document.getElementById("q_date").value
    if(date == "day1") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate());
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day2") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-1);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day3") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-2);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day7") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-6);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "day15") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-14);
        qobj["time_stamp"] = {"$gte": d}
    }
    else if(date == "month") {
        var d = new Date()
        d.setHours(0,0,0,0)
        d.setDate(d.getDate()-29);
        qobj["time_stamp"] = {"$gte": d}
    }
    console.log(qobj)
    ipcRenderer.send('loadOrders', {pageNum:current_page,pageSize:page_size,query:qobj});
    
}


// Jquery -----------------------------------------------------------------------------------------
$('.accordian-body').on('show.bs.collapse', function () {
    $(this).closest("table")
        .find(".collapse.in")
        .not(this)
})

document.getElementById('tst').addEventListener('click',e =>{
    window.close()
    
})
