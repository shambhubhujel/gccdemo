function showHidebtn() {
    const showhide = document.getElementById('showhide');
    //loginbtn=document.getElementById('login');
    //logoutbtn =document.getElementById('logout');
    var test = localStorage.getItem('loggeduser');
    console.log("Test :", test);
    if (localStorage.getItem('loggeduser') === null || undefined) {
      //loginbtn.style.display='block';
      //logoutbtn.style.display='none';
      let output = `<a  class="menu__btn" href="./login.html"> LOGIN</a>`;
      showhide.innerHTML = output;
    }
    else {
      //loginbtn.style.display='none';
      //logoutbtn.style.display='block';
      let output = `<a id="logout" class="menu__btn" href="./index.html"> LOGOUT</a>`;
      showhide.innerHTML = output;
    }
  
  }
  function logout() {
    const Logout = document.getElementById('logout');
    Logout.addEventListener("click", function (event) {
      localStorage.clear();
      window.location.assign('./index.html');
    });
  }
  showHidebtn();
  logout();