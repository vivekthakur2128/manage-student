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

document
  .querySelector(".search-by-radio-buttons")
  .addEventListener("click", (event) => {
    let searchByField = document.querySelector(".search-by-field");
    searchByField.classList.remove("disabled-div");

    // check which search radio button is checked
    let checkedSearchButton = event.target.value;
    console.log(checkedSearchButton);
    enableSearchField(checkedSearchButton);
  });

function enableSearchField(checkedSearchButton) {
  let searchByName = document.querySelector('input[name="name"]');
  let searchByFathername = document.querySelector('input[name="fathername"]');
  let searchByGender = document.querySelector(".genderField");
  let searchByDate = document.querySelector(".dateField");

  if (checkedSearchButton == "name") {
    searchByName.classList.remove("disabled-div");
    searchByFathername.classList.add("disabled-div");
    searchByGender.classList.add("disabled-div");
    searchByDate.classList.add("disabled-div");
  }
  if (checkedSearchButton == "fathername") {
    searchByFathername.classList.remove("disabled-div");
    searchByName.classList.add("disabled-div");
    searchByGender.classList.add("disabled-div");
    searchByDate.classList.add("disabled-div");
  }
  if (checkedSearchButton == "gender") {
    searchByGender.classList.remove("disabled-div");
    searchByName.classList.add("disabled-div");
    searchByFathername.classList.add("disabled-div");
    searchByDate.classList.add("disabled-div");
  }
  if (checkedSearchButton == "date") {
    searchByDate.classList.remove("disabled-div");
    searchByName.classList.add("disabled-div");
    searchByFathername.classList.add("disabled-div");
    searchByGender.classList.add("disabled-div");
  }

  // console.log(searchByName);
  // console.log(searchByFathername);
  // console.log(searchByGender);
  // console.log(searchByDate);
}
