let user = document.getElementById("userid");
let passKey = document.getElementById("password");
let loginButton = document.getElementById("loginBtn");

// validate userid and password field
loginButton.addEventListener("click", (event) => {
  let userId = user.value;
  let password = passKey.value;

  if (!userId || !password) {
    event.preventDefault(); // stops the navigation
    alert("Both User ID and Password are required.");
  }
  else {
    checkLoginCredentials(userId, password);
  }
  
});

// check whether entered userId and password are correct or not
function checkLoginCredentials(userId, password){
  // sending variables to php file
  fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'userId=' + encodeURIComponent(userId) + '&pass=' + encodeURIComponent(password)
  })
  // receive the response on the basis of entered usserId and password
    .then(res => res.text())
    .then(data => {
      console.log(data);
      if(data == "Logged in"){
        window.location.href = "/manage-student/crud-students/crud-students.html";
      }
      else{
        alert(data);
        document.querySelector("form").reset();
      }    
    });
}

  