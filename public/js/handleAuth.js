$(document).ready(function () {
  var Loader = document.getElementById('loading');
  var SLoader = document.getElementById('signuploading');
  const url = 'https://myexample.gq/api/v1/';
  function UserLogin() {
    if (localStorage.getItem('loggeduser') === null || undefined) {
      try {
        const Login = document.getElementById('Login');
        Login.addEventListener('click', function (event) {
          event.preventDefault();
          var email = document.getElementById('email').value;
          var password = document.getElementById('password').value;
          Loader.style.display = 'block';
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
                //console.log('Logged In User: ', username);
                //Save logged in user to localstorage for later use
                window.localStorage.setItem('loggeduser', username);
                window.localStorage.setItem('userid', userId);
                window.localStorage.setItem('token', usertoken);
                window.localStorage.setItem('role', userRole);
                window.location.assign('../index.html');
              } else {
                console.log('Error:', userData.error);
                window.location.assign('../login.html');
              }
            })
            .catch(function (err) {
              console.log(err);
              window.location.assign('../login.html');
            });
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      console.log('Already logged in user!!');
      window.location.assign('../index.html');
    }
  }
  function UserRegister() {
    try {
      const Register = document.getElementById('Register');
      Register.addEventListener('click', function (register) {
        register.preventDefault();
        SLoader.style.display = 'block';
        var name = document.getElementById('signup_fullname').value;
        var email = document.getElementById('signup_email').value;
        var address = document.getElementById('signup_address').value;
        var office = document.getElementById('signup_company').value;
        var age = document.getElementById('signup_age').value;
        var phone = document.getElementById('signup_phone').value;
        var password = document.getElementById('signup_password').value;
        // Register a new user
        fetch(`${url}auth/register`, {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method: 'POST',
          body: JSON.stringify({
            email: email,
            name,
            address,
            office,
            age,
            phone,
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
              //console.log('Logged In User: ', username);
              //Save logged in user to localstorage for later use
              window.localStorage.setItem('loggeduser', username);
              window.localStorage.setItem('userid', userId);
              window.localStorage.setItem('token', usertoken);

              window.location.assign('../index.html');
            } else {
              console.log('Error:', userData.error);
              window.location.assign('../signup.html');
            }
          })
          .catch(function (err) {
            console.log(err);
            window.location.assign('../login.html');
          });
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  UserLogin();
  UserRegister();
});
