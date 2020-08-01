const url = 'http://46.101.210.191:5000/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('vacancyTBody');

const form = document.getElementById('addVacancy');
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

const modal = $('#editModal');
const title = document.getElementById('modalVacancyTitle');
const jobType = document.getElementById('modalVacancyWorktime');
const date = document.getElementById('modalVacancyDate');
const description = document.getElementById('modalVacancyDescription');

let vacancyList = [];
const modalForm = document.getElementById('editVacancy');

function editSupervisor(id) {
  const currentVacancy = vacancyList.find((vacancy) => vacancy._id === id);
  modalForm.dataset.id = id;
  title.value = currentVacancy.title;
  jobType.value = currentVacancy.jobType;
  description.value = currentVacancy.description;

  const dateA = Date.parse(currentVacancy.date);
  date.value = dateA.toString('yyyy-MM-dd');

  modal.modal('show');
}

async function deleteVacancy(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/vacancy/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted vacancy', TIMEOUT);
    await getAllVacancies();

    // Update and remove vacancyList
    const vacancy = vacancyList.find((vacancy) => vacancy._id === id);
    newList = vacancyList.filter((newList) => newList !== vacancy);
    vacancyList = newList;
    //console.log('Vacancy cache LIST: ', vacancyList);
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

function getAllVacancies() {
  loading.style.display = 'block';
  fetch(`${url}/vacancy`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allVacancies) => {
      const vacancies = allVacancies.data;
      //console.log('allVacancies: ', vacancies);
      vacancyList = vacancies;
      //console.log(vacancyList);

      // Delete table if #vacancyTable exists
      if ($.fn.DataTable.isDataTable('#vacancyTable')) {
        $('#vacancyTable').DataTable().clear().destroy();
      }

      const output = vacancies.map((vacancy) => {
        const date = Date.parse(vacancy.date).toString('dd-MM-yyyy');
        return `
                <tr>
                    <td>${vacancy.title}</td>
                    <td>${vacancy.jobType}</td>
                    <td>${date}</td>
                    <td>
                        <pre
                            style=" width: 100%; height: 100%; font-family: inherit; text-align: justify; margin: 0; padding: 0;white-space: pre-line;">
                            ${vacancy.description}
                    </pre>
                    </td>
                    <td><button id="editIcon" type="button" class="btn" title="Edit" data-edit=${vacancy._id}><i
                                class="fa fa-edit"></i></button></td>
                    <td><button id="deleteIcon" type="button" class="btn" title="Delete" data-delete=${vacancy._id}><i
                                class="fa fa-trash fa-2x text-danger"></i></button></td>
                </tr>
                `;
      });
      // console.log('output: ', output);
      tBody.innerHTML = output.join(' ');
      $('#vacancyTable').DataTable();
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');
      const editIcons = document.querySelectorAll('#editIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          // console.log(e.currentTarget);
          const id = e.currentTarget.dataset.delete;
          deleteVacancy(id);
        });
      });

      editIcons.forEach((editIcon) => {
        editIcon.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.edit;
          editSupervisor(id);
        });
      });
    });
}

//console.log('vacancyList: ', vacancyList);

// Update Vacancy
modalForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = e.path[0].dataset.id;

  try {
    let response = await fetch(`${url}/vacancy/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        title: title.value,
        jobType: jobType.value,
        date: date.value,
        description: description.value,
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

    showAlertSuccess('Successfully updated vacancy', TIMEOUT);
    getAllVacancies();

    // Show success alert msg
  } catch (error) {
    console.log('Error: ', error);
    modal.modal('hide');
    showAlertError(error, TIMEOUT);
  }
};

// Add Vacancy
form.onsubmit = async (e) => {
  e.preventDefault();
  // const formData = new FormData(form);
  const title = $('#vacancyTitle').val();
  const jobType = $('#vacancyJobType').val();
  const date = $('#vacancyDate').val();
  const description = $('#vacancyDescription').val();
  // return;
  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/vacancy`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        title: title,
        jobType: jobType,
        date: date,
        description: description,
      }),
    });
    form.reset();
    let result = await response.json();
    //console.log('Result: ', result);
    loading.style.display = 'none';

    if (!result.success) {
      showAlertError(result.error, TIMEOUT);
      return;
    }

    showAlertSuccess('Successfully added vacancy', TIMEOUT);
    getAllVacancies();
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

getAllVacancies();
