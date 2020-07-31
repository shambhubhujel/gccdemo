const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const url = 'http://localhost:5000/api/v1';
const workBody = document.getElementById('workBody');
let title = null;

const form = document.getElementById('applyWork');
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

// redirect to career.html if ID not found
!id && (window.location.href = 'career.html');

// Apply for work
form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append('title', title);
  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/applicant/`, {
      headers: {
        // Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: formData,
    });
    form.reset();
    let result = await response.json();
    //console.log('Result: ', result);
    loading.style.display = 'none';

    if (!result.success) {
      showAlertError(result.error, TIMEOUT);
      return;
    }

    showAlertSuccess('Successfully submitted', TIMEOUT);
  } catch (error) {
    console.error('Error: ', error);
    loading.style.display = 'none';
    showAlertError(error, TIMEOUT);
  }
};

fetch(`${url}/vacancy/${id}`, {
  method: 'GET',
})
  .then((response) => response.json())
  .then((Vacancy) => {
    const vacancy = Vacancy.data.vacancy;
    const date = new Date(vacancy.date);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.toLocaleString('default', { day: 'numeric' });
    const year = date.getFullYear();
    title = vacancy.title;

    const output = `
                <h2 class="text-large"><u>${vacancy.title}</u></h2>
                        <p class="text-small mtb--10">&nbsp;<span><i class="fa fa-clock-o"></i></span>&nbsp;&nbsp;${month}  ${day},${year}&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;<span><i class="fa fa-briefcase"></i></span>&nbsp;&nbsp;${vacancy.jobType}</p>

                        <p class="text-small text-justify text--dark mtb--10" style="white-space:pre-line">
                            ${vacancy.description}
                        </p>
                `;
    workBody.innerHTML = output;
  });

function showAlertSuccess(msg, timeout) {
  alertInfo.classList.add('open');
  alertSuccessMsg.innerHTML = msg;
  setTimeout(() => {
    alertInfo.classList.remove('open');
  }, timeout);
}
function showAlertError(msg, timeout) {
  alertError.classList.add('open');
  alertErrorMsg.innerHTML = msg;
  setTimeout(() => {
    alertError.classList.remove('open');
  }, timeout);
}
