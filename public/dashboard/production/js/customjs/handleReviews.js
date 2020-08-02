$(document).ready(function () {
  const url = 'https://myexample.gq/api/v1/';
  const token = window.localStorage.getItem('admintoken');
  const tBody = document.getElementById('getAllReviews');

  function deleteReview(id) {
    fetch(`https://myexample.gq/api/v1/reviews/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
      .then((data) => data.json())
      .then((reviews) => {
        location.reload();
      });
  }

  function editPublish(id, publish) {
    fetch(`https://myexample.gq/api/v1/reviews/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        publish: publish,
      }),
    })
      .then((data) => data.json())
      .then((reviews) => {
        console.log(reviews);
        location.reload();
      })
      .catch((err) => console.log(err));
  }

  // Fetch All Reviews
  function getAllReviews() {
    fetch(`${url}reviews/allreviews`, {
      headers: { Authorization: 'Bearer ' + token },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((reviews) => {
        //console.log(reviews);
        const allReviews = reviews.data;

        // Delete table if #reviewTable exists
        if ($.fn.DataTable.isDataTable('#reviewTable')) {
          $('#reviewTable').DataTable().clear().destroy();
        }
        //console.log('Reviews:', allReviews);
        //console.log(allReviews.length);
        const countReviews = allReviews.length;
        window.localStorage.setItem('countReviews', countReviews);
        let output = '';
        output = allReviews.map((item) => {
          const isPublish = item.publish;
          return `<tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.company}</td>
          <td>${item.message}</td>
          <td>
              <a href="${item.photo}"target="_blank">
              <img src="${item.photo}" alt="client image">
              </a>
          </td>
          <td id="editIcon" class="text-center" data-edit="${
            item._id
          }" data-publish="${isPublish}">
            ${
              isPublish
                ? `<i class="fa fa-eye fa-2x text-success"></i>`
                : `<i class="fa fa-eye-slash fa-2x text-danger"></i>`
            }
          </td>
          <td class="text-center">
            <a id="deleteIcon" href="#" data-delete="${item._id}">
              <i class="fa fa-trash fa-2x text-danger"></i>
            </a>
          </td>
              `;
        });
        // for (let index = 0; index < allReviews.length; index++) {
        //   var item = allReviews[index];
        //   const isPublish = item.publish;
        //   // console.log('ITEM: ', item);
        //   output += `<tr>
        //   <td>${item.name}</td>
        //   <td>${item.email}</td>
        //   <td>${item.company}</td>
        //   <td>${item.message}</td>
        //   <td>
        //       <a href="${item.photo}"target="_blank">
        //       <img src="${item.photo}" alt="client image">
        //       </a>
        //   </td>
        //   <td id="editIcon" class="text-center" data-edit="${
        //     item._id
        //   }" data-publish="${isPublish}">
        //     ${
        //       isPublish
        //         ? `<i class="fa fa-eye fa-2x text-success"></i>`
        //         : `<i class="fa fa-eye-slash fa-2x text-danger"></i>`
        //     }
        //   </td>
        //   <td class="text-center">
        //     <a id="deleteIcon" href="#" data-delete="${item._id}">
        //       <i class="fa fa-trash fa-2x text-danger"></i>
        //     </a>
        //   </td>
        //       `;

        // output += "<td id='showhide_publishReview" + item._id + "'>";
        // output +=
        //   '<td><a onClick=\'deleteReview("' +
        //   item._id +
        //   "\")' href='./clients_reviews.html'>" +
        //   "<i class='fa fa-trash fa-2x text-danger'></i>" +
        //   '</a></td>' +
        //   '</tr>';
        // }

        tBody.innerHTML = output.join('');
        // $('#reviewTable').DataTable();
        var table = $('#reviewTable').DataTable();
        new $.fn.dataTable.Buttons(table, {
          buttons: ['print', 'excel', 'copy', 'csv', 'pdf'],
        });
        table
          .buttons()
          .container()
          .appendTo('#reviewTable_wrapper .col-sm-6:eq(0)');

        const editIcons = document.querySelectorAll('#editIcon');
        const deleteIcons = document.querySelectorAll('#deleteIcon');

        deleteIcons.forEach((deleteIcon) => {
          deleteIcon.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.delete;
            deleteReview(id);
          });
        });

        editIcons.forEach((editIcon) => {
          editIcon.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.edit;
            const tempPublish = e.currentTarget.dataset.publish;
            const publish = tempPublish === 'true' ? false : true;
            // console.log(publish);
            editPublish(id, publish);
          });
        });

        // //Logic for Publish/Unpublish reviews for website
        // for (let index = 0; index < allReviews.length; index++) {
        //   var item = allReviews[index];
        //   if (item.publish === true) {
        //     console.log('Unpublish now');
        //     var ifPublished =
        //       "<a rel='Unpublish Review' onClick='unpublishReview(\"" +
        //       item._id +
        //       "\")' href='./clients_reviews.html'>" +
        //       "<i class='fa fa-check-circle fa-2x text-success' aria-hidden='true'></i></td>";

        //     document.getElementById(
        //       'showhide_publishReview' + item._id
        //     ).innerHTML = ifPublished;
        //   } else {
        //     console.log('Publish now');
        //     var ifUnpublished =
        //       "<a rel='Publish Review' onClick='publishReview(\"" +
        //       item._id +
        //       "\")' href='./clients_reviews.html'>" +
        //       "<i class='fa fa-universal-access fa-check-circle fa-2x text-warning' aria-hidden='true'></i></td>";

        //     document.getElementById(
        //       'showhide_publishReview' + item._id
        //     ).innerHTML = ifUnpublished;
        //   }
        // }
      })
      .catch((err) => console.log(err));
  }

  getAllReviews();
});
