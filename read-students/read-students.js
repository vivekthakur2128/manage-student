// global variables
let searchByRadioButtons = document.querySelector(".search-by-radio-buttons");
let SearchFiedsContainer = document.querySelector(".search-fields-container");
let searchInputFields = SearchFiedsContainer.querySelectorAll("input");
let tableContainer = document.querySelector('.result-table-container');

document.querySelector(".show-search-buttons").addEventListener("click", (event) => {
    let clickedButtonId = event.target.id;
    let showStudentsContainer = document.querySelector(".show-students-container");
    let searchStudentsContainer = document.querySelector(".search-students-container");
    if(clickedButtonId == "showStudents"){
        showStudentsContainer.classList.remove("disabled-element");
        searchStudentsContainer.classList.add("disabled-element");
        searchByRadioButtons.querySelectorAll('input[type = "radio"]').forEach((searchByRadioButton) => {
        searchByRadioButton.checked = false;
        })
        searchInputFields.forEach((searchInputFIeld) => {
            searchInputFIeld.value = "";
            searchInputFIeld.classList.add("disabled-element");
        });
    }
    if(clickedButtonId == "searchStudents"){
        searchStudentsContainer.classList.remove("disabled-element");
        showStudentsContainer.classList.add("disabled-element");
        EnableDisableSearchFields();
    }
});

function EnableDisableSearchFields(){
    SearchFiedsContainer.classList.add("disabled-element");
    searchByRadioButtons.addEventListener("click", (event) => {
        SearchFiedsContainer.classList.remove("disabled-element");
        let ckeckedSearchByButtons = event.target.value;
        SearchFiedsContainer.querySelectorAll("input").forEach((inputField) => {
            if(inputField.id == ckeckedSearchByButtons){
                inputField.classList.remove("disabled-element");
                // inputField.setAttribute("required", "");
            }
            else{
                inputField.classList.add("disabled-element");
                inputField.value = "";
                // inputField.removeAttribute("required", "");
            }
        });
    });
    
}

document.querySelector("#showAllStudentsButton").addEventListener("click", (event) => {
    let clickedButtonId = event.target.id;
    sendDataToPhp(clickedButtonId);
});

document.querySelector("#searchButton").addEventListener("click", (event) => {
    event.preventDefault();
    searchInputFields.forEach((searchInputFIeld) => {
        let searchInputFIeldId = searchInputFIeld.id;
        if(searchInputFIeld.value){
            let searchInputFIeldValue = searchInputFIeld.value.trim();
            let searchInputFieldDetails = [searchInputFIeldId, searchInputFIeldValue];
            sendDataToPhp(searchInputFieldDetails);
            return;
        }
        let checkDisabledElementClass = searchInputFIeld.classList.contains("disabled-element");
        if(!(searchInputFIeld.value) && !(checkDisabledElementClass)){
            alert(`Please enter ${searchInputFIeldId}`);
            return;
        }
       
    });
    
});

async function sendDataToPhp(dataToBeSent){
    try {
        const response = await fetch('read-students.php', {
            method: 'POST',
            body: JSON.stringify({data: dataToBeSent})
        });
    const studentsArray = await response.json(); 
    console.log(studentsArray);
    if(typeof(studentsArray) === "string"){
        alert(studentsArray);
    }
    createTable(studentsArray);
    } catch (error) {
        console.error('Error:', error);
    }
}

function createTable(studentsArray){
    tableContainer.innerHTML = "";
    let tableHeaderData = studentsArray[0];
    let tableBodyData = studentsArray[1];
    if(!(tableHeaderData[0] == "id")){
        let newTableBodyData = [];
        tableHeaderData.unshift("S.no.")
        let serialNumber = 1;
        tableBodyData.forEach(rowData => {
            let newTableRowData = { ["S.no."]: serialNumber, ...rowData };
            newTableBodyData.push(newTableRowData);
            serialNumber++;
        });
        tableBodyData = [];
        tableBodyData = [...newTableBodyData];
    }
   
    // create table
    let table = document.createElement("table");
    table.style.border = "2px solid black";
    table.style.width = "100%";
    // table header
    let tableHeader = table.createTHead();
    let tableHeaderRow = tableHeader.insertRow();
    tableHeaderData.forEach(columnName => {
        let th = document.createElement('th');
        th.style.border = "1px solid black";
        th.textContent = columnName;
        tableHeaderRow.appendChild(th)
    });
    // table body
    let tableBody = table.createTBody();
    tableBodyData.forEach(rowData => {
        let tableRow = document.createElement('tr');
        Object.values(rowData).forEach(columnData => {
            let td = document.createElement('td');
            td.style.border = "1px solid black";
            td.innerText = columnData;
            tableRow.appendChild(td);
        });
        tableBody.appendChild(tableRow);
    });
    table.appendChild(tableBody);
    document.querySelector(".search-result-heading").classList.remove("hidden");
    tableContainer.appendChild(table);
}