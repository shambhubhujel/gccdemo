const url = 'https://myexample.gq/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('clientTBody');

const alertInfo = document.getElementById('alertInfo');
const alertSuccessMsg = document.getElementById('alertSuccessMsg');
const alertError = document.getElementById('alertError');
const alertErrorMsg = document.getElementById('alertErrorMsg');
const loading = document.getElementById('runLoader');
const TIMEOUT = 2000;

async function deleteClient(id) {
    try {
        loading.style.display = 'block';
        let result = await fetch(`${url}/admin/${id}`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            method: 'DELETE',
        });
        loading.style.display = 'none';

        showAlertSuccess('Successfully deleted client', TIMEOUT);
        await getAllClients();
    } catch (error) {
        console.log('Error: ', error);
        loading.style.display = 'none';
        showAlertError(error, TIMEOUT);
    }
}

function getAllClients() {
    loading.style.display = 'block';
    fetch(`${url}/admin?role=client`, {
        headers: { Authorization: 'Bearer ' + token },
        method: 'GET',
    })
        .then((response) => response.json())
        .then((allClients) => {
            const clients = allClients.data;
            console.log('All Clients: ', clients);

            // Delete table if #clientTable exists
            if ($.fn.DataTable.isDataTable('#clientTable')) {
                $('#clientTable').DataTable().clear().destroy();
            }

            const output = clients.map((client) => {
                const joinedDate = Date.parse(client.createdAt).toString('dd-MM-yyyy');
                return `<tr>
              <td>${client.name}</td>
              <td>${client.email}</td>
              <td>${client.address}</td>
              <td>${client.phone}</td>
              <td>${client.office}</td>
              <td>${client.age}</td>
              <td>${joinedDate}</td>
              <td>
                  <a id="deleteIcon" href="#" title="Delete" data-delete="${client._id}">
                      <i class="fa fa-trash fa-2x text-danger"></i>
                  </a>
              </td>
        </tr>`;
            });
            tBody.innerHTML = output.join(' ');
            $('#clientTable').DataTable();
            loading.style.display = 'none';

            const deleteIcons = document.querySelectorAll('#deleteIcon');

            deleteIcons.forEach((deleteIcon) => {
                deleteIcon.addEventListener('click', (e) => {
                    // console.log(e.currentTarget);
                    const id = e.currentTarget.dataset.delete;
                    deleteClient(id);
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

getAllClients();