let registrationForm = document.getElementById("studentForm");
registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();
  // Collect input values
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validation for email or phone
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  const formData = new FormData(this);
  // console.log(formData.get('fullname')); //where fullname is name attribute of input field
  submitForm(formData);
});

async function submitForm(formData) {
  try {
    const response = await fetch('new-registration.php', {
      method: 'POST',
      body: formData
    });
    const result = await response.text(); 
    alert(result);
    registrationForm.reset();
  } catch (error) {
    console.error('Error:', error);
  }
}


