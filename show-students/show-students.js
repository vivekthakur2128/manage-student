let tableContainer = document.querySelector('.table-container');
document.querySelector(".radio-buttons").addEventListener("click", (event) => {
  tableContainer.innerHTML = '';
  let searchByRadioButtons = document.querySelector(".search-by-radio-buttons").querySelectorAll('input[type="radio"]');
  searchByRadioButtons.forEach(searchByRadioButton => {
    searchByRadioButton.checked = false;
  });
  let activeRadioBtnName = event.target.id;
  let showAllStudentsDiv = document.querySelector(".show-all-students");
  let searchStudentsByFieldDiv = document.querySelector(".search-by");
  let searchRadioButtons = document.querySelector(".search-by-buttons");
  let searchByField = document.querySelector(".search-by-field");

  if (activeRadioBtnName == "show") {
    showAllStudentsDiv.classList.remove("disabled-div");
    searchStudentsByFieldDiv.classList.add("disabled-div");
  }
  if (activeRadioBtnName == "search") {
    searchStudentsByFieldDiv.classList.remove("disabled-div");
    showAllStudentsDiv.classList.add("disabled-div");
    searchRadioButtons.classList.remove("disabled-div");
    searchByField.classList.add("disabled-div");
  }
});

document.querySelector(".search-by-radio-buttons").addEventListener("click", (event) => {
    let searchByField = document.querySelector(".search-by-field");
    searchByField.classList.remove("disabled-div");
    // check which search radio button is checked
    let checkedSearchButton = event.target.value;
    enableDisableSearchField(checkedSearchButton);
  });

function enableDisableSearchField(checkedSearchButton) {
  let searchByName = document.querySelector('#name');
  let searchByFathername = document.querySelector('#fathername');
  let searchByGender = document.querySelector("#gender");
  let searchByDate = document.querySelector("#date");

  let searchFields = [searchByName, searchByFathername, searchByGender, searchByDate];
  searchFields.forEach(searchField => {
    if(searchField.id === checkedSearchButton){
        searchField.classList.remove("disabled-div");
    }
    else{
        searchField.classList.add("disabled-div");
        searchField.querySelector("input").value = '';
    }
  });
}

// when show all students button is clicked
document.querySelector(".showStudentsBtn").addEventListener("click", (event) => {
    let showAllStudents = event.target.name;
    let dataToSend = [showAllStudents];
    sendDataToPhp(dataToSend);
  });
// when search students by fields
document.querySelector("#searchBtn").addEventListener("click", (event) => {
    let allsearcheFIelds = document.querySelector('.search-by-field').querySelectorAll('input');
    allsearcheFIelds.forEach(searchField => {
        let searchFieldName = searchField.name;
        let searchFieldData = searchField.value.trim();
        if (searchFieldData) {
          let dataToSend = [searchFieldName, searchFieldData];
          sendDataToPhp(dataToSend);
          return;
        }
      });
  });

// send data to php file and receive response from php file
async function sendDataToPhp(dataToSend){
    try {
        const response = await fetch('show-students.php', {
            method: 'POST',
            body: JSON.stringify({data: dataToSend})
        });
    const studentsArray = await response.json(); 
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

    tableContainer.appendChild(table);
}