$(document).ready(function () {
  const url = 'http://54.79.196.224/api/v1/';
  const token = window.localStorage.getItem('admintoken');

  //Fetch all the complains from db
  function getAllComplains() {
    fetch(`${url}complain/`, {
      headers: { Authorization: 'Bearer ' + token },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((complains) => {
        //console.log(complains);
        const allComplains = complains.data;
        //console.log('Complains:', allComplains);
        //console.log(allComplains.length);
        const countReviews = allComplains.length;
        window.localStorage.setItem('countComplains', countReviews);
        let output = '';
        for (let index = 0; index < allComplains.length; index++) {
          var item = allComplains[index];
          const photos = item.photo;
          var id = item._id;
          output += `<tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.phone}</td>
          <td>${item.message}</td>
          <td>
          ${photos
              .map((photo) => {
                return `
              <a href="${photo}"target="_blank">
              <img src="${photo}" alt="client image">
              </a>
          `;
              })
              .join(' ')}
          </td>`;
          output +=
            '<td><a onClick=\'deleteComplain("' +
            id +
            "\")' href='./clients_complains.html'>" +
            "<i class='fa fa-trash fa-2x text-danger'></i>" +
            '</a></td>' +
            '</tr>';
        }

        document.getElementById('getAllComplains').innerHTML = output;
        var table = $('#complainTable').DataTable();
        new $.fn.dataTable.Buttons(table, {
          buttons: ['print', 'excel', 'copy', 'csv', 'pdf'],
        });
        table
          .buttons()
          .container()
          .appendTo('#complainTable_wrapper .col-sm-6:eq(0)');
      })
      .catch((err) => console.log(err));
  }

  getAllComplains();
});
