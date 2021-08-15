const electron = require('electron');
const { ipcRenderer } = electron;

//<<<<<<<<<<<<<<---globals---<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



// $('#demo').pagination({
//     dataSource: [{a :1}, {a :2}, {a :3}, {a :4}, ... , {a :50}],
//     pageSize: 8,
//     formatResult: function(data) {
//         for (var i = 0, len = data.length; i < len; i++) {
//             data[i].a = data[i].a + ' - bad guys';
//         }
//     },
//     callback: function(data, pagination) {
//         // template method of yourself
//         var html = template(data);
//         dataContainer.html(html);
//     }
// })



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
    console.log(recArray)
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
            '<td id="showOrder'+ocount+'">' +'<i class="far fa-caret-square-down"></i>'+'order' +'</td>'+
            '<td>'+element.total+'</td>'+
            '<td>'+(element.discount?element.discount:'-')+'</td>'+
            '<td>'+(element.afterdiscount?element.afterdiscount:'-')+'</td>'+
            '<td>'+ (element.in_progress?'<i class="fa fa-check" aria-hidden="true"></i>':'<i class="fa fa-times" aria-hidden="true"></i>') +'</td>'+
            '<td>'+ (element.paid?'<i class="fa fa-check" aria-hidden="true"></i>':'<i class="fa fa-times" aria-hidden="true"></i>') +'</td>'+
            '<td>' +'<i onclick="editfun(this)" id="editicon' + ocount + '" class="far fa-edit" style="color: rgb(255, 238, 0);display:inline;"></i><i id="afterediticon' + ocount + '" onclick="afteredit(this)" class="fas fa-pencil-alt" style="color:rgb(53, 194, 18);display:none;"></i><i id="delete' + ocount + '" onclick="odelete(this)" class="fas fa-trash-alt" style="color:rgb(209, 2, 2);display:inline;"></i>' + '</td>' +
            '</tr>'
        console.log(newrow)
        document.getElementById('tablebody').appendChild(newrow);

        var collapse_row = document.createElement("tr");
        var tdata = document.createElement("td");
        tdata.setAttribute("colspan","10");
        tdata.setAttribute("class","hiddenRow");
        tdata.innerHTML += 
            '<div id="order'+ ocount+'" class="accordian-body collapse" style="width:100%">'+
            // '<pre>'+'-'+ele.index+'-   '+'صنف:'+ ele.type +'          '+'سعر:'+ ele.price +'          '+ 'كمية:' + ele.quantity+'          ' +'السعر الكلي:'+ele.totalprice+ '</pre>'+
            '<table style="margin:auto;width:80%; min-width:300px;"><thead><tr>'+
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
            console.log(orderRow)
            document.getElementById("table"+ocount).append(orderRow)
        });
        

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