$(document).ready(function () {
  const url = 'http://46.101.210.191:5000/api/v1/';
  const Loader = document.getElementById('runLoader');
  const name = document.getElementById('qorcname');
  const email = document.getElementById('qorcemail');
  const phone = document.getElementById('qorcphone');
  const subject = document.getElementById('checkforquote');
  const message = document.getElementById('qorcmessage');
  const quoteInfo = document.getElementById('qorcInfo');
  const successsQuoteInfo = document.getElementById('alertQuote');

  function sendQuote() {
    try {
      window.btnSubmitQorC = document.getElementById('btnSubmitQorC');
      window.btnSubmitQorC.addEventListener('click', function (event) {
        // Make sure quote form is filled
        if (
          name.value === '' ||
          email.value === '' ||
          phone.value === '' ||
          subject.value === '' ||
          message.value === ''
        ) {
          $('#error_Quote').modal('show');
          return;
        }

        event.preventDefault();
        Loader.style.display = 'block';
        var formData = new FormData();
        formData = {
          name: name.value,
          email: email.value,
          phone: phone.value,
          subject: subject.value,
          message: message.value,
        };

        fetch(`${url}quote/`, {
          headers: { 'Content-Type': 'application/json' },
          //'Authorization': 'Bearer ' +token },
          method: 'POST',
          body: JSON.stringify(formData),
        })
          .then((data) => data.json())
          .then((json) => {
            const responseData = json.data;
            //console.log(responseData);
            if (responseData.success === true) {
              Loader.style.display = 'none';
              document.getElementById('qorc_form').reset();
              const email = responseData.quote.email;
              console.log('Ouote sender : ', email);
              successsQuoteInfo.classList.remove('none');
              quoteInfo.innerText =
                'Your Quote has been successfully sent. We will get back to you soon.Thank you!!!';
              Loader.style.display = 'none';
              //window.location.assign("../index.html");
            } else {
              console.log('Error:', responseData.error);
              Loader.style.display = 'none';
              //window.location.assign('../index.html');
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
  sendQuote();
});
