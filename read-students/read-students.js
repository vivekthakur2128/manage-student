let searchByRadioButtons = document.querySelector(".search-by-radio-buttons");
document.querySelector(".show-search-buttons").addEventListener("click", (event) => {
    let clickedButtonId = event.target.id;
    let showStudentsContainer = document.querySelector(".show-students-container");
    let searchStudentsContainer = document.querySelector(".search-students-container");
    if(clickedButtonId == "showStudents"){
        showStudentsContainer.classList.remove("disabled-div");
        searchStudentsContainer.classList.add("disabled-div");
        searchByRadioButtons.querySelectorAll('input[type = "radio"]').forEach((searchByRadioButton) => {
            searchByRadioButton.checked = false;
        })
    }
    if(clickedButtonId == "searchStudents"){
        searchStudentsContainer.classList.remove("disabled-div");
        showStudentsContainer.classList.add("disabled-div");
        EnableDisableSearchFields();
    }
});

function EnableDisableSearchFields(){
    let SearchFiedsContainer = document.querySelector(".search-fields-container");
    SearchFiedsContainer.classList.add("disabled-div");
    searchByRadioButtons.addEventListener("click", (event) => {
        SearchFiedsContainer.classList.remove("disabled-div");
        let ckeckedSearchByButtons = event.target.value;
        SearchFiedsContainer.querySelectorAll("input").forEach((inputField) => {
            if(inputField.id == ckeckedSearchByButtons){
                inputField.classList.remove("disabled-div");
            }
            else{
                inputField.classList.add("disabled-div");
            }
        });
    });
    
}