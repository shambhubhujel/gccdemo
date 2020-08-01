const url = 'http://46.101.210.191:5000/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('applicantTBody');

const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

function getAllApplicants() {
  loading.style.display = 'block';
  fetch(`${url}/applicant`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allApplicant) => {
      const applicants = allApplicant.data;
      //console.log('allApplicant: ', applicants);

      // Delete table if #applicantTable exists
      if ($.fn.DataTable.isDataTable('#applicantTable')) {
        $('#applicantTable').DataTable().clear().destroy();
      }

      const output = applicants.map((applicant) => {
        const DOB = Date.parse(applicant.dob).toString('dd-MM-yyyy');
        return `<tr>
                  <td>${applicant.title}</td>
                  <td>${applicant.gender}</td>
                  <td>${applicant.name}</td>
                  <td>${applicant.email}</td>
                  <td>${applicant.qualification}</td>
                  <td>${applicant.institution}</td>
                  <td>${DOB}</td>
                  <td>${applicant.nationality}</td>
                  <td>${applicant.address1}</td>
                  <td>${applicant.address2 || ''}</td>
                  <td>${applicant.country}</td>
                  <td>${applicant.state}</td>
                  <td>${applicant.city}</td>
                  <td>${applicant.zipCode}</td>
                  <td>
                      <div>
                          <a href="${applicant.cv}" target="_blank">CV</a>
                      </div>
                  </td>
                  <td><button id="deleteIcon" type="button" class="btn" title="Delete" data-delete ="${
          applicant._id
          }"><i
                              class="fa fa-trash"></i></button>
                  </td>
              </tr>`;
      });
      // console.log('output: ', output);
      tBody.innerHTML = output.join(' ');
      $('#applicantTable').DataTable();
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          // console.log(e.currentTarget);
          const id = e.currentTarget.dataset.delete;
          deleteApplicant(id);
        });
      });
    });
}

async function deleteApplicant(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/applicant/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted applicant', TIMEOUT);
    await getAllApplicants();
    //console.log('result: ', result);
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

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

getAllApplicants();
