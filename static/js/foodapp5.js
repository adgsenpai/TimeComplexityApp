//# ************************************************************************
//# Ashlin Darius Govindasamy - ADGSTUDIOS 2021
//# All rights reserved.
//# foodapp.js - Last modified: 2021-11-21T21:59:00.959Z
//# ************************************************************************

let DeletedItems = 0;
let AddedItems = 0;


let lenprod = Object.values(dict['Product']).length;
let lenlinks = Object.values(dict['ImageLink']).length;
let arr = [];

function searchQuery(search) {
    var t = 'https://adgstudios.co.za/api/v1/picknpay/search/' + search
    let n = new XMLHttpRequest()
    n.open('GET', t),
        (n.responseType = 'text'),
        (n.onload = function () { }),
        n.send(),
        fetch(t).then(function (e) {
            e.text().then(function (e) {
                console.log(e)
            })
        })
}

function LoadProducts() {
    for (let i = 0; i < lenprod; i++) {
        arr.push(['<div class="d-flex px-2 py-1"><div><img src="' + dict['ImageLink'][i] + '" style="user-drag: none;user-select: none;-moz-user-select: none;-webkit-user-drag: none;-webkit-user-select: none;-ms-user-select: none;"></div>' + '<div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-lg">' + dict['Product'][i] + '</h6><button type="button" onclick="AddToBasket(this)" class="btn btn-default"><img src = "/static/img/addtobasketicon.png" style="width:50px;"></button></div>']);
    }
    PopulateTable(tblIngredients, arr);
    document.getElementById("loadingAnimation").remove()
}

function searchFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById('foodSearch');
    filter = input.value.toUpperCase();
    table = document.getElementById('tblIngredients');
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("h6")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
BasketItemCount = 0;


function AddToBasket(element) {
    var rowjQuery = $(element).closest("tr");
    var ID = rowjQuery[0].rowIndex;
    if (CheckIfItemInBasket(dict['Product'][ID])) {
        msg = document.getElementById("errormsg");
        msg.innerHTML = '<div id class="alert alert-primary alert-dismissible fade show" role="alert"><span class="text-white"><strong>Error!</strong> Item already in cart!</span><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        location.href = "#errormsg";
    }
    else {
        var BasketItems = [];
        BasketItems.push(['<div class="d-flex px-2 py-1"><div><img src="' + dict['ImageLink'][ID] + '" style="user-drag: none;user-select: none;-moz-user-select: none;-webkit-user-drag: none;-webkit-user-select: none;-ms-user-select: none;"></div>' + '<div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-lg">' + dict['Product'][ID] + '</h6><button type="button" onclick= "RemoveFromBasket(this)"class="btn btn-danger" style="width: 54px;">X</button>']);
        PopulateTable(tblBasket, BasketItems);
        BasketItemCount += 1;
        RenderProcessingButton()
    }
}

function RenderProcessingButton()
{
    
    if (BasketItemCount > 0)
    {
    document.getElementById("btnGenerateInstructions").innerHTML = '<button type="button" onclick="GenerateResponse()" class="btn bg-gradient-primary">Generate Instructions</button>';    
    }
    else
    {
    document.getElementById("btnGenerateInstructions").innerHTML = ''; 
    }
}


function CheckIfItemInBasket(itemName) {
    let BasketItems = [];
    let table = document.getElementById("tblBasket");
    tds = table.getElementsByTagName("td");
    for (let i = 0; i < tds.length; i++) {
        if (tds[i].getElementsByTagName("h6")[0].innerText == itemName) {
            return true;
        }
    }
    return false;
}

function renderInstructionsCard() {

    let componentCardInstructions = '<div class="card h-100 p-3"><div class="overflow-hidden position-relative border-radius-lg bg-cover h-100"><span class="mask bg-gradient-white"></span><div class="card-body position-relative z-index-1 d-flex flex-column h-100 p-3"><h3 class="text-black font-weight-bolder mb-4 pt-2">Recipe</h3><div id="progressInstructions" class="spinner-border text-primary" role="status"></div><div id="componentsRecipe"></div></div></div>'
    document.getElementById("instructions").innerHTML = componentCardInstructions;

    
}

function renderRecipe()
{
    let components = '<div id="textAreaComponent"><textarea readonly class="form-control" id="edtInstructions"rows="10"></textarea><br><button type="button" onclick="CopyToClipboard()"class="btn bg-gradient-info">Copy to clipboard</button></div>'
    document.getElementById("componentsRecipe").innerHTML = components;
}


function CopyToClipboard()
{
    var copyText = document.getElementById("edtInstructions");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}

async function GenerateResponse() {

    renderInstructionsCard()
    data = ReturnItemsOfBasket();
    fetch('/apps/foodapp/api/v1/generateinstructions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("progressInstructions").remove();
            renderRecipe();
            document.getElementById("edtInstructions").value = data;
        })
        .catch((error) => {
            document.getElementById("edtInstructions").value = 'Error server cant handle that much ingredients';
        });
}


function ReturnItemsOfBasket() {
    let table = document.getElementById("tblBasket");
    tds = table.getElementsByTagName("td");
    let arrProd = [];
    for (let i = 0; i < tds.length; i++) {
        arrProd.push(tds[i].getElementsByTagName("h6")[0].innerText);
    }
    return arrProd;
}

function RemoveFromBasket(element) {
    var rowjQuery = $(element).closest("tr");
    var ID = rowjQuery[0].rowIndex;
    document.getElementById("tblBasket").deleteRow(ID);
    BasketItemCount -= 1;
    RenderProcessingButton()
}

function PopulateTable(htmlTable, arr) {
    for (var i = 0; i < arr.length; i++) {
        var newRow = htmlTable.insertRow(htmlTable.length);
        for (var j = 0; j < arr[i].length; j++) {
            var cell = newRow.insertCell(j);
            cell.innerHTML = arr[i][j];
        }
    }
}