var select = document.getElementById('heating');
var val = select.options[select.selectedIndex].value;
var buttonTemp = document.getElementById('SaveTemp');
var imgTerm = document.querySelector('.term');
var btnList = document.getElementById('get-button');
var table = document.querySelectorAll('table');
var upBtn = document.getElementsByClassName('update-button');
var capture = document.getElementById('capture');
buttonTemp.addEventListener('click', ChangeTempMode);

function ChangeTempMode() {
    var val = select.options[select.selectedIndex].value;
    let mode = {};
    mode['heat'] = val;
    let data = JSON.stringify(mode);
    fetch('/mode', {
        headers: {
            'Accept': 'application/json'
            , 'Content-Type': 'application/json'
        }
        , method: 'POST'
        , body: data
    }).then(function (res) {
        return res.json()
    }).then(function (data) {
        console.log('Request succeeded with JSON response', data);
        ChangePictureClass(data);
    }).catch(function (error) {
        console.log('Request failed', error);
    });
}

function ChangePictureClass(data) {
    switch (data.heat) {
    case '1':
        imgTerm.classList.remove('Op-2');
        imgTerm.classList.remove('Op-3');
        imgTerm.classList.add('Op-1');
        break;
    case '2':
        imgTerm.classList.remove('Op-1');
        imgTerm.classList.remove('Op-3');
        imgTerm.classList.add('Op-2');
        break;
    case '3':
        imgTerm.classList.remove('Op-1');
        imgTerm.classList.remove('Op-2');
        imgTerm.classList.add('Op-3');
        break;
    }
}
// GET/READ
btnList.addEventListener('click', showList);

function showList() {
    fetch('/beds', {
        method: 'GET'
    , }).then(function (res) {
        return res.json()
    }).then(function (data) {
        //console.log('Req GET succeeded', data);
        capture.style.display = "table-row";
        var tbodyEl = document.querySelector('tbody');
        var text = '';
        //        tbodyEl.innerHTML = text;
        //console.log(data);
        data.beds.forEach(function (bed) {
            text += `<tr>
                            <td class="id">${bed.id}</td>
                            <td><input type="text" class="name" value="${bed.name}"></td>
                            <td>
                                <button class="update-button" onclick="return rename();">UPDATE</button>
                                <button class="delete-button" onclick="return delBeds();">DELETE</button>
                            </td>
                        </tr> `
            tbodyEl.innerHTML = text;
        });
    }).catch(function (error) {
        console.log('Request failed', error);
    });
}
// CREATE/POST
var create = document.getElementById('create-form');
create.addEventListener('submit', createBed);

function createBed(event) {
    event.preventDefault();
    var createInput = document.getElementById('create-input');
    fetch('/beds/create', {
        headers: {
            'Accept': 'application/json'
            , 'Content-Type': 'application/json'
        }
        , method: 'POST'
        , body: JSON.stringify({
            name: createInput.value
        })
    }).then(function (data) {
        console.log('post succeeded', data);
        createInput.value = '';
        showList();
    }).catch(function (error) {
        console.log('Request failed', error);
    })
}
// PUT/ UPDATE
function rename() {
    var target = event.target;
    var rowEl = target.closest('tr');
    var id = rowEl.getElementsByClassName('id')[0].textContent;
    var newName = rowEl.getElementsByClassName('name')[0].value;
    fetch('/beds/' + id, {
        headers: {
            'Accept': 'application/json'
            , 'Content-Type': 'application/json'
        }
        , method: 'PUT'
        , body: JSON.stringify({
            newName: newName
        })
    }).then(function (data) {
        console.log('PUT succeeded', data);
        alert('Bed name changed');
        showList();
    }).catch(function (error) {
        console.log('Request failed', error.stack);
    })
};
// DELETE
function delBeds() {
    var target = event.target;
    var rowEl = target.closest('tr');
    var id = rowEl.getElementsByClassName('id')[0].textContent;
    fetch('/beds/delete/' + id, {
        headers: {
            'Accept': 'application/json'
            , 'Content-Type': 'application/json'
        }
        , method: 'DELETE'
    , }).then(function (data) {
        console.log('PUT succeeded', data);
        showList();
    }).catch(function (error) {
        console.log('Request failed', error);
    })
}