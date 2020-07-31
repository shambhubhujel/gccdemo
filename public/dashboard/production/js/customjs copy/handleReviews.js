$(document).ready(function () {
  const url = "http://localhost:5000/api/v1/";
  const Loader =document.getElementById('runLoader');
  const formElement=document.getElementById('sendReviewForm');
  // Fetch All Reviews
  function getAllReviews() {

    fetch(`${url}reviews/`)
      .then(response => response.json())
      .then((reviews) => {
        console.log(reviews);
        const allReviews = reviews.data;
        console.log("Reviews:", allReviews);
        console.log(allReviews.length);
        let output = "";
        for (let index = 0; index < allReviews.length; index++) {
          var item = allReviews[index];
          //console.log(item);
          output += `
          <div class="testimonial">
                                    <div class="testimonial__thumb">
                                        <img src="${item.photo}" alt="Reviewer image">
                                    </div>
                                    <div class="testimonial__details">
                                        <div class="tes__icon">
                                            <i class="fa fa-quote-right"></i>
                                        </div>`;
          output += `<p id='allreviews'>${item.message}</p>`;
          output += `<h2 id="reviewer">${item.name}</h2>`;
          output += `<h4 id="company">${item.company}</h4>`;
          output += ` </div>
          </div>
                  `;

          // const message=document.getElementById('reviews');
          // message.textContent= `${item.message}`;
          // const reviewer=document.getElementById('reviewer');
          // reviewer.textContent= `${item.name}`;
          // const company  =document.getElementById('company');
          // company.textContent=`${item.company}`; 
          //document.getElementById('reviewsdiv').innerHTML = output;
        };

        document.getElementById('reviewsdiv').innerHTML = output;
        //document.getElementById('reviews').innerHTML=allreviews;
        //document.getElementById('reviewer').innerHTML=reviewer;
        //document.getElementById('company').innerHTML=company;
        //for (item of allReviews) {

      })
      .catch(err => console.log(err))
  }
  function disableSendReview() {
    if (localStorage.getItem('loggeduser') === null || undefined) {
      btnSendReview.style.display = 'none';
    }
    else {
      btnSendReview.style.display = 'block';
      sendreviewcheck.style.display = 'none';
    }
  }
  function sendReview() {
    formElement.onsubmit= async(e) =>{
      e.preventDefault();
      const token = window.localStorage.getItem('token');
      Loader.style.dispaly='block';
      $('#runLoader1').css('display', 'block');
      let response = await fetch(`${url}reviews/`,{
        headers: {
          //           'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
        method:'POST',
        body:new FormData(formElement)
      });
      formElement.reset();
      let result =await response.json();
      $('#runLoader1').css('display', 'none');
      Loader.style.dispaly='none';
      console.log(result);
      formElement.style.display='none';
      $('#exampleModalReview').modal('hide');

    }

    // if (!(localStorage.getItem('loggeduser') === null || undefined)) {
    //   try {

    //     const SendReview = document.getElementById('btnSendReview');
    //     SendReview.addEventListener('click', function (event) {
    //       event.preventDefault();
    //       Loader.style.dispaly='block';
    //       var formData = new FormData();
    //       formData = {
    //         'name': document.getElementById('name').value,
    //         'email': document.getElementById('email').value,
    //         'company': document.getElementById('company').value,
    //         'file': document.getElementById('photo').value,
    //         'message': document.getElementById('message').value,

    //       }
    //       const token = window.localStorage.getItem('token');

    //       // Send  a new review
    //       fetch(`${url}reviews/`, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': 'Bearer ' + token
    //         },
    //         method: 'POST',
    //         body: JSON.stringify(formData),
    //       })
    //         .then(response => response.json())
    //         .then((json) => {
    //           const reviewsData = json;
    //           console.log(reviewsData);
    //           if (reviewsData.success === true) {
                
    //             const username = reviewsData.user;
    //             console.log("Logged In User: ", username);
    //             Loader.style.display='none';
    //             window.location.assign("../index.html");
    //           }
    //           else {
    //             console.log("Error:", reviewsData.error);
    //             Loader.style.display='none';
    //             window.location.assign('../404.html');
    //           }


    //         })

    //     })

    //   } catch (error) {
    //     console.log(error);

    //   }
    // }
  }
  getAllReviews();
  disableSendReview();
  sendReview();



});