document.querySelector(".radio-buttons").addEventListener("click", (event) => {
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
    }
  });
}

// when show all students button is clicked
document.querySelector(".showStudentsBtn").addEventListener("click", (event) => {
    let showAllStudents = event.target.name;
    let dataToSend = [showAllStudents];
    sendButtonValueToPhp(dataToSend);
  });
// when search students by fields
document.querySelector("#searchBtn").addEventListener("click", (event) => {
    let allsearcheFIelds = document.querySelector('.search-by-field').querySelectorAll('input');
    allsearcheFIelds.forEach(searchField => {
        let searchFieldName = searchField.name;
        let searchFieldData = searchField.value.trim();
        if (searchFieldData) {
          let dataToSend = [searchFieldName, searchFieldData];
          sendButtonValueToPhp(dataToSend);
          return;
        }
      });
  });

// send data to php file and receive response from php file
async function sendButtonValueToPhp(dataToSend){
    try {
        const response = await fetch('show-students.php', {
            method: 'POST',
            body: JSON.stringify({data: dataToSend})
        });
    const result = await response.json(); 
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

