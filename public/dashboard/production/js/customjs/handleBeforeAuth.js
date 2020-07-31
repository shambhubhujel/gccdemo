$(document).ready(function () {
    //console.log("All good here admin");
    function checkAdminAuth() {
        //console.log("From inside check admin auth!!!");

        if (window.localStorage.getItem('isAdmin') === null || undefined) {
            try {
                //console.log("Admin not logged  in!!");
                window.location.assign('../../../../dashboard/production/login.html');

            } catch (error) {
                console.log(error);
            }


        }
        else {
            if (window.localStorage.getItem('isAdmin') === "admin") {
                //console.log("Admin");
            }
        }
    }


    checkAdminAuth();
});
