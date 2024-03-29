$(document).ready(function () {
  const url = 'https://myexample.gq/api/v1/';
  const token = window.localStorage.getItem('admintoken');
  let countAdmin = 0;
  let countSupevisor = 0;
  let countClient = 0;
  let countCleaner = 0;
  let countReview = 0;
  let countComplain = 0;

  countReview = document.getElementById('reviewCounter');
  countComplain = document.getElementById('complainCounter');
  function topTiles_Counter() {
    fetch(`${url}admin/`, {
      headers: { Authorization: 'Bearer ' + token },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((allUsers) => {
        //console.log(allUsers);
        const usersData = allUsers.data;
        //console.log('ALL USERS:', usersData);
        //console.log(usersData.length);
        for (let index = 0; index < usersData.length; index++) {
          var item_count = usersData[index];
          if (item_count.role === 'client') {
            countClient = countClient + 1;
          }
          if (item_count.role === 'cleaner') {
            countCleaner = countCleaner + 1;
          }
          if (item_count.role === 'admin') {
            countAdmin = countAdmin + 1;
          }
          if (item_count.role === 'supervisor') {
            countSupevisor = countSupevisor + 1;
          }
        }
        document.getElementById('adminCounter').innerText = countAdmin;
        document.getElementById('clientCounter').innerText = countClient;
        document.getElementById('supervisorCounter').innerText = countSupevisor;
        document.getElementById('cleanerCounter').innerText = countCleaner;
        //Do later for reviews and complains counters too
        countComplain.innerText = window.localStorage.getItem('countComplains');
        countReview.innerText = window.localStorage.getItem('countReviews');
      })
  }

  function getAllUsers() {
    fetch(`${url}admin/`, {
      headers: { Authorization: 'Bearer ' + token },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((allUsers) => {
        //console.log(allUsers);
        const usersData = allUsers.data;
        //console.log('ALL USERS:', usersData);
        //console.log(usersData.length);
        let output = ``;
        for (let index = 0; index < usersData.length; index++) {
          var item = usersData[index];
          const date = item.startDate
            ? moment(item.startDate).format('DD-MM-YYYY')
            : '';
          output += `<tr>
          <td>${item.name}</td>
          <td>${item.role}</td>
          <td>${item.address}</td>
          <td>${item.email}</td>
          <td>${item.age}</td>
          <td>${item.phone}</td>
          <td>${item.office}</td>
          <td>${date}</td>
          </tr>
          `;
        }

        document.getElementById('userData').innerHTML = output;
      })
      .then(() => {
        var table = $('#allUserTable').DataTable();
        new $.fn.dataTable.Buttons(table, {
          buttons: ['print', 'excel', 'copy', 'csv', 'pdf'],
        });
        table
          .buttons()
          .container()
          .appendTo('#allUserTable_wrapper .col-sm-6:eq(0)');
      })
      .catch((err) => console.log(err));
  }
  topTiles_Counter();
  getAllUsers();
});
