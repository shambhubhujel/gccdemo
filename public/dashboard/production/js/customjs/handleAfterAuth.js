$(document).ready(function () {
  function showhideMenu() {
    const showhide = document.getElementById('showhideMenus');
    let output = ``;
    if (window.localStorage.getItem('isAdmin') === 'admin') {
      output += `
      <li><a><i class="fa fa-home"></i> Dashboard </a>
        <ul class="nav child_menu">
          <li><a href="index.html">Home</a></li>
        </ul>
      </li>
      <li><a><i class="fa fa-users"></i> Cleaner's Task </a>
      <ul class="nav child_menu">
        <li><a href="cleaner_workdone_submission.html"><i class="fa fa-file"></i> WorkDone Submission</a></li>
      </ul>
      </li>
      <li><a><i class="fa fa-table"></i> Employee Details <span class="fa fa-chevron-down"></span></a>
        <ul class="nav child_menu">
          <li><a href="all_Users.html">All Users</a></li>
          <li><a href="cleaners_details.html">Cleaner Details</a></li>
          <li><a href="workLocation_withPhotos.html">Cleaner's WorkDone Details</a></li>
          <li><a href="supervisors_details.html">Supervisor Details</a></li>
          <li><a href="make_inspections.html">Make Inspections</a></li>
        </ul>
      </li>

      <li><a><i class="fa fa-bar-chart-o"></i>Client Sites <span class="fa fa-chevron-down"></span></a>
        <ul class="nav child_menu">
          <li><a href="all_Clients.html">All Clients</a></li>
          <li><a href="clients_details.html">Work Sites(Clients) Details</a></li>
          <li><a href="clients_reviews.html">Reviews</a></li>
          <li><a href="clients_complains.html">Complains</a></li>
        </ul>
      </li>

      <li><a><i class="fa fa-edit"></i>Add Employees <span class="fa fa-chevron-down"></span></a>
        <ul class="nav child_menu">
          <li><a href="add_cleaners.html">Add Cleaners</a></li>
          <li><a href="add_supervisors.html"> Add Supervisors</a></li>
        </ul>
      </li>

      <li><a><i class="fa fa-sticky-note-o"></i>Careers <span class="fa fa-chevron-down"></span></a>
        <ul class="nav child_menu">
          <li><a href="add_vacancy.html">Add Vacancy</a></li>
          <li><a href="vacancyApplicantsDetails.html"> Career Applicants Details</a></li>
        </ul>
      </li>`;
      showhide.innerHTML = output;
    } else if (window.localStorage.getItem('isAdmin') === 'client') {
      output += `
      <li><a><i class="fa fa-home"></i> Dashboard </a>
        <ul class="nav child_menu">
          <li><a href="index.html">Home</a></li>
          <li><a href="client_mySites.html">My Sites</li>
        </ul>
      </li>`;
      showhide.innerHTML = output;
    } else if (window.localStorage.getItem('isAdmin') === 'supervisor') {
      output += `
      <li><a><i class="fa fa-table"></i> Employee Details <span class="fa fa-chevron-down"></span></a>
      <ul class="nav child_menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="cleaners_details.html">Cleaner Details</a></li>
        <li><a href="workLocation_withPhotos.html">Cleaner's WorkDone Details</a></li>
        <li><a href="supervisors_details.html">Supervisor Details</a></li>
        <li><a href="make_inspections.html">Make Inspections</a></li>
      </ul>
    </li>`;
      showhide.innerHTML = output;

    } else {
      output += `
      <li><a><i class="fa fa-users"></i> Cleaner's Task </a>
      <ul class="nav child_menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="cleaner_workdone_submission.html"><i class="fa fa-file"></i> WorkDone Submission</a></li>
      </ul>
      </li>`;
      showhide.innerHTML = output;
    }

  }
  function logout() {
    const Logout = document.getElementById('logout');
    Logout.addEventListener('click', function (event) {
      localStorage.clear();
      window.location.assign('../../../../dashboard/production/login.html');
    });
  }
  showhideMenu();
  logout();
});