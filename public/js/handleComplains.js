$(document).ready(function () {
  const url = "https://myexample.gq/api/v1/";
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
            //console.log(responseData);
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
   

  
  }
  sendComplain();

});