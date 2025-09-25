document.addEventListener("DOMContentLoaded", () => {
  fetch("fetchStudentsForDelete.php") // PHP file that returns some data
    .then((response) => response.json()) // use .json() if PHP returns JSON
    .then((data) => {
      createTable(data); // Call a function to create a table with the data
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

let tableContainer = document.querySelector(".table-container");
function createTable(tableData) {
  let tableHeaderData = tableData[0];
  tableHeaderData.push("");
  let tableBodyData = tableData[1];
  // create table
  let table = document.createElement("table");
  table.classList.add("tableStyle");

  // table header
  let tableHeader = table.createTHead();
  let tableHeaderRow = tableHeader.insertRow();
  tableHeaderData.forEach((columnName) => {
    let th = document.createElement("th");
    th.style.border = "1px solid black";
    th.style.paddingLeft = "5px";
    th.textContent = columnName;
    tableHeaderRow.appendChild(th);
  });
  // table body
  let tableBody = table.createTBody();
  tableBodyData.forEach((rowData) => {
    let tableRow = document.createElement("tr");
    // add delete button in each row
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("id", "deleteButton");

    let newRowData = [...Object.values(rowData), deleteButton];
    newRowData.forEach((columnData, index) => {
      let td = document.createElement("td");
      td.style.border = "1px solid black";
      td.style.paddingLeft = "5px";
      if (index === newRowData.length - 1) {
        td.innerHTML = columnData.outerHTML;
        td.style.textAlign = "center";
      } else {
        td.innerText = columnData;
      }
      tableRow.appendChild(td);
    });
    tableBody.appendChild(tableRow);
  });
  table.appendChild(tableBody);
  tableContainer.appendChild(table);
}

//add event listener to search button
document.querySelector(".search-button").addEventListener("click", () => {
  let searchText = document.querySelector(".search-field").value;
  findseaarchingText(searchText);
});

function findseaarchingText(searchText) {
  let tableRows = tableContainer.querySelectorAll("tbody tr");
  const regex = new RegExp(searchText, "gi");
  let rowContainsSearchTextCounter = 0;
  tableRows.forEach((row, index) => {
    let rowText = row.innerText.toLowerCase();
    if (rowText.includes(searchText.toLowerCase())) {
      row.style.display = "";
      let cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        let cellText = cell.innerText;
        let highlightedText = cellText.replace(
          regex,
          (match) => `<span class="highlightCellText">${match}</span>`
        );
        cell.innerHTML = highlightedText;
      });
      rowContainsSearchTextCounter++;
    } else {
      row.style.display = "none";
      if (
        index === tableRows.length - 1 &&
        rowContainsSearchTextCounter === 0
      ) {
        alert("No matching records found");
        return;
      }
    }
  });
}
// event delegation for delete button
tableContainer.addEventListener("click", (event) => {
  if (event.target && event.target.id == "deleteButton") {
    let currentRow = event.target.closest("tr");
    let studentId = currentRow.querySelector("td").innerText;
    let confirmAction = confirm(`Are you sure you want to delete student with ID: ${studentId}`
    );
    if (confirmAction) {
      deleteRecord(studentId, currentRow);
      console.log("Confirmed deletion for student ID:", studentId);
    }
  }
});

function deleteRecord(studentId, currentRow) {
  console.log("Deleting record with ID:", studentId);
    fetch("delete-students.php", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "studentId=" + encodeURIComponent(studentId)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            alert("Record deleted successfully.");
            currentRow.remove(); // remove row from table
        }
        })
        .catch((error) => {
        console.error("Error deleting record:", error);
        });
}
