const url = 'https://myexample.gq/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('workDoneTBody');
const cleanerTBody = document.getElementById('cleanerShiftTBody');
const ID = window.localStorage.getItem('adminid');
const isAdmin = window.localStorage.getItem('isAdmin');
const currentDate = moment().format('DD-MM-YYYY');
const selectOption = document.getElementById('workaddress');

const form = document.getElementById('addWorkDone');
let workDate = null;
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

const modal = $('#finishShiftModal');
const modalForm = document.querySelector('#finishShift');
let workID = null;

let workLocation = null;
let currentSiteID = null;

!ID && showAlertError('ID not found from local storage', TIMEOUT);

// Hide form if admin is logged in
isAdmin === 'admin' ? form.remove() : null;

// get current location
let latitude;
let longitude;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function locationSuccess(pos) {
  const crds = pos.coords;
  latitude = crds.latitude;
  longitude = crds.longitude;

  console.log('Your current position is:');
  console.log(`Latitude : ${latitude}`);
  console.log(`Longitude: ${longitude}`);
}

function locationError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  showAlertError(
    `ERROR(${err.code}): ${err.message}. Please allow location tracking`,
    TIMEOUT
  );
}

navigator.geolocation.getCurrentPosition(
  locationSuccess,
  locationError,
  options
);

function loadAllSite() {
  fetch(`${url}/site/cleaner/${ID}`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allSite) => {
      const sites = allSite.data;
      if ($.fn.DataTable.isDataTable('#cleanerShiftTable')) {
        $('#cleanerShiftTable').DataTable().clear().destroy();
      }
      // Cleaner's shift time
      const filterShifts = sites.filter((site) => {
        const hasDayPassed = moment(
          Date.parse(site.date).toString('yyyy-MM-dd')
        ).isBefore(moment().format('YYYY-MM-DD'));
        const done = site.done;
        return !hasDayPassed && !done;
      });

      const cleanerShiftOutput = filterShifts.map((shift) => {
        const date = Date.parse(shift.date).toString('dd-MM-yyyy');
        return `<tr>
            <td>${shift.name}</td>
            <td>${shift.phone}</td>
            <td>${shift.address}</td>
            <td>${date}</td>
            <td>${shift.time}</td>
            <td>${shift.detail}</td>
          </tr>
        `;
      });
      cleanerTBody.innerHTML = cleanerShiftOutput.join(' ');
      $('#cleanerShiftTable').DataTable();

      // Upcoming Work for today
      const filteredSite = sites.filter((site) => {
        const date = Date.parse(site.date).toString('dd-MM-yyyy');
        return date === currentDate;
      });
      let output = ``;
      output += `<option value="">Select a Client</option>`;
      output += filteredSite.map((site) => {
        return site.done
          ? null
          : `<option id='${site._id}' value='${site.address}'>
          ${site.address}, ${site.time}
        </option>`;
      });
      selectOption.innerHTML = output;
    });
  selectOption.addEventListener('change', function () {
    workLocation = this.value.split(',');
    workLocation = `${workLocation[0]},${workLocation[1]}`;
    currentSiteID = this.options[this.selectedIndex].id;
  });
}

function getCleanerWorks() {
  loading.style.display = 'block';
  fetch(`${url}/work/${ID}`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allWorkDone) => {
      const workDone = allWorkDone.data;
      //console.log('allWorkDone: ', workDone);

      // Delete table if #workDoneTable exists
      if ($.fn.DataTable.isDataTable('#workDoneTable')) {
        $('#workDoneTable').DataTable().clear().destroy();
      }

      const output = workDone.map((work) => {
        const date = Date.parse(work.workDate).toString('dd-MM-yyyy');
        const start = moment(work.createdAt).format('hh:mm:A');
        const end = work.finishedAt
          ? moment(work.finishedAt).format('hh:mm:A')
          : '';
        const btnEnable = `
          <button
            type="button"
            class="btn btn-lg btn-danger btn-block endShift"
            data-id="${work._id}"
          >
            FINISH SHIFT
          </button>`;
        const btnDisable = `<button type="button" class="btn btn-lg btn-danger btn-block" disabled="disabled">FINISHED</button>`;
        return `
                <tr>
                    <td>${work.name}</td>
                    <td>${work.address}</td>
                    <td>
                    ${work.photo
                      .map((img) => {
                        return `
                            <a href="${img}"target="_blank">
                            <img src="${img}" alt="client image" width="100px" >
                            </a>
                        `;
                      })
                      .join(' ')}
                    </td>
                    <td>
                      ${date}
                    </td>
                    <td>${start}</td>
                    <td>${end}</td>
                    <td class="text-center" style="vertical-align:middle">${
                      end ? btnDisable : btnEnable
                    }</td>
                </tr>
                `;
      });
      // console.log('output: ', output);
      tBody.innerHTML = output.join(' ');
      $('#workDoneTable').DataTable();
      loading.style.display = 'none';

      const endShift = document.querySelectorAll('.endShift');

      endShift.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          workID = e.currentTarget.dataset.id;
          modal.modal('show');
        });
      });
    });
}

//Finish Work
modalForm.onsubmit = async (e) => {
  e.preventDefault();
  const endShiftTime = new Date();
  const formData = new FormData(modalForm);
  formData.append('finishedAt', endShiftTime);
  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/work/${workID}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
      body: formData,
    });
    modalForm.reset();
    let result = await response.json();
    loading.style.display = 'none';

    if (!result.success) {
      modal.modal('hide');
      showAlertError(result.error, TIMEOUT);
      return;
    }
    modal.modal('hide');
    showAlertSuccess('Successfully finished shift!', TIMEOUT);
    getCleanerWorks();
  } catch (error) {
    console.log('Error: ', error);
    loading.style.display = 'none';
    showAlertError(error, TIMEOUT);
  }
};

// Add Work
form.onsubmit = (e) => {
  e.preventDefault();
  loading.style.display = 'block';
  const formData = new FormData(form);

  // Get User's current location
  fetch(`${url}/work/${latitude}/${longitude}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((location) => {
      // If user request more than 5 times in 1min, prevent user from submitting form
      if (!location.success) {
        showAlertError(location.message, TIMEOUT);
        return;
      }

      const data = location.data[0];
      const fullAddress = data.formattedAddress;

      // Check user's location to selected work site address
      if (!fullAddress.includes(workLocation)) {
        showAlertError(
          `Your current location is ${fullAddress}! `,
          TIMEOUT * 2
        );
        loading.style.display = 'none';
        return;
      }

      // Start user's shift
      formData.append('address', fullAddress);
      formData.append('workDate', moment().toDate());
      formData.append('id', currentSiteID);

      // Post user work
      fetch(`${url}/work/`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log('Result: ', result);
          loading.style.display = 'none';

          if (!result.success) {
            showAlertError(result.error, TIMEOUT);
            return;
          }
          loadAllSite();
          getCleanerWorks();
          showAlertSuccess('Successfully added Work', TIMEOUT);
        });
    })
    .catch((error) => {
      console.error('Error: ', error);
      loading.style.display = 'none';
      showAlertError(error, TIMEOUT);
    });

  // Check if location matched
  // try {
  //   loading.style.display = 'block';
  //   let response = await fetch(`${url}/work/`, {
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //     },
  //     method: 'POST',
  //     body: formData,
  //   });
  //   form.reset();
  //   let result = await response.json();
  //   loading.style.display = 'none';

  //   if (!result.success) {
  //     showAlertError(result.error, TIMEOUT);
  //     return;
  //   }

  //   showAlertSuccess('Successfully added Work', TIMEOUT);
  //   getCleanerWorks();
  // } catch (error) {
  //   console.error('Error: ', error);
  //   loading.style.display = 'none';
  //   showAlertError(error, TIMEOUT);
  // }
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
loadAllSite();
getCleanerWorks();
