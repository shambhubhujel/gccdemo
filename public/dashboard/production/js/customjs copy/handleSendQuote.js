$(document).ready(function () {
  const url = "http://localhost:5000/api/v1/";
  const Loader = document.getElementById('runLoader');
  function sendQuote() {

    try {

      window.btnSubmitQorC = document.getElementById('btnSubmitQorC');
      window.btnSubmitQorC.addEventListener('click', function (event) {
        event.preventDefault();
        Loader.style.display = 'block';
        var formData = new FormData();
        formData = {
          'name': document.getElementById('qorcname').value,
          'email': document.getElementById('qorcemail').value,
          'phone': document.getElementById('qorcphone').value,
          'subject': document.getElementById('checkforquote').value,
          'message': document.getElementById('qorcmessage').value,

        }

        fetch(`${url}quote/`, {
          headers: { 'Content-Type': 'application/json' },
          //'Authorization': 'Bearer ' +token },
          method: 'POST',
          body: JSON.stringify(formData),
        })
          .then(data => data.json())
          .then((json) => {

            const responseData = json.data;
            console.log(responseData);
            if (responseData.success === true) {
              Loader.style.display = 'none';
              document.getElementById('qorc_form').reset();
              const email = responseData.quote.email;
              console.log("Ouote sender : ", email);
              document.getElementById('qorcInfo').innerText = "Your Quote has been successfully sent to us.We will get back to you soon.Thank you!!!";
              Loader.style.display = 'none';
              //window.location.assign("../index.html");
            }
            else {
              console.log("Error:", responseData.error);
              Loader.style.display = 'none';
              //window.location.assign('../index.html');
            }


          })

      })

    } catch (error) {
      console.log(error);

    }
  }
  sendQuote();

});
