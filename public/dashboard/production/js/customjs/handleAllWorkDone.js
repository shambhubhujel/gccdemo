const url = 'https://myexample.gq/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('workDoneTBody');

const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

async function deleteCleanerWorkDone(id) {
  try {
    loading.style.display = 'block';
    let result = await fetch(`${url}/work/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'DELETE',
    });
    loading.style.display = 'none';

    showAlertSuccess('Successfully deleted cleaner work', TIMEOUT);
    await getCleanerWorks();
  } catch (error) {
    console.log('Error: ', error);
    showAlertError(error, TIMEOUT);
  }
}

function getCleanerWorks() {
  loading.style.display = 'block';
  fetch(`${url}/work`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allWorkDone) => {
      const workDone = allWorkDone.data;
      console.log('allWorkDone: ', workDone);

      // Delete table if #workDoneTable exists
      if ($.fn.DataTable.isDataTable('#workDoneTable')) {
        $('#workDoneTable').DataTable().clear().destroy();
      }

      const output = workDone.map((work, i) => {
        const date = Date.parse(work.workDate).toString('dd-MM-yyyy');
        const start = moment(work.createdAt).format('hh:mm:A');
        const end = work.finishedAt
          ? moment(work.finishedAt).format('hh:mm:A')
          : '';
        const images = `${work.photo.map((img) => {
          return `
                            <a href="${img}"target="_blank">
                            <img src="${img}" alt="client image" width="100px" >
                            </a>
                        `;
        })}`.split(',');
        return `
                <tr>
                    <td>${work.name}</td>
                    <td>${work.address}</td>
                    <td>
                    ${images.map((image) => image).join(' ')}
                    </td>
                    <td>
                      ${date}
                    </td>
                    <td>${start}</td>
                    <td>${end}</td>
                    <td>
                        <a id="deleteIcon" href="#" title="Delete" data-delete="${
                          work._id
                        }">
                            <i class="fa fa-trash fa-2x text-danger"></i>
                        </a>
                    </td>
                </tr>
                `;
      });
      // console.log('output: ', output);
      tBody.innerHTML = output.join(' ');
      $('#workDoneTable').DataTable();
      loading.style.display = 'none';

      const deleteIcons = document.querySelectorAll('#deleteIcon');

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener('click', (e) => {
          // console.log(e.currentTarget);
          const id = e.currentTarget.dataset.delete;
          deleteCleanerWorkDone(id);
        });
      });
    });
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

getCleanerWorks();
