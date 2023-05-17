// $(document).ready(function() {
  /* ======================================================================================================================== */
  /* ==============================================Login POS================================================================= */
  /* ======================================================================================================================== */
  let currentInput = null;
  const usernameInput = document.getElementById('username');
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
      
  //   document.querySelector('.form-login').submit();
  
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  if(username != "" || password != "")
  {
      $.ajax({
          url: '/login-pos-check/',
          dataType: 'json',
          method: 'POST',
          data:{
              "username": username,
              "password": password
          },
          success: function(response) {
          if (response.success) {
              window.location.href = "/home-pos/";
              Swal.fire(
                  'Notification',
                  'Logout Success!!!',
                  'success'
              )
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.error,
              })
          }
          },
          error: function(response) {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.error,
              })
          }
      });
  }
  else
  {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Username or Password is not empty.",
      })
  }
  
  }

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