// global variables
let studentNameField =  document.querySelector('#studentName');
let fatherNameField = document.querySelector('#fathername');
let tableContainer = document.querySelector('.result-table-container');


document.querySelector(".search-by-container").addEventListener("click", (event) =>{
    if(event.target.id == "studentName"){
       fatherNameField.value = "";
    }
    if(event.target.id == "fathername"){
        studentNameField.value = "";

    }
});

document.querySelector('#searchStudents').addEventListener("click", (event) => {
    event.preventDefault();
    if((studentNameField.value) || (fatherNameField.value)){
        if(studentNameField.value){
            sendDataToPhp(studentNameField.name, studentNameField.value);
        }
        if(fatherNameField.value){
            sendDataToPhp(fatherNameField.name, fatherNameField.value);
        }
    }
    else{
        alert("At least one field is required (Student name or Father name)");
    }
});

async function sendDataToPhp(columnName, columnValue) {
    try {
        const response = await fetch('studentsToBeUpdate.php', {
            method: 'POST',
            body: JSON.stringify({ columnName: columnName, columnValue: columnValue })
        });
    const studentsArray = await response.json(); 
    // console.log(studentsArray);
    if(typeof(studentsArray) === "string"){
        alert(studentsArray);
        return;
    }
    createTable(studentsArray);
    } catch (error) {
        console.error('Error:', error);
    }
}

function createTable(studentsArray){
    tableContainer.innerHTML = "";
    let tableHeaderData = studentsArray[0];
    // add action columns in header for edit and update 
    tableHeaderData.unshift("");
    tableHeaderData.push("");
    let tableBodyData = studentsArray[1];
    
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
        // add edit and update buttons in each row
        let editButton = document.createElement('button');
        editButton.setAttribute("id", "editButton");
        editButton.innerText = "Edit";
        let updateButton = document.createElement('button');
        updateButton.setAttribute("id", "updateButton");
        updateButton.innerText = "Update";
        updateButton.classList.add("disableUpdateButton");
        let newRowData = [editButton, ...Object.values(rowData), updateButton];
        newRowData.forEach((columnData, index) => {
            let td = document.createElement('td');
            td.style.border = "1px solid black";
            if(index === 0 || index === newRowData.length -1){
                td.innerHTML = columnData.outerHTML;
                tableRow.appendChild(td);
            }
            else{
                td.innerText = columnData;
                tableRow.appendChild(td);
            }
            
        });
        tableBody.appendChild(tableRow);
    });
    table.appendChild(tableBody);
    document.querySelector(".search-result-heading").classList.remove("hidden");
    tableContainer.appendChild(table);
}

// event delegation for edit and update buttons
tableContainer.addEventListener("click", (event) => {
    
    if(event.target && event.target.id == "editButton" && event.target.innerText == "Edit"){
        let currentRow = event.target.closest("tr");
        let updateButton = currentRow.querySelector("#updateButton");
        let editButton = currentRow.querySelector("#editButton");
        if(updateButton.classList.contains("disableUpdateButton")){
            updateButton.classList.remove("disableUpdateButton");
            editButton.innerText = "Cancel";
            makeRowEditable(currentRow);
        }
        tableContainer.querySelector("tbody").querySelectorAll("tr").forEach(row => {
            if(row !== currentRow){
                // disable other edit buttons
                let otherEditButton = row.querySelector("#editButton");
                if(otherEditButton.innerText !== "Edit"){
                    otherEditButton.innerText = "Edit";
                }
                row.querySelectorAll("td").forEach((cell, index) => {
                    if(index > 1 && index < row.querySelectorAll("td").length -2){
                        cell.style.backgroundColor = ""; // Revert background color
                        cell.setAttribute('contenteditable', 'false');
                    }
                });
                let otherUpdateButton = row.querySelector("#updateButton");
                if(!(otherUpdateButton.classList.contains("disableUpdateButton"))){
                    otherUpdateButton.classList.add("disableUpdateButton");
                }

            }
        });
        return;
    }
    if(event.target && event.target.id == "editButton" && event.target.innerText == "Cancel"){
        var actionChoice = confirm("Do you want to undo the changes?");
        if(actionChoice === true){
            let currentRow = event.target.closest("tr");
            let updateButton = currentRow.querySelector("#updateButton");
            let editButton = currentRow.querySelector("#editButton");
            updateButton.classList.add("disableUpdateButton");
            editButton.innerText = "Edit";
            currentRow.querySelectorAll("td").forEach((cell, index) => {
                if(index > 1 && index < currentRow.querySelectorAll("td").length -2){
                    cell.style.backgroundColor = ""; // Revert background color
                    cell.setAttribute('contenteditable', 'false');
                }
            });
            return;
        }
    }
    if(event.target && event.target.id == "updateButton" && !(event.target.classList.contains("disableUpdateButton"))){
        let currentRow = event.target.closest("tr");
        let updateButton = currentRow.querySelector("#updateButton");
        let editButton = currentRow.querySelector("#editButton");
        UpdatedData(currentRow);
        updateButton.classList.add("disableUpdateButton");
        editButton.innerText = "Edit";
    }
});

function makeRowEditable(row){
    let cells = row.querySelectorAll("td");
    // skip first and last cell (edit and update buttons) and also skip id and date cell
    for(let i=2; i<cells.length-2; i++){
        let cell = cells[i];
        // change background color to indicate edit mode
        cell.style.backgroundColor = "#9bc6ccff"; 
        cell.setAttribute('contenteditable', 'true');
    }
}

function UpdatedData(row){
    let cells = row.querySelectorAll("td");
    // skip first and last cell (edit and update buttons) and also skip id and date cell
    let dataToBeUpdate = {};
    for(let i=1; i<cells.length-2; i++){
        let cell = cells[i];
        let columnName = document.querySelector("thead").querySelectorAll("th")[i].innerText;
        let columnValue = cell.innerText;
        dataToBeUpdate[columnName] = columnValue;
    }
    sendUpdatedDataToDb(dataToBeUpdate);
}
async function sendUpdatedDataToDb(dataToBeUpdate) {
    try {
        let actionChoice = confirm("Are you sure you want to update the record?");
        if(actionChoice === false){
            return;
        }
        const response = await fetch('update-students.php', {
            method: 'POST',
            body: JSON.stringify(dataToBeUpdate)
        });
    const result = await response.text(); 
    alert(result);
    } catch (error) {
        console.error('Error:', error);
    }
}