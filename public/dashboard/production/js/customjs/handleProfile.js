const url = 'http://54.79.196.224/api/v1';
const token = window.localStorage.getItem('admintoken');
const isClient = window.localStorage.getItem('isAdmin') === 'client';
const ID = window.localStorage.getItem('adminid');
const tBody = document.getElementById('myDetails');

const imgForm = document.getElementById('editImage');
const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

// Image Modal
const imgModal = $('#editImgModal');
const img = document.getElementById('modalImg');

//  Detail Modal
const detailModal = $('#editDetailModal');
const name = document.getElementById('modalDetailFullName');
const email = document.getElementById('modalDetailEmail');
const phone = document.getElementById('modalDetailPhone');
const address = document.getElementById('modalDetailAddress');
const age = document.getElementById('modalDetailAge');
const startDate = document.getElementById('modalDetailStartDate');
const detailModalForm = document.getElementById('editDetail');

// Password Modal
const passwordModal = $('#editPasswordModal');
const currentPassword = document.getElementById('modalCurrentPassword');
const newPassword = document.getElementById('modalNewPassword');
const repeatPassword = document.getElementById('modalRepeatPassword');
const passwordModalForm = document.getElementById('editPassword');

let detailList = [];

function editPassword() {
  passwordModal.modal('show');
}

function editDetail() {
  const date = Date.parse(detailList.startDate);
  name.value = detailList.name;
  email.value = detailList.email;
  phone.value = detailList.phone;
  address.value = detailList.address;
  age.value = detailList.age;
  isClient ? null : (startDate.value = date.toString('yyyy-MM-dd'));

  // remove startdate input if client is logged in
  isClient && startDate.parentElement.remove();

  detailModal.modal('show');
}

function getAllDetails() {
  loading.style.display = 'block';
  fetch(`${url}/auth/me`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allDetails) => {
      const details = allDetails.data;
      detailList = details;
      const date = Date.parse(details.startDate);
      const startDate = date ? date.toString('dd-MM-yyyy') : '';

      const output = `
        <div class="col-md-5 col-sm-12 text-center p-2">
          <div class="profile_img mb-3">
            <div id="crop-avatar">
              <!-- Current avatar -->
              <img class=" w-75 img-responsive" src="${
        details.photo ||
        `https://ui-avatars.com/api/?name=${details.name}&size=512&background=1ABB9C&color=fff&rounded=true&bold=true`
        }" alt="Avatar" title="Change the avatar">
            </div>
          </div>
          <a id="editImg" class="btn btn-success" style="color:#fff; font-size:1rem;"><i class="fa fa-edit mr-1"></i>Edit Image</a>
        </div>
        <div class="col-md-1 col-sm-12"></div>
        <div class="col-md-6 col-sm-12 text-capitalize">

          <h1 class="my-0 pt-0 display-3 font-weight-normal text-uppercase" style="color: #3f3f3f;">${
        details.name || 'Not Provided'
        }</h1>

          <p style="font-size: 1.5rem; letter-spacing: 4px; color:#3f3f3f">${
        details.role || 'Not Provided'
        }<span>, ${details.age || '--'}</span></p>

          <div style="font-size:1.5rem">

            <p><i class="fa fa-envelope user-profile-icon"></i> Email: </p>
            <p><span>${
        details.email || 'Not Provided'
        }</span>
            </p>

            <p><i class="fa fa-phone user-profile-icon"></i> Phone: <span>${
        details.phone || 'Not Provided'
        }</span>
            </p>

            <p><i class="fa fa-map-marker user-profile-icon"></i> Address: <span>${
        details.address || 'Not Provided'
        }</span>
            </p>

            <p>
              <i class="fa fa-briefcase user-profile-icon"></i> Office: <span>${
        details.office || 'Not Provided'
        }</span>
            </p>

            ${
        isClient
          ? ''
          : `
                <p>
                  <i class="fa fa-calendar user-profile-icon"></i> Start Date:
                  <span>${startDate || 'Not Provided'}</span>
                </p>
              `
        }
        </div>


          <a id="editDetail" class="btn btn-success" style="color:#fff; font-size: 1rem;"><i class="fa fa-edit mr-1"></i>Edit Profile</a>

          <a id="editPassword" class="btn btn-success" style="color:#fff; font-size: 1rem;"><i class="fa fa-edit mr-1"></i>Update Password</a>


        </div>
      `;
      tBody.innerHTML = output;
      loading.style.display = 'none';

      const editImgBtn = document.getElementById('editImg');
      const editDetailBtn = document.getElementById('editDetail');
      const editPasswordBtn = document.getElementById('editPassword');

      editImgBtn.addEventListener('click', (e) => {
        editImg();
      });

      editDetailBtn.addEventListener('click', (e) => {
        editDetail();
      });

      editPasswordBtn.addEventListener('click', (e) => {
        editPassword();
      });
    });
}

// update password
passwordModalForm.onsubmit = async (e) => {
  e.preventDefault();
  // Check if new password matches repeat password
  if (newPassword.value !== repeatPassword.value) {
    // if not match
    showAlertError('Password does not match', TIMEOUT);
    passwordModalForm.reset();
    return;
  }
  try {
    let response = await fetch(`${url}/auth/updatepassword`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    });
    let result = await response.json();
    //console.log('Password update: ', result);

    if (!result.success) {
      showAlertError(result.error, TIMEOUT);
      passwordModalForm.reset();
      return;
    }
    // hide modal
    passwordModal.modal('hide');
    showAlertSuccess('Successfully updated password', TIMEOUT);
    passwordModalForm.reset();
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
    passwordModalForm.reset();
  }
};

// update Detail
detailModalForm.onsubmit = async (e) => {
  e.preventDefault();
  try {
    let response = await fetch(`${url}/auth/updatedetails`, {
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
        address: address.value,
        startDate: isClient ? undefined : startDate.value,
      }),
    });
    let result = await response.json();
    //console.log('Update Result: ', result);

    if (!result.success) {
      detailModal.modal('hide');
      showAlertError(result.error, TIMEOUT);
      return;
    }

    // Hide modal
    detailModal.modal('hide');

    showAlertSuccess('Successfully updated details', TIMEOUT);

    getAllDetails();
  } catch (error) {
    console.log('Error: ', error);
    detailModal.modal('hide');
    showAlertError(error, TIMEOUT);
  }
};

function editImg() {
  imgModal.modal('show');
}
// Edit Image
imgForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');

  formData.append('profilePic', fileField.files[0]);

  try {
    loading.style.display = 'block';
    let response = await fetch(`${url}/auth/updatedetails`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
      body: formData,
    });
    imgForm.reset();
    let result = await response.json();
    //console.log('Result: ', result);
    loading.style.display = 'none';

    if (!result.success) {
      imgModal.modal('hide');
      showAlertError(result.error, TIMEOUT);
      return;
    }
    window.localStorage.setItem('avatar', result.data.photo);
    loggedAdmin.innerHTML = `
                    <img src="${window.localStorage.getItem(
      'avatar'
    )}" alt="">${window.localStorage.getItem('loggedadmin')}
                </a>`;
    imgModal.modal('hide');

    showAlertSuccess('Successfully updated profile pic', TIMEOUT);
    getAllDetails();
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

getAllDetails();
