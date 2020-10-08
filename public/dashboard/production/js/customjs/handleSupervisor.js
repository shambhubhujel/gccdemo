const url = 'https://myexample.gq/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('supervisorTBody');

const form = document.getElementById('addSupervisor');
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

const modal = $('#editModal');
const name = document.getElementById('modalSupervisorFullName');
const email = document.getElementById('modalSupervisorEmailAddress');
const phone = document.getElementById('modalPhoneSupervisor');
const address = document.getElementById('modalSupervisorAddress');
const age = document.getElementById('modalAgeSupervisor');
const position = document.getElementById('modalPositionSupervisor');
const office = document.getElementById('modalOfficeSupervisor');
// const photo = document.getElementById('modalSupervisorProfileImage');
const startDate = document.getElementById('modalSupervisortStartDate');

let supervisorList = [];
const modalForm = document.getElementById('editSupervisor');

function editSupervisor(id) {
  const currentSupervisor = supervisorList.find(
    (supervisor) => supervisor._id === id
  );
  modalForm.dataset.id = id;
  name.value = currentSupervisor.name;
  email.value = currentSupervisor.email;
  phone.value = currentSupervisor.phone;
  address.value = currentSupervisor.address;
  age.value = currentSupervisor.age;
  position.value = currentSupervisor.position;
  office.value = currentSupervisor.office;

  const date = Date.parse(currentSupervisor.startDate);
  startDate.value = date.toString('yyyy-MM-dd');

  modal.modal('show');
}

async function deleteSupervisor(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/admin/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted supervisor', TIMEOUT);
    await getAllSupervisors();

    // Update and remove supervisorList
    const supervisor = supervisorList.find(
      (supervisor) => supervisor._id === id
    );
    newList = supervisorList.filter((newList) => newList !== supervisor);
    supervisorList = newList;
    //console.log('Supervisor cache LIST: ', supervisorList);
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

function getAllSupervisors() {
  loading.style.display = 'block';
  fetch(`${url}/admin?role=supervisor`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allSupervisors) => {
      const supervisors = allSupervisors.data;
      //console.log('allSupervisors: ', supervisors);
      supervisorList = supervisors;
      //console.log(supervisorList);

      // Delete table if #supervisorTable exists
      if ($.fn.DataTable.isDataTable('#supervisorTable')) {
        $('#supervisorTable').DataTable().clear().destroy();
      }

      const output = supervisors.map((supervisor) => {
        const StartDate = Date.parse(supervisor.startDate).toString(
          'dd-MM-yyyy'
        );
        return `<tr>
              <td>${supervisor.name}</td>
              <td>${supervisor.email}</td>
              <td>${supervisor.phone}</td>
              <td>${supervisor.age}</td>
              <td>${supervisor.position}</td>
              <td>${supervisor.office}</td>

              <td><a href="${supervisor.photo}">
                      <img src="${
          supervisor.photo ||
          'https://via.placeholder.com//300?text=Image+Not+Available'
          }"
                          alt="">
                  </a></td>
              <td>${supervisor.address}</td>
              <td>${StartDate}</td>
              <td><a id="editIcon" href="#" title="Edit" data-edit="${
          supervisor._id
          }">
                      <i class="fa fa-edit fa-2x"></i>
                  </a></td>
              <td>
                  <a id="deleteIcon" href="#" title="Delete" data-delete="${
          supervisor._id
          }">
                      <i class="fa fa-trash fa-2x text-danger"></i>
                  </a>
              </td>
          </tr>`;
      });
      // console.log('output: ', output);
      tBody.innerHTML = output.join(' ');
      $('#supervisorTable').DataTable();
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');
      const editIcons = document.querySelectorAll('#editIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          // console.log(e.currentTarget);
          const id = e.currentTarget.dataset.delete;
          deleteSupervisor(id);
        });
      });

      editIcons.forEach((editIcon) => {
        editIcon.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.edit;
          //console.log('Edit_ID: ', id);
          editSupervisor(id);
        });
      });
    });
}

//console.log('supervisorList: ', supervisorList);

// Update Supervisor
modalForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = e.path[0].dataset.id;

  try {
    let response = await fetch(`${url}/admin/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phone: phone.value,
        age: age.value,
        position: position.value,
        office: office.value,
        address: address.value,
        startDate: startDate.value,
      }),
    });
    let result = await response.json();
    // console.log('Update Result: ', result);

    if (!result.success) {
      modal.modal('hide');
      showAlertError(result.error, TIMEOUT);
      return;
    }

    // Hide modal
    modal.modal('hide');

    showAlertSuccess('Successfully updated supervisor', TIMEOUT);
    getAllSupervisors();

    // Show success alert msg
  } catch (error) {
    console.log('Error: ', error);
    modal.modal('hide');
    showAlertError(error, TIMEOUT);
  }
};

// Add Supervisor
form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append('role', 'supervisor');
  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/admin/`, {
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

    showAlertSuccess('Successfully added supervisor', TIMEOUT);
    getAllSupervisors();
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

getAllSupervisors();
