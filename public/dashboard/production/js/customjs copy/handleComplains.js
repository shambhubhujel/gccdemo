$(document).ready(function () {
  const url = "http://localhost:5000/api/v1/";
  const token = window.localStorage.getItem('token');
  var Loader =document.getElementById('runLoader');
  const formElement=document.getElementById('qorc_form');

  function sendComplain() {
    try {
      formElement.onsubmit= function(e){
        e.preventDefault();
        $('#runLoader').css('display', 'block');
        fetch(`${url}complain/`,{
          headers: {
            //           'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + token
                    },
          method:'POST',
          body:new FormData(formElement),
        })
        .then(data=>data.json())
        .then((json =>{
          const responseData = json.data;
            console.log(responseData);
            if (responseData.success === true) {
              document.getElementById('qorc_form').reset();
              const email = responseData.complain.email;
              console.log("Complain sender : ", email);
              Loader.style.display='none';
              document.getElementById('qorcInfo').innerText = "Your Complain has been successfully sent to us.We will get back to you soon.Thank you!!!";
              //window.location.assign("../index.html");
            }
            else {
              console.log("Error:", responseData.error);
              Loader.style.display='none';
              //window.location.assign('../index.html');
            }
        }))
        // formElement.reset();
        // let result = response.json();
        // console.log(result);
        // const responseData=result.data;
        // const email = responseData.complain.email;
        // console.log("Complain sender : ", email);
        // document.getElementById('qorcInfo').innerText = "Your Complain has been successfully sent to us.We will get back to you soon.Thank you!!!";
        // //Loader.style.dispaly='none';
        
  
      }
    } catch (error) {
      console.log("Error:",error);
    }
   

  //   try {

  //     window.btnSubmitComplain = document.getElementById('btnSubmitComplain');
  //     window.btnSubmitComplain.addEventListener('click', function (event) {
  //       event.preventDefault();
  //       Loader.style.display='block';
  //       var formData = new FormData();
  //       formData = {
  //         'name': document.getElementById('qorcname').value,
  //         'email': document.getElementById('qorcemail').value,
  //         'phone': document.getElementById('qorcphone').value,
  //         //'subject': document.getElementById('checkforquote').value,
  //         'message': document.getElementById('qorcmessage').value,

  //       }
  //       fetch(`${url}complain/`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': 'Bearer ' + token
  //         },
  //         method: 'POST',
  //         body: JSON.stringify(formData),
  //       })
  //         .then(data => data.json())
  //         .then((json) => {
  //           const responseData = json.data;
  //           console.log(responseData);
  //           if (responseData.success === true) {
  //             document.getElementById('qorc_form').reset();
  //             const email = responseData.complain.email;
  //             console.log("Complain sender : ", email);
  //             Loader.style.display='none';
  //             document.getElementById('qorcInfo').innerText = "Your Complain has been successfully sent to us.We will get back to you soon.Thank you!!!";
  //             //window.location.assign("../index.html");
  //           }
  //           else {
  //             console.log("Error:", responseData.error);
  //             Loader.style.display='none';
  //             //window.location.assign('../index.html');
  //           }


  //         })

  //     })

  //   } catch (error) {
  //     console.log(error);

  //   }
  //   Loader.style.display='none';
  }
  sendComplain();

});