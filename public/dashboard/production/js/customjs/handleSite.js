const url = 'https://myexample.gq/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('siteTBody');
const selectOption = document.getElementById('clientname');
const selectCleanerOption = document.getElementById('workSiteCleaner');

const form = document.getElementById('addSite');
let name = null;
let user = null;
let cleanerName = null;
let cleanerID = null;
const email = document.getElementById('emailSubjectClient');
const phone = document.getElementById('phoneClient');
const workSite = document.getElementById('workSiteClient');
const address = document.getElementById('workSiteAddress');
const time = document.getElementById('workSiteTime');
const date = document.getElementById('workSiteDate');
const detail = document.getElementById('workSiteDetail');

const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

async function deleteSite(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/site/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted site', TIMEOUT);
    await getAllSite();
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

function loadAllClient() {
  fetch(`${url}/admin?role=client`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allClients) => {
      const clients = allClients.data;
      // console.log(clients);
      let output = ``;
      output += `<option value="">Slect a Client</option>`;
      output += clients.map((client) => {
        return `<option value='${JSON.stringify({
          name: `${client.name}`,
          user: `${client._id}`,
          email: `${client.email}`,
          phone: `${client.phone}`,
        })}'>
        ${client.name}
        </option>`;
      });
      selectOption.innerHTML = output;
    });

  selectOption.addEventListener('change', function () {
    // console.log(this.value);
    const values = JSON.parse(this.value);
    // console.log(values);
    name = values.name;
    user = values.user;
    phone.value = values.phone;
    email.value = values.email;
  });
}
function loadAllCleaner() {
  fetch(`${url}/admin?role=cleaner`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allCleaner) => {
      const cleaners = allCleaner.data;
      let output = ``;
      output += `<option value="">Select a Cleaner for Site</option>`;
      output += cleaners.map((cleaner) => {
        return `<option value='${JSON.stringify({
          name: `${cleaner.name}`,
          id: `${cleaner._id}`,
        })}'>
          ${cleaner.name}
        </option>`;
      });
      selectCleanerOption.innerHTML = output;
    });
  selectCleanerOption.addEventListener('change', function () {
    const values = JSON.parse(this.value);
    cleanerID = values.id;
    cleanerName = values.name;
  });
}


function getAllSite() {
  loading.style.display = 'block';
  fetch(`${url}/site`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
  .then((response) => response.json())
  .then((allSite) => {
    const sites = allSite.data;
    console.log('Sites: ', sites);
    const output = sites.map((site) => {
      const date = Date.parse(site.date).toString('dd-MM-yyyy');
      return `
          <tr>
            <td>${site.name}</td>
            <td>${site.cleanerName}</td>
            <td>${site.email}</td>
            <td>${site.phone}</td>
            <td>${site.workSite}</td>
            <td>${site.address}</td>
            <td>${site.time}</td>
            <td>${date}</td>
              <td>${site.detail}</td>
              <td class="text-center">
                <a id="deleteIcon" href="#" data-delete="${site._id}">
                  <i class="fa fa-trash fa-2x text-danger "></i>
                </a>
              </td>
            </tr>
        `;
      });
      tBody.innerHTML = output.join('');
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.delete;
          deleteSite(id);
        });
      });
    });
}

// Add Site
form.onsubmit = async (e) => {
  e.preventDefault();
  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/site/`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name: name,
        cleanerName: cleanerName,
        email: email.value,
        phone: phone.value,
        workSite: workSite.value,
        address: address.value,
        time: time.value,
        date: date.value,
        detail: detail.value,
        user: user,
        cleanerID: cleanerID,
      }),
    });
    form.reset();
    let result = await response.json();
    // console.log('Result', result);
    loading.style.display = 'none';

    if (!result.success) {
      showAlertError(result.error, TIMEOUT);
      return;
    }

    showAlertSuccess('Successfully added work site', TIMEOUT);
    getAllSite();
  } catch (error) {
    console.error('Error: ', error);
    loading.style.display = 'none';
    showAlertError(error, TIMEOUT);
  }
};

loadAllClient();
loadAllCleaner();
getAllSite();

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
