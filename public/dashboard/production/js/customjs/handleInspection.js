const url = 'http://localhost:5000/api/v1';
const token = window.localStorage.getItem('admintoken');
const ID = window.localStorage.getItem('adminid');
const tBody = document.getElementById('inspectionTBody');

const form = document.getElementById('addInspection');
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

const modal = $('#editModal');
const email = document.getElementById('modalEmailInspection');
const subject = document.getElementById('modalSubjectInspection');
const message = document.getElementById('modalemailMessageInspection');
const attachment = document.getElementById('modalMyfile');

let inspectionList = [];
const modalForm = document.getElementById('editInspection');

function editInspection(id) {
  const currentInspection = inspectionList.find(
    (inspection) => inspection._id === id
  );
  modalForm.dataset.id = id;
  email.value = currentInspection.email;
  subject.value = currentInspection.subject;
  message.value = currentInspection.message;

  modal.modal('show');
}

async function deleteInspection(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/inspection/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted inspection', TIMEOUT);
    await getAllInspections();

    // Update and remove supervisorList
    const inspection = inspectionList.find(
      (inspection) => inspection._id === id
    );
    newList = inspectionList.filter((newList) => newList !== inspection);
    inspectionList = newList;
    console.log('inspection cache LIST: ', inspectionList);
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

function getAllInspections() {
  loading.style.display = 'block';
  fetch(`${url}/inspection/${ID}`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allInspection) => {
      const inspections = allInspection.data;
      //console.log('allInspection: ', inspections);
      inspectionList = inspections;
      //console.log(inspectionList);

      // Delete table if #inspectionTable exists
      if ($.fn.DataTable.isDataTable('#inspectionTable')) {
        $('#inspectionTable').DataTable().clear().destroy();
      }

      const output = inspections.map((inspection) => {
        return `<tr>
                  <td>${inspection.email}</td>
                  <td>${inspection.subject}</td>
                  <td>${inspection.message}</td>
                  <td>
                  ${inspection.attachment.map((attach, i) => {
          const name = attach.split('-');
          const length = name.length - 1;
          return `<a href="${attach}">
                      ${name[length].split('%20').join(' ')}
                    </a>`;
        })}
                  </td>
                <td>
                  <a id="editIcon" href="#" title="Edit" data-edit="${
          inspection._id
          }">
                    <i class="fa fa-edit fa-2x"></i>
                  </a>
                </td>
                <td>
                    <a id="deleteIcon" href="#" title="Delete" data-delete="${
          inspection._id
          }">
                        <i class="fa fa-trash fa-2x text-danger"></i>
                    </a>
                </td>
          </tr>`;
      });
      // console.log('output: ', output);
      tBody.innerHTML = output.join(' ');
      $('#inspectionTable').DataTable();
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');
      const editIcons = document.querySelectorAll('#editIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          // console.log(e.currentTarget);
          const id = e.currentTarget.dataset.delete;
          deleteInspection(id);
        });
      });

      editIcons.forEach((editIcon) => {
        editIcon.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.edit;
          //console.log('Edit_ID: ', id);
          editInspection(id);
        });
      });
    })
    .catch((err) => {
      loading.style.display = 'none';
      showAlertError(err, TIMEOUT);
    });
}
// Update Inspection
modalForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = e.path[0].dataset.id;
  try {
    let response = await fetch(`${url}/inspection/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        email: email.value,
        subject: subject.value,
        message: message.value,
      }),
    });
    let result = await response.json();

    if (!result.success) {
      modal.modal('hide');
      showAlertError(result.error, TIMEOUT);
      return;
    }

    // Hide modal
    modal.modal('hide');

    showAlertSuccess('Successfully updated inspection', TIMEOUT);
    getAllInspections();

    // Show success alert msg
  } catch (error) {
    console.log('Error: ', error);
    modal.modal('hide');
    showAlertError(error, TIMEOUT);
  }
};

// Add Inspection
form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/inspection/`, {
      headers: {
        Authorization: 'Bearer ' + token,
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

    showAlertSuccess('Successfully added inspection', TIMEOUT);
    getAllInspections();
  } catch (error) {
    console.error('Error: ', error);
    loading.style.display = 'none';
    showAlertError(error, TIMEOUT);
  }
};

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

getAllInspections();
