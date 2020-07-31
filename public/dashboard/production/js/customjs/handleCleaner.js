const url = 'http://localhost:5000/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('cleanerTBody');

const form = document.getElementById('addCleaner');
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

const modal = $('#editModal');
const name = document.getElementById('modalCleanerFullName');
const email = document.getElementById('modalCleanerEmailAddress');
const phone = document.getElementById('modalPhoneCleaner');
const address = document.getElementById('modalCleanerAddress');
const age = document.getElementById('modalAgeCleaner');
const position = document.getElementById('modalPositionCleaner');
const office = document.getElementById('modalOfficeCleaner');
const startDate = document.getElementById('modalCleanertStartDate');

let cleanerList = [];
const modalForm = document.getElementById('editCleaner');

function editCleaner(id) {
  const currentCleaner = cleanerList.find((cleaner) => cleaner._id === id);
  modalForm.dataset.id = id;
  name.value = currentCleaner.name;
  email.value = currentCleaner.email;
  phone.value = currentCleaner.phone;
  address.value = currentCleaner.address;
  age.value = currentCleaner.age;
  position.value = currentCleaner.position;
  office.value = currentCleaner.office;

  const date = Date.parse(currentCleaner.startDate);
  startDate.value = date.toString('yyyy-MM-dd');

  modal.modal('show');
}

async function deleteCleaner(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/admin/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted cleaner', TIMEOUT);
    await getAllCleaner();

    // Update and remove cleanerList
    const cleaner = cleanerList.find((cleaner) => cleaner._id === id);
    newList = cleanerList.filter((newList) => newList !== cleaner);
    cleanerList = newList;
    console.log('Cleaner cache LIST: ', cleanerList);
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

function getAllCleaner() {
  loading.style.display = 'block';
  fetch(`${url}/admin?role=cleaner`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allCleaners) => {
      const cleaners = allCleaners.data;
      //console.log('All Cleaners: ', cleaners);
      cleanerList = cleaners;
      //console.log('Cleaner List: ', cleanerList);

      // Delete table if #cleanerTable exists
      if ($.fn.DataTable.isDataTable('#cleanerTable')) {
        $('#cleanerTable').DataTable().clear().destroy();
      }

      const output = cleaners.map((cleaner) => {
        let StartDate = Date.parse(cleaner.startDate);
        StartDate = StartDate.toString('dd-MM-yyyy');
        // const StartDate = Date.parse(cleaner.startDate);
        return `<tr>
              <td>${cleaner.name}</td>
              <td>${cleaner.email}</td>
              <td>${cleaner.phone}</td>
              <td>${cleaner.age}</td>
              <td>${cleaner.position}</td>
              <td>${cleaner.office}</td>

              <td><a href="${cleaner.photo}">
                      <img src="${
                        cleaner.photo ||
                        'https://via.placeholder.com/300?text=Image+Not+Available'
                      }"
                  </a></td>
              <td>${cleaner.address}</td>
              <td>${StartDate}</td>
              <td><a id="editIcon" href="#" title="Edit" data-edit="${
                cleaner._id
              }">
                      <i class="fa fa-edit fa-2x"></i>
                  </a></td>
              <td>
                  <a id="deleteIcon" href="#" title="Delete" data-delete="${
                    cleaner._id
                  }">
                      <i class="fa fa-trash fa-2x text-danger"></i>
                  </a>
              </td>
          </tr>`;
      });
      tBody.innerHTML = output.join(' ');
      $('#cleanerTable').dataTable();
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');
      const editIcons = document.querySelectorAll('#editIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          // console.log(e.currentTarget);
          const id = e.currentTarget.dataset.delete;
          deleteCleaner(id);
        });
      });

      editIcons.forEach((editIcon) => {
        editIcon.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.edit;
          //console.log('Edit_ID: ', id);
          editCleaner(id);
        });
      });
    });
}

// Update Cleaner
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

    showAlertSuccess('Successfully updated cleaner', TIMEOUT);
    getAllCleaner();

    // Show success alert msg
  } catch (error) {
    console.log('Error: ', error);
    modal.modal('hide');
    showAlertError(error, TIMEOUT);
  }
};

// Add Cleaner
form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append('role', 'cleaner');
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

    showAlertSuccess('Successfully added cleaner', TIMEOUT);
    getAllCleaner();
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

getAllCleaner();
