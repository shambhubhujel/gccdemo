const url = 'http://46.101.210.191:5000/api/v1';
const token = window.localStorage.getItem('admintoken');
const tBody = document.getElementById('siteTBody');
const ID = window.localStorage.getItem('adminid');
const loading = document.getElementById('runLoader');

function getAllSite() {
  loading.style.display = 'block';
  fetch(`${url}/site/${ID}`, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((allSite) => {
      const sites = allSite.data;
      const output = sites.map((site) => {
        return `
            <tr>
              <td>${site.name}</td>
              <td>${site.email}</td>
              <td>${site.phone}</td>
              <td>${site.workSite}</td>
              <td>${site.address}</td>
              <td>${site.detail}</td>
            </tr>
        `;
      });
      tBody.innerHTML = output.join('');
      loading.style.display = 'none';
    });
}

getAllSite();
