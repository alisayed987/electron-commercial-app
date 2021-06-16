const electron = require('electron');
const { ipcRenderer } = electron;

//<<<<<<<<<<<<<<---globals---<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



window.addEventListener('DOMContentLoaded', (event) => {
   getpage(1,10);
});
//----------------------------------------------------------------------------------

function getpage(N,S){
    ipcRenderer.send('loadOrders', {pageNum:N,pageSize:S});
}
//----------------------------------------------------------------------------------

ipcRenderer.on('loadedOrders', (event, rec) => {
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
            '<td>'+element.client+'</td>'+
            '<td>'+element.address+'</td>'+
            '<td id="showOrder'+ocount+'">' +'<i class="far fa-caret-square-down"></i>'+'order' +'</td>'+
            '<td>'+element.total+'</td>'+
            '<td>'+element.discount+'</td>'+
            '<td>'+element.afterdiscount+'</td>'+
            '<td>'+element.in_progress+'</td>'+
            '<td>' +'<i onclick="editfun(this)" id="editicon' + ocount + '" class="far fa-edit" style="color: rgb(255, 238, 0);display:inline;"></i><i id="afterediticon' + ocount + '" onclick="afteredit(this)" class="fas fa-pencil-alt" style="color:rgb(53, 194, 18);display:none;"></i><i id="delete' + ocount + '" onclick="odelete(this)" class="fas fa-trash-alt" style="color:rgb(209, 2, 2);display:inline;"></i>' + '</td>' +
            '</tr>'

        document.getElementById('tablebody').appendChild(newrow);

        var collapse_row = document.createElement("tr");
        var tdata = document.createElement("td");
        tdata.setAttribute("colspan","10");
        tdata.setAttribute("class","hiddenRow");
        
        element.order.forEach(ele => {
            tdata.innerHTML += 
            '<div id="order'+ ocount+'" class="accordian-body collapse">'+
            '<pre>'+'-'+ele.index+'-   '+'صنف:'+ ele.type +'          '+'سعر:'+ ele.price +'          '+ 'كمية:' + ele.quantity+'          ' +'السعر الكلي:'+ele.totalprice+ '</pre>'+
            '</div>'
        });
        collapse_row.appendChild(tdata);
        document.getElementById('tablebody').appendChild(collapse_row);

    });
});

//------------------------------------------------------

// //------------------------------------------------------

// //------------------------------------------------------
function editfun(these) {
    const offset = getIndex(these.id);
    // console.log(document.getElementById('id'+offset).innerHTML);
    ipcRenderer.send('editWindow',document.getElementById('id'+offset).innerHTML);

};
//------------------------------------------------------------------
function odelete(a) {
    const offset = getIndex(a.id);
    var answer = window.confirm("تاكيد المسح؟");
    if(answer){
        ipcRenderer.send('deleteOrder',document.getElementById('id'+offset).innerHTML)
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



$('.accordian-body').on('show.bs.collapse', function () {
    $(this).closest("table")
        .find(".collapse.in")
        .not(this)
        //.collapse('toggle')
})