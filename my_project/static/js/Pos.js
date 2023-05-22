// $(document).ready(function() {
  /* ======================================================================================================================== */
  /* ==============================================Login POS================================================================= */
  /* ======================================================================================================================== */
  let currentInput = null;
  const usernameInput = document.getElementById('userid');
  const passwordInput = document.getElementById('password');

  function onFocus(event) {
  currentInput = event.target;
  }

  function addValue(value) {
  if (currentInput === null) {
      currentInput = usernameInput;
  }
  if (currentInput === usernameInput || currentInput === passwordInput) {
      currentInput.value += value;
  }
  }

  function clearInput() {
  if (currentInput !== null) {
      currentInput.value = "";
  }
  }

  document.getElementById('enter-login-pos').addEventListener('click', function() {
      // Chuyển hướng đến trang xác thực của Google
      // event.preventDefault();
      submitForm();
  });

  function submitForm() {
    var UserID = document.getElementById('userid').value;
    var password = document.getElementById('password').value;
    if (UserID !== "" && password !== "") {
        $.ajax({
            url: '/login-pos-check/',
            dataType: 'json',
            method: 'POST',
            data: {
                "UserID": UserID,
                "password": password
            },
            success: function(response) {
                if (response.success) {
                    var group = response.Group;
                    if (group === 'Admin') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đăng Nhập Thành Công',
                            text: 'Welcome Trang Admin',
                        });
                    } else {
                        window.location.href = "/home-pos/";
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.message,
                    });
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorThrown,
                });
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Username or Password is not empty.",
        });
    }
}


  // function submitForm() {
      
  // //   document.querySelector('.form-login').submit();
  
  // var UserID = document.getElementById('userid').value;
  // var password = document.getElementById('password').value;
  // if(UserID != "" || password != "")
  // {
  //     $.ajax({
  //         url: '/login-pos-check/',
  //         dataType: 'json',
  //         method: 'POST',
  //         data:{
  //             "UserID": UserID,
  //             "password": password
  //         },
  //         success: function(response) {
  //           if (response.success) {
  //             var group  = response.Group;
  //               if(response.Group === 'Admin'){
  //                 Swal.fire({
  //                   icon: 'Success',
  //                   title: 'Đăng Nhập Thành Công',
  //                   text:  'Wellcome Trang Admin',
  //               })
  //               }
  //               else{
  //                 window.location.href = "/home-pos/";
  //               }
                
            
  //           } else {
  //               Swal.fire({
  //                   icon: 'error',
  //                   title: 'Oops...11111',
  //                   text: response.message,
  //               })
  //           }
  //         },
  //         error: function(response) {
  //             Swal.fire({
  //                 icon: 'error',
  //                 title: 'Oops...22222',
  //                 text: response.error,
  //             })
  //         }
  //     });
  // }
  // else
  // {
  //     Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: "Username or Password is not empty.",
  //     })
  // }
  
  // }

  usernameInput.addEventListener('focus', onFocus);
  passwordInput.addEventListener('focus', onFocus);

  document.addEventListener("DOMContentLoaded", function() {
    var companyModal = document.getElementById("company-modal");
    var ModalBackground = document.querySelector(".modal-background");
    var companySelect = document.getElementById("companySelect");
    var saveCompanyBtn = document.getElementById("save-company-btn");

    // Kiểm tra cookie có bị trống không
    var companyCookie = getCookie("company-POS");
    if (companyCookie === "") {
      // Hiển thị modal nếu cookie trống
      companyModal.classList.add("modal-show");
      ModalBackground.classList.add('hidden');
    }
    else{
        ModalBackground.classList.remove('hidden');
        ModalBackground.classList.add('modal-bg-show');
    }

    // Lưu công ty được chọn và lưu cookie lại
    saveCompanyBtn.addEventListener("click", function() {
      var selectedCompany = companySelect.value;
      if (selectedCompany !== "") {
        setCookie("company-POS", selectedCompany, 365); // Lưu cookie trong 365 ngày
        companyModal.classList.remove("modal-show"); // Ẩn modal sau khi lưu cookie
        ModalBackground.classList.remove('hidden');
        ModalBackground.classList.add('modal-bg-show');
      }
    });

  });



// Hàm lấy giá trị của cookie
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return "";
  }

  // Hàm lưu cookie
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  const modalBackground = document.querySelector('.modal-background');
  const companyModal = document.querySelector('#company-modal');
  
  // Khi muốn hiển thị modal
  modalBackground.classList.remove('hidden');
  companyModal.classList.remove('hidden');
  
  // Khi muốn ẩn modal
  modalBackground.classList.add('hidden');
  companyModal.classList.add('hidden');
// });




// var companySelect = document.getElementById("companySelect");
// var searchInput = document.querySelector(".search-company");

// searchInput.addEventListener("input", function() {
//   var searchValue = searchInput.value.toLowerCase();
//   var options = companySelect.getElementsByTagName("option");

//   for (var i = 0; i < options.length; i++) {
//     var option = options[i];
//     var text = option.text.toLowerCase();

//     if (text.includes(searchValue)) {
//       option.style.display = "block";
//     } else {
//       option.style.display = "none";
//     }
//   }

//   companySelect.classList.add("show-options");
// });

// companySelect.addEventListener("click", function() {
//   companySelect.classList.remove("show-options");
// });
