$(document).ready(function () {
  //var Loader = document.getElementById('loading');
  //var SLoader = document.getElementById('signuploading');
  const url = 'https://myexample.gq/api/v1/';
  function adminAuth() {
    if (localStorage.getItem('loggedadmin') === null || undefined) {
      try {
        const Login = document.getElementById('btnsubmit');
        Login.addEventListener('click', function (event) {
          event.preventDefault();
          var email = document.getElementById('email').value;
          var password = document.getElementById('password').value;
          //Loader.style.display = 'block';
          // Login a user
          fetch(`${url}auth/login`, {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              const userData = json;
              //console.log(userData);
              if (userData.success === true) {
                const username = userData.user;
                const userId = userData.id;
                const usertoken = userData.token;
                const userRole = userData.role;
                const userImg =
                  // Remove once every user had image or is not defined
                  userData.photo ||
                  `https://ui-avatars.com/api/?name=${username}&background=1ABB9C&color=fff&rounded=true&bold=true`;
                //console.log('Logged In User: ', username);

                if (
                  userRole === 'admin' ||
                  'client' ||
                  'cleaner' ||
                  'supervisor'
                ) {
                  //Save logged in user to localstorage for later use
                  window.localStorage.setItem('loggedadmin', username);
                  window.localStorage.setItem('adminid', userId);
                  window.localStorage.setItem('admintoken', usertoken);
                  window.localStorage.setItem('isAdmin', userRole);
                  window.localStorage.setItem('avatar', userImg);
                  console.log('Admin only allowed!!');
                  window.location.assign(
                    '../../../../dashboard/production/index.html'
                  );
                } else {
                  window.location.assign(
                    '../../../../dashboard/production/login.html'
                  );
                }
              } else {
                console.log('Error:', userData.error);
                window.location.assign(
                  '../../../../dashboard/production/login.html'
                );
              }
            })
            .catch(function (err) {
              console.log(err);
              window.location.assign(
                '../../../../dashboard/production/login.html'
              );
            });
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      console.log('Already logged in user!!');
      window.location.assign('../../../../dashboard/production/index.html');
    }
  }

  adminAuth();
});
