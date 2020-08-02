$(document).ready(function () {
  const url = 'https://myexample.gq/api/v1/';
  const Loader = document.getElementById('runLoader');
  const formElement = document.getElementById('sendReviewForm');
  // Fetch All Reviews
  function getAllReviews() {
    fetch(`${url}reviews/`)
      .then((response) => response.json())
      .then((reviews) => {
        //console.log(reviews);
        const allReviews = reviews.data;
        //console.log('Reviews:', allReviews);
        //console.log(allReviews.length);
        let output = ``;
        for (let index = 0; index < allReviews.length; index++) {
          var item = allReviews[index];
          output += `
          <div class="testimonial">
                <div class="testimonial__thumb">
                    <img src="${item.photo}" alt="Reviewer image" style="width:350px">
                </div>
                <div class="testimonial__details">
                    <div class="tes__icon">
                        <i class="fa fa-quote-right"></i>
                    </div>
                    <p id='allreviews'>${item.message}</p>
                    <h2 id="reviewer">${item.name}</h2>
                    <h4 id="company">${item.company}</h4>
                </div>
            </div>
          `;

          // const message=document.getElementById('reviews');
          // message.textContent= `${item.message}`;
          // const reviewer=document.getElementById('reviewer');
          // reviewer.textContent= `${item.name}`;
          // const company  =document.getElementById('company');
          // company.textContent=`${item.company}`;
          //document.getElementById('reviewsdiv').innerHTML = output;
        }

        document.getElementById('reviewsdiv').innerHTML = output;
        //document.getElementById('reviews').innerHTML=allreviews;
        //document.getElementById('reviewer').innerHTML=reviewer;
        //document.getElementById('company').innerHTML=company;
        //for (item of allReviews) {
      })
      .then(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/main.js';
        document.body.appendChild(script);
      })
      .catch((err) => console.log(err));
  }
  function disableSendReview() {
    if (localStorage.getItem('loggeduser') === null || undefined) {
      btnSendReview.style.display = 'none';
    } else {
      btnSendReview.style.display = 'block';
      sendreviewcheck.style.display = 'none';
    }
  }
  function sendReview() {
    formElement.onsubmit = async (e) => {
      e.preventDefault();
      const token = window.localStorage.getItem('token');
      Loader.style.dispaly = 'block';
      $('#runLoader1').css('display', 'block');
      let response = await fetch(`${url}reviews/`, {
        headers: {
          //           'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: 'POST',
        body: new FormData(formElement),
      });
      formElement.reset();
      let result = await response.json();
      $('#runLoader1').css('display', 'none');
      Loader.style.dispaly = 'none';
      //console.log(result);
      formElement.style.display = 'none';
      $('#exampleModalReview').modal('hide');
    };
  }
  getAllReviews();
  disableSendReview();
  sendReview();
});
