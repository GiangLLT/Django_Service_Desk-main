
$(document).ready(function() {
    
    // Load data
    var currentPage = 1;
    var itemsPerPage = 10;
    function displayProducts(products, currentPage, itemsPerPage, filters, data_temp) {

        $('#product-table tbody').empty();

        var filteredProducts = products.filter(function(product) {
            var nameMatch = filters.name === '' || product.name.toLowerCase().includes(filters.name);
            var cateMatch = filters.category === '' || product.category.toLowerCase().indexOf(filters.category) > -1;
            var priceMatch = filters.price === '' || product.price.toString().toLowerCase().indexOf(filters.price) > -1;
            return nameMatch && cateMatch && priceMatch;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }

        // for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr data-product-id="'+product.id+'">' +
            '<td data-column="name">' + product.name + '</td>' +
            '<td data-column="cate">' + product.category + '</td>' +
            '<td data-column="price">' + product.price + '</td>' +
            // '<td><input type="checkbox" name="delete[]" value="' + product.id + '">' +
            '<td>' +
            // '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon" name="Create[]" value="' + product.id + '"><i class="ti-plus text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-Product" name="Update[]" value="' + product.id + '"><i class="ti-pencil text-danger"></i></button>' +
            // '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon" name="delete[]" value="' + product.id + '" id="' + delete-produdct + '-' + product.id +'" ><i class="ti-trash text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-produdct" name="delete[]" value="' + product.id + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }

        // for (var i = 1; i <= numPages; i++) {
        //   pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        // }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
           event.preventDefault();
      
           var page = $(this).data('page');
           displayProducts(products, page, itemsPerPage, filters);
        });
        
        // Handle First button click event
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            displayProducts(products, 1, itemsPerPage, filters);
          }
          else
          {
            displayProducts(products, currentPage, itemsPerPage, filters);
          }
        });
        
        // Handle Last button click event
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            displayProducts(products, numPages, itemsPerPage, filters);
          }
          else
          {
            displayProducts(products, currentPage, itemsPerPage, filters);
          }
        });
      
        // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
        $('.delete-produdct').click(function(event) {
          event.preventDefault();
        
        //   var selectedProducts = $('#product-table input:checked').map(function() {
        //     return $(this).val();
        //   }).get();
      
          // Gọi hàm xử lý xóa sản phẩm
          var recordId = $(this).val();
          deleteProduct(recordId);
        });

        // Xử lý sự kiện khi người dùng nhấn nút Create
        $('#addProduct').click(function(event) {
          $('#addProductModal').modal('show');
        });
         // Xử lý sự kiện khi người dùng nhấn nút Update
        $('.update-Product').click(function(event) {
          event.preventDefault();
          $('.updateProductModal').modal('show');
          if( $('.updateProductModal').modal('show'))
          {
            var id_product = $(this).val();
              LoadDataUpdate(id_product);           
          }
        });
        $('.close').click(function(event) {
          $('#addProductModal').modal('hide');
          $('.updateProductModal').modal('hide');
        });


        $('#addProductForm').submit(function(event) {
          event.preventDefault(); // Prevent default form submission      
          var add_product = $(this).serialize();
          CreateProduct(add_product)
        });

        $('#updateProductForm').submit(function(event) {
          event.preventDefault(); // Prevent default form submission      
          var update_product = $(this).serialize();
          UpdateProduct(update_product);
        });

        // Search data in textbox table
        $('#search-name, #search-cate, #search-price').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-name').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-cate').blur();
              $('#search-price').blur();

              // Lấy giá trị của filters
              var filters = {
                  name: $('#search-name').val().toLowerCase().trim(),
                  category: $('#search-cate').val().toLowerCase().trim(),
                  price: $('#search-price').val().toLowerCase().trim()
              };
              displayProducts(data_temp, currentPage, itemsPerPage, filters, data_temp);
          }
        });
      }
     
      //delete data product
      function deleteProduct(recordId){
        // $('#delete-produdct').click(function() {
            // var recordId = $(this).val();
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    // console.log(recordId);
                    $.ajax({
                        url: '/delete-product/',
                        method: 'POST',
                        data: { 'product_id': recordId },
                        success: function(response) {
                          if (response.success) {
                            var productRow = $('#product-table tbody').find('tr[data-product-id="' + recordId + '"]');
                            productRow.remove();
                            Swal.fire(
                                'Deleted!',
                                'Your data has been deleted.',
                                'success'
                              )
                            // alert('Record deleted successfully');
                            // Reload the page or update the UI to reflect the change
                          } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: response.error,
                                // footer: '<a href="">Why do I have this issue?</a>'
                              })
                            // alert('Error: ' + response.error);
                          }
                        },
                        error: function(response) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: response.error,
                                // footer: '<a href="">Why do I have this issue?</a>'
                              })
                            // alert('Error: ' + response.error);
                        //   alert('Error: Unable to delete record');
                        }
                      });
                }
              })
        //   });
      }  
      
      //Create data product
      function CreateProduct(data){  
          // Send ajax request to add product
          $.ajax({
            url: '/add_product/', // URL of Django view to handle add product request
            type: 'POST',
            data : data,
            // data: {
            //   'name': name,
            //   'category': category,
            //   'price': price
            // },
            success: function(response) {
              if (response.success) {
                $('#product-table tbody').append('<tr data-product-id="'+response.id+'">' +
                '<td data-column="name">' + response.name + '</td>' +
                '<td data-column="cate">' + response.category + '</td>' +
                '<td data-column="price">' + response.price + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon" name="Update[]" value="' + response.id + '"><i class="ti-pencil text-danger"></i></button>' +
                '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-produdct" name="delete[]" value="' + response.id + '"><i class="ti-trash text-danger"></i></button>' +
                '</td>' +
                '</tr>');                
                Swal.fire(
                    'Created!',
                    response.message,
                    'success'
                  )
              } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                    // footer: '<a href="">Why do I have this issue?</a>'
                  })
              }
            },
            error: function(response) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                    // footer: '<a href="">Why do I have this issue?</a>'
                  })
            }
          });
      }
    
    if (window.location.pathname === '/danh-sach-test1/') {
      // load data product
      $.ajax({
          url: '/danh-sach-test1/',
          dataType: 'json',
          success: function(data) {
              var filters = {
                  name: $('#search-name').val().toLowerCase().trim(),
                  category: $('#search-cate').val().toLowerCase().trim(),
                  price: $('#search-price').val().toLowerCase().trim()
                };
              displayProducts(data, currentPage, itemsPerPage,filters, data)
              // setupPagination(data);
              // displayProducts(data.slice(0, itemsPerPage));
          },
          error: function(rs, e) {
              alert('Oops! something went wrong..');
          }
      });
   

    
        // load data category
        $.ajax({
          url: '/data-category/',
          dataType: 'json',
          success: function(data) {
            for (var i = 0; i < data.length; i++){
              cate = data[i];
              $('.input_Category').append(' <option value="'+ cate.id +'">'+ cate.category +'</option>');
            }
          },
          error: function(rs, e) {
              alert('Oops! something went wrong..');
          }
      });
    }


    // load data form update product
    function LoadDataUpdate(id_product){    
      $.ajax({
        url: '/load-data-update-product/',
        dataType: 'json',
        method: 'POST',
        data: {'id_product': id_product},
        success: function(response) {
          var input_IDproduct = document.querySelector('.updateProductModal .input_IDproduct');
          input_IDproduct.value = response[0].id;
          var input_Material = document.querySelector('.updateProductModal .input_Material');
          input_Material.value = response[0].name;
          var input_Category = document.querySelector('.updateProductModal .input_Category');
          input_Category.value = response[0].id_cate;
          var input_price = document.querySelector('.updateProductModal .input_price');
          input_price.value = response[0].price;
        },
        error: function(rs, e) {
            alert('Oops! something went wrong..');
        }
    });
  }
  //update product
  function UpdateProduct(data){    
    $.ajax({
      url: '/update-product/',
      dataType: 'json',
      method: 'POST',
      data: data,
      success: function(response) {
        if (response.success) {
          $('.updateProductModal').modal('hide');
          var name = $('#product-table tbody tr[data-product-id="' + response.id + '"] td[data-column="name"]');
          name.text(response.name);
          var category = $('#product-table tbody tr[data-product-id="' + response.id + '"] td[data-column="cate"]');
          category.text(response.category);
          var price = $('#product-table tbody tr[data-product-id="' + response.id + '"] td[data-column="price"]');
          price.text(response.price);
        
          Swal.fire(
            'Updated!',
            'Your data has been Updated.',
            'success'
          )
        }
      },
      error: function(rs, e) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...', 
          text: response.error,
          // footer: '<a href="">Why do I have this issue?</a>'
        })
      }
  });
}


//login system
$('#login-system').click(function(event) {
  event.preventDefault();
  var Email = document.getElementById("InputEmail").value;
  // const InputEmail = Email.value;
  var Password = document.getElementById("InputPassword").value;
  var rememberCheckbox = document.getElementById("checkbox-remember");
  var Remember = rememberCheckbox.checked ? true : false;
  if (!validateEmail(Email)) {
    // Email không hợp lệ
      Swal.fire({
        icon: 'error',
        title: 'Oops...', 
        text: "Email Error",
        // footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  else {
    // Email hợp lệ
    $.ajax({
      url: '/system/callback/',
      dataType: 'json',
      method: 'POST',
      data: {
        "email": Email,
        "pass": Password,
        "checkbox": Remember
      },
      success: function(response) {
        if (response.success) {
          if(response.remember){
            setCookie(response.cookie_name, response.cookie_data, response.cookie_day);
          }
          window.location.href = "/dashboard/";
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...', 
            text: response.error,
            // footer: '<a href="">Why do I have this issue?</a>'
          })
        }
      },
      error: function(rs, e) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...', 
          text: response.error,
          // footer: '<a href="">Why do I have this issue?</a>'
        })
      }
  });
  }
});

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  const cookieValue = escape(value) + (days ? `; expires=${expires.toUTCString()}` : '');
  document.cookie = `${name}=${cookieValue}`;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


//Login Microsoft 
$('#login-button').click(function(event) {
  // event.preventDefault();
  microsoft_login();
});


function microsoft_login() {
  // Lấy thông tin về URL hiện tại
  var currentURL = window.location.href;
  // Tách ra host từ URL
  // var urlObject = new URL(currentURL);
  // var host = urlObject.host;

  var clientId = '5c17ff26-50a1-4003-bc31-f0545709c2f7'; // Replace with your own client ID
  // var redirectUri = 'https://localhost:8000/login/callback/'; // Replace with your own redirect URI
  var redirectUri = currentURL +'login/callback/'; // Replace with your own redirect URI
  var scope = 'https://graph.microsoft.com/.default'; // Replace with your own scopes

  var loginUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' +
    '?client_id=' + encodeURIComponent(clientId) +
    '&redirect_uri=' + encodeURIComponent(redirectUri) +
    '&response_type=code' +
    '&scope=' + encodeURIComponent(scope);

  // var microsoftLoginWindow = window.open(loginUrl, '_blank');
  //var microsoftLoginWindow = window.open(loginUrl);
  window.location.href = loginUrl;

}

//login Google
// Gọi hàm này khi click vào button đăng nhập
// document.getElementById('google-login-btn').addEventListener('click', function() {
//   // Chuyển hướng đến trang xác thực của Google
//   google_login();
// });

function google_login() {
  var CLIENT_ID    =  "76045418295-6f2usr0sr610lm51rvph28uutjmilm6s.apps.googleusercontent.com";
  var REDIRECT_URI = "https://localhost:8000/google/callback/";
  scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'; // Phạm vi yêu cầu truy cập (vd: email, profile)
  // Gửi yêu cầu xác thực OAuth 2.0 đến Google
  var loginUrl = "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=" + encodeURIComponent(CLIENT_ID) + "&redirect_uri="+ encodeURIComponent(REDIRECT_URI) +"&scope="+scope+"&access_type=offline";
  //var loginUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=' + encodeURIComponent(CLIENT_ID) + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) + '&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&response_type=code';
  var GoogleLoginWindow = window.open(loginUrl);
}

//login Facebook
 // Thêm sự kiện click vào nút đăng nhập
 window.fbAsyncInit = function() {
  FB.init({
    appId      : '899604034596998',
    cookie     : true,
    xfbml      : true,
    version    : 'v16.0'
  });
  FB.AppEvents.logPageView();   
};
     

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 // Thêm sự kiện click vào nút đăng nhập
// document.getElementById('facebook-login-btn').addEventListener('click', function() {
//   FB.login(function(response) {
//       if (response.authResponse) {
//           console.log('Đăng nhập thành công!');
//       } else {
//           console.log('Đăng nhập không thành công!');
//       }
//   }, {scope: 'public_profile,email'});
// });

// Hàm xử lý trạng thái đăng nhập
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
      console.log('Bạn đã đăng nhập thành công!');
  } else {
      console.log('Bạn chưa đăng nhập!');
  }
}


    // $('#logout-button').click(function(event) {
    //   event.preventDefault();
    //   logout();
    // });

    // function logout(){
    //   $.ajax({
    //     url: '/logout/',
    //     method: 'POST',
    //     success: function(response) {
    //       if (response.success) {
    //         Swal.fire(
    //             'Notification',
    //             'Logout Success!!!',
    //             'success'
    //           )
    //       } else {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             // text: response.error,
    //             text: 'Lỗi 1',
    //           })
    //       }
    //     },
    //     error: function(response) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             // text: response.error,
    //             text: 'Lỗi 2',
    //           })
    //     }
    //   });
    // }

    //Load barcode data append to table html
    var isLoading = false;
    function loadData() {
        if (isLoading) {
            return;
        }      
        isLoading = true;

        var searchText = $('#barcode-search').val(); // Lấy giá trị của textbox tìm kiếm
        $.ajax({
            // type: 'GET',
            url: '/load-article/',
            data: {
                search_text: searchText // Truyền tham số tìm kiếm vào request
            },
            dataType: 'json',
            success: function(data) {
                // Lặp qua từng dòng của bảng HTML để kiểm tra xem dữ liệu trả về có trùng với dữ liệu trong bảng không
                $('#mara-table tbody tr').each(function() {
                    var row = $(this);
                    var barcode = row.find('#category').text();
                    var quantity = parseInt(row.find('#quantity').text());
                    for (var i = 0; i < data.length; i++) {
                        var product = data[i];
                        if (product.Barcode === barcode) {
                            quantity += 1;
                            row.find('#quantity').text(quantity);
                            break;
                        }
                    }
                });
    
                // Thêm các dòng mới vào bảng
                for (var i = 0; i < data.length; i++) {
                    var product = data[i];
                    var newRow = '<tr>' +
                        '<td id="name">' + product.Article + '</td>' +
                        '<td id="category">' + product.Barcode + '</td>' +
                        '<td id="price">' + product.Art_type + '</td>' +
                        '<td id="quantity">1</td>' +
                        '<td><input type="checkbox" name="delete[]" value="' + product.Barcode + '"></td>' +
                    '</tr>';
                    var barcodeExists = false;
                    // Kiểm tra xem dữ liệu trả về có trùng với dữ liệu đã có trong bảng không
                    $('#mara-table tbody tr').each(function() {
                        var row = $(this);
                        var barcode = row.find('#category').text();
                        if (product.Barcode === barcode) {
                            barcodeExists = true;
                            return false;
                        }
                    });
                    if (!barcodeExists) {
                        $('#mara-table tbody').append(newRow);
                    }
                }
                $('#barcode-search').val(null);
            },
            complete: function() {
                isLoading = false;
            },
            error: function(rs, e) {
                alert(e.text); //throw actual error, just for debugging purpose
                // alert(rs.responseText); //throw actual error, just for debugging purpose
                // alert('Oops! something went wrong..'); // alert user that something goes wrong
             }
        });
    }  
      
      $('#barcode-search').on('keyup', function() {
        barcode_text = $('#barcode-search').val();
        if (barcode_text != '' ||  barcode_text != null ) {
          loadData();
        }
      });
 
 
      var data = {
        // Dữ liệu gửi đi trong yêu cầu POST
        // Ví dụ:
        username: "gianglee007@gmail.com",
        password: "123456789"
    };
    $('#button-login-btn').click(function(event) {
      event.preventDefault();
        $.ajax({
          url: 'https://localhost:44386/api/Authentication',
          dataType: 'json',
          method: 'POST',
          // headers: { 'contentType': 'application/json' },
          contentType: 'application/json', // Header Content-Type
          data: data,
          success: function(response) {
            if (response.success) { 
              var token = response.token;      
              $.ajax({
                url: 'https://localhost:44386/api/APIToken/get-token',
                dataType: 'json',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }, // Header Content-Type
                data: data,
                success: function(response) {
                  if (response.success) {       
                    var jsonData = response.JSON;
                    console.log(jsonData); // In ra JSON trả về

                    Swal.fire(
                      'load data',
                      jsonData,
                      'success'
                    )
                  }
                },
                error: function(rs, e) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...', 
                    text: response.error,
                    // footer: '<a href="">Why do I have this issue?</a>'
                  })
                }
            });
              Swal.fire(
                'error!',
                'vòng lỗi kế cuối.',
                'success'
              )
            }
          },
          error: function(rs, e) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...', 
              text: "vòng lỗi cuối",
              // footer: '<a href="">Why do I have this issue?</a>'
            })
          }
      });
    });     

});

//################################################## PAGE TICKET HELPDESK - START ##################################################  

//########### Menu Function ########### 
if (window.location.pathname != '/'){ //function run if different homepage
  function Load_Menu_Master() {
    // Thực hiện các tác vụ cần thực hiện khi trang vừa tải xong
    $.ajax({
      url: '/menu-data/',
      type: 'POST',
      success: function(response) {
        if(response.success){
          if(response.isData){
            add_menu(response);
          }
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      },
      error: function(xhr, status, error) {
        // Xử lý lỗi
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    });
  }
  function add_menu(data){
    var groups = data.Group_Roles;
    var menus = data.Menus;
    var html_data = '';
    // var html_data_custom = '';
    // var html_data_for = '';
    var menu_custom = document.querySelector('#menu-custom');
    for(i=0; i < menus.length; i++){
      var html_data_custom = '';
      var html_data_for = '';
      var add = menus[i].Menu_Adress;
      var menuID = menus[i].Menu_ID;
      if(add != ''){
        html_data += '  <li class="nav-item">' +
        '<a class="nav-link" href="'+menus[i].Menu_Adress+'">'+
        '<i class="'+menus[i].Menu_Icon+' menu-icon"></i>'+
        '<span class="menu-title">'+menus[i].Menu_Name+'</span>'+
        '</a>'+
        '</li>';
      }   
      else{
        for(y=0; y < groups.length; y ++){
          var id = groups[y].Menu_ID;
          var name = groups[y].Role_Group_Name;      
          // var li = groups[y].Role_Group_Name.split('-');
          if(menuID == id){
            var hasHyphen = name.includes("-");
            if(hasHyphen == true){
              var GroupName = name.split('-');
              name = GroupName[1];
            }
            // html_data_for +='<li class="nav-item"> <a class="nav-link" href="'+groups[y].Role_Group_Address+'">'+groups[y].Role_Group_Name+'</a></li>';
            html_data_for +='<li class="nav-item"> <a class="nav-link" href="'+groups[y].Role_Group_Address+'">'+name+'</a></li>';
          }
        }
        if(html_data_for != ''){
          html_data_custom ='<li class="nav-item nav-category">'+menus[i].Menu_Name+'</li>'+
          '<li class="nav-item">'+
          '<a class="nav-link" data-bs-toggle="collapse" href="#ui-manage'+menus[i].Menu_ID+'" aria-expanded="false" aria-controls="ui-manage'+menus[i].Menu_ID+'">'+
          '<i class="menu-icon '+menus[i].Menu_Icon+'"></i>'+
          '<span class="menu-title">'+menus[i].Menu_Name+'</span>'+
          '<i class="menu-arrow"></i> '+
          '</a>'+
          '<div class="collapse" id="ui-manage'+menus[i].Menu_ID+'">'+
          '<ul class="nav flex-column sub-menu">'+
          html_data_for +
          ' </ul>'+
          '</div>'+
          '</li>';

          html_data += html_data_custom;
        }
      } 
    }
    menu_custom.innerHTML = html_data;
  }

  $(document).on('click', '.btn-read-comment', function() {
    read_all_comment();
  });
  function read_all_comment(){
    var list = document.querySelectorAll('.unread-list[data-unread]');
    if(list.length > 0){      
      var list_unread = [];
      list.forEach(function(item){
        var id = item.getAttribute('data-unread');;
        var data_unread = {'ReadCommentID': id};
        list_unread.push(JSON.stringify(data_unread));
      });
      unread_all_comment(list_unread, list);
    } 
  }
  function unread_all_comment(data, list){
    $.ajax({
      url: '/cap-nhat-all-comment-unread/',
      dataType: 'json',
      method: 'POST',
        data: {
          'data[]': data,
        },
      success: function(response) {
          if(response.success){
            var count = document.querySelector('.comment_count');
            count.textContent = 'Bạn Có 0 Comment Chưa Đọc';         
            list.forEach(function(item){
              item.remove();
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo',
              text: response.message,
            });
          }
      },
      error: function(rs, e) {
          alert('Oops! something went wrong..111');
      }
    });
  }

  function load_unread_comment(){
    $.ajax({
      url: '/load-read-comment/',
      type: 'POST',
      success: function(response) {
        if(response.success){
          if(response.data){
            var icon_count = document.querySelector('.count-unread');
            if(response.data){
              add_comment(response.Count, response.data);
              icon_count.classList.remove('hide-option');
            }
            else{
              icon_count.classList.add('hide-option');
            }
          }
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      },
      error: function(xhr, status, error) {
        // Xử lý lỗi
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    });
  }
  function add_comment(count_num, data){
    var count = document.querySelector('.comment_count');
    count.textContent = 'Bạn Có ' + count_num + ' Comment Chưa Đọc';
    for(i=0 ; i < data.length; i++){
      $('.comment_list_unread').append('<a data-unread="'+data[i].ReadComment_ID+'" class="dropdown-item preview-item unread-list" href="/cap-nhat-comment-unread/'+data[i].TicketID+'/'+data[i].Ticket_Slug+'/'+data[i].ReadComment_ID+'">'+
      '<div class="preview-thumbnail">'+
      '<img src="/static/Asset/img/ava.png" alt="image" class="img-sm profile-pic">'+
      '</div>'+
      '<div class="preview-item-content flex-grow py-2">'+
      '<p class="preview-subject ellipsis font-weight-medium text-dark">'+data[i].TicketID +' - '+ data[i].Ticket_Title+'</p>'+
      '<p class="fw-light small-text mb-0">'+data[i].Comment_UserName+' đã bình luận</p>'+
      '<p class="fw-light small-text mb-0">'+data[i].Comment_Date+' - '+data[i].Comment_Time+'</p>'+
      '</div>'+
      '</a>');
    }; 
  }
}

// Gọi hàm myFunction khi trang vừa tải xong
document.addEventListener('DOMContentLoaded', function() {
  Load_Menu_Master();
  load_unread_comment()
});

//########### Menu Function ########### 

//########### Danh Sách Ticket Start ###########  
if (window.location.pathname === '/danh-sach-yeu-cau/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-ticket/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Ticket(response.isAdmin);
        // auth_role();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  // load data product
  function Load_Ticket(isAdmin){
    $.ajax({
      url: '/danh-sach-data-ticket/',
      dataType: 'json',
      method: 'POST',
        data: {
          'isAdmin': isAdmin,
        },
      success: function(context) {
          var filters = {
              id: $('#search-TicketID').val().toLowerCase().trim(),
              title: $('#search-TicketID').val().toLowerCase().trim(),
              desc: $('#search-TicketDes').val().toLowerCase().trim(),
              company: $('.db-company').val().toLowerCase().trim(),
              group: $('.db-group').val().toLowerCase().trim(),
              support: $('#search-TicketSupport').val().toLowerCase().trim(),
              type: $('.db-type').val().toLowerCase().trim(),
              create: $('#search-TicketCreate').val().toLowerCase().trim(),
              date: $('#search-TicketDate').val().toLowerCase().trim(),
              time: $('#search-TicketTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            Load_data(context.companys, context.tgroups, context.users);
            display_Ticket(context.data, currentPage, itemsPerPage,filters, context.data);
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong..111');
      }
    });
  }

    //authorization page
    function auth_role(){
      $.ajax({
        url: '/phan-quyen-ticket/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            var buttonAdd = document.querySelector('#addTicket');
            var buttonEdit = document.querySelectorAll('.update-ticket');
            var buttonDel = document.querySelectorAll('.delete-ticket');
            var buttonAdmin_sta = document.querySelectorAll('.btn-status');
            var buttonAdmin_assg = document.querySelectorAll('.btn-assign');
            //Role Add New User
            if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
              buttonAdd.classList.remove('disable-button');
            }
            else{
              buttonAdd.classList.add('disable-button');
            }
            //Role Update User
            if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
              buttonEdit.forEach(function(edit){
                edit.classList.remove('disable-button');
              });        
            }
            else{
              buttonEdit.forEach(function(edit){
                edit.classList.add('disable-button');
              });             
            }
            //Role Delete User
            if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
              buttonDel.forEach(function(del){
                del.classList.remove('disable-button');
              });
            }
            else{
              buttonDel.forEach(function(del){
                del.classList.add('disable-button');
              }); 
            }
             //Role Admin
             if(response.IsAdmin == true || response.Roles[4].Status == 'True'){             
              buttonAdmin_sta.forEach(function(admin){
                admin.classList.remove('admin-button');
              });
              buttonAdmin_assg.forEach(function(asg){
                asg.classList.remove('admin-button');
              });
            }
            else{
              buttonAdmin_sta.forEach(function(admin){
                admin.classList.add('admin-button');
              }); 
              buttonAdmin_assg.forEach(function(asg){
                asg.classList.add('admin-button');
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    //event load file upload multiple 
    document.getElementById('file-input').addEventListener('change', function() {
      var files = this.files;
      var fileSizeLimit = 10 * 1024 * 1024; //10MB
    
      var fileSizeExceeded = false;
      var totalFileSize = 0;
      
      var fileDisplayInfo = "";
      var update = document.getElementById('updateTicketModal');
      var create = document.getElementById('CreateTicketModal');
      if(create.style.display === 'block'){
        fileDisplayInfo = create.querySelector('#file-display-info');
      }
     else if(update.style.display === 'block'){
        fileDisplayInfo = update.querySelector('#file-display-info');
      }
      // var fileDisplayInfo = document.getElementById('file-display-info');
      fileDisplayInfo.innerHTML = '';
    
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
    
        var fileItem = document.createElement('div');
        fileItem.classList.add('attach-custom');
        fileItem.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
        fileDisplayInfo.appendChild(fileItem);
    
        totalFileSize += file.size;
    
        if (file.size > fileSizeLimit) {
          fileSizeExceeded = true;
          break;
        }
      }
    
      if (fileSizeExceeded) {
        if(create.style.display === 'block'){
          create.querySelector('#file-size-info').textContent = 'Kích thước tệp tin vượt quá giới hạn cho phép';
        }
       else if(update.style.display === 'block'){
        update.querySelector('#file-size-info').textContent = 'Kích thước tệp tin vượt quá giới hạn cho phép';
        }
        // document.getElementById('file-size-info').textContent = 'Kích thước tệp tin vượt quá giới hạn cho phép';
        // document.getElementById('upload-button').disabled = true;
      } else {
        if(create.style.display === 'block'){
          create.querySelector('#file-size-info').textContent = 'Tổng kích thước tệp tin: ' + formatFileSize(totalFileSize);
        }
       else if(update.style.display === 'block'){
        update.querySelector('#file-size-info').textContent = 'Tổng kích thước tệp tin: ' + formatFileSize(totalFileSize);
        }
        // document.getElementById('file-size-info').textContent = 'Tổng kích thước tệp tin: ' + formatFileSize(totalFileSize);
        // document.getElementById('upload-button').disabled = false;
      }
    });

    function formatFileSize(size) {
      var units = ['B', 'KB', 'MB', 'GB', 'TB'];
      var unitIndex = 0;
    
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
    
      return size.toFixed(2) + ' ' + units[unitIndex];
    }
    
    $(document).on('click', '#create-ticket-button', function() {
    // document.getElementById('create-ticket-button').addEventListener('click', function() {
      //get data from model
      var title = document.querySelector('#input_title').value;
      var companyOptions = document.querySelector('#input_company').value;
      var groupOptions = document.querySelector('#input_group').value;
      var supportOptions = document.querySelector('#input_support').value;
      var supNameOptions = document.querySelector('#input_support option:checked').textContent.substring(12,100).trim();
      var typeOptions = document.querySelector('#input_type').value;
      var des = tinymce.get('tinyMceExample').getContent();
      var detail = des.replace(/<p>\s*<img src=([^>]+)>\s*<\/p>/gi, '<a href=$1><img src=$1/></a>');
      //get data from model

      if(title && companyOptions &&  groupOptions && typeOptions && detail){
      // if(title && companyOptions &&  groupOptions && supportOptions && typeOptions && detail){
        var files = document.querySelector('#CreateTicketModal #file-input').files;
        create_ticket(title,companyOptions,groupOptions,supportOptions,supNameOptions,typeOptions,detail, files);
        //upload_Files(files);      
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        })
      }     
    });

    $(document).on('click', '#update-ticket-button', function() {
    // document.getElementById('update-ticket-button').addEventListener('click', function() {
      //get data from model
      var ticketID = document.querySelector('.updateTicketModal #input_ticketid').value;
      var status = document.querySelector('.updateTicketModal #input_status').value;
      var title = document.querySelector('.updateTicketModal #input_title').value;
      var companyOptions = document.querySelector('.updateTicketModal #input_company').value;
      var groupOptions = document.querySelector('.updateTicketModal #input_group').value;
      var supportOptions = document.querySelector('.updateTicketModal #input_support').value;
      var supNameOptions = document.querySelector('.updateTicketModal #input_support option:checked').textContent.substring(12,100).trim();
      var typeOptions = document.querySelector('.updateTicketModal #input_type').value;
      var detail = tinymce.get('tinyMce-update').getContent();
      //get data from model

      if(title && companyOptions &&  groupOptions && supportOptions && typeOptions && detail){
        var files = document.querySelector('#file-input').files;
        update_ticket(ticketID, status,title,companyOptions,groupOptions,supportOptions,supNameOptions,typeOptions,detail, files);  
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        })
      }   
    });

function create_ticket(title,companyOptions,groupOptions,supportOptions,supNameOptions,typeOptions,detail, files){
  $.ajax({
        url: '/tao-yeu-cau/',
        dataType: 'json',
        method: 'POST',
        data: {
          'title': title,
          'company': companyOptions,
          'group': groupOptions,
          'support': supportOptions,
          'supportName': supNameOptions,
          'type': typeOptions,
          'detail': detail,
          // 'files': formData,
        },
        // processData: false, // Không xử lý dữ liệu FormData
        // contentType: false, // Không đặt lại header Content-Type
        success: function(response) {
          if (response.success) {
            if(files.length > 0){
              uploadFiles_Create(files, response.Ticket_ID,response);
            }
            else{
              Add_Ticket_Data(response);  
              auth_role();         
              $('#CreateTicketModal').modal('hide');
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
              notifyTicketCreated(response.Email,response.Ticket_ID,response.Ticket_Title,response.Ticket_Title_Slug);
              window.open('/chi-tiet-yeu-cau/'+response.Ticket_ID+'/'+response.Ticket_Title_Slug, '_blank');
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
}

function notifyTicketCreated(Email, Ticket_ID, Ticket_Title,Ticket_Title_Slug) {
  // Check if the browser supports Notification API
      if ('Notification' in window) {
        // Check if the user has granted permission for notifications
        if (Notification.permission === 'granted') {
          // Check if the user is assigned
          if (Email) {
            // Create a new notification
            var notification = new Notification("Ticket " + Ticket_ID + " Created", {
              body: Ticket_Title,
              icon: "/static/Asset/logo/BCG_logo.jpg",
              // recipient: Email,
              data: {
                recipient: Email,
              },
            });
            notification.onclick = function(){
              window.open('/chi-tiet-yeu-cau/'+Ticket_ID+'/'+Ticket_Title_Slug);
            };
            setTimeout(notification.close.bind(notification), 3000);
          
        } else {
          // The user has not granted permission for notifications, request permission
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              // The user has granted permission for notifications, send a notification
              var notification = new Notification("Ticket " + Ticket_ID + " Created", {
                body: Ticket_Title,
                icon: "/static/Asset/logo/BCG_logo.jpg",
                // recipient: Email,
                data: {
                  recipient: Email,
                },
              });
              notification.onclick = function(){
                window.open('/chi-tiet-yeu-cau/'+Ticket_ID+'/'+Ticket_Title_Slug);
              };
              setTimeout(notification.close.bind(notification), 3000);
            } else {
              // The user has denied permission for notifications, do not send a notification
            }
          });
        }
      } else {
        // The browser does not support Notification API, do not send a notification
      }
    }
}

// function notifyTicketCreated(Email, Ticket_ID, Ticket_Title) {
//     if ('Notification' in window && Notification.permission === 'granted') {
//     // Kiểm tra xem trình duyệt hỗ trợ Notification API hay không
//     if ('Notification' in window) {
//       // Kiểm tra xem đã cấp phép thông báo hay chưa
//       if (Notification.permission === 'granted') {
//         // Hiển thị thông báo bằng Notification API
//         var notification = new Notification("Ticket " + Ticket_ID + " Created", {
//           body: Ticket_Title,
//           // icon: "https://example.com/images/ticket.png",
//             icon: "/static/Asset/logo/BCG_logo.jpg",
//             recipient: Email,
//         });

        
//       } else {
//         // Nếu chưa cấp phép thông báo, yêu cầu cấp phép
//         Notification.requestPermission().then(function (permission) {
//           if (permission === 'granted') {
//             // Hiển thị thông báo bằng Notification API nếu đã cấp phép
//             var notification = new Notification("Ticket " + Ticket_ID + " Created", {
//               body: Ticket_Title,
//               icon: "/static/Asset/logo/BCG_logo.jpg",
//               recipient: Email,
//             });
          
//           } else {
//             // Nếu người dùng từ chối cấp phép, hiển thị thông báo bằng window.alert()
//             alert("Bạn đã từ chối hiển thị thông báo.");
//           }
//         });
//       }
//     } else {
//       // Nếu trình duyệt không hỗ trợ Notification API, hiển thị thông báo bằng window.alert()
//       alert("Trình duyệt không hỗ trợ Notification API.");
//     }
//   }
// }

function checkCookieExists(cookieName, searchString) {
  // Lấy giá trị của cookie
  var cookies = document.cookie;
  
  // Tách các cookie thành mảng các cặp tên và giá trị
  var cookieArray = cookies.split(';');
  
  // Duyệt qua từng cặp tên và giá trị của cookie
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    
    // Loại bỏ khoảng trắng ở đầu và cuối chuỗi cookie
    cookie = cookie.trim();
    
    // Kiểm tra nếu tên cookie trùng với tên cookie cần tìm
    if (cookie.indexOf(cookieName + '=') === 0) {
      // Lấy giá trị của cookie
      var cookieValue = cookie.substring(cookieName.length + 1);
      
      // Kiểm tra xem chuỗi cần tìm có tồn tại trong giá trị cookie hay không
      if (cookieValue.indexOf(searchString) !== -1) {
        return true;
      }
    }
  }
  
  // Trả về false nếu không tìm thấy chuỗi cần tìm trong cookie
  return false;
}

function update_ticket(ticketID, status,title,companyOptions,groupOptions,supportOptions,supNameOptions,typeOptions,detail, files){
  $.ajax({
        url: '/chinh-sua-yeu-cau/',
        dataType: 'json',
        method: 'POST',
        data: {
          'ticketID': ticketID,
          'status': status,
          'title': title,
          'company': companyOptions,
          'group': groupOptions,
          'support': supportOptions,
          'supportName': supNameOptions,
          'type': typeOptions,
          'detail': detail,
          // 'files': formData,
        },
        // processData: false, // Không xử lý dữ liệu FormData
        // contentType: false, // Không đặt lại header Content-Type
        success: function(response) {
          if (response.success) {
            if(files.length > 0){
              uploadFiles_Update(files, response.Ticket_ID,response);
            }
            else{
              // Add_Ticket_Data(response);  
              update_info_ticket(response);         
              $('#updateTicketModal').modal('hide');
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
}

//download all file
document.getElementById('down-ticket-button').addEventListener('click', function() {
  download_all_file();
});
//event load file upload multiple 
// Hàm tạo và tải xuống file zip
function download_all_file() {
  var attachmentLinks = document.querySelectorAll('.attachs-file .attachment-download');
  var zip = new JSZip();

  var promises = Array.from(attachmentLinks).map(function(link) {
    var url = link.getAttribute('href');
    var fileName = link.innerText;

    return fetch(url)
      .then(function(response) {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then(function(blob) {
        zip.file(fileName, blob);
      })
      .catch(function(error) {
        console.error('Error downloading file:', error);
      });
  });

  Promise.all(promises)
    .then(function() {
      zip.generateAsync({ type: 'blob' })
        .then(function(content) {
          var downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(content);
          downloadLink.download = 'attachments.zip';

          document.body.appendChild(downloadLink);
          downloadLink.click();

          setTimeout(function() {
            URL.revokeObjectURL(downloadLink.href);
            downloadLink.remove();
          }, 100);
        });
    });
}

function Add_Ticket_Data(data){
  var show_hide = '';
  var status = document.querySelector('#showall i');
  if (status.classList.contains('ti-shift-right')) {
    show_hide = 'hidden-column';
  }
  else if (status.classList.contains('ti-shift-left')){
    show_hide = 'show-column';
  }
  //append insert last item, prepend insert first item
       $('#product-table tbody').prepend('<tr data-product-id="'+data.Ticket_ID+'">' +
         '<td data-column="id">#' + data.Ticket_ID + '</td>' +
         '<td data-column="title">' + (data.Ticket_Title.length < 30 ? data.Ticket_Title : data.Ticket_Title.substring(0,30) + '...') + '</td>' +
         '<td data-column="Description" class="column-hidden">' + data.Ticket_Desc + '</td>' +                 
         '<td data-column="company">' + data.Company_Name + '</td>' +
         '<td data-column="group">' + data.Group_Name + '</td>' +         
         '<td data-column="assignUser">'+ (data.Ticket_Name_Asign ? '<button type="button" data-ticket-status="' + data.Ticket_ID + '" data-user-id="'+data.Ticket_User_Asign+'" class="btn btn-outline-danger btn-rounded btn-fw btn-assign">'+data.Ticket_Name_Asign+'</button>' :'') +'</td>' +
         //Type 0 - Sự Cố , 1 - Hỗ Trợ
         '<td data-column="type" id="toggle-column" class="'+show_hide+'"><button type="button" class="btn btn-'+(data.Ticket_Type == 0 ? 'danger' : (data.Ticket_Type == 1 ? 'warning' : ''))+' btn-rounded btn-fw btn-type">'+         
         (data.Ticket_Type == 0 ? 'Sự Cố' : (data.Ticket_Type == 1 ? 'Hỗ Trợ' : '' ))+
         '</button></td>' +
         '<td data-column="username" id="toggle-column" class="'+show_hide+'">' + data.Ticket_User_Name + '</td>' +
         '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + data.Ticket_Date + '</td>' +
         '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + data.Ticket_Time + '</td>' +
         //Status 0 - Complete , 1 - Inprogress , 2 - Pending, 3 - cancel
         '<td data-column="status"><button data-ticket-status="' + data.Ticket_ID + '" status-value="'+ data.Ticket_Status +'" type="button" class="btn btn-'+(data.Ticket_Status == 0 ? 'success' : (data.Ticket_Status == 1 ? 'primary' : (data.Ticket_Status == 2 ? 'warning' : (data.Ticket_Status == 3 ? 'danger' : '' ) ) ))+' btn-rounded btn-fw btn-status">'+  
         (data.Ticket_Status == 0 ? 'Hoàn Thành' : (data.Ticket_Status == 1 ? 'Đang Làm' : (data.Ticket_Status == 2 ? 'Đang Treo' : (data.Ticket_Status == 3 ? 'Hủy' : '' ) ) ))+
         '</button></td>' +
        //  '<td data-column="price"><input class="checkbox delivery-input-checkbox" type="checkbox"'+ (product.Ticket_Status == 1 ? 'checked' : '') +'></td>' +
         // '<td><input type="checkbox" name="delete[]" value="' + product.id + '">' +
         '<td>' +
         '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon view-ticket" name="View[]" value="' + data.Ticket_ID + '"><a href="/chi-tiet-yeu-cau/' + data.Ticket_ID + '/' + data.Ticket_Title_Slug + '/" target="_blank"><i class="ti-comment-alt text-danger"></i></a></button>' +
         '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-ticket disable-button" name="Update[]" value="' + data.Ticket_ID + '"><i class="ti-pencil text-danger"></i></button>' +
         '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-ticket disable-button" name="delete[] " value="' + data.Ticket_ID + '"><i class="ti-trash text-danger"></i></button>' +
         '</td>' +
       '</tr>');
}

function upload_Files(files) {
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    formData.append('files', file);
  }

  $.ajax({
    url: '/upload-files/',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      if(response.success){
        Swal.fire({
          icon: 'success',
          title: 'Thông Báo',
          timer: 1000,
          text: response.message,
        });
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    },
    error: function(xhr, status, error) {
      // Xử lý lỗi
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo Lỗi',
        text: response.message,
      });
    }
  });
}

function uploadFiles_Create(files, ticketID, data) {
  console.log('Files:', files);

  // Check if any files are selected
  if (files.length > 0) {
    var formData = new FormData();

    // Append each file to the FormData
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append('files', file);
    }
    formData.append('ticketID', ticketID);

    // Send an AJAX request to the Django server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload-files/', true);

    // Handle the AJAX request completion event
    xhr.onload = function() {
      if (xhr.status === 200) {
        // var response = JSON.parse(xhr.responseText);
        // console.log(response.message);
        Add_Ticket_Data(data);           
        $('#CreateTicketModal').modal('hide');
        Swal.fire({
           icon: 'success',
           title: 'Thông Báo',
           timer: 1000,
           text: data.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: 'Error uploading files',
        });
      }
    };

    // Send the AJAX request with the FormData
    xhr.send(formData);
  } else {
    console.log('No files selected');
  }
}

function uploadFiles_Update(files, ticketID, data) {
  console.log('Files:', files);

  // Check if any files are selected
  if (files.length > 0) {
    var formData = new FormData();

    // Append each file to the FormData
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append('files', file);
    }
    formData.append('ticketID', ticketID);

    // Send an AJAX request to the Django server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload-files/', true);

    // Handle the AJAX request completion event
    xhr.onload = function() {
      if (xhr.status === 200) {
        // var response = JSON.parse(xhr.responseText);
        // console.log(response.message);
        update_info_ticket(data);
        $('#updateTicketModal').modal('hide');
        Swal.fire({
           icon: 'success',
           title: 'Thông Báo',
           timer: 1000,
           text: data.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: 'Error uploading files',
        });
      }
    };

    // Send the AJAX request with the FormData
    xhr.send(formData);
  } else {
    console.log('No files selected');
  }
}

function update_info_ticket(Ticket_Data){
    // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
    var productRows = document.querySelectorAll('tr[data-product-id]');

    // Lặp qua từng phần tử tr
    productRows.forEach(function(row) {
      // Lấy giá trị của thuộc tính data-product-id
      var productId = row.getAttribute('data-product-id');

      // Kiểm tra xem productId có khớp với sản phẩm bạn đang quan tâm không
      if (productId === Ticket_Data.Ticket_ID) {
        // Cập nhật thông tin của phần tử
        var titleElement = row.querySelector('[data-column="title"]');
        var companyElement = row.querySelector('[data-column="company"]');
        var groupElement = row.querySelector('[data-column="group"]');
        var assignUserElement = row.querySelector('[data-column="assignUser"]');
        var typeElement = row.querySelector('[data-column="type"]');
        var statusElement = row.querySelector('[data-column="status"]');

        titleElement.textContent   =    (Ticket_Data.Ticket_Title.length < 30 ? Ticket_Data.Ticket_Title : Ticket_Data.Ticket_Title.substring(0,30) + '...');
        companyElement.textContent =    Ticket_Data.Company_Name;
        groupElement.textContent   =    Ticket_Data.Group_Name;

        var assignUserHTML = (Ticket_Data.Ticket_Name_Asign ? '<button type="button" class="btn btn-outline-danger btn-rounded btn-fw btn-assign">'+Ticket_Data.Ticket_Name_Asign+'</button>' :'');
        var buttonAssignElement = assignUserElement.querySelector('button');
        if (buttonAssignElement) {
          buttonAssignElement.remove();
        }
        assignUserElement.insertAdjacentHTML('beforeend', assignUserHTML);

        var typeHTML = '<button type="button" class="btn btn-'+(Ticket_Data.Ticket_Type == 0 ? 'danger' : (Ticket_Data.Ticket_Type == 1 ? 'warning' : ''))+' btn-rounded btn-fw btn-type">'+(Ticket_Data.Ticket_Type == 0 ? 'Sự Cố' : (Ticket_Data.Ticket_Type == 1 ? 'Hỗ Trợ' : '' ));
        var buttontypeElement = typeElement.querySelector('button');
        if (buttontypeElement) {
          buttontypeElement.remove();
        }
        typeElement.insertAdjacentHTML('beforeend', typeHTML);

        var statusHTML = '<button data-ticket-status="' + Ticket_Data.Ticket_ID + '" status-value="'+ Ticket_Data.Ticket_Status +'" type="button" class="btn btn-'+(Ticket_Data.Ticket_Status == 0 ? 'success' : (Ticket_Data.Ticket_Status == 1 ? 'primary' : (Ticket_Data.Ticket_Status == 2 ? 'warning' : (Ticket_Data.Ticket_Status == 3 ? 'danger' : '' ) ) ))+' btn-rounded btn-fw btn-status">'+(Ticket_Data.Ticket_Status == 0 ? 'Hoàn Thành' : (Ticket_Data.Ticket_Status == 1 ? 'Đang Làm' : (Ticket_Data.Ticket_Status == 2 ? 'Đang Treo' : (Ticket_Data.Ticket_Status == 3 ? 'Hủy' : '' ) ) ))+'</button>';
        var buttonstatusElement = statusElement.querySelector('button');
        if (buttonstatusElement) {
          buttonstatusElement.remove();
        }
        statusElement.insertAdjacentHTML('beforeend', statusHTML);
        // statusElement.textContent =     Ticket_Data.Ticket_Status;
      }
    });
}

function Load_data(companys, Tgroups, User_support){
  //load dropdown list company - Ticket
  if(companys){
    for(i=0; i< companys.length; i++){
      var company = companys[i];
      $('.db-company').append(
        '<option value="'+company.Company_ID+'">'+company.Company_Name+'</option>'
       );
       $('.db-company-ticket').append(
        '<option value="'+company.Company_ID+'">'+company.Company_Name+'</option>'
       );
     }
  }

   //load dropdown list TGroup - Ticket
   if(Tgroups){
    for(i=0; i< Tgroups.length; i++){
      var tgroup = Tgroups[i];
      $('.db-group').append(
        '<option value="'+tgroup.TGroup_ID+'">'+tgroup.TGroup_Name+'</option>'
       );
       $('.db-group-ticket').append(
        '<option value="'+tgroup.TGroup_ID+'">'+tgroup.TGroup_Name+'</option>'
       );
     }

     //load dropdown list User Support - Ticket
   if(User_support){
    for(i=0; i< User_support.length; i++){
      var user = User_support[i];
       $('.db-support-ticket').append(
        '<option value="'+user.ID_user+'">'+ user.ID_user +' - '+ user.FullName+'</option>'
       );

       $('.input_assign').append(
        '<option value="'+user.ID_user+'">'+ user.ID_user +' - '+ user.FullName+'</option>'
       );
     }
  }
  }
}

 // Load data
 function display_Ticket(products, currentPage, itemsPerPage, filters, data_temp) {

     $('#product-table tbody').empty();
     var filteredProducts = products.filter(function(product) {
         var IDMatch = filters.id === '' || product.Ticket_ID.toString().toLowerCase().includes(filters.id);
        //  var IDMatch = filters.id === '' || product.Ticket_ID.includes(parseID);
         var titleMatch = filters.title === '' || product.Ticket_Title.toLowerCase().indexOf(filters.title) > -1;
         var DescMatch = filters.desc === '' || product.Company_ID.toString().toLowerCase().indexOf(filters.desc) > -1;
         var companyMatch = filters.company === '' || product.Company_ID.toString().toLowerCase().indexOf(filters.company) > -1;
         var groupMatch = filters.group === '' || product.Group_ID.toString().toLowerCase().indexOf(filters.group) > -1;

         var supportMatch = filters.support === '' || (product.Ticket_Name_Asign && product.Ticket_Name_Asign.toLowerCase().indexOf(filters.support) > -1);
         var typeMatch = filters.type === '' || product.Ticket_Type.toString().toLowerCase().indexOf(filters.type) > -1;
         var createMatch = filters.create === '' || product.Ticket_User_Name.toString().toLowerCase().indexOf(filters.create) > -1;
         var dateMatch = filters.date === '' || product.Ticket_Date.toString().toLowerCase().indexOf(filters.date) > -1;
         var timeMatch = filters.time === '' || product.Ticket_Time.toLowerCase().indexOf(filters.time) > -1;
         var statusMatch = filters.status === '' || product.Ticket_Status.toString().toLowerCase().indexOf(filters.status) > -1;

         return IDMatch && titleMatch && DescMatch && companyMatch && groupMatch && supportMatch && typeMatch && createMatch && dateMatch && timeMatch && statusMatch ;
       });

       if(filteredProducts !== null || filteredProducts !== '')
       {
         products = filteredProducts
       }

      var show_hide = '';
      var status = document.querySelector('#showall i');
      if (status.classList.contains('ti-shift-right')) {
        show_hide = 'hidden-column';
      }
      else if (status.classList.contains('ti-shift-left')){
        show_hide = 'show-column';
      }
     for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
       var product = products[i];
       $('#product-table tbody').append('<tr data-product-id="'+product.Ticket_ID+'">' +
         '<td data-column="id">#' + product.Ticket_ID + '</td>' +
         '<td data-column="title">' + (product.Ticket_Title.length < 30 ? product.Ticket_Title : product.Ticket_Title.substring(0,30) + '...') + '</td>' +
         '<td data-column="Description" class="column-hidden">' + product.Ticket_Desc + '</td>' +                 
         '<td data-column="company">' + product.Company_Name + '</td>' +
         '<td data-column="group">' + product.Group_Name + '</td>' +         
         '<td data-column="assignUser">'+ (product.Ticket_Name_Asign ? '<button type="button" data-ticket-status="' + product.Ticket_ID + '" data-user-id="'+product.Ticket_User_Asign+'" class="btn btn-outline-danger btn-rounded btn-fw btn-assign">'+product.Ticket_Name_Asign+'</button>' :'') +'</td>' +
         //Type 0 - Sự Cố , 1 - Hỗ Trợ
         '<td data-column="type" id="toggle-column" class="'+show_hide+'"><button type="button" class="btn btn-'+(product.Ticket_Type == 0 ? 'danger' : (product.Ticket_Type == 1 ? 'warning' : ''))+' btn-rounded btn-fw btn-type">'+         
         (product.Ticket_Type == 0 ? 'Sự Cố' : (product.Ticket_Type == 1 ? 'Hỗ Trợ' : '' ))+
         '</button></td>' +
         '<td data-column="username" id="toggle-column" class="'+show_hide+'">' + product.Ticket_User_Name + '</td>' +
         '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + product.Ticket_Date + '</td>' +
         '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + product.Ticket_Time + '</td>' +
         //Status 0 - Complete , 1 - Inprogress , 2 - Pending, 3 - cancel
         '<td data-column="status"><button data-ticket-status="' + product.Ticket_ID + '" status-value="'+ product.Ticket_Status +'" type="button" class="btn btn-'+(product.Ticket_Status == 0 ? 'success' : (product.Ticket_Status == 1 ? 'primary' : (product.Ticket_Status == 2 ? 'warning' : (product.Ticket_Status == 3 ? 'danger' : '' ) ) ))+' btn-rounded btn-fw btn-status">'+  
         (product.Ticket_Status == 0 ? 'Hoàn Thành' : (product.Ticket_Status == 1 ? 'Đang Làm' : (product.Ticket_Status == 2 ? 'Đang Treo' : (product.Ticket_Status == 3 ? 'Hủy' : '' ) ) ))+
         '</button></td>' +
        //  '<td data-column="price"><input class="checkbox delivery-input-checkbox" type="checkbox"'+ (product.Ticket_Status == 1 ? 'checked' : '') +'></td>' +
         // '<td><input type="checkbox" name="delete[]" value="' + product.id + '">' +
         '<td>' +
         '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon view-ticket" name="View[]" value="' + product.Ticket_ID + '"><a href="/chi-tiet-yeu-cau/' + product.Ticket_ID + '/' + product.Ticket_Title_Slug + '/" target="_blank"><i class="ti-comment-alt text-danger"></i></a></button>' +
         '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-ticket disable-button" name="Update[]" value="' + product.Ticket_ID + '"><i class="ti-pencil text-danger"></i></button>' +
         '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-ticket disable-button" name="delete[]" value="' + product.Ticket_ID + '"><i class="ti-trash text-danger"></i></button>' +
         '</td>' +
       '</tr>');
     }
   
     var numPages = Math.ceil(products.length / itemsPerPage);
     var pagination = $('#pagination');
     pagination.empty();
     
     // Add First button
     pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
     
     for (var i = 1; i <= numPages; i++) {
       var activeClass = (i === currentPage) ? "active" : "";
       pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
     }
     
     // Add Last button
     pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
   
     pagination.find('.page-link').click(function(event) {
        event.preventDefault();
   
        var page = $(this).data('page');
        display_Ticket(products, page, itemsPerPage, filters);
        auth_role();
     });
     
     // Handle First and Last button click event - start
     pagination.find('.page-item:first-child .page-link').click(function(event) {
       event.preventDefault();
       
       if (currentPage > 1) {
        display_Ticket(products, 1, itemsPerPage, filters);
        auth_role();
       }
       else
       {
        display_Ticket(products, currentPage, itemsPerPage, filters);
        auth_role();
       }
     });
     pagination.find('.page-item:last-child .page-link').click(function(event) {
       event.preventDefault();
       
       if (currentPage < numPages) {
        display_Ticket(products, numPages, itemsPerPage, filters);
        auth_role();
       }
       else
       {
        display_Ticket(products, currentPage, itemsPerPage, filters);
        auth_role();
       }
     });
     // Handle First and Last button click event - end
    
   
     // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
     $(document).on('click', '.delete-ticket', function() {
      var ticketid = $(this).val();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-success-cus',
          cancelButton: 'btn btn-danger btn-danger-cus'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Bạn muốn xóa Ticket "+ ticketid + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          event.preventDefault();
          
          var parentRow = $(this).closest('tr');
          delete_Ticket(ticketid, parentRow);      
        } 
      })
    });

     function delete_Ticket(ticketid, parentRow){
      $.ajax({
        url: '/xoa-yeu-cau/',
        dataType: 'json',
        method: 'POST',
        data: {
          'ticketid': ticketid,
        },
        success: function(response) {
          if (response.success) {
            parentRow.remove();
            Swal.fire({
              icon: 'success',
              title: 'Thông Báo',
              timer: 1000,
              text: response.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
     }

     // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

     // Xử lý sự kiện khi người dùng nhấn nút Create
     $('.addTicket').click(function(event) {
       $('#CreateTicketModal').modal('show');
       var cre = document.querySelector('#CreateTicketModal');
       var upd = document.querySelector('#updateTicketModal');
       if(cre.style.display === 'none' || upd.style.display === 'none'){
        var attachCustomElements = document.querySelectorAll('.attach-custom');
        var fileSizeInfoElements = document.querySelectorAll('#file-size-info');
        attachCustomElements.forEach(function(element) {
          element.remove();
        });
        fileSizeInfoElements.forEach(function(element) {
          element.textContent = '';
        });
       }
     });
     // Xử lý sự kiện khi người dùng nhấn nút Create


      // Xử lý sự kiện khi người dùng nhấn nút Update
     $(document).on('click', '.update-ticket', function() {
      $('#updateTicketModal').modal('show');
      if( $('#updateTicketModal').modal('show'))
      {
       var cre = document.querySelector('#CreateTicketModal');
       var upd = document.querySelector('#updateTicketModal');
       if(cre.style.display === 'none' || upd.style.display === 'none'){
        var attachCustomElements = document.querySelectorAll('.attach-custom');
        var fileSizeInfoElements = document.querySelectorAll('#file-size-info');
        attachCustomElements.forEach(function(element) {
          element.remove();
        });
        fileSizeInfoElements.forEach(function(element) {
          element.textContent = '';
        });
       }
        var id_ticket = $(this).val();
        LoadDataUpdate_Ticket(id_ticket);           
      }
    });

    // load data form update product
    function LoadDataUpdate_Ticket(id_ticket){    
      $.ajax({
        url: '/data-update-ticket/',
        dataType: 'json',
        method: 'POST',
        data: {'id_ticket': id_ticket},
        success: function(response) {
          if(response.success){
            getlink_download(response.Attachs);

            var input = document.querySelector('.updateTicketModal');
            var input_title = input.querySelector('#input_title');
            input_title.value = response.Tickets[0].Ticket_Title;
            
            var input_ticketid = input.querySelector('#input_ticketid');
            input_ticketid.value = response.Tickets[0].Ticket_ID;
            var input_status = input.querySelectorAll('#input_status option');
            var stat =  response.Tickets[0].Ticket_Status;
            input_status.forEach(function(sta){
              var status = parseInt(sta.getAttribute('value'));              
              if (status === stat) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected','selected');
              }
            });

            var input_company = input.querySelectorAll('#input_company option');
            var comp =  response.Tickets[0].Company_ID;
            input_company.forEach(function(com){
              var company = parseInt(com.getAttribute('value'));              
              if (company === comp) {
                com.setAttribute('selected', 'selected');
              } else {
                com.removeAttribute('selected','selected');
              }
            });
            var input_group = input.querySelectorAll('#input_group option');
            var grp =  response.Tickets[0].TGroup_ID;
            input_group.forEach(function(gr){
              var group = parseInt(gr.getAttribute('value'));              
              if (group === grp) {
                gr.setAttribute('selected', 'selected');
              } else {
                gr.removeAttribute('selected','selected');
              }
            });

            var input_support = input.querySelectorAll('#input_support option');
            var sup =  response.Tickets[0].ID_User;
            input_support.forEach(function(sp){
              var support = parseInt(sp.getAttribute('value'));              
              if (support === sup) {
                sp.setAttribute('selected', 'selected');
              } else {
                sp.removeAttribute('selected','selected');
              }
            });
            var input_type = input.querySelectorAll('#input_type option');
            var typ =  response.Tickets[0].Ticket_Type;
            input_type.forEach(function(tp){
              var type = parseInt(tp.getAttribute('value'));              
              if (type === typ) {
                tp.setAttribute('selected', 'selected');
              } else {
                tp.removeAttribute('selected','selected');
              }
            });

            html = response.Tickets[0].Ticket_Desc;
            var input_desc = tinymce.get('tinyMce-update');
            input_desc.setContent(html, {format: 'html'});
            tinymce.activeEditor.setContent(html, {format: 'html'});

          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
  }

  function getlink_download(links){
    $('.attachs-file-item').remove();
    if(Array.isArray(links) && links.length !== 0){      
      // $('#list-files').removeClass('files-hidden');
      $('#list-files').removeClass('form-upload');
      links.forEach(function(link){
        $('.attachs-file').append(' <div class="attachs-file-item">' +
        '<a class="attachment-download" href="../static/Asset/Attachment-Upload/'+ link.Attachment +'" download>'+link.Attachment+'</a>' +
      '</div>');
      });
      // if(){

      // }
    }
    else{
      $('#list-files').addClass('form-upload');
    }
  }

     $('.close').click(function(event) {
       $('#updateTicketModal').modal('hide');
       $('#StatusModal').modal('hide');
       $('#CreateTicketModal').modal('hide');
       $('#AssignModal').modal('hide');
       var cre = document.querySelector('#CreateTicketModal');
       var upd = document.querySelector('#updateTicketModal');
       if(cre.style.display === 'none' || upd.style.display === 'none'){
        var attachCustomElements = document.querySelectorAll('.attach-custom');
        var fileSizeInfoElements = document.querySelectorAll('#file-size-info');
        attachCustomElements.forEach(function(element) {
          element.remove();
        });
        fileSizeInfoElements.forEach(function(element) {
          element.textContent = '';
        });
       }
     });


     $('#addProductForm').submit(function(event) {
       event.preventDefault(); // Prevent default form submission      
       var add_product = $(this).serialize();
       CreateProduct(add_product)
     });

     $('#updateProductForm').submit(function(event) {
       event.preventDefault(); // Prevent default form submission      
       var update_product = $(this).serialize();
       UpdateProduct(update_product);
     });

     // Search data in textbox table - start
     $('#search-TicketID, #search-TicketTitle, #search-TicketDes,.db-company, .db-group, #search-TicketSupport, #search-TicketCreate, #search-TicketDate,#search-TicketTime,.db-type,.db-status').on('keydown', function(event) {
       if (event.keyCode === 13) { // Nếu nhấn phím Enter
           event.preventDefault(); // Tránh việc reload lại trang
           $('#search-TicketID').blur(); // Mất focus khỏi textbox tìm kiếm
           $('#search-TicketTitle').blur();
           $('#search-TicketDes').blur();
          var formattedDate ="";
          var date = $('#search-TicketDate').val();
          if(date){
            var parts = date.split("-");
            formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
          }
           // Lấy giá trị của filters
           var filters = {
               id: $('#search-TicketID').val().toLowerCase().trim(),
               title: $('#search-TicketTitle').val().toLowerCase().trim(),
               desc: $('#search-TicketDes').val().toLowerCase().trim(),
               company: $('.db-company').val().toLowerCase().trim(),
               group: $('.db-group').val().toLowerCase().trim(),
               support: $('#search-TicketSupport').val().toLowerCase().trim(),
               type: $('.db-type').val().toLowerCase().trim(),
               create: $('#search-TicketCreate').val().toLowerCase().trim(),
               date: (formattedDate ? formattedDate : ''),
               time: $('#search-TicketTime').val().toLowerCase().trim(),
               status: $('.db-status').val().toLowerCase().trim(),
           };
           if(data_temp){
            display_Ticket(data_temp, currentPage, itemsPerPage, filters, data_temp);
            auth_role();
           }
       }
     });

     $(document).on('click', '.btn-remove-filter', function() {
      $('#search-TicketID').val('');
      $('#search-TicketTitle').val('');
      $('#search-TicketDes').val('');
      $('.db-company').val('');
      $('.db-group').val('');
      $('#search-TicketSupport').val('');
      $('.db-type').val('');
      $('#search-TicketCreate').val('');
      $('#search-TicketDate').val('');
      $('#search-TicketTime').val('');
      $('.db-status').val('');
      var perPage = document.querySelector('#db-rows').value;
      reset_data(parseInt(perPage));  
    });
    
    function reset_data(itemsPerPage){
      $('#search-TicketID').blur(); // Mất focus khỏi textbox tìm kiếm
      $('#search-TicketTitle').blur();
      $('#search-TicketDes').blur();
     var formattedDate ="";
     var date = $('#search-TicketDate').val();
     if(date){
       var parts = date.split("-");
       formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
     }
      // Lấy giá trị của filters
      var filters = {
          id: $('#search-TicketID').val().toLowerCase().trim(),
          title: $('#search-TicketTitle').val().toLowerCase().trim(),
          desc: $('#search-TicketDes').val().toLowerCase().trim(),
          company: $('.db-company').val().toLowerCase().trim(),
          group: $('.db-group').val().toLowerCase().trim(),
          support: $('#search-TicketSupport').val().toLowerCase().trim(),
          type: $('.db-type').val().toLowerCase().trim(),
          create: $('#search-TicketCreate').val().toLowerCase().trim(),
          date: (formattedDate ? formattedDate : ''),
          time: $('#search-TicketTime').val().toLowerCase().trim(),
          status: $('.db-status').val().toLowerCase().trim(),
      };
      if(data_temp){
        display_Ticket(data_temp, currentPage, itemsPerPage, filters, data_temp);
        auth_role();
      }
    }
     // Search data in textbox table - end  

     //function button status update  - start
      // var statusButtons = document.querySelectorAll('.btn-status');
      // statusButtons.forEach(function(button) {
      //   button.addEventListener('click', function() {     
      //       $('#StatusModal').modal('show');
      //       if( $('#StatusModal').modal('show'))
      //       {
      //         var value = this.getAttribute('status-value');
      //         var ticketID = this.getAttribute('data-ticket-status');
      //         var id = document.querySelector('.ticket-ID');
      //         id.textContent =  ticketID;    
      //         var statusOptions = document.querySelectorAll('#input_model_status option');
      //         statusOptions.forEach(function(option) {
      //           if (option.value === value) {
      //             option.setAttribute('selected', 'selected');
      //           } else {
      //             option.removeAttribute('selected');
      //           }
      //         });
      //       }         
      //   });
      // });

      $(document).on('click', '.btn-status', function() {    
            $('#StatusModal').modal('show');
            if( $('#StatusModal').modal('show'))
            {
              var value = this.getAttribute('status-value');
              var ticketID = this.getAttribute('data-ticket-status');
              var id = document.querySelector('.ticket-ID');
              id.textContent =  ticketID;    
              var statusOptions = document.querySelectorAll('#input_model_status option');
              statusOptions.forEach(function(option) {
                if (option.value === value) {
                  option.setAttribute('selected', 'selected');
                } else {
                  option.removeAttribute('selected');
                }
              });
            }         
        });

      // $('#status-button').click(function(event){
      $(document).on('click', '#status-button', function() {
        var ticket = document.querySelector('.ticket-ID');
        if(ticket){
          var ticketid = ticket.innerText;
          var new_status = $('#input_model_status').val();
          var new_name = $('#input_model_status option:selected').text();
          ticket_update_status(ticketid, new_status, new_name);            
        }            
      });

      function ticket_update_status(ticketid, new_status, new_name) {
        $.ajax({
          url: '/cap-nhat-ticket-status/',
          dataType: 'json',
          method: 'POST',
          data: {
            'ticketid': ticketid,
            'new_status': new_status,
          },
          success: function(response) {
            if (response.success) {
              $('#StatusModal').modal('hide');
              // Cập nhật lại giá trị status-value của button
              var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
              btn_ticket.attr('status-value', new_status);
              btn_ticket.text(new_name);
              // Xóa tất cả các lớp hiện tại của nút
              btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

              // Thêm lớp mới dựa trên giá trị trạng thái
              if (new_status === '0') {
                btn_ticket.addClass('btn-success');
              } else if (new_status === '1') {
                btn_ticket.addClass('btn-primary');
              }
              else if (new_status === '2') {
                btn_ticket.addClass('btn-warning');
              }
              else if (new_status === '3') {
                btn_ticket.addClass('btn-danger');
              }

              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }    
      //function button status update ticket - end

      //function button User assign update ticket - start
      // var statusButtons = document.querySelectorAll('.btn-assign');
      // statusButtons.forEach(function(button) {
      //   button.addEventListener('click', function() {     
      //       $('#AssignModal').modal('show');
      //       if( $('#AssignModal').modal('show'))
      //       {
      //         var userID = this.getAttribute('data-user-id');
      //         var ticketID = this.getAttribute('data-ticket-status');
      //         var id = document.querySelector('#AssignModal .ticket-ID');
      //         id.textContent =  ticketID;   
      //         var statusOptions = document.querySelectorAll('#input_model_assign option');
      //         statusOptions.forEach(function(option) {
      //           if (option.value === userID) {
      //             option.setAttribute('selected', 'selected');
      //           } else {
      //             option.removeAttribute('selected');
      //           }
      //         });
      //       }         
      //   });
      // });

      $(document).on('click', '.btn-assign', function() {     
            $('#AssignModal').modal('show');
            if( $('#AssignModal').modal('show'))
            {
              var userID = this.getAttribute('data-user-id');
              var ticketID = this.getAttribute('data-ticket-status');
              var id = document.querySelector('#AssignModal .ticket-ID');
              id.textContent =  ticketID;   
              var statusOptions = document.querySelectorAll('#input_model_assign option');
              statusOptions.forEach(function(option) {
                if (option.value === userID) {
                  option.setAttribute('selected', 'selected');
                } else {
                  option.removeAttribute('selected');
                }
              });
            }         
          });
      
      
      // $('#assign-button').click(function(event){
      $(document).on('click', '#assign-button', function() { 
        var ticket = document.querySelector('#AssignModal .ticket-ID');
        if(ticket){
          var ticketid = ticket.innerText;
          var new_assign = $('#input_model_assign').val();
          // var new_assig_name = $('#input_model_assign option:selected').text();
          ticket_update_assign(ticketid, new_assign);            
        }            
      });

      function  ticket_update_assign(ticketid, new_assign) {
        $.ajax({
          url: '/cap-nhat-ticket-nguoi-ho-tro/',
          dataType: 'json',
          method: 'POST',
          data: {
            'ticketid': ticketid,
            'new_assign': new_assign,
          },
          success: function(response) {
            if (response.success) {          
              var btn_ticket = $('.btn-assign[data-ticket-status="' + ticketid + '"]');
              btn_ticket.attr('data-user-id', new_assign);
              btn_ticket.text(response.FullName);  
              $('#AssignModal').modal('hide');          
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      } 

    //chose row in table 
    $(document).on('change', '#db-rows', function() {
      // var PerPage = this.value;
      var PerPage = parseInt(this.value);
      if(PerPage != itemsPerPage){
        reset_data(PerPage);
      }
    });

      //function button User assign update ticket - end
}
// Load data

//show or hide column in table
$(document).on('click', '#showall', function() {
  var show_hide = document.querySelectorAll('#toggle-column');
  // var changeIcon =  document.querySelector('#showall i');
  var button =  document.querySelector('#showall');
  show_hide.forEach(function(item){
    if (item.classList.contains('hidden-column')) {
      // changeIcon.classList.remove('ti-shift-right');
      // changeIcon.classList.add('ti-shift-left');
      button.innerHTML = '<i class="btn-icon-prepend ti-shift-left"></i> ẨN CỘT';

      item.classList.remove('hidden-column');
      item.classList.add('show-column');
    } else if (item.classList.contains('show-column')) {          
      // changeIcon.classList.remove('ti-shift-left');
      // changeIcon.classList.add('ti-shift-right');
      button.innerHTML = '<i class="btn-icon-prepend ti-shift-right"></i> HIỂN THỊ CỘT';

      item.classList.remove('show-column');
      item.classList.add('hidden-column');
    } 
  });
});
//show or hide column in table
}
//########### Danh Sách Ticket End ########### 

//########### Danh Sách Company Start ###########  
if (window.location.pathname === '/danh-sach-cong-ty/') {
  var currentPage = 1;
  var itemsPerPage = 10;

  //Check Role
  $.ajax({
    url: '/role-cong-ty/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Company();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  // load data product
  function Load_Company(){
    $.ajax({
      url: '/danh-sach-data-cong-ty/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id: $('#search-CompanyID').val().toLowerCase().trim(),
              company: $('#search-CompanyName').val().toLowerCase().trim(),
              create: $('#search-CompanyCreate').val().toLowerCase().trim(),
              date: $('#search-CompanyDate').val().toLowerCase().trim(),
              time: $('#search-CompanyTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_Company(context.data, currentPage, itemsPerPage,filters, context.data);
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

  //authorization page
  function auth_role(){
    $.ajax({
      url: '/phan-quyen-cong-ty/',
      dataType: 'json',
      method: 'POST',
      success: function(response) {
        if (response.success) {
          // if(response.IsAdmin == false || response.Roles[0].Status == 'False'){             
          //   window.location.href = '/dashboard/';
          // }
          var buttonAdd = document.querySelector('#addCompany');
          var buttonEdit = document.querySelectorAll('.update-company');
          var buttonDel = document.querySelectorAll('.delete-company');
          var buttonSta = document.querySelectorAll('.btn-company-status');
          //Role Add New User
          if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
            buttonAdd.classList.remove('disable-button');
          }
          else{
            buttonAdd.classList.add('disable-button');
          }
          //Role Update User
          if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
            buttonEdit.forEach(function(edit){
              edit.classList.remove('disable-button');
            });        
            buttonSta.forEach(function(sta){
              sta.classList.remove('admin-button');
            }); 
          }
          else{
            buttonEdit.forEach(function(edit){
              edit.classList.add('disable-button');
            });      
            buttonSta.forEach(function(sta){
              sta.classList.add('admin-button');
            });        
          }
          //Role Delete User
          if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
            buttonDel.forEach(function(edit){
              edit.classList.remove('disable-button');
            });
          }
          else{
            buttonDel.forEach(function(edit){
              edit.classList.add('disable-button');
            }); 
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        }
      },
      error: function(response) {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    });
  }

    // Load data
    function display_Company(products, currentPage, itemsPerPage, filters, data_temp) {

      $('#product-table tbody').empty();
      var filteredProducts = products.filter(function(product) {
          var IDMatch = filters.id === '' || product.Company_ID.toString().toLowerCase().includes(filters.id);
          var ComNameMatch = filters.company === '' || product.Company_Name.toLowerCase().indexOf(filters.company) > -1;
          var createMatch = filters.create === '' || product.Company_User_Name.toString().toLowerCase().indexOf(filters.create) > -1;
          var dateMatch = filters.date === '' || product.Company_Date.toString().toLowerCase().indexOf(filters.date) > -1;
          var timeMatch = filters.time === '' || product.Company_Time.toLowerCase().indexOf(filters.time) > -1;
          var statusMatch = filters.status === '' || product.Company_Status.toString().toLowerCase().indexOf(filters.status) > -1;

          return IDMatch && ComNameMatch && createMatch && dateMatch && timeMatch && statusMatch ;
        });

        if(filteredProducts !== null || filteredProducts !== '')
        {
          products = filteredProducts
        }

      for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
        var product = products[i];
        $('#product-table tbody').append('<tr data-product-id="'+product.Company_ID+'">' +
          '<td data-column="id">#' + product.Company_ID + '</td>' +           
          '<td data-column="company">' + product.Company_Name + '</td>' +
          '<td data-column="username">' + product.Company_User_Name + '</td>' +         
          '<td data-column="date">' + product.Company_Date + '</td>' +
          '<td data-column="time">' + product.Company_Time + '</td>' +
          '<td data-column="status"><button data-company-id="' + product.Company_ID + '" data-company-status="' + product.Company_Status + '" type="button" class="btn btn-'+(product.Company_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-company-status admin-button">'+  
          (product.Company_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
          '</button></td>' +
          '<td>' +
          '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-company disable-button" name="Update[]" value="' + product.Company_ID + '"><i class="ti-pencil text-danger"></i></button>' +
          '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-company disable-button" name="delete[]" value="' + product.Company_ID + '"><i class="ti-trash text-danger"></i></button>' +
          '</td>' +
        '</tr>');
      }
    
      var numPages = Math.ceil(products.length / itemsPerPage);
      var pagination = $('#pagination');
      pagination.empty();
      
      // Add First button
      pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
      
      for (var i = 1; i <= numPages; i++) {
        var activeClass = (i === currentPage) ? "active" : "";
        pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
      }
      
      // Add Last button
      pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
    
      pagination.find('.page-link').click(function(event) {
          event.preventDefault();
    
          var page = $(this).data('page');
          display_Company(products, page, itemsPerPage, filters);
          auth_role();
      });
      
      // Handle First and Last button click event - start
      pagination.find('.page-item:first-child .page-link').click(function(event) {
        event.preventDefault();
        
        if (currentPage > 1) {
          display_Company(products, 1, itemsPerPage, filters);
          auth_role();
        }
        else
        {
          display_Company(products, currentPage, itemsPerPage, filters);
          auth_role();
        }
      });
      pagination.find('.page-item:last-child .page-link').click(function(event) {
        event.preventDefault();
        
        if (currentPage < numPages) {
          display_Company(products, numPages, itemsPerPage, filters);
          auth_role();
        }
        else
        {
          display_Company(products, currentPage, itemsPerPage, filters);
          auth_role();
        }
      });
      // Handle First and Last button click event - end
      
      //xử lý sự kiện update status
      $(document).on('click', '.btn-company-status', function() {
        // document.querySelector('.btn-company-status').addEventListener('click', function() {
          // var comp   = document.querySelector('.btn-company-status');
          var comp   = $(this);
          var status = comp.attr('data-company-status');
          var id     = comp.attr('data-company-id');
          var status_new = (status === "true" ? "false" : "true");
          if(status){
            $.ajax({
              url: '/cap-nhat-cong-ty/',
              dataType: 'json',
              method: 'POST',
              data: {
                'status': (status === "true" ? "False" : "True"),
                'CompanyID': id,
              },
              success: function(response) {
                if (response.success) {     
                  var htmlStatus = '<button data-company-id="' + response.Company_ID + '" data-company-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-company-status">'+  
                  (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                  '</button>';

                  var btn_status = document.querySelector('tr[data-product-id="' + response.Company_ID + '"]');
                  var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                  var btn_status_button = btn_status_column.querySelector('button');
                  if (btn_status_button) {
                    btn_status_button.remove();
                  }
                  btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);

                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                  });
                }
              },
              error: function(response) {
                Swal.fire({
                  icon: 'error',
                  title: 'Thông Báo Lỗi',
                  text: response.message,
                });
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi', 
              text: 'Không update được status',
            })
          }
          
        });
      //xử lý sự kiện update status

      // Search data in textbox table - start
      $('#search-CompanyID, #search-CompanyName, #search-CompanyCreate,#search-CompanyDate,#search-CompanyTime,.db-status').on('keydown', function(event) {
        if (event.keyCode === 13) { // Nếu nhấn phím Enter
            event.preventDefault(); // Tránh việc reload lại trang
            $('#search-CompanyID').blur(); // Mất focus khỏi textbox tìm kiếm
            $('#search-CompanyName').blur();
            $('#search-CompanyCreate').blur();
            var formattedDate ="";
            var date = $('#search-CompanyDate').val();
            if(date){
              var parts = date.split("-");
              formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
            }
            // Lấy giá trị của filters
            var filters = {
                id: $('#search-CompanyID').val().toLowerCase().trim(),
                company: $('#search-CompanyName').val().toLowerCase().trim(),
                create: $('#search-CompanyCreate').val().toLowerCase().trim(),
                date: (formattedDate ? formattedDate : ''),
                time: $('#search-CompanyTime').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
            };
            if(data_temp){
              display_Company(data_temp, currentPage, itemsPerPage, filters, data_temp);
              auth_role();
            }
        }
      });
      $(document).on('click', '.btn-remove-filter', function() {
        $('#search-CompanyID').val('');
        $('#search-CompanyName').val('');
        $('#search-CompanyCreate').val('');
        $('#search-CompanyDate').val('');
        $('#search-CompanyTime').val('');
        $('.db-status').val('');
        reset_data();  
      });
      
      function reset_data(){
        $('#search-CompanyID').blur(); // Mất focus khỏi textbox tìm kiếm
        $('#search-CompanyName').blur();
        $('#search-CompanyCreate').blur();
        var formattedDate ="";
        var date = $('#search-CompanyDate').val();
        if(date){
          var parts = date.split("-");
          formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
        }
        // Lấy giá trị của filters
        var filters = {
            id: $('#search-CompanyID').val().toLowerCase().trim(),
            company: $('#search-CompanyName').val().toLowerCase().trim(),
            create: $('#search-CompanyCreate').val().toLowerCase().trim(),
            date: (formattedDate ? formattedDate : ''),
            time: $('#search-CompanyTime').val().toLowerCase().trim(),
            status: $('.db-status').val().toLowerCase().trim(),
        };
        if(data_temp){
          display_Company(data_temp, currentPage, itemsPerPage, filters, data_temp);
          auth_role();
        }
      }
      // Search data in textbox table - end



      //function button status update  - start
        var statusButtons = document.querySelectorAll('.btn-status');
        statusButtons.forEach(function(button) {
          button.addEventListener('click', function() {     
              $('#StatusModal').modal('show');
              if( $('#StatusModal').modal('show'))
              {
                var value = this.getAttribute('status-value');
                var ticketID = this.getAttribute('data-ticket-status');
                var id = document.querySelector('.ticket-ID');
                id.textContent =  ticketID;    
                var statusOptions = document.querySelectorAll('#input_model_status option');
                statusOptions.forEach(function(option) {
                  if (option.value === value) {
                    option.setAttribute('selected', 'selected');
                  } else {
                    option.removeAttribute('selected');
                  }
                });
              }         
          });
        });

        $('#status-button').click(function(event){
          var ticket = document.querySelector('.ticket-ID');
          if(ticket){
            var ticketid = ticket.innerText;
            var new_status = $('#input_model_status').val();
            var new_name = $('#input_model_status option:selected').text();
            ticket_update_status(ticketid, new_status, new_name);            
          }            
        });

        function ticket_update_status(ticketid, new_status, new_name) {
          $.ajax({
            url: '/cap-nhat-ticket-status/',
            dataType: 'json',
            method: 'POST',
            data: {
              'ticketid': ticketid,
              'new_status': new_status,
            },
            success: function(response) {
              if (response.success) {
                $('#StatusModal').modal('hide');
                // Cập nhật lại giá trị status-value của button
                var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
                btn_ticket.attr('status-value', new_status);
                btn_ticket.text(new_name);
                // Xóa tất cả các lớp hiện tại của nút
                btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

                // Thêm lớp mới dựa trên giá trị trạng thái
                if (new_status === '0') {
                  btn_ticket.addClass('btn-success');
                } else if (new_status === '1') {
                  btn_ticket.addClass('btn-primary');
                }
                else if (new_status === '2') {
                  btn_ticket.addClass('btn-warning');
                }
                else if (new_status === '3') {
                  btn_ticket.addClass('btn-danger');
                }

                Swal.fire({
                  icon: 'success',
                  title: 'Thông Báo',
                  timer: 1000,
                  text: response.message,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
        }    
        //function button status update ticket - end  
  }

    //xử lý sự kiện close modal
    $('.close').click(function(event) {
      $('#CreateCompanyModal').modal('hide');
      $('#UpdateCompanyModal').modal('hide');
    });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
    $(document).on('click', '.delete-company', function() {
      var CompanyID = $(this).val();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-success-cus',
          cancelButton: 'btn btn-danger btn-danger-cus'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Bạn muốn xóa Company "+ CompanyID + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          event.preventDefault();          
          var parentRow = $(this).closest('tr');
          delete_Company(CompanyID, parentRow);      
        } 
      })
    });

    function delete_Company(CompanyID, parentRow){
      $.ajax({
        url: '/xoa-cong-ty/',
        dataType: 'json',
        method: 'POST',
        data: {
          'CompanyID': CompanyID,
        },
        success: function(response) {
          if (response.success) {
            parentRow.remove();
            Swal.fire({
              icon: 'success',
              title: 'Thông Báo',
              timer: 1000,
              text: response.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
    $('.addCompany').click(function(event) {
      $('#CreateCompanyModal').modal('show');
    });
    $('#create-company-button').click(function(event) {
      event.preventDefault(); // Prevent default form submission      
      var Company_Name = document.querySelector('#input_company_name').value;
      create_company(Company_Name);
    });
    function create_company(Company_Name){
      $.ajax({
        url: '/tao-cong-ty/',
        dataType: 'json',
        method: 'POST',
        data: {
          'Company_Name': Company_Name,
        },
        success: function(response) {
          if (response.success) {     
            // var data_Company = document.querySelector('#product-table tbody').find('tr[data-product-id="' + response.Company_ID + '"]'); 
            // var companyName =  data_Company.querySelector('td[data-column="company"]');
            // companyName.textContent = response.Company_Name;
            add_row_company(response)
            auth_role();
            $('#CreateCompanyModal').modal('hide');           
            Swal.fire({
              icon: 'success',
              title: 'Thông Báo',
              timer: 1000,
              text: response.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }
    function add_row_company(data){
      $('#product-table tbody').prepend('<tr data-product-id="'+data.Company_ID+'">' +
      '<td data-column="id">#' + data.Company_ID + '</td>' +           
      '<td data-column="company">' + data.Company_Name + '</td>' +
      '<td data-column="username">' + data.Company_User_Name + '</td>' +         
      '<td data-column="date">' + data.Company_Date + '</td>' +
      '<td data-column="time">' + data.Company_Time + '</td>' +
      '<td data-column="status"><button data-company-id="' + data.Company_ID + '" data-ticket-status="' + data.Company_Status + '" type="button" class="btn btn-'+(data.Company_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-company-status admin-button">'+  
      (data.Company_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
      '</button></td>' +
      '<td>' +
      '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-company disable-button" name="Update[]" value="' + data.Company_ID + '"><i class="ti-pencil text-danger"></i></button>' +
      '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-company disable-button" name="delete[]" value="' + data.Company_ID + '"><i class="ti-trash text-danger"></i></button>' +
      '</td>' +
    '</tr>');
    }
    // Xử lý sự kiện khi người dùng nhấn nút Create


    // Xử lý sự kiện khi người dùng nhấn nút Update
    $(document).on('click', '.update-company', function() {
      $('#UpdateCompanyModal').modal('show');
      if( $('#UpdateCompanyModal').modal('show'))
      {       
        var companyID = $(this).val();
        LoadDataUpdate_Company(companyID);           
      }
    });

  // load data form update product
    function LoadDataUpdate_Company(companyID){    
      $.ajax({
        url: '/data-update-company/',
        dataType: 'json',
        method: 'POST',
        data: {'companyID': companyID},
        success: function(response) {
          if(response.success){
            var input = document.querySelector('#UpdateCompanyModal');
            var input_ID = input.querySelector('#input_company_id');
            input_ID.value = response.Companys[0].Company_ID;
            var input_Name = input.querySelector('#input_company_name');
            input_Name.value = response.Companys[0].Company_Name;

            var input_status = input.querySelectorAll('#input_company_status option');            
            input_status.forEach(function(sta){
              var status = sta.getAttribute('value');
              var companyStatus = response.Companys[0].Company_Status;                         
              if (status === String(companyStatus)) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected');
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#Update-company-button', function() {
    // $('#Update-company-button').click(function(event) {
      // $(document).on('click', 'update-company-button', function() {
      var modal = document.querySelector('#UpdateCompanyModal');
      var input_ID = modal.querySelector('#input_company_id').value;
      var input_Name = modal.querySelector('#input_company_name').value;
      var input_status = modal.querySelector('#input_company_status').value;
    
      if (input_ID && input_Name && input_status) {
        update_company(input_ID, input_Name, input_status);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    });
    

    function update_company(CompanyID, CompanyName,status){
      var status_new = (status == "true" ? "true" : "false")
      $.ajax({
            url: '/cap-nhat-cong-ty/',
            dataType: 'json',
            method: 'POST',
            data: {
              'CompanyID': CompanyID,
              'status': (status == "true" ? "True" : "False"),
              'CompanyName': CompanyName,
            },
            success: function(response) {
              if (response.success) {
                update_info_company(response, status_new);
                $('#UpdateCompanyModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }

    function update_info_company(Company_Data,status_new){
        // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
        var productRows = document.querySelectorAll('tr[data-product-id]');

        // Lặp qua từng phần tử tr
        productRows.forEach(function(row) {
          // Lấy giá trị của thuộc tính data-product-id
          var companyID = parseInt(row.getAttribute('data-product-id'));

          // Kiểm tra xem productId có khớp với sản phẩm bạn đang quan tâm không
          if (companyID === Company_Data.Company_ID) {
            // Cập nhật thông tin của phần tử
            var companyElement = row.querySelector('[data-column="company"]');
            var statusElement = row.querySelector('[data-column="status"]');
            companyElement.textContent =  Company_Data.Company_Name;

            var htmlStatus = '<button data-company-id="' + Company_Data.Company_ID + '" data-company-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-company-status">'+  
            (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
            '</button>';
            var buttonStatusElement = statusElement.querySelector('button');
            if (buttonStatusElement) {
              buttonStatusElement.remove();
            }
            statusElement.insertAdjacentHTML('beforeend', htmlStatus);
          }
        });
    }
    // Xử lý sự kiện khi người dùng nhấn nút Update 
}
//########### Danh Sách Company End ########### 

//########### Danh Sách Group Start ###########  
if (window.location.pathname === '/danh-sach-nhom/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-nhom/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Group();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  // load data product
  function Load_Group(){
    $.ajax({
      url: '/danh-sach-data-nhom/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id: $('#search-GroupID').val().toLowerCase().trim(),
              group: $('#search-GroupName').val().toLowerCase().trim(),
              create: $('#search-GroupCreate').val().toLowerCase().trim(),
              date: $('#search-GroupDate').val().toLowerCase().trim(),
              time: $('#search-GroupTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_Group(context.data, currentPage, itemsPerPage,filters, context.data)
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

  //authorization page
  function auth_role(){
    $.ajax({
      url: '/phan-quyen-nhom/',
      dataType: 'json',
      method: 'POST',
      success: function(response) {
        if (response.success) {
          // if(response.IsAdmin == false || response.Roles[0].Status == 'False'){             
          //   window.location.href = '/dashboard/';
          // }
          var buttonAdd = document.querySelector('#addGroup');
          var buttonEdit = document.querySelectorAll('.update-group');
          var buttonDel = document.querySelectorAll('.delete-group');
          var buttonSta = document.querySelectorAll('.btn-group-status');

          //Role Add New User
          if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
            buttonAdd.classList.remove('disable-button');
          }
          else{
            buttonAdd.classList.add('disable-button');
          }
          //Role Update User
          if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
            buttonEdit.forEach(function(edit){
              edit.classList.remove('disable-button');
            }); 
            buttonSta.forEach(function(sta){
              sta.classList.remove('admin-button');
            });       
          }
          else{
            buttonEdit.forEach(function(edit){
              edit.classList.add('disable-button');
            });    
            buttonSta.forEach(function(sta){
              sta.classList.add('admin-button');
            });         
          }
          //Role Delete User
          if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
            buttonDel.forEach(function(edit){
              edit.classList.remove('disable-button');
            });
          }
          else{
            buttonDel.forEach(function(edit){
              edit.classList.add('disable-button');
            }); 
          }       
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        }
      },
      error: function(response) {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    });
  }

    // Load data
      function display_Group(products, currentPage, itemsPerPage, filters, data_temp) {

        $('#product-table tbody').empty();
        var filteredProducts = products.filter(function(product) {
            var IDMatch = filters.id === '' || product.TGroup_ID.toString().toLowerCase().includes(filters.id);
            var GroupNameMatch = filters.group === '' || product.TGroup_Name.toLowerCase().indexOf(filters.group) > -1;
            var createMatch = filters.create === '' || product.TGroup_User_Name.toString().toLowerCase().indexOf(filters.create) > -1;
            var dateMatch = filters.date === '' || product.TGroup_Date.toString().toLowerCase().indexOf(filters.date) > -1;
            var timeMatch = filters.time === '' || product.TGroup_Time.toLowerCase().indexOf(filters.time) > -1;
            var statusMatch = filters.status === '' || product.TGroup_Status.toString().toLowerCase().indexOf(filters.status) > -1;

            return IDMatch && GroupNameMatch && createMatch && dateMatch && timeMatch && statusMatch ;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }

        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr data-product-id="'+product.TGroup_ID+'">' +
            '<td data-column="id">#' + product.TGroup_ID + '</td>' +           
            '<td data-column="TGroup">' + product.TGroup_Name + '</td>' +
            '<td data-column="username">' + product.TGroup_User_Name + '</td>' +         
            '<td data-column="date">' + product.TGroup_Date + '</td>' +
            '<td data-column="time">' + product.TGroup_Time + '</td>' +
            '<td data-column="status"><button data-group-id="' + product.TGroup_ID + '" data-group-status="' + product.TGroup_Status + '" type="button" class="btn btn-'+(product.TGroup_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-group-status admin-button">'+  
            (product.TGroup_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-group disable-button" name="Update[]" value="' + product.TGroup_ID + '"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-group disable-button" name="delete[]" value="' + product.TGroup_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
            event.preventDefault();
      
            var page = $(this).data('page');
            display_Group(products, page, itemsPerPage, filters);
            auth_role();
        });
        
        // Handle First and Last button click event - start
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            display_Group(products, 1, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Group(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            display_Group(products, numPages, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Group(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        // Handle First and Last button click event - end
        
        //xử lý sự kiện update status
        $(document).on('click', '.btn-group-status', function() {
            var comp   = $(this);
            var status = comp.attr('data-group-status');
            var id     = comp.attr('data-group-id');
            var status_new = (status === "true" ? "false" : "true");
            if(status){
              $.ajax({
                url: '/cap-nhat-nhom/',
                dataType: 'json',
                method: 'POST',
                data: {
                  'status': (status === "true" ? "False" : "True"),
                  'GroupID': id,
                },
                success: function(response) {
                  if (response.success) {     
                    var htmlStatus = '<button data-group-id="' + response.TGroup_ID + '" data-group-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-group-status">'+  
                    (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';

                    var btn_status = document.querySelector('tr[data-product-id="' + response.TGroup_ID + '"]');
                    var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                    var btn_status_button = btn_status_column.querySelector('button');
                    if (btn_status_button) {
                      btn_status_button.remove();
                    }
                    btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);
                    Swal.fire({
                      icon: 'success',
                      title: 'Thông Báo',
                      timer: 1000,
                      text: response.message,
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: response.message,
                    });
                  }
                },
                error: function(response) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Thông Báo Lỗi',
                    text: response.message,
                  });
                }
              });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi', 
                text: 'Không update được status',
              })
            }
            
          });
        //xử lý sự kiện update status

        // Search data in textbox table - start
        $('#search-GroupID, #search-GroupName, #search-GroupCreate,#search-GroupDate,#search-GroupTime,.db-status').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-GroupID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-GroupName').blur();
              $('#search-GroupCreate').blur();
              var formattedDate ="";
              var date = $('#search-GroupDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                  id: $('#search-GroupID').val().toLowerCase().trim(),
                  group: $('#search-GroupName').val().toLowerCase().trim(),
                  create: $('#search-GroupCreate').val().toLowerCase().trim(),
                  date: (formattedDate ? formattedDate : ''),
                  time: $('#search-GroupTime').val().toLowerCase().trim(),
                  status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Group(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
          }
        });

        $(document).on('click', '.btn-remove-filter', function() {
          $('#search-GroupID').val('');
          $('#search-GroupName').val('');
          $('#search-GroupCreate').val('');
          $('#search-GroupDate').val('');
          $('#search-GroupTime').val('');
          $('.db-status').val('');
          reset_data();  
        });
        
        function reset_data(){
          $('#search-GroupID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-GroupName').blur();
              $('#search-GroupCreate').blur();
              var formattedDate ="";
              var date = $('#search-GroupDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                  id: $('#search-GroupID').val().toLowerCase().trim(),
                  group: $('#search-GroupName').val().toLowerCase().trim(),
                  create: $('#search-GroupCreate').val().toLowerCase().trim(),
                  date: (formattedDate ? formattedDate : ''),
                  time: $('#search-GroupTime').val().toLowerCase().trim(),
                  status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Group(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
        }
        // Search data in textbox table - end

        //function button status update  - start
          var statusButtons = document.querySelectorAll('.btn-status');
          statusButtons.forEach(function(button) {
            button.addEventListener('click', function() {     
                $('#StatusModal').modal('show');
                if( $('#StatusModal').modal('show'))
                {
                  var value = this.getAttribute('status-value');
                  var ticketID = this.getAttribute('data-ticket-status');
                  var id = document.querySelector('.ticket-ID');
                  id.textContent =  ticketID;    
                  var statusOptions = document.querySelectorAll('#input_model_status option');
                  statusOptions.forEach(function(option) {
                    if (option.value === value) {
                      option.setAttribute('selected', 'selected');
                    } else {
                      option.removeAttribute('selected');
                    }
                  });
                }         
            });
          });

          $('#status-button').click(function(event){
            var ticket = document.querySelector('.ticket-ID');
            if(ticket){
              var ticketid = ticket.innerText;
              var new_status = $('#input_model_status').val();
              var new_name = $('#input_model_status option:selected').text();
              ticket_update_status(ticketid, new_status, new_name);   
              auth_role();         
            }            
          });

          function ticket_update_status(ticketid, new_status, new_name) {
            $.ajax({
              url: '/cap-nhat-ticket-status/',
              dataType: 'json',
              method: 'POST',
              data: {
                'ticketid': ticketid,
                'new_status': new_status,
              },
              success: function(response) {
                if (response.success) {
                  $('#StatusModal').modal('hide');
                  // Cập nhật lại giá trị status-value của button
                  var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
                  btn_ticket.attr('status-value', new_status);
                  btn_ticket.text(new_name);
                  // Xóa tất cả các lớp hiện tại của nút
                  btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

                  // Thêm lớp mới dựa trên giá trị trạng thái
                  if (new_status === '0') {
                    btn_ticket.addClass('btn-success');
                  } else if (new_status === '1') {
                    btn_ticket.addClass('btn-primary');
                  }
                  else if (new_status === '2') {
                    btn_ticket.addClass('btn-warning');
                  }
                  else if (new_status === '3') {
                    btn_ticket.addClass('btn-danger');
                  }

                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                  });
                }
              },
              error: function(response) {
                Swal.fire({
                  icon: 'error',
                  title: 'Thông Báo Lỗi',
                  text: response.message,
                });
              }
            });
          }    
          //function button status update ticket - end  
      }

    //xử lý sự kiện close modal
      $('.close').click(function(event) {
        $('#CreateGroupModal').modal('hide');
        $('#UpdateGroupModal').modal('hide');
      });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
      $(document).on('click', '.delete-group', function() {
        var GroupID = $(this).val();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success btn-success-cus',
            cancelButton: 'btn btn-danger btn-danger-cus'
          },
          buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Bạn muốn xóa Nhóm "+ GroupID + " ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();          
            var parentRow = $(this).closest('tr');
            delete_Group(GroupID, parentRow);      
          } 
        })
      });

      function delete_Group(GroupID, parentRow){
        $.ajax({
          url: '/xoa-nhom/',
          dataType: 'json',
          method: 'POST',
          data: {
            'GroupID': GroupID,
          },
          success: function(response) {
            if (response.success) {
              parentRow.remove();
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
      $('.addGroup').click(function(event) {
        $('#CreateGroupModal').modal('show');
      });
      $('#create-group-button').click(function(event) {
        event.preventDefault(); // Prevent default form submission      
        var Group_Name = document.querySelector('#input_group_name').value;
        create_group(Group_Name);
      });
      function create_group(Group_Name){
        $.ajax({
          url: '/tao-nhom/',
          dataType: 'json',
          method: 'POST',
          data: {
            'Group_Name': Group_Name,
          },
          success: function(response) {
            if (response.success) {     
              // var data_Company = document.querySelector('#product-table tbody').find('tr[data-product-id="' + response.Company_ID + '"]'); 
              // var companyName =  data_Company.querySelector('td[data-column="company"]');
              // companyName.textContent = response.Company_Name;
              add_row_group(response);
              auth_role();
              $('#CreateGroupModal').modal('hide');           
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
      function add_row_group(data){
        $('#product-table tbody').prepend('<tr data-product-id="'+data.TGroup_ID+'">' +
        '<td data-column="id">#' + data.TGroup_ID + '</td>' +           
        '<td data-column="group">' + data.TGroup_Name + '</td>' +
        '<td data-column="username">' + data.TGroup_User_Name + '</td>' +         
        '<td data-column="date">' + data.TGroup_Date + '</td>' +
        '<td data-column="time">' + data.TGroup_Time + '</td>' +
        '<td data-column="status"><button data-group-id="' + data.TGroup_ID + '" data-group-status="' + data.TGroup_Status + '" type="button" class="btn btn-'+(data.TGroup_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-group-status admin-button">'+  
        (data.TGroup_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
        '</button></td>' +
        '<td>' +
        '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-group disable-button" name="Update[]" value="' + data.TGroup_ID + '"><i class="ti-pencil text-danger"></i></button>' +
        '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-group disable-button" name="delete[]" value="' + data.TGroup_ID + '"><i class="ti-trash text-danger"></i></button>' +
        '</td>' +
      '</tr>');
      }
    // Xử lý sự kiện khi người dùng nhấn nút Create


    // Xử lý sự kiện khi người dùng nhấn nút Update
    $(document).on('click', '.update-group', function() {
      $('#UpdateGroupModal').modal('show');
      if( $('#UpdateGroupModal').modal('show'))
      {       
        var GroupID = $(this).val();
        LoadDataUpdate_Group(GroupID);           
      }
    });

  // load data form update product
    function LoadDataUpdate_Group(GroupID){    
      $.ajax({
        url: '/data-update-group/',
        dataType: 'json',
        method: 'POST',
        data: {'GroupID': GroupID},
        success: function(response) {
          if(response.success){
            var input = document.querySelector('#UpdateGroupModal');
            var input_ID = input.querySelector('#input_group_id');
            input_ID.value = response.Groups[0].TGroup_ID;
            var input_Name = input.querySelector('#input_group_name');
            input_Name.value = response.Groups[0].TGroup_Name;

            var input_status = input.querySelectorAll('#input_group_status option');            
            input_status.forEach(function(sta){
              var status = sta.getAttribute('value');
              var groupStatus = response.Groups[0].TGroup_Status;                         
              if (status === String(groupStatus)) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected');
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#Update-group-button', function() {
    // $('#Update-company-button').click(function(event) {
      // $(document).on('click', 'update-company-button', function() {
      var modal = document.querySelector('#UpdateGroupModal');
      var input_ID = modal.querySelector('#input_group_id').value;
      var input_Name = modal.querySelector('#input_group_name').value;
      var input_status = modal.querySelector('#input_group_status').value;
    
      if (input_ID && input_Name && input_status) {
        update_group(input_ID, input_Name, input_status);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    });
    

    function update_group(GroupID, GroupName,status){
      var status_new = (status == "true" ? "true" : "false")
      $.ajax({
            url: '/cap-nhat-nhom/',
            dataType: 'json',
            method: 'POST',
            data: {
              'GroupID': GroupID,
              'status': (status == "true" ? "True" : "False"),
              'GroupName': GroupName,
            },
            success: function(response) {
              if (response.success) {
                update_info_group(response, status_new);
                $('#UpdateGroupModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }

    function update_info_group(Group_Data,status_new){
        // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
        var productRows = document.querySelectorAll('tr[data-product-id]');

        // Lặp qua từng phần tử tr
        productRows.forEach(function(row) {
          // Lấy giá trị của thuộc tính data-product-id
          var GroupID = parseInt(row.getAttribute('data-product-id'));

          // Kiểm tra xem productId có khớp với sản phẩm bạn đang quan tâm không
          if (GroupID === Group_Data.TGroup_ID) {
            // Cập nhật thông tin của phần tử
            var groupElement = row.querySelector('[data-column="group"]');
            var statusElement = row.querySelector('[data-column="status"]');
            groupElement.textContent =  Group_Data.TGroup_Name;
            var htmlStatus = '<button data-group-id="' + Group_Data.TGroup_ID + '" data-TGroup-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-group-status">'+  
            (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
            '</button>';
            var buttonStatusElement = statusElement.querySelector('button');
            if (buttonStatusElement) {
              buttonStatusElement.remove();
            }
            statusElement.insertAdjacentHTML('beforeend', htmlStatus);
          }
        });
    }
    // Xử lý sự kiện khi người dùng nhấn nút Update 
}
//########### Danh Sách Group End ########### 

//########### Danh Sách Files Start ###########  
if (window.location.pathname === '/danh-sach-attach-file/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-attach/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Attach();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  // load data product
  function Load_Attach(){
    $.ajax({
      url: '/danh-sach-data-attach-file/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id: $('#search-AttachmentID').val().toLowerCase().trim(),
              ticketid: $('#search-TicketID').val().toLowerCase().trim(),
              attachment: $('#search-AttachmentName').val().toLowerCase().trim(),
              create: $('#search-AttachmentCreate').val().toLowerCase().trim(),
              date: $('#search-AttachmentDate').val().toLowerCase().trim(),
              time: $('#search-AttachmentTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tAttachments, context.users)
            display_Attachment(context.data, currentPage, itemsPerPage,filters, context.data);
            auth_role();
          
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

    //authorization page
    function auth_role(){
      $.ajax({
        url: '/phan-quyen-attach/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            // var buttonAdd = document.querySelector('#addRole');
            var buttonEdit = document.querySelectorAll('.update-attach');
            var buttonDel = document.querySelectorAll('.delete-attach');
            //Role Add New User
            // if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
            //   buttonAdd.classList.remove('disable-button');
            // }
            // else{
            //   buttonAdd.classList.add('disable-button');
            // }
            //Role Update User
            if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
              buttonEdit.forEach(function(edit){
                edit.classList.remove('disable-button');
              });        
            }
            else{
              buttonEdit.forEach(function(edit){
                edit.classList.add('disable-button');
              });             
            }
            //Role Delete User
            if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
              buttonDel.forEach(function(edit){
                edit.classList.remove('disable-button');
              });
            }
            else{
              buttonDel.forEach(function(edit){
                edit.classList.add('disable-button');
              }); 
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    // Load data
      function display_Attachment(products, currentPage, itemsPerPage, filters, data_temp) {

        $('#product-table tbody').empty();
        var filteredProducts = products.filter(function(product) {
            var IDMatch = filters.id === '' || product.Attachment_ID.toString().toLowerCase().includes(filters.id);
            var TicketMatch = filters.ticketid === '' || product.Ticket_ID.toString().toLowerCase().includes(filters.ticketid);
            var AttachNameMatch = filters.attachment === '' || product.Attachment_Name.toLowerCase().indexOf(filters.attachment) > -1;
            var createMatch = filters.create === '' || product.Attachment_User_Name.toString().toLowerCase().indexOf(filters.create) > -1;
            var dateMatch = filters.date === '' || product.Attachment_Date.toString().toLowerCase().indexOf(filters.date) > -1;
            var timeMatch = filters.time === '' || product.Attachment_Time.toLowerCase().indexOf(filters.time) > -1;
            var statusMatch = filters.status === '' || product.Attachment_Status.toString().toLowerCase().indexOf(filters.status) > -1;

            return IDMatch && TicketMatch && AttachNameMatch && createMatch && dateMatch && timeMatch && statusMatch ;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }
        
        var show_hide = '';
        var status = document.querySelector('#showall i');
        if (status.classList.contains('ti-shift-right')) {
          show_hide = 'hidden-column';
        }
        else if (status.classList.contains('ti-shift-left')){
          show_hide = 'show-column';
        }
        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr data-product-id="'+product.Attachment_ID+'">' +
            '<td data-column="id">#' + product.Attachment_ID + '</td>' +           
            '<td data-column="ticketid">#' + product.Ticket_ID + '</td>' +           
            '<td data-column="attach">' +(product.Attachment_Name.length < 30 ? product.Attachment_Name : product.Attachment_Name.substring(0,30) + "...") + '</td>' +
            '<td data-column="username">' + product.Attachment_User_Name + '</td>' +         
            '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + product.Attachment_Date + '</td>' +
            '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + product.Attachment_Time + '</td>' +
            '<td data-column="status"><button data-attach-id="' + product.Attachment_ID + '" data-attach-status="' + product.Attachment_Status + '" type="button" class="btn btn-'+(product.Attachment_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-attach-status">'+  
            (product.Attachment_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-attach disable-button" name="Update[]" value="' + product.Attachment_ID + '"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-attach disable-button" name="delete[]" value="' + product.Attachment_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
            event.preventDefault();
      
            var page = $(this).data('page');
            display_Attachment(products, page, itemsPerPage, filters);
            auth_role();
        });
        
        // Handle First and Last button click event - start
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            display_Attachment(products, 1, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Attachment(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            display_Attachment(products, numPages, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Attachment(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        // Handle First and Last button click event - end
        
        //xử lý sự kiện update status
        $(document).on('click', '.btn-company-status', function() {
          // document.querySelector('.btn-company-status').addEventListener('click', function() {
            // var comp   = document.querySelector('.btn-company-status');
            var comp   = $(this);
            var status = comp.attr('data-company-status');
            var id     = comp.attr('data-company-id');
            var status_new = (status === "true" ? "false" : "true");
            if(status){
              $.ajax({
                url: '/cap-nhat-cong-ty/',
                dataType: 'json',
                method: 'POST',
                data: {
                  'status': (status === "true" ? "False" : "True"),
                  'CompanyID': id,
                },
                success: function(response) {
                  if (response.success) {     
                    var htmlStatus = '<button data-company-id="' + response.Company_ID + '" data-company-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-company-status">'+  
                    (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';

                    var btn_status = document.querySelector('tr[data-product-id="' + response.Company_ID + '"]');
                    var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                    var btn_status_button = btn_status_column.querySelector('button');
                    if (btn_status_button) {
                      btn_status_button.remove();
                    }
                    btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);

                      Swal.fire({
                        icon: 'success',
                        title: 'Thông Báo',
                        timer: 1000,
                        text: response.message,
                      });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: response.message,
                    });
                  }
                },
                error: function(response) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Thông Báo Lỗi',
                    text: response.message,
                  });
                }
              });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi', 
                text: 'Không update được status',
              })
            }
            
          });
        //xử lý sự kiện update status

        // Search data in textbox table - start
        $('#search-AttachmentID,#search-TicketID, #search-AttachmentName, #search-AttachmentCreate,#search-AttachmentDate,#search-AttachmentTime,.db-status').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-AttachmentID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-AttachmentName').blur();
              $('#search-AttachmentCreate').blur();
              $('#search-TicketID').blur();
              var formattedDate ="";
              var date = $('#search-AttachmentDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-AttachmentID').val().toLowerCase().trim(),
                ticketid: $('#search-TicketID').val().toLowerCase().trim(),
                attachment: $('#search-AttachmentName').val().toLowerCase().trim(),
                create: $('#search-AttachmentCreate').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-AttachmentTime').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Attachment(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
          }
        });
        $(document).on('click', '.btn-remove-filter', function() {
          $('#search-AttachmentID').val('');
          $('#search-TicketID').val('');
          $('#search-AttachmentName').val('');
          $('#search-AttachmentCreate').val('');
          $('#search-AttachmentDate').val('');
          $('#search-AttachmentTime').val('');
          $('.db-status').val('');
          reset_data();  
        });
        
        function reset_data(){
          $('#search-AttachmentID').blur(); // Mất focus khỏi textbox tìm kiếm
          $('#search-AttachmentName').blur();
          $('#search-AttachmentCreate').blur();
          $('#search-TicketID').blur();
          var formattedDate ="";
          var date = $('#search-AttachmentDate').val();
          if(date){
            var parts = date.split("-");
            formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
          }
          // Lấy giá trị của filters
          var filters = {
            id: $('#search-AttachmentID').val().toLowerCase().trim(),
            ticketid: $('#search-TicketID').val().toLowerCase().trim(),
            attachment: $('#search-AttachmentName').val().toLowerCase().trim(),
            create: $('#search-AttachmentCreate').val().toLowerCase().trim(),
            date: formattedDate,
            time: $('#search-AttachmentTime').val().toLowerCase().trim(),
            status: $('.db-status').val().toLowerCase().trim(),
          };
          if(data_temp){
            display_Attachment(data_temp, currentPage, itemsPerPage, filters, data_temp);
            auth_role();
          }
        }
        // Search data in textbox table - end

      //update status - click
        $(document).on('click', '.btn-attach-status', function() {
            var comp   = $(this);
            var status = comp.attr('data-attach-status');
            var id     = comp.attr('data-attach-id');
            var status_new = (status === "true" ? "false" : "true");
            if(status){
              $.ajax({
                url: '/cap-nhat-attachment/',
                dataType: 'json',
                method: 'POST',
                data: {
                  'status': (status === "true" ? "False" : "True"),
                  'AttachID': id,
                },
                success: function(response) {
                  if (response.success) {     
                    var htmlStatus = '<button data-attach-id="' + response.Attachment_ID + '" data-attach-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-attach-status">'+  
                    (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';
  
                    var btn_status = document.querySelector('tr[data-product-id="' + response.Attachment_ID + '"]');
                    var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                    var btn_status_button = btn_status_column.querySelector('button');
                    if (btn_status_button) {
                      btn_status_button.remove();
                    }
                    btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);
  
                    Swal.fire({
                      icon: 'success',
                      title: 'Thông Báo',
                      timer: 1000,
                      text: response.message,
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: response.message,
                    });
                  }
                },
                error: function(response) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Thông Báo Lỗi',
                    text: response.message,
                  });
                }
              });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi', 
                text: 'Không update được status',
              })
            }
            
          });
      //update status - click
        
      }

    //xử lý sự kiện close modal
      $('.close').click(function(event) {
        $('#UpdateAttachmentModal').modal('hide');
      });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
      $(document).on('click', '.delete-attach', function() {
        var AttachID = $(this).val();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success btn-success-cus',
            cancelButton: 'btn btn-danger btn-danger-cus'
          },
          buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Bạn muốn xóa Files Đính Kèm "+ AttachID + " ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();          
            var parentRow = $(this).closest('tr');
            delete_Attachment(AttachID, parentRow);      
          } 
        })
      });

      function delete_Attachment(AttachID, parentRow){
        $.ajax({
          url: '/xoa-dinh-kem/',
          dataType: 'json',
          method: 'POST',
          data: {
            'AttachID': AttachID,
          },
          success: function(response) {
            if (response.success) {
              parentRow.remove();
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
      $('.addGroup').click(function(event) {
        $('#CreateGroupModal').modal('show');
      });
      $('#create-group-button').click(function(event) {
        event.preventDefault(); // Prevent default form submission      
        var Group_Name = document.querySelector('#input_group_name').value;
        create_group(Group_Name);
      });
      function create_group(Group_Name){
        $.ajax({
          url: '/tao-nhom/',
          dataType: 'json',
          method: 'POST',
          data: {
            'Group_Name': Group_Name,
          },
          success: function(response) {
            if (response.success) {     
              // var data_Company = document.querySelector('#product-table tbody').find('tr[data-product-id="' + response.Company_ID + '"]'); 
              // var companyName =  data_Company.querySelector('td[data-column="company"]');
              // companyName.textContent = response.Company_Name;
              add_row_group(response)
              $('#CreateGroupModal').modal('hide');           
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
      function add_row_group(data){
        var show_hide = '';
        var status = document.querySelector('#showall i');
        if (status.classList.contains('ti-shift-right')) {
          show_hide = 'hidden-column';
        }
        else if (status.classList.contains('ti-shift-left')){
          show_hide = 'show-column';
        }

        $('#product-table tbody').prepend('<tr data-product-id="'+data.TGroup_ID+'">' +
        '<td data-column="id">#' + data.TGroup_ID + '</td>' +           
        '<td data-column="group">' + data.TGroup_Name + '</td>' +
        '<td data-column="username">' + data.TGroup_User_Name + '</td>' +         
        '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + data.TGroup_Date + '</td>' +
        '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + data.TGroup_Time + '</td>' +
        '<td data-column="status"><button data-attach-id="' + data.TGroup_ID + '" data-attachp-status="' + data.TGroup_Status + '" type="button" class="btn btn-'+(data.TGroup_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-attach-status">'+  
        (data.TGroup_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
        '</button></td>' +
        '<td>' +
        '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-attach disable-button" name="Update[]" value="' + data.TGroup_ID + '"><i class="ti-pencil text-danger"></i></button>' +
        '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-attach disable-button" name="delete[]" value="' + data.TGroup_ID + '"><i class="ti-trash text-danger"></i></button>' +
        '</td>' +
      '</tr>');
      }
    // Xử lý sự kiện khi người dùng nhấn nút Create


    // Xử lý sự kiện khi người dùng nhấn nút Update
    $(document).on('click', '.update-attach', function() {
      $('#UpdateAttachmentModal').modal('show');
      if( $('#UpdateAttachmentModal').modal('show'))
      {       
        var AttachID = $(this).val();
        LoadDataUpdate_Group(AttachID);           
      }
    });

  // load data form update product
    function LoadDataUpdate_Group(AttachID){    
      $.ajax({
        url: '/data-update-attachment/',
        dataType: 'json',
        method: 'POST',
        data: {'AttachID': AttachID},
        success: function(response) {
          if(response.success){
            var input = document.querySelector('#UpdateAttachmentModal');
            var input_ID = input.querySelector('#input_attach_id');
            input_ID.value = response.Attachment[0].Attachment_ID;
            var input_Name = input.querySelector('#input_attach_name');
            input_Name.value = response.Attachment[0].Attachment_Name;

            var input_status = input.querySelectorAll('#input_attach_status option');            
            input_status.forEach(function(sta){
              var status = sta.getAttribute('value');
              var attachStatus = response.Attachment[0].Attachment_Status;                         
              if (status === String(attachStatus)) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected');
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#Update-attachment-button', function() {
    // $('#Update-company-button').click(function(event) {
      // $(document).on('click', 'update-company-button', function() {
      var modal = document.querySelector('#UpdateAttachmentModal');
      var input_ID = modal.querySelector('#input_attach_id').value;
      var input_Name = modal.querySelector('#input_attach_name').value;
      var input_status = modal.querySelector('#input_attach_status').value;
    
      if (input_ID && input_Name && input_status) {
        update_attach(input_ID, input_Name, input_status);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    });
    

    function update_attach(AttachID, AttachName,status){
      var status_new = (status == "true" ? "true" : "false")
      $.ajax({
            url: '/cap-nhat-attachment/',
            dataType: 'json',
            method: 'POST',
            data: {
              'AttachID': AttachID,
              'status': (status == "true" ? "True" : "False"),
              'AttachName': AttachName,
            },
            success: function(response) {
              if (response.success) {
                update_info_attach(response, status_new);
                $('#UpdateAttachmentModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }

    function update_info_attach(Attach_Data,status_new){
        // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
        var productRows = document.querySelectorAll('tr[data-product-id]');

        // Lặp qua từng phần tử tr
        productRows.forEach(function(row) {
          // Lấy giá trị của thuộc tính data-product-id
          var AttachID = parseInt(row.getAttribute('data-product-id'));

          // Kiểm tra xem productId có khớp với sản phẩm bạn đang quan tâm không
          if (AttachID === Attach_Data.Attachment_ID) {
            // Cập nhật thông tin của phần tử
            var attachElement = row.querySelector('[data-column="attach"]');
            var statusElement = row.querySelector('[data-column="status"]');
            attachElement.textContent =  (Attach_Data.Attachment_Name < 30 ? Attach_Data.Attachment_Name : Attach_Data.Attachment_Name.substring(0,30) + '...');
            var htmlStatus = '<button data-attach-id="' + Attach_Data.Attachment_ID + '" data-attach-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-attach-status">'+  
            (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
            '</button>';
            var buttonStatusElement = statusElement.querySelector('button');
            if (buttonStatusElement) {
              buttonStatusElement.remove();
            }
            statusElement.insertAdjacentHTML('beforeend', htmlStatus);
          }
        });
    }
    // Xử lý sự kiện khi người dùng nhấn nút Update 
    $(document).on('click', '#showall', function() {
      var show_hide = document.querySelectorAll('#toggle-column');
      // var changeIcon =  document.querySelector('#showall i');
      var button =  document.querySelector('#showall');
      show_hide.forEach(function(item){
        if (item.classList.contains('hidden-column')) {
          // changeIcon.classList.remove('ti-shift-right');
          // changeIcon.classList.add('ti-shift-left');
          button.innerHTML = '<i class="btn-icon-prepend ti-shift-left"></i> ẨN CỘT';
    
          item.classList.remove('hidden-column');
          item.classList.add('show-column');
        } else if (item.classList.contains('show-column')) {          
          // changeIcon.classList.remove('ti-shift-left');
          // changeIcon.classList.add('ti-shift-right');
          button.innerHTML = '<i class="btn-icon-prepend ti-shift-right"></i> HIỂN THỊ CỘT';
  
          item.classList.remove('show-column');
          item.classList.add('hidden-column');
        } 
      });
    });
}
//########### Danh Sách Files End ########### 

//########### Danh Sách Assign Start ###########  
if (window.location.pathname === '/danh-sach-phan-cong/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-phan-cong/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Assign();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo 1',
        text: response.message,
      });
    }
  });


  // load data product
  function Load_Assign(){
    $.ajax({
      url: '/danh-sach-data-phan-cong/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id: $('#search-Assign_ID').val().toLowerCase().trim(),
              user: $('#search-ID_user').val().toLowerCase().trim(),
              name: $('#search-username').val().toLowerCase().trim(),
              group: $('#search-TGroup_ID').val().toLowerCase().trim(),
              create: $('#search-Assign_User_Name').val().toLowerCase().trim(),
              date: $('#search-Assign_User_Date').val().toLowerCase().trim(),
              time: $('#search-Assign_User_Time').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            Load_data(context.group);
            display_Assign(context.data, currentPage, itemsPerPage,filters, context.data);
            auth_role();
          
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

  //authorization page
  function auth_role(){
    $.ajax({
      url: '/phan-quyen-phan-cong/',
      dataType: 'json',
      method: 'POST',
      success: function(response) {
        if (response.success) {
          var buttonAdd = document.querySelector('#addAssign');
          var buttonEdit = document.querySelectorAll('.btn-assign-status');
          var buttonDel = document.querySelectorAll('.delete-assign');

          //Role Add New User
          if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
            buttonAdd.classList.remove('disable-button');
          }
          else{
            buttonAdd.classList.add('disable-button');
          }
          //Role Update User
          if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
            buttonEdit.forEach(function(edit){
              edit.classList.remove('admin-button');
            });        
          }
          else{
            buttonEdit.forEach(function(edit){
              edit.classList.add('admin-button');
            });             
          }
          //Role Delete User
          if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
            buttonDel.forEach(function(edit){
              edit.classList.remove('disable-button');
            });
          }
          else{
            buttonDel.forEach(function(edit){
              edit.classList.add('disable-button');
            }); 
          }
          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        }
      },
      error: function(response) {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    });
  }

    // Load data
      function display_Assign(products, currentPage, itemsPerPage, filters, data_temp) {

        $('#product-table tbody').empty();
        var filteredProducts = products.filter(function(product) {
            var IDMatch = filters.id === '' || product.Assign_ID.toString().toLowerCase().includes(filters.id);
            var userMatch = filters.user === '' || product.ID_user.toLowerCase().indexOf(filters.user) > -1;
            var nameMatch = filters.name === '' || product.UserName.toLowerCase().indexOf(filters.name) > -1;
            var groupMatch = filters.group === '' || product.TGroup_ID.toLowerCase().indexOf(filters.group) > -1;
            var createMatch = filters.create === '' || product.Assign_User_Name.toString().toLowerCase().indexOf(filters.create) > -1;
            var dateMatch = filters.date === '' || product.Assign_User_Date.toString().toLowerCase().indexOf(filters.date) > -1;
            var timeMatch = filters.time === '' || product.Assign_User_Time.toLowerCase().indexOf(filters.time) > -1;
            var statusMatch = filters.status === '' || product.Assign_User_Status.toString().toLowerCase().indexOf(filters.status) > -1;

            return IDMatch && userMatch && nameMatch && groupMatch && createMatch && dateMatch && timeMatch && statusMatch ;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }
          
          var show_hide = '';
          var status = document.querySelector('#showall i');
          if (status.classList.contains('ti-shift-right')) {
            show_hide = 'hidden-column';
          }
          else if (status.classList.contains('ti-shift-left')){
            show_hide = 'show-column';
          }
        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr data-product-id="'+product.Assign_ID+'">' +
            '<td data-column="id">#' + product.Assign_ID + '</td>' +           
            '<td data-column="user">#' + product.ID_user + '</td>' +           
            '<td data-column="name">' + product.UserName + '</td>' +           
            '<td data-column="group">' + product.TGroup_ID + '</td>' +
            '<td data-column="username">' + product.Assign_User_Name + '</td>' +         
            '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + product.Assign_User_Date + '</td>' +
            '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + product.Assign_User_Time + '</td>' +
            '<td data-column="status"><button data-assign-id="' + product.Assign_ID + '" data-assign-status="' + product.Assign_User_Status + '" type="button" class="btn btn-'+(product.Assign_User_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-assign-status admin-button">'+  
            (product.Assign_User_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            // '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-assign" name="Update[]" value="' + product.Assign_ID + '"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-assign disable-button" name="delete[]" value="' + product.Assign_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
            event.preventDefault();
      
            var page = $(this).data('page');
            display_Assign(products, page, itemsPerPage, filters);
            auth_role();
        });
        
        // Handle First and Last button click event - start
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            display_Assign(products, 1, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Assign(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            display_Assign(products, numPages, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Assign(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        // Handle First and Last button click event - end
        
        //xử lý sự kiện update status click
        $(document).on('click', '.btn-assign-status', function() {
            var assign   = $(this);
            var status = assign.attr('data-assign-status');
            var id     = assign.attr('data-assign-id');
            var status_new = (status === "true" ? "false" : "true");
            if(status){
              $.ajax({
                url: '/cap-nhat-phan-cong/',
                dataType: 'json',
                method: 'POST',
                data: {
                  'status': (status === "true" ? "False" : "True"),
                  'AsignID': id,
                },
                success: function(response) {
                  if (response.success) {     
                    var htmlStatus = '<button data-assign-id="' + response.Assign_ID + '" data-assign-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-assign-status">'+  
                    (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';

                    var btn_status = document.querySelector('tr[data-product-id="' + response.Assign_ID + '"]');
                    var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                    var btn_status_button = btn_status_column.querySelector('button');
                    if (btn_status_button) {
                      btn_status_button.remove();
                    }
                    btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);

                      Swal.fire({
                        icon: 'success',
                        title: 'Thông Báo',
                        timer: 1000,
                        text: response.message,
                      });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: response.message,
                    });
                  }
                },
                error: function(response) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Thông Báo Lỗi',
                    text: response.message,
                  });
                }
              });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi', 
                text: 'Không update được status',
              })
            }
            
          });
        //xử lý sự kiện update status click

        // Search data in textbox table - start
        $('#search-Assign_ID,#search-username,#search-ID_user,#search-,#search-TGroup_ID , #search-Assign_User_Name, #search-Assign_User_Create,#search-Assign_User_Date,#search-Assign_User_Time,.db-status').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-Assign_ID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-ID_user').blur();
              $('#search-username').blur();
              $('#search-Assign_User_Name').blur();
              var formattedDate ="";
              var date = $('#search-Assign_User_Date').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-Assign_ID').val().toLowerCase().trim(),
                user: $('#search-ID_user').val().toLowerCase().trim(),
                name: $('#search-username').val().toLowerCase().trim(),
                group: $('#search-TGroup_ID').val().toLowerCase().trim(),
                create: $('#search-Assign_User_Name').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-Assign_User_Time').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Assign(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
          }
        });
        $(document).on('click', '.btn-remove-filter', function() {
          $('#search-Assign_ID').val('');
          $('#search-ID_user').val('');
          $('#search-username').val('');
          $('#search-TGroup_ID').val('');
          $('#search-Assign_User_Name').val('');
          $('#search-Assign_User_Date').val('');
          $('#search-Assign_User_Time').val('');
          $('.db-status').val('');
          reset_data();  
        });
        
        function reset_data(){
          $('#search-Assign_ID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-ID_user').blur();
              $('#search-username').blur();
              $('#search-Assign_User_Name').blur();
              var formattedDate ="";
              var date = $('#search-Assign_User_Date').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-Assign_ID').val().toLowerCase().trim(),
                user: $('#search-ID_user').val().toLowerCase().trim(),
                name: $('#search-username').val().toLowerCase().trim(),
                group: $('#search-TGroup_ID').val().toLowerCase().trim(),
                create: $('#search-Assign_User_Name').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-Assign_User_Time').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Assign(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
        }
        // Search data in textbox table - end
        
      }     

    //xử lý sự kiện close modal
      $('.close').click(function(event) {
        $('#CreateAssignModal').modal('hide');
      });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
      $(document).on('click', '.delete-assign', function() {
        var AssignID = $(this).val();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success btn-success-cus',
            cancelButton: 'btn btn-danger btn-danger-cus'
          },
          buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Bạn muốn xóa phân công "+ AssignID + " ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();          
            var parentRow = $(this).closest('tr');
            delete_Assign(AssignID, parentRow);      
          } 
        })
      });

      function delete_Assign(AssignID, parentRow){
        $.ajax({
          url: '/xoa-phan-cong/',
          dataType: 'json',
          method: 'POST',
          data: {
            'AssignID': AssignID,
          },
          success: function(response) {
            if (response.success) {
              parentRow.remove();
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
      $('.addAssign').click(function(event) {
        $('#CreateAssignModal').modal('show');
      });         

      $('#create-assign-button').click(function(event) {
        event.preventDefault(); // Prevent default form submission
        var group = document.querySelector('#input_assign_group').value;      
        var users = document.querySelectorAll('#selectedItemsContainer .selected-item');  
        var assgins = []
        users.forEach(function(assgin){
          user_assign = assgin.getAttribute('value-id');
          assgins.push(user_assign);
        })
        create_assign(group,assgins);
      });

      function create_assign(group,users){
        $.ajax({
          url: '/tao-phan-cong/',
          dataType: 'json',
          method: 'POST',
          data: {
            'users': JSON.stringify(users),
            'group': group,
          },
          success: function(response) {
            if (response.success) {     
              var list_user = "";
              var list = response.assigns;
              list.forEach(function(item){
                if(item.Status_Create === 'Insert'){
                  add_row_group(item);
                  auth_role();
                }
                else if(item.Status_Create === 'Update'){
                  var htmlStatus = '<button data-assign-id="' + item.Assign_ID + '" data-assign-status="' + item.Assign_User_Status + '" type="button" class="btn btn-'+(item.Assign_User_Status.toString() === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-assign-status">'+  
                    (item.Assign_User_Status.toString() === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';

                  var btn_status = document.querySelector('tr[data-product-id="' + item.Assign_ID + '"]');
                  var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                  var btn_status_button = btn_status_column.querySelector('button');
                  if (btn_status_button) {
                    btn_status_button.remove();
                  }
                  btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);
                }
                else{
                  list_user = list_user + "\n" + item.ID_user;
                }              
              })                        
              $('#CreateAssignModal').modal('hide');  
              if(list_user){
                Swal.fire({
                  icon: 'warning',
                  title: 'Thông Báo',
                  text:  list_user + " đã tồn tại" ,
                });
              }    
              else{
                Swal.fire({
                  icon: 'success',
                  title: 'Thông Báo',
                  timer: 1000,
                  text: response.message,
                });
              }                 
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }

      function add_row_group(data){
        var show_hide = '';
        var status = document.querySelector('#showall i');
        if (status.classList.contains('ti-shift-right')) {
          show_hide = 'hidden-column';
        }
        else if (status.classList.contains('ti-shift-left')){
          show_hide = 'show-column';
        }
        $('#product-table tbody').prepend('<tr data-product-id="'+data.Assign_ID+'">' +
            '<td data-column="id">#' + data.Assign_ID + '</td>' +           
            '<td data-column="user">#' + data.ID_user + '</td>' +           
            '<td data-column="name">' + data.UserName + '</td>' +           
            '<td data-column="group">' + data.TGroup_Name + '</td>' +
            '<td data-column="username">' + data.Assign_User_Name + '</td>' +         
            '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + data.Assign_User_Date + '</td>' +
            '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + data.Assign_User_Time + '</td>' +
            '<td data-column="status"><button data-assign-id="' + data.Assign_ID + '" data-assign-status="' + data.Assign_User_Status + '" type="button" class="btn btn-'+(data.Assign_User_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-assign-status admin-button">'+  
            (data.Assign_User_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            // '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-assign" name="Update[]" value="' + data.Assign_ID + '"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-assign disable-button" name="delete[]" value="' + data.Assign_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
      }

      //Load data 
      function Load_data(Tgroups){
        //load dropdown list TGroup - Ticket
        if(Tgroups){
          for(i=0; i< Tgroups.length; i++){
            var tgroup = Tgroups[i];
            $('.db-group').append(
              '<option value="'+tgroup.TGroup_ID+'">'+tgroup.TGroup_Name+'</option>'
            );
            $('.db-group-ticket').append(
              '<option value="'+tgroup.TGroup_ID+'">'+tgroup.TGroup_Name+'</option>'
            );
          }
        }
      }
      //Load data
      $(document).on('click', '#showall', function() {
        var show_hide = document.querySelectorAll('#toggle-column');
        // var changeIcon =  document.querySelector('#showall i');
        var button =  document.querySelector('#showall');
        show_hide.forEach(function(item){
          if (item.classList.contains('hidden-column')) {
            // changeIcon.classList.remove('ti-shift-right');
            // changeIcon.classList.add('ti-shift-left');
            button.innerHTML = '<i class="btn-icon-prepend ti-shift-left"></i> ẨN CỘT';
      
            item.classList.remove('hidden-column');
            item.classList.add('show-column');
          } else if (item.classList.contains('show-column')) {          
            // changeIcon.classList.remove('ti-shift-left');
            // changeIcon.classList.add('ti-shift-right');
            button.innerHTML = '<i class="btn-icon-prepend ti-shift-right"></i> HIỂN THỊ CỘT';
    
            item.classList.remove('show-column');
            item.classList.add('hidden-column');
          } 
        });
      });
}
//########### Danh Sách Assign End ########### 

//########### Danh Sách User Start ###########  
if (window.location.pathname === '/danh-sach-nguoi-dung/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-user/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_User();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  // load data product
  function Load_User(){
    $.ajax({
      url: '/danh-sach-data-nguoi-dung/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id:   $('#search-ID_User').val().toLowerCase().trim(),
              email: $('#search-Mail').val().toLowerCase().trim(),
              name: $('#search-FullName').val().toLowerCase().trim(),
              utype: $('.db-User_Type').val().toLowerCase().trim(),
              atype: $('#search-Acc_Type').val().toLowerCase().trim(),
              jobtitle: $('#search-Jobtitle').val().toLowerCase().trim(),
              birthday: $('#search-Birthday').val().toLowerCase().trim(),
              address: $('#search-Address').val().toLowerCase().trim(),
              phone: $('#search-Phone').val().toLowerCase().trim(),
              createid: $('#search-ID_Create').val().toLowerCase().trim(),
              createname: $('#search-Name_Create').val().toLowerCase().trim(),
              date: $('#search-Date_Create').val().toLowerCase().trim(),
              time: $('#search-Time_Create').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_User(context.data, currentPage, itemsPerPage,filters, context.data)
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

    //authorization page
    function auth_role(){
      $.ajax({
        url: '/phan-quyen-user/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            // if(response.IsAdmin == false || response.Roles[0].Status == 'False'){             
            //   window.location.href = '/dashboard/';
            // }
            var buttonAdd = document.querySelector('#addUser');
            var buttonEdit = document.querySelectorAll('.update-user');
            var buttonDel = document.querySelectorAll('.delete-user');
            var buttonAdmin = document.querySelectorAll('.btn-user-role');
            var optionAdmin = document.querySelectorAll('.opt-admin');
            //Role Add New User
            if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
              buttonAdd.classList.remove('disable-button');
            }
            else{
              buttonAdd.classList.add('disable-button');
            }
            //Role Update User
            if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
              buttonEdit.forEach(function(edit){
                edit.classList.remove('disable-button');
              });        
            }
            else{
              buttonEdit.forEach(function(edit){
                edit.classList.add('disable-button');
              });             
            }
            //Role Delete User
            if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
              buttonDel.forEach(function(edit){
                edit.classList.remove('disable-button');
              });
            }
            else{
              buttonDel.forEach(function(edit){
                edit.classList.add('disable-button');
              }); 
            }
            //Role Admin
            if(response.IsAdmin == true || response.Roles[4].Status == 'True'){             
              buttonAdmin.forEach(function(admin){
                admin.classList.remove('admin-button');               
                optionAdmin.forEach(function(opt){
                  opt.classList.remove('hide-option');
                });
              });
            }
            else{
              buttonDel.forEach(function(edit){
                admin.classList.add('admin-button');
                optionAdmin.forEach(function(opt){
                  opt.classList.add('hide-option');
                });
              }); 
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    // Load data
    function display_User(products, currentPage, itemsPerPage, filters, data_temp) {

      $('#product-table tbody').empty();
      var filteredProducts = products.filter(function(product) {
          var IDMatch = filters.id === '' || product.ID_user.toString().toLowerCase().includes(filters.id);
          var MailMatch = filters.email === '' || product.Mail.toLowerCase().indexOf(filters.email) > -1;
          var NameMatch = filters.name === '' || product.FullName.toLowerCase().indexOf(filters.name) > -1;
          var UtypeMatch = filters.utype === '' || product.User_Type.toString().toLowerCase().indexOf(filters.utype) > -1;
          var AtypeMatch = filters.atype === '' || product.Acc_Type.toLowerCase().indexOf(filters.atype) > -1;
          var JobtitleMatch = filters.jobtitle === '' || product.Jobtitle.toLowerCase().indexOf(filters.jobtitle) > -1;
          var BirthdayMatch = filters.birthday === '' || product.Birthday.toLowerCase().indexOf(filters.birthday) > -1;
          var AddressMatch = filters.address === '' || product.Address.toLowerCase().indexOf(filters.address) > -1;
          var PhoneMatch = filters.phone === '' || product.Phone.toLowerCase().indexOf(filters.phone) > -1;
          var createIDMatch = filters.createid === '' || product.ID_Create.toString().toLowerCase().indexOf(filters.createid) > -1;
          var createNameMatch = filters.createname === '' || product.Name_Create.toString().toLowerCase().indexOf(filters.createname) > -1;
          var dateMatch = filters.date === '' || product.Date_Create.toString().toLowerCase().indexOf(filters.date) > -1;
          var timeMatch = filters.time === '' || product.Time_Create.toLowerCase().indexOf(filters.time) > -1;
          var statusMatch = filters.status === '' || product.User_Status.toString().toLowerCase().indexOf(filters.status) > -1;

          return IDMatch && MailMatch && NameMatch && UtypeMatch && AtypeMatch && JobtitleMatch && BirthdayMatch && AddressMatch && PhoneMatch && createIDMatch && createNameMatch && dateMatch && timeMatch && statusMatch ;
        });

        if(filteredProducts !== null || filteredProducts !== '')
        {
          products = filteredProducts
        }

        var show_hide = '';
        var status = document.querySelector('#showall i');
        if (status.classList.contains('ti-shift-right')) {
          show_hide = 'hidden-column';
        }
        else if (status.classList.contains('ti-shift-left')){
          show_hide = 'show-column';
        }
      for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
        var product = products[i];
        if(product.Avatar === 'Null')
        {
          var ava = '';
        }
        $('#product-table tbody').append('<tr data-product-id="'+product.ID_user+'">' +
          '<td data-column="ava">' + (product.Avatar != 'Null' ? '<img class="img-xs rounded-circle" src="'+product.Avatar+'" alt="Profile image">' : '<div class="avatar-container"> <div class="avatar-title-list">'+ product.img +'</div></div>' )+ '</td>' +           
          '<td data-column="id">#' + product.ID_user + '</td>' +           
          '<td data-column="mail">' + product.Mail + '</td>' +           
          '<td data-column="name">' + product.FullName + '</td>' +           
          '<td data-column="utype"><button data-user-id="' + product.ID_user + '" data-type-value="' + product.User_Type + '" type="button" class="btn btn-'+(product.User_Type == 0 ? 'danger' : (product.User_Type == 1 ? 'warning' : 'primary' ))+' btn-rounded btn-fw btn-user-role admin-button">'+  
          (product.User_Type == 0 ? 'Administrator' :  (product.User_Type == 1 ? 'Moderator' : 'Member'))+
          '</button></td>' +
          '<td data-column="atype" id="toggle-column" class="'+show_hide+'">' + product.Acc_Type + '</td>' +
          '<td data-column="jobtitle" id="toggle-column" class="'+show_hide+'">' + product.Jobtitle + '</td>' +
          '<td data-column="birthday" id="toggle-column" class="'+show_hide+'">' + product.Birthday + '</td>' +
          '<td data-column="address" id="toggle-column" class="'+show_hide+'">' + product.Address + '</td>' +
          '<td data-column="phone" id="toggle-column" class="'+show_hide+'">' + (product.Phone != 'No Data'? '0'+product.Phone : 'No Data') + '</td>' +
          '<td data-column="createid" id="toggle-column" class="'+show_hide+'">' + product.ID_Create + '</td>' +
          '<td data-column="createname" id="toggle-column" class="'+show_hide+'">' + product.Name_Create + '</td>' +         
          '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + product.Date_Create + '</td>' +
          '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + product.Time_Create + '</td>' +
          '<td data-column="status"><button data-user-id="' + product.ID_user + '" data-user-status="' + product.User_Status + '" type="button" class="btn btn-'+(product.User_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-user-status">'+  
          (product.User_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
          '</button></td>' +
          '<td>' +
          '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-user disable-button" name="Update[]" value="' + product.ID_user + '"><i class="ti-pencil text-danger"></i></button>' +
          '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-user disable-button" name="delete[]" value="' + product.ID_user + '"><i class="ti-trash text-danger"></i></button>' +
          '</td>' +
        '</tr>');
      }
    
      var numPages = Math.ceil(products.length / itemsPerPage);
      var pagination = $('#pagination');
      pagination.empty();
      
      // Add First button
      pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
      
      for (var i = 1; i <= numPages; i++) {
        var activeClass = (i === currentPage) ? "active" : "";
        pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
      }
      
      // Add Last button
      pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
    
      pagination.find('.page-link').click(function(event) {
          event.preventDefault();
    
          var page = $(this).data('page');
          display_User(products, page, itemsPerPage, filters);
          auth_role();
      });
      
      // Handle First and Last button click event - start
      pagination.find('.page-item:first-child .page-link').click(function(event) {
        event.preventDefault();
        
        if (currentPage > 1) {
          display_User(products, 1, itemsPerPage, filters);
          auth_role();
        }
        else
        {
          display_User(products, currentPage, itemsPerPage, filters);
          auth_role();
        }
      });
      pagination.find('.page-item:last-child .page-link').click(function(event) {
        event.preventDefault();
        
        if (currentPage < numPages) {
          display_User(products, numPages, itemsPerPage, filters);
          auth_role();
        }
        else
        {
          display_User(products, currentPage, itemsPerPage, filters);
          auth_role();
        }
      });
      // Handle First and Last button click event - end
      
      //xử lý sự kiện update status
      $(document).on('click', '.btn-user-status', function() {
        // document.querySelector('.btn-company-status').addEventListener('click', function() {
          // var comp   = document.querySelector('.btn-company-status');
          var user   = $(this);
          var status = user.attr('data-user-status');
          var id     = user.attr('data-user-id');
          var status_new = (status === "true" ? "false" : "true");
          if(status){
            $.ajax({
              url: '/cap-nhat-nguoi-dung/',
              dataType: 'json',
              method: 'POST',
              data: {
                'status': (status === "true" ? "False" : "True"),
                'UserID': id,
                'Action': 'status'
              },
              success: function(response) {
                if (response.success) {     
                  var htmlStatus = '<button data-user-id="' + response.ID_user + '" data-user-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-user-status">'+  
                  (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                  '</button>';

                  var btn_status = document.querySelector('tr[data-product-id="' + response.ID_user + '"]');
                  var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                  var btn_status_button = btn_status_column.querySelector('button');
                  if (btn_status_button) {
                    btn_status_button.remove();
                  }
                  btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);

                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                  });
                }
              },
              error: function(response) {
                Swal.fire({
                  icon: 'error',
                  title: 'Thông Báo Lỗi',
                  text: response.message,
                });
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi', 
              text: 'Không update được status',
            })
          }
          
        });

        $(document).on('click', '.btn-user-role', function(){
          var user = $(this);
          var type = user.attr('data-type-value');
          var id     = user.attr('data-user-id');
          var userID = document.querySelector('#input_Role_id');
          userID.value = id;
          var userType = document.querySelectorAll('#input_user_role option');
          userType.forEach(function(item){
            var type_value = item.value;
            if(type_value === type){
              item.setAttribute('selected','selected');
            }
            else{
              item.removeAttribute('selected','selected');
            }
          });       
          $('#UpdateRoleModal').modal('show');
        });

        $(document).on('click', '#Update-role-button', function(){
          var id = document.querySelector('#input_Role_id').value;
          var type = document.querySelector('#input_user_role').value;
          
          $.ajax({
            url: '/cap-nhat-nguoi-dung/',
            dataType: 'json',
            method: 'POST',
            data: {
              'UserID': id,
              'UserType': type,
              'Action': 'role'
            },
            success: function(response) {
              if (response.success) {     
                var htmlStatus = '<button data-user-id="' + response.ID_user + '" data-type-value="' + response.User_Type + '" type="button" class="btn btn-'+(response.User_Type == 0 ? 'danger' : (response.User_Type == 1 ? 'warning' : 'primary' ))+' btn-rounded btn-fw btn-user-role">'+  
                (response.User_Type == 0 ? 'Administrator' :  (response.User_Type == 1 ? 'Moderator' : 'Member'))+
                '</button>';

                var btn_status = document.querySelector('tr[data-product-id="' + response.ID_user + '"]');
                var btn_status_column = btn_status.querySelector('td[data-column="utype"]');
                var btn_status_button = btn_status_column.querySelector('button');
                if (btn_status_button) {
                  btn_status_button.remove();
                }
                btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);
                $('#UpdateRoleModal').modal('hide');

                Swal.fire({
                  icon: 'success',
                  title: 'Thông Báo',
                  timer: 1000,
                  text: response.message,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
        });
      //xử lý sự kiện update status

      // Search data in textbox table - start     
      $('#search-ID_User, #search-Mail, #search-FullName,.db-User_Type,#search-Acc_Type,#search-Birthday,#search-Jobtitle,#search-Address,#search-Phone,#search-ID_Create,#search-Name_Create,#search-Date_Create,#search-Time_Create,.db-status').on('keydown', function(event) {
        if (event.keyCode === 13) { // Nếu nhấn phím Enter
            event.preventDefault(); // Tránh việc reload lại trang
            $('#search-ID_User').blur(); // Mất focus khỏi textbox tìm kiếm
            $('#search-Mail').blur();
            $('#search-FullName').blur();
            $('#search-Jobtitle').blur();
            $('#search-Address').blur();
            $('#search-Phone').blur();
            $('#search-ID_Create').blur();
            $('#search-Name_Create').blur();
            var formattedDate ="";
            var formattedDateBirth ="";
            var birth = $('#search-Birthday').val();
            var date = $('#search-Date_Create').val();
            if(date){
              var parts = date.split("-");
              formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
            }
            if(birth){
              var parts = birth.split("-");
              formattedDateBirth = parts[2] + "/" + parts[1] + "/" + parts[0];
            }
            // Lấy giá trị của filters
            var filters = {
              id:   $('#search-ID_User').val().toLowerCase().trim(),
              email: $('#search-Mail').val().toLowerCase().trim(),
              name: $('#search-FullName').val().toLowerCase().trim(),
              utype: $('.db-User_Type').val().toLowerCase().trim(),
              atype: $('#search-Acc_Type').val().toLowerCase().trim(),
              jobtitle: $('#search-Jobtitle').val().toLowerCase().trim(),
              birthday: formattedDateBirth,
              address: $('#search-Address').val().toLowerCase().trim(),
              phone: $('#search-Phone').val().toLowerCase().trim(),
              createid: $('#search-ID_Create').val().toLowerCase().trim(),
              createname: $('#search-Name_Create').val().toLowerCase().trim(),
              date: formattedDate,
              time: $('#search-Time_Create').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            if(data_temp){
              display_User(data_temp, currentPage, itemsPerPage, filters, data_temp);
              auth_role();
            }
        }
      });
      
      // Search data in textbox table - end
      
      //clear data search
    $(document).on('click', '.btn-remove-filter', function() {
      $('#search-ID_User').val('');
      $('#search-Mail').val('');
      $('#search-FullName').val('');
      $('.db-User_Type').val('');
      $('#search-Acc_Type').val('');
      $('#search-Jobtitle').val('');
      $('#search-Birthday').val('');
      $('#search-Address').val('');
      $('#search-Phone').val('');
      $('#search-ID_Create').val('');
      $('#search-Name_Create').val('');
      $('#search-Date_Create').val('');
      $('#search-Time_Create').val('');
      $('.db-status').val(''); 
      var perPage = document.querySelector('#db-rows').value;
      reset_data(parseInt(perPage));  
    });
    
    function reset_data(itemsPerPage){
          $('#search-ID_User').blur(); // Mất focus khỏi textbox tìm kiếm
          $('#search-Mail').blur();
          $('#search-FullName').blur();
          $('#search-Jobtitle').blur();
          $('#search-Address').blur();
          $('#search-Phone').blur();
          $('#search-ID_Create').blur();
          $('#search-Name_Create').blur();
          var formattedDate ="";
          var formattedDateBirth ="";
          var birth = $('#search-Birthday').val();
          var date = $('#search-Date_Create').val();
          if(date){
            var parts = date.split("-");
            formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
          }
          if(birth){
            var parts = birth.split("-");
            formattedDateBirth = parts[2] + "/" + parts[1] + "/" + parts[0];
          }
          // Lấy giá trị của filters
          var filters = {
            id:   $('#search-ID_User').val().toLowerCase().trim(),
            email: $('#search-Mail').val().toLowerCase().trim(),
            name: $('#search-FullName').val().toLowerCase().trim(),
            utype: $('.db-User_Type').val().toLowerCase().trim(),
            atype: $('#search-Acc_Type').val().toLowerCase().trim(),
            jobtitle: $('#search-Jobtitle').val().toLowerCase().trim(),
            birthday: formattedDateBirth,
            address: $('#search-Address').val().toLowerCase().trim(),
            phone: $('#search-Phone').val().toLowerCase().trim(),
            createid: $('#search-ID_Create').val().toLowerCase().trim(),
            createname: $('#search-Name_Create').val().toLowerCase().trim(),
            date: formattedDate,
            time: $('#search-Time_Create').val().toLowerCase().trim(),
            status: $('.db-status').val().toLowerCase().trim(),
          };
          if(data_temp){
            display_User(data_temp, currentPage, itemsPerPage, filters, data_temp);
            auth_role();
          }
    }
    //clear data search


      //function button status update  - start
        var statusButtons = document.querySelectorAll('.btn-status');
        statusButtons.forEach(function(button) {
          button.addEventListener('click', function() {     
              $('#StatusModal').modal('show');
              if( $('#StatusModal').modal('show'))
              {
                var value = this.getAttribute('status-value');
                var ticketID = this.getAttribute('data-ticket-status');
                var id = document.querySelector('.ticket-ID');
                id.textContent =  ticketID;    
                var statusOptions = document.querySelectorAll('#input_model_status option');
                statusOptions.forEach(function(option) {
                  if (option.value === value) {
                    option.setAttribute('selected', 'selected');
                  } else {
                    option.removeAttribute('selected');
                  }
                });
              }         
          });
        });

        $('#status-button').click(function(event){
          var ticket = document.querySelector('.ticket-ID');
          if(ticket){
            var ticketid = ticket.innerText;
            var new_status = $('#input_model_status').val();
            var new_name = $('#input_model_status option:selected').text();
            ticket_update_status(ticketid, new_status, new_name);            
          }            
        });

        function ticket_update_status(ticketid, new_status, new_name) {
          $.ajax({
            url: '/cap-nhat-ticket-status/',
            dataType: 'json',
            method: 'POST',
            data: {
              'ticketid': ticketid,
              'new_status': new_status,
            },
            success: function(response) {
              if (response.success) {
                $('#StatusModal').modal('hide');
                // Cập nhật lại giá trị status-value của button
                var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
                btn_ticket.attr('status-value', new_status);
                btn_ticket.text(new_name);
                // Xóa tất cả các lớp hiện tại của nút
                btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

                // Thêm lớp mới dựa trên giá trị trạng thái
                if (new_status === '0') {
                  btn_ticket.addClass('btn-success');
                } else if (new_status === '1') {
                  btn_ticket.addClass('btn-primary');
                }
                else if (new_status === '2') {
                  btn_ticket.addClass('btn-warning');
                }
                else if (new_status === '3') {
                  btn_ticket.addClass('btn-danger');
                }

                Swal.fire({
                  icon: 'success',
                  title: 'Thông Báo',
                  timer: 1000,
                  text: response.message,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
        }    
        //function button status update ticket - end  

        //chose row in table 
        $(document).on('change', '#db-rows', function() {
          // var PerPage = this.value;
          var PerPage = parseInt(this.value);
          if(PerPage != itemsPerPage){
            reset_data(PerPage);
          }
        });
        
  }

    //xử lý sự kiện close modal
    $('.close').click(function(event) {
      $('#CreateUserModal').modal('hide');
      $('#UpdateRoleModal').modal('hide');
      $('#UpdateUserModal').modal('hide');
    });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
    $(document).on('click', '.delete-user', function() {
      var UserID = $(this).val();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-success-cus',
          cancelButton: 'btn btn-danger btn-danger-cus'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Bạn muốn xóa User "+ UserID + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          event.preventDefault();          
          var parentRow = $(this).closest('tr');
          delete_User(UserID, parentRow);      
        } 
      })
    });

    function delete_User(UserID, parentRow){
      $.ajax({
        url: '/xoa-nguoi-dung/',
        dataType: 'json',
        method: 'POST',
        data: {
          'UserID': UserID,
        },
        success: function(response) {
          if (response.success) {
            parentRow.remove();
            Swal.fire({
              icon: 'success',
              title: 'Thông Báo',
              timer: 1000,
              text: response.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
    $('.addUser').click(function(event) {
      $('#CreateUserModal').modal('show');
    });
    $('#create-user-button').click(function(event) {
      event.preventDefault(); // Prevent default form submission      
      var email = document.querySelector('#input_email').value;
      var pass = document.querySelector('#input_pass').value;
      var fullname = document.querySelector('#input_name').value;
      var phone = document.querySelector('#input_phone').value;
      var address = document.querySelector('#input_address').value;
      var birthday = document.querySelector('#input_birthday').value;
      var jobtitle = document.querySelector('#input_jobtitle').value;
      var role = document.querySelector('#input_role').value;
      var status_user = document.querySelector('#input_status').value;
      if(email && pass && fullname && role && status_user){
        validateEmail(email,pass,fullname,phone,address,birthday,jobtitle,role,status_user);
        // create_user(email,pass,fullname,phone,address,birthday,jobtitle,role,status_user)    
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Nhập Đầy Đủ Các Trường Có *',
        });
      }
      
    });
    function create_user(email,pass,fullname,phone,address,birthday,jobtitle,role,status_user){
      $.ajax({
        url: '/tao-nguoi-dung/',
        dataType: 'json',
        method: 'POST',
        data: {
          'email'     : email,
          'pass'      : pass,
          'fullname'  : fullname,
          'phone'     : phone,
          'address'   : address,
          'birthday'  : birthday,
          'jobtitle'  : jobtitle,
          'role'      : role,
          'status'    : status_user,
        },
        success: function(response) {
          if (response.success) {     
            add_row_user(response);
            auth_role();
            $('#CreateUserModal').modal('hide');           
            Swal.fire({
              icon: 'success',
              title: 'Thông Báo',
              timer: 1000,
              text: response.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    function validateEmail(email,pass,fullname,phone,address,birthday,jobtitle,role,status_user) {
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  
      if (emailRegex.test(email)) {
        $.ajax({
          url: '/kiem-tra-email/',
          dataType: 'json',
          method: 'POST',
          data: {
            'email'     : email,
          },
          success: function(response) {
            if (response.success) {     
              create_user(email,pass,fullname,phone,address,birthday,jobtitle,role,status_user)
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });       
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: 'Email Không hợp lệ',
        });
      }
    }

    function add_row_user(data){
      var show_hide = '';
      var status = document.querySelector('#showall i');
      if (status.classList.contains('ti-shift-right')) {
        show_hide = 'hidden-column';
      }
      else if (status.classList.contains('ti-shift-left')){
        show_hide = 'show-column';
      } 

      $('#product-table tbody').prepend('<tr data-product-id="'+data.ID_user+'">' +
      '<td data-column="ava">' + (data.Avatar != '' ? '<img class="img-xs rounded-circle" src="'+data.Avatar+'" alt="Profile image">' : '<div class="avatar-container"> <div class="avatar-title-list">'+ data.img +'</div></div>' )+ '</td>' +           
      '<td data-column="id">#' + data.ID_user + '</td>' +           
      '<td data-column="mail">' + data.Mail + '</td>' +           
      '<td data-column="name">' + data.FullName + '</td>' +           
      '<td data-column="utype"><button data-user-id="' + data.ID_user + '" data-type-value="' + data.User_Type + '" type="button" class="btn btn-'+(data.User_Type == 0 ? 'danger' : (data.User_Type == 1 ? 'warning' : 'primary' ))+' btn-rounded btn-fw btn-user-role admin-button">'+  
      (data.User_Type == 0 ? 'Administrator' :  (data.User_Type == 1 ? 'Moderator' : 'Member'))+
      '</button></td>' +
      '<td data-column="atype" id="toggle-column" class="'+show_hide+'">' + data.Acc_Type + '</td>' +
      '<td data-column="jobtitle" id="toggle-column" class="'+show_hide+'">' + (data.Jobtitle ? data.Jobtitle : 'No Data') + '</td>' +
      '<td data-column="birthday" id="toggle-column" class="'+show_hide+'">' + data.Birthday + '</td>' +
      '<td data-column="address" id="toggle-column" class="'+show_hide+'">' + (data.Address ? data.Address : 'No Data')+ '</td>' +
      '<td data-column="phone" id="toggle-column" class="'+show_hide+'">' + (data.Phone ? '0'+data.Phone : 'No Data')+ '</td>' +
      '<td data-column="createid" id="toggle-column" class="'+show_hide+'">' + data.ID_Create + '</td>' +
      '<td data-column="createname" id="toggle-column" class="'+show_hide+'">' + data.Name_Create + '</td>' +         
      '<td data-column="date" id="toggle-column" class="'+show_hide+'">' + data.Date_Create + '</td>' +
      '<td data-column="time" id="toggle-column" class="'+show_hide+'">' + data.Time_Create + '</td>' +
      '<td data-column="status"><button data-user-id="' + data.ID_user + '" data-user-status="' + data.User_Status + '" type="button" class="btn btn-'+(data.User_Status == 'True' ? 'success' : 'danger' )+' btn-rounded btn-fw btn-user-status">'+  
      (data.User_Status == 'True' ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
      '</button></td>' +
      '<td>' +
      '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-user disable-button" name="Update[]" value="' + data.ID_user + '"><i class="ti-pencil text-danger"></i></button>' +
      '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-user disable-button" name="delete[]" value="' + data.ID_user + '"><i class="ti-trash text-danger"></i></button>' +
      '</td>' +
    '</tr>');
    }
    // Xử lý sự kiện khi người dùng nhấn nút Create


    // Xử lý sự kiện khi người dùng nhấn nút Update
    $(document).on('click', '.update-user', function() {
      $('#UpdateUserModal').modal('show');
      if( $('#UpdateUserModal').modal('show'))
      {       
        var UserID = $(this).val();
        LoadDataUpdate_User(UserID);           
      }
    });

  // load data form update product
    function LoadDataUpdate_User(UserID){    
      $.ajax({
        url: '/data-update-user/',
        dataType: 'json',
        method: 'POST',
        data: {
          'UserID': UserID,
        },
        success: function(response) {
          if(response.success){
            var input = document.querySelector('#UpdateUserModal');
            var input_ID = input.querySelector('#input_userid');
            input_ID.value = response.Users.ID_user;
            var input_Mail = input.querySelector('#input_email');
            input_Mail.value = response.Users.Mail;
            var input_Name = input.querySelector('#input_name');
            input_Name.value = response.Users.FullName;
            var input_Phone = input.querySelector('#input_phone');
            input_Phone.value = '0' + response.Users.Phone;
            var input_Address = input.querySelector('#input_address');
            input_Address.value = response.Users.Address;

            var input_Birth = input.querySelector('#input_birthday');
            input_Birth.value = response.Users.Birthday;

            var input_Jobtitle = input.querySelector('#input_jobtitle');
            input_Jobtitle.value = response.Users.Jobtitle;

            var input_status = input.querySelectorAll('#input_status option');            
            input_status.forEach(function(sta){
              var status = sta.getAttribute('value');
              var userStatus = response.Users.User_Status;                         
              if (status.toLowerCase() === String(userStatus).toLowerCase()) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected');
              }
            });

            var input_role = input.querySelectorAll('#input_role option');            
            input_role.forEach(function(rol){
              var role = rol.getAttribute('value');
              var userRole = response.Users.User_Type;                         
              if (role === String(userRole)) {
                rol.setAttribute('selected', 'selected');
              } else {
                rol.removeAttribute('selected');
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#Update-user-button', function() {
      var modal = document.querySelector('#UpdateUserModal');
      var input_ID = modal.querySelector('#input_userid').value;
      var input_Name = modal.querySelector('#input_name').value;
      var input_Phone = modal.querySelector('#input_phone').value;
      var input_Address = modal.querySelector('#input_address').value;
      var input_Birth = modal.querySelector('#input_birthday').value;
      var input_Jobtitle = modal.querySelector('#input_jobtitle').value;
      var input_Role = modal.querySelector('#input_role').value;
      var input_status = modal.querySelector('#input_status').value;
    
      // if (input_ID && input_Name && input_Phone && input_Address && input_Birth && input_Jobtitle && input_Role && input_status) {
      if (input_ID && input_Name && input_Phone  && input_Birth && input_Role && input_status) {
        update_user(input_ID , input_Name , input_Phone , input_Address , input_Birth , input_Jobtitle , input_Role , input_status);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    });
    

    function update_user(ID_user , FullName , Phone , Address , Birthday , Jobtitle , User_Type , User_Status){
      var status_new = (User_Status.toLowerCase() == "true" ? "true" : "false")
      $.ajax({
            url: '/cap-nhat-nguoi-dung/',
            dataType: 'json',
            method: 'POST',
            data: {
              'UserID' : ID_user,
              'FullName': FullName,
              'Phone'   : Phone,
              'Address' : Address,
              'Birthday': Birthday,
              'Jobtitle': Jobtitle,
              'UserType': User_Type,
              'status': (User_Status.toLowerCase() == "true" ? "True" : "False"),
              'Action': 'update'
            },
            success: function(response) {
              if (response.success) {
                update_info_user(response, status_new);
                $('#UpdateUserModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }

    function update_info_user(User_Data,status_new){
        // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
        var productRows = document.querySelectorAll('tr[data-product-id]');

        // Lặp qua từng phần tử tr
        productRows.forEach(function(row) {
          // Lấy giá trị của thuộc tính data-product-id
          var userID = row.getAttribute('data-product-id');

          if (userID === User_Data.ID_user) {
            var nameElement = row.querySelector('[data-column="name"]');
            nameElement.textContent =  User_Data.FullName;
            var jobtitleElement = row.querySelector('[data-column="jobtitle"]');
            jobtitleElement.textContent =  User_Data.Jobtitle;
            var birthElement = row.querySelector('[data-column="birthday"]');
            birthElement.textContent =  User_Data.Birthday;

            var addressElement = row.querySelector('[data-column="address"]');
            addressElement.textContent =  User_Data.Address;
            var PhoneElement = row.querySelector('[data-column="phone"]');
            PhoneElement.textContent =  User_Data.Phone;

            var roleElement = row.querySelector('[data-column="utype"]');
            var htmlRole = '<button data-user-id="' + User_Data.ID_user + '" data-type-value="' + User_Data.User_Type + '" type="button" class="btn btn-'+(User_Data.User_Type == '0' ? 'danger' : (User_Data.User_Type == '1' ? 'warning' : 'primary' ))+' btn-rounded btn-fw btn-user-role">'+  
            (User_Data.User_Type == '0' ? 'Administrator' :  (User_Data.User_Type == '1' ? 'Moderator' : 'Member'))+
            '</button>';
            var buttonRoleElement = roleElement.querySelector('button');
            if (buttonRoleElement) {
              buttonRoleElement.remove();
            }
            roleElement.insertAdjacentHTML('beforeend', htmlRole);


            var statusElement = row.querySelector('[data-column="status"]');
            var htmlStatus = '<button data-user-id="' + User_Data.ID_user + '" data-user-status="' + status_new + '" type="button" class="btn btn-'+(status_new == 'true' ? 'success' : 'danger' )+' btn-rounded btn-fw btn-user-status">'+  
            (status_new == 'true' ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button>';
            var buttonStatusElement = statusElement.querySelector('button');
            if (buttonStatusElement) {
              buttonStatusElement.remove();
            }
            statusElement.insertAdjacentHTML('beforeend', htmlStatus);
          }
        });
    }
    // Xử lý sự kiện khi người dùng nhấn nút Update   
    $(document).on('click', '#showall', function() {
      var show_hide = document.querySelectorAll('#toggle-column');
      // var changeIcon =  document.querySelector('#showall i');
      var button =  document.querySelector('#showall');
      show_hide.forEach(function(item){
        if (item.classList.contains('hidden-column')) {
          // changeIcon.classList.remove('ti-shift-right');
          // changeIcon.classList.add('ti-shift-left');
          button.innerHTML = '<i class="btn-icon-prepend ti-shift-left"></i> ẨN CỘT';
    
          item.classList.remove('hidden-column');
          item.classList.add('show-column');
        } else if (item.classList.contains('show-column')) {          
          // changeIcon.classList.remove('ti-shift-left');
          // changeIcon.classList.add('ti-shift-right');
          button.innerHTML = '<i class="btn-icon-prepend ti-shift-right"></i> HIỂN THỊ CỘT';
  
          item.classList.remove('show-column');
          item.classList.add('hidden-column');
        } 
      });
    });
    //chose row in table 

}
//########### Danh Sách User End #############

//########### Danh Sách Comment Start ###########  
if (window.location.pathname === '/danh-sach-binh-luan/') {
  var currentPage = 1;
  var itemsPerPage = 10;

  $.ajax({
    url: '/role-binh-luan/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Comment();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });


  // load data product
  function Load_Comment(){
    $.ajax({
      url: '/danh-sach-data-binh-luan/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id:   $('#search-CommentID').val().toLowerCase().trim(),
              ticketid:   $('#search-TicketID').val().toLowerCase().trim(),
              desc:   $('#search-CommentDesc').val().toLowerCase().trim(),
              userid:   $('#search-UserID').val().toLowerCase().trim(),
              name: $('#search-Username').val().toLowerCase().trim(),
              date: $('#search-CommentDate').val().toLowerCase().trim(),
              time: $('#search-CommentTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_Comment(context.data, currentPage, itemsPerPage,filters, context.data)
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong test');
      }
    });
  }

    //authorization page
    function auth_role(){
      $.ajax({
        url: '/phan-quyen-binh-luan/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            var buttonEdit = document.querySelectorAll('.update-comment');
            var buttonDel = document.querySelectorAll('.delete-comment');
            var buttonSta = document.querySelectorAll('.btn-comment-status');
            if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
              buttonEdit.forEach(function(edit){
                edit.classList.remove('disable-button');
              }); 
              buttonSta.forEach(function(sta){
                sta.classList.remove('admin-button');
              });        
            }
            else{
              buttonEdit.forEach(function(edit){
                edit.classList.add('disable-button');
              });    
              buttonSta.forEach(function(sta){
                sta.classList.add('admin-button');
              });          
            }
            //Role Delete User
            if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
              buttonDel.forEach(function(del){
                del.classList.remove('disable-button');
              });
            }
            else{
              buttonDel.forEach(function(edit){
                del.classList.add('disable-button');
              }); 
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    // Load data
    function display_Comment(products, currentPage, itemsPerPage, filters, data_temp) {

      $('#product-table tbody').empty();
      var filteredProducts = products.filter(function(product) {
          var IDMatch = filters.id === '' || product.Comment_ID.toString().toLowerCase().includes(filters.id);
          var TicketIDMatch = filters.ticketid === '' || product.Ticket_ID.toString().toLowerCase().indexOf(filters.ticketid) > -1;
          var DescIDMatch = filters.desc === '' || product.Comment_Desc.toString().toLowerCase().indexOf(filters.desc) > -1;
          var UserIDMatch = filters.userid === '' || product.ID_user.toString().toLowerCase().indexOf(filters.userid) > -1;
          var UsernameMatch = filters.name === '' || product.Comment_User_Name.toString().toLowerCase().indexOf(filters.name) > -1;
          var dateMatch = filters.date === '' || product.Comment_Date.toString().toLowerCase().indexOf(filters.date) > -1;
          var timeMatch = filters.time === '' || product.Comment_Time.toLowerCase().indexOf(filters.time) > -1;
          var statusMatch = filters.status === '' || product.Comment_Status.toString().toLowerCase().indexOf(filters.status) > -1;

          return IDMatch && TicketIDMatch && DescIDMatch && UserIDMatch && UsernameMatch && dateMatch && timeMatch && statusMatch ;
          // return IDMatch && TicketIDMatch && UserIDMatch && UsernameMatch && dateMatch && timeMatch && statusMatch ;
        });

        if(filteredProducts !== null || filteredProducts !== '')
        {
          products = filteredProducts
        }

      for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
        var product = products[i];
      
        $('#product-table tbody').append('<tr data-product-id="'+product.Comment_ID+'">' +
          '<td data-column="id">#' + product.Comment_ID + '</td>' +           
          '<td data-column="ticketid">#' + product.Ticket_ID + '</td>' +           
          '<td data-column="desc" class="commentDesc">' + product.Comment_Desc + '</td>' +           
          '<td data-column="userid">' + product.ID_user + '</td>' +           
          '<td data-column="username">' + product.Comment_User_Name + '</td>' +        
          '<td data-column="date">' + product.Comment_Date + '</td>' +
          '<td data-column="time">' + product.Comment_Time + '</td>' +
          '<td data-column="status"><button data-comment-id="' + product.Comment_ID + '" data-comment-status="' + product.Comment_Status + '" type="button" class="btn btn-'+(product.Comment_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-comment-status admin-button">'+  
          (product.Comment_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
          '</button></td>' +
          '<td>' +
          '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-comment disable-button" name="Update[]" value="' + product.Comment_ID + '"><i class="ti-pencil text-danger"></i></button>' +
          '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-comment disable-button" name="delete[]" value="' + product.Comment_ID + '"><i class="ti-trash text-danger"></i></button>' +
          '</td>' +
        '</tr>');
      }
    
      var numPages = Math.ceil(products.length / itemsPerPage);
      var pagination = $('#pagination');
      pagination.empty();
      
      // Add First button
      pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
      
      for (var i = 1; i <= numPages; i++) {
        var activeClass = (i === currentPage) ? "active" : "";
        pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
      }
      
      // Add Last button
      pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
    
      pagination.find('.page-link').click(function(event) {
          event.preventDefault();
    
          var page = $(this).data('page');
          display_Comment(products, page, itemsPerPage, filters);
          auth_role()
      });
      
      // Handle First and Last button click event - start
      pagination.find('.page-item:first-child .page-link').click(function(event) {
        event.preventDefault();
        
        if (currentPage > 1) {
          display_Comment(products, 1, itemsPerPage, filters);
          auth_role()
        }
        else
        {
          display_Comment(products, currentPage, itemsPerPage, filters);
          auth_role()
        }
      });
      pagination.find('.page-item:last-child .page-link').click(function(event) {
        event.preventDefault();
        
        if (currentPage < numPages) {
          display_Comment(products, numPages, itemsPerPage, filters);
          auth_role()
        }
        else
        {
          display_Comment(products, currentPage, itemsPerPage, filters);
          auth_role()
        }
      });
      // Handle First and Last button click event - end
      
      //xử lý sự kiện update status
      $(document).on('click', '.btn-comment-status', function() {
          var comment   = $(this);
          var status = comment.attr('data-comment-status');
          var id     = comment.attr('data-comment-id');
          var status_new = (status === "true" ? "false" : "true");
          if(status){
            $.ajax({
              url: '/cap-nhat-binh-luan/',
              dataType: 'json',
              method: 'POST',
              data: {
                'status': (status === "true" ? "False" : "True"),
                'CommentID': id,
              },
              success: function(response) {
                if (response.success) {     
                  var htmlStatus = '<button data-comment-id="' + response.Comment_ID + '" data-comment-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-comment-status">'+  
                  (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                  '</button>';

                  var btn_status = document.querySelector('tr[data-product-id="' + response.Comment_ID + '"]');
                  var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                  var btn_status_button = btn_status_column.querySelector('button');
                  if (btn_status_button) {
                    btn_status_button.remove();
                  }
                  btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);

                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                  });
                }
              },
              error: function(response) {
                Swal.fire({
                  icon: 'error',
                  title: 'Thông Báo Lỗi',
                  text: response.message,
                });
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi', 
              text: 'Không update được status',
            })
          }
          
        });
      //xử lý sự kiện update status

      // Search data in textbox table - start     
      $('#search-CommentID,#search-TicketID,#search-UserID,#search-Username,#search-CommentDate,#search-CommentTime ,.db-status,#search-CommentDesc').on('keydown', function(event) {
        if (event.keyCode === 13) { // Nếu nhấn phím Enter
            event.preventDefault(); // Tránh việc reload lại trang
            $('#search-CommentID').blur(); // Mất focus khỏi textbox tìm kiếm
            $('#search-TicketID').blur();
            $('#search-CommentDesc').blur();
            $('#search-UserID').blur();
            $('#search-Username').blur();
            var formattedDate ="";
            var date = $('#search-CommentDate').val();
            if(date){
              var parts = date.split("-");
              formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
            }
            // Lấy giá trị của filters
            var filters = {
              id:   $('#search-CommentID').val().toLowerCase().trim(),
              ticketid:   $('#search-TicketID').val().toLowerCase().trim(),
              desc:   $('#search-CommentDesc').val().toLowerCase().trim(),
              userid:   $('#search-UserID').val().toLowerCase().trim(),
              name: $('#search-Username').val().toLowerCase().trim(),
              date: formattedDate,
              time: $('#search-CommentTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };    
            if(data_temp){
              display_Comment(data_temp, currentPage, itemsPerPage, filters, data_temp);
              auth_role()
            }      
        }
      });
      
      // Search data in textbox table - end
      
      //clear data search
    $(document).on('click', '.btn-remove-filter', function() {
      $('#search-CommentID').val(''),
      $('#search-TicketID').val(''),
      $('#search-CommentDesc').val(''),
      $('#search-UserID').val(''),
      $('#search-Username').val(''),
      $('#search-CommentDate').val('');
      $('#search-CommentTime').val(''),
      $('.db-status').val(''),
      reset_data();  
    });
    
    function reset_data(){
      $('#search-CommentID').blur(); // Mất focus khỏi textbox tìm kiếm
      $('#search-TicketID').blur();
      $('#search-CommentDesc').blur();
      $('#search-UserID').blur();
      $('#search-Username').blur();
      var formattedDate ="";
      var date = $('#search-CommentDate').val();
      if(date){
        var parts = date.split("-");
        formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
      }
      // Lấy giá trị của filters
      var filters = {
        id:   $('#search-CommentID').val().toLowerCase().trim(),
        ticketid:   $('#search-TicketID').val().toLowerCase().trim(),
        desc:   $('#search-CommentDesc').val().toLowerCase().trim(),
        userid:   $('#search-UserID').val().toLowerCase().trim(),
        name: $('#search-Username').val().toLowerCase().trim(),
        date: formattedDate,
        time: $('#search-CommentTime').val().toLowerCase().trim(),
        status: $('.db-status').val().toLowerCase().trim(),
      };

      if(data_temp){
        display_Comment(data_temp, currentPage, itemsPerPage, filters, data_temp);
        auth_role()
      }  
    }
    //clear data search


      //function button status update  - start
        var statusButtons = document.querySelectorAll('.btn-status');
        statusButtons.forEach(function(button) {
          button.addEventListener('click', function() {     
              $('#StatusModal').modal('show');
              if( $('#StatusModal').modal('show'))
              {
                var value = this.getAttribute('status-value');
                var ticketID = this.getAttribute('data-ticket-status');
                var id = document.querySelector('.ticket-ID');
                id.textContent =  ticketID;    
                var statusOptions = document.querySelectorAll('#input_model_status option');
                statusOptions.forEach(function(option) {
                  if (option.value === value) {
                    option.setAttribute('selected', 'selected');
                  } else {
                    option.removeAttribute('selected');
                  }
                });
              }         
          });
        });

        $('#status-button').click(function(event){
          var ticket = document.querySelector('.ticket-ID');
          if(ticket){
            var ticketid = ticket.innerText;
            var new_status = $('#input_model_status').val();
            var new_name = $('#input_model_status option:selected').text();
            ticket_update_status(ticketid, new_status, new_name);            
          }            
        });

        function ticket_update_status(ticketid, new_status, new_name) {
          $.ajax({
            url: '/cap-nhat-ticket-status/',
            dataType: 'json',
            method: 'POST',
            data: {
              'ticketid': ticketid,
              'new_status': new_status,
            },
            success: function(response) {
              if (response.success) {
                $('#StatusModal').modal('hide');
                // Cập nhật lại giá trị status-value của button
                var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
                btn_ticket.attr('status-value', new_status);
                btn_ticket.text(new_name);
                // Xóa tất cả các lớp hiện tại của nút
                btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

                // Thêm lớp mới dựa trên giá trị trạng thái
                if (new_status === '0') {
                  btn_ticket.addClass('btn-success');
                } else if (new_status === '1') {
                  btn_ticket.addClass('btn-primary');
                }
                else if (new_status === '2') {
                  btn_ticket.addClass('btn-warning');
                }
                else if (new_status === '3') {
                  btn_ticket.addClass('btn-danger');
                }

                Swal.fire({
                  icon: 'success',
                  title: 'Thông Báo',
                  timer: 1000,
                  text: response.message,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
        }    
        //function button status update ticket - end  
  }

    //xử lý sự kiện close modal
    $('.close').click(function(event) {
      $('#UpdateCommentModal').modal('hide');
    });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
    $(document).on('click', '.delete-comment', function() {
      var commentID = $(this).val();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-success-cus',
          cancelButton: 'btn btn-danger btn-danger-cus'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Bạn muốn xóa Comment "+ commentID + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          event.preventDefault();          
          delete_User(commentID);      
        } 
      })
    });

    function delete_User(commentID){
      $.ajax({
        url: '/cap-nhat-binh-luan/',
        dataType: 'json',
        method: 'POST',
        data: {
          'status':  "False",
          'CommentID': commentID,
        },
        success: function(response) {
          if (response.success) {     
            var htmlStatus = '<button data-comment-id="' + response.Comment_ID + '" data-comment-status="' + response.Comment_Status + '" type="button" class="btn btn-'+(response.Comment_Status === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-comment-status">'+  
            (response.Comment_Status === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
            '</button>';

            var btn_status = document.querySelector('tr[data-product-id="' + response.Comment_ID + '"]');
            var btn_status_column = btn_status.querySelector('td[data-column="status"]');
            var btn_status_button = btn_status_column.querySelector('button');
            if (btn_status_button) {
              btn_status_button.remove();
            }
            btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);

            Swal.fire({
              icon: 'success',
              title: 'Thông Báo',
              timer: 1000,
              text: response.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Update
    $(document).on('click', '.update-comment', function() {
      $('#UpdateCommentModal').modal('show');
      if( $('#UpdateCommentModal').modal('show'))
      {       
        var CommentID = $(this).val();
        LoadDataUpdate_Comment(CommentID);           
      }
    });

  // load data form update product
    function LoadDataUpdate_Comment(CommentID){    
      $.ajax({
        url: '/data-update-comment/',
        dataType: 'json',
        method: 'POST',
        data: {
          'CommentID': CommentID,
        },
        success: function(response) {
          if(response.success){
            var commentid = document.querySelector('.modal-commentID');
            commentid.textContent = response.Comment.Comment_ID;
            var desc = tinymce.get('tinyMce-Update').setContent(response.Comment.Comment_Desc);
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#update-comment-button', function() {
      var modal = document.querySelector('#UpdateCommentModal');
      var input_ID = modal.querySelector('.modal-commentID').textContent;
      var input_Desc = tinymce.get('tinyMce-Update').getContent();
    
      if (input_Desc) {
        update_comment_desc(input_ID,input_Desc);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    });
    

    function update_comment_desc(CommentID, CommentDesc){
      $.ajax({
            url: '/data-update-comment-desc/',
            dataType: 'json',
            method: 'POST',
            data: {
              'CommentID' : CommentID,
              'CommentDesc': CommentDesc,
            },
            success: function(response) {
              if (response.success) {
                $('#UpdateCommentModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }
   
    $(document).on('click', '#desc-toggle', function() {
      var contentRows = document.querySelectorAll('tbody td[data-column="desc"]');
      var button = document.querySelector('#desc-toggle');
      var changeButton = button.querySelector('i');
    
      contentRows.forEach(function(item) {
        if (item.classList.contains('commentDesc')) {
          changeButton.classList.remove('ti-control-forward');
          changeButton.classList.add('ti-control-backward');
    
          item.classList.remove('commentDesc');
          item.classList.add('commentToggle');
        } else if (item.classList.contains('commentToggle')) {
          changeButton.classList.remove('ti-control-backward');
          changeButton.classList.add('ti-control-forward');
    
          item.classList.remove('commentToggle');
          item.classList.add('commentDesc');
        }
      });
    });
    
}
//########### Danh Sách Comment End #############

//########### Danh Sách Ticket detail Start ###########  
if (window.location.pathname.startsWith('/chi-tiet-yeu-cau/')) {
//Comment in ticket
$('#create-comment-button').click(function(event) {
  var comment = tinymce.get('tinyMce-comment').getContent();
  var ticketid = document.querySelector('#create-comment-button').getAttribute('data-ticketID');
  var modifiedComment = comment.replace(/<p>\s*<img src=([^>]+)>\s*<\/p>/gi, '<a href=$1><img src=$1/></a>');
  modifiedComment = modifiedComment.replace(/<p>(?=.*?<a)(?=.*?<img src=([^>]+)).*?<\/p>/g, '<a href=$1><img src=$1/></a>');
  modifiedComment = modifiedComment.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  $.ajax({
    url: '/tao-binh-luan/',
    dataType: 'json',
    method: 'POST',
    data: {
      'comment'     : modifiedComment,
      'ticketid'     : ticketid,
    },
    success: function(response) {
      if (response.success) { 
        unhide_title();    
        add_row_comment(response);  
        tinymce.get('tinyMce-comment').setContent('');
        Swal.fire({
          icon: 'success',
          title: 'Thông Báo',
          timer: 1000,
          text: response.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
        });
      }
    },
    error: function(response) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo Lỗi',
        text: response.message,
      });
    }
  });
  
});

function unhide_title(){
  var hide = document.querySelectorAll('#comment-title');
  hide.forEach(function(item){
    item.classList.remove('comment-title-hidden');
  });
}

function add_row_comment(data){
  $('.footer-ticket-comment').append('<div class="container-comment" data-commentid="'+data.Comment_ID+'">' +
  '<div class="container-comment-info">' +
    '<div class="container-comment-info-ava">' +
      '<div class="avatar-container">' +
        '<div class="avatar-title-comment">LG</div>' +
      '</div>' +
    '</div>' +
    '<div class="container-comment-info-user">' +
      '<p>'+data.Comment_User_Name+'</p>' +
      '<p>'+data.Comment_Date+' - '+data.Comment_Time+'</p>' +
    '</div>' +
  '</div>' +
  '<div class="container-comment-content">' +
    '<p class="comment-ID">#'+data.Comment_ID+'</p>' +
    '<hr class="hr-comment">' +
    '<div class="comment-desc">'+data.Comment_Desc+'</div>' +
  '</div>' +
  '<hr class="hr-comment">' +
  '<div class="container-comment-footer">' +
    '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon quote-comment" name="Update[]" value="'+data.Comment_ID+'" data-user="'+data.Comment_User_Name+'"><i class="ti-quote-left text-danger"></i></button>' +
    '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-comment" name="Update[]" value="'+data.Comment_ID+'"><i class="ti-pencil text-danger"></i></button>' +
    '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-comment" name="delete[]" value="'+data.Comment_ID+'"><i class="ti-trash text-danger"></i></button>' +
  '</div>' +
'</div>');
}

//Change status Comment/ Delete Comment
$(document).on('click', '.delete-comment', function() {
  var CommentID = $(this).val();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success btn-success-cus',
      cancelButton: 'btn btn-danger btn-danger-cus'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "Bạn muốn xóa Comment "+ CommentID + " ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      event.preventDefault();          
      var parentRow = $(this).closest('.container-comment');
      Delete_Comment(CommentID, parentRow);      
    } 
  })
});

function Delete_Comment(CommentID, parentRow){
  $.ajax({
    url: '/cap-nhat-binh-luan/',
    dataType: 'json',
    method: 'POST',
    data: {
      'CommentID'     : CommentID,
    },
    success: function(response) {
      if (response.success) {     
        parentRow.remove();     
        Swal.fire({
          icon: 'success',
          title: 'Thông Báo',
          timer: 1000,
          text: response.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
        });
      }
    },
    error: function(response) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo Lỗi',
        text: response.message,
      });
    }
  });
}
//Change status Comment/ Delete Comment

//button close modal
$(document).on('click', '.close', function() {
  $('#UpdateCommentModal').modal('hide');
  $('#StatusCommentModal').modal('hide');
  $('#UpdateCommentTicketModal').modal('hide');
});
//button close modal

//updateComment
$(document).on('click', '.update-comment', function() {
  var commentID = $(this).val();
  var commentDesc = $(this).closest('.container-comment').find('.container-comment-content .comment-desc').html();
  $('#UpdateCommentModal').modal('show');
  // $('#tinyMce-comment').val(commentDesc);
  tinymce.get('tinyMce-Update').setContent(commentDesc);
  document.querySelector('.modal-commentID').textContent = commentID;
});

$(document).on('click', '#update-comment-button', function() {
  var Desc = tinymce.get('tinyMce-Update').getContent();
  var commentID = document.querySelector('.modal-commentID').textContent;
  var modifiedComment = Desc.replace(/<p>\s*<img src=([^>]+)>\s*<\/p>/gi, '<a href=$1><img src=$1/></a>');
  modifiedComment = modifiedComment.replace(/<p>(?=.*?<a)(?=.*?<img src=([^>]+)).*?<\/p>/g, '<a href=$1><img src=$1/></a>');
  modifiedComment = modifiedComment.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  Update_Comment(modifiedComment, commentID);
});

$(document).on('click', '.update-ticket-detail', function() {
  // var ticketID = document.querySelector('.assign-ticket-id').textContent.replace('ID Yêu Cầu:','').trim();
  var commentDesc = document.querySelector('#image-gallery').innerHTML;
  tinymce.get('tinyMce-Update-Ticket').setContent(commentDesc);
  $('#UpdateCommentTicketModal').modal('show');
});

$(document).on('click', '#update-ticket-button', function() {
  var ticketID = document.querySelector('.assign-ticket-id').textContent.replace('ID Yêu Cầu:','').trim();
  var Desc = tinymce.get('tinyMce-Update-Ticket').getContent();
  var modifiedComment = Desc.replace(/<p>\s*<img src=([^>]+)>\s*<\/p>/gi, '<a href=$1><img src=$1/></a>');
  modifiedComment = modifiedComment.replace(/<p>(?=.*?<a)(?=.*?<img src=([^>]+)).*?<\/p>/g, '<a href=$1><img src=$1/></a>');
  modifiedComment = modifiedComment.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  Update_Ticket(modifiedComment, ticketID);
});

$(document).on('click', '.update-ticket-cancel', function() {
  var ticketID = document.querySelector('.assign-ticket-id').textContent;
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success btn-success-cus',
      cancelButton: 'btn btn-danger btn-danger-cus'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "Bạn muốn hủy yêu cầu "+ ticketID + " ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Change it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      event.preventDefault();          
      // var parentRow = $(this).closest('.container-comment');
      var status = 3;
      Update_Status(ticketID, status);     
    } 
  })
});

$(document).on('click', '.update-ticket-complete', function() {
  var ticketID = document.querySelector('.assign-ticket-id').textContent;
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success btn-success-cus',
      cancelButton: 'btn btn-danger btn-danger-cus'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "Bạn muốn hoàn thành yêu cầu "+ ticketID + " ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Change it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      event.preventDefault();          
      // var parentRow = $(this).closest('.container-comment');
      var status = 0;
      Update_Status(ticketID, status);      
    } 
  })
});

$(document).on('click', '.update-ticket-status', function() {
  var status = document.querySelector('.status_view').getAttribute('data-status');
  var cate = document.querySelectorAll('#input_model_status option');
  cate.forEach(function(item){
    var value = item.value;
    if(value === status){
      item.setAttribute('selected','selected');
    }
  });
  $('#StatusCommentModal').modal('show');
});

$(document).on('click', '#status-button', function() {
  var ticketID = document.querySelector('.assign-ticket-id').textContent;
  var status = $('#input_model_status').val();
  Update_Status(ticketID, status);
  $('#StatusCommentModal').modal('hide');
});

$(document).on('click', '.quote-comment', function() {
  var name = $(this).attr('data-user');
  var commentDesc = $(this).closest('.container-comment').find('.container-comment-content .comment-desc').html();
  var quote_data = '<p>&lt;blockquote class="quote"&gt;<br>  &lt;p&gt;'+commentDesc+'.&lt;/p&gt;<br>  &lt;cite&gt;- '+name+'&lt;/cite&gt;<br>&lt;/blockquote&gt;</p>';
  tinymce.get('tinyMce-comment').setContent(quote_data);
  scrollToBottom();
});

$(document).on('click', '.quote-comment_top', function() {
  var name = $(this).attr('data-user');
  // var commentDesc = $(this).closest('.container-comment').find('.container-comment-content .comment-desc').html();
  var commentDesc = document.querySelector('#image-gallery').innerHTML;
  var quote_data = '<p>&lt;blockquote class="quote"&gt;<br>  &lt;p&gt;'+commentDesc+'.&lt;/p&gt;<br>  &lt;cite&gt;- '+name+'&lt;/cite&gt;<br>&lt;/blockquote&gt;</p>';
  tinymce.get('tinyMce-comment').setContent(quote_data);
  scrollToBottom();
});

function Update_Status(ticketID, status){
  $.ajax({
    url: '/cap-nhat-tinh-trang/',
    dataType: 'json',
    method: 'POST',
    data: {
      'status'     : status,
      'ticketID'   : ticketID.replace('ID Yêu Cầu:','').trim(),
    },
    success: function(response) {
      if (response.success) {     
        var button = '<button type="button" data-status="'+status+'" class="btn btn-icon-text status_view ' + 
        (status == 0 ? 'btn-success' : (status == 1 ? 'btn-primary' : (status == 2 ? 'btn-warning' : (status == 3 ? 'btn-danger' : '')))) +
        '">' +
        (status == 0 ? 'Hoàn Thành' : (status == 1 ? 'Đang Làm' : (status == 2 ? 'Đang Treo' : (status == 3 ? 'Hủy' : '')))) +
        '</button>';
        var button_status = document.querySelector('.top-title-left');
        var remove_button = button_status.querySelector('.status_view'); 
        var h4 = button_status.querySelector('.card-title-edit'); 
        if (remove_button) {
          remove_button.remove();
        }
        // button_status.innerHTML += button;
        h4.insertAdjacentHTML('beforebegin', button);

        Swal.fire({
          icon: 'success',
          title: 'Thông Báo',
          timer: 1000,
          text: response.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
        });
      }
    },
    error: function(response) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo Lỗi',
        text: response.message,
      });
    }
  });
}

function Update_Comment(Desc, CommentID){
  $.ajax({
    url: '/cap-nhat-binh-luan/',
    dataType: 'json',
    method: 'POST',
    data: {
      'Desc'        : Desc,
      'CommentID'   : CommentID,
    },
    success: function(response) {
      if (response.success) {     
        Update_Data_Comment(Desc,CommentID);
        $('#UpdateCommentModal').modal('hide');
        Swal.fire({
          icon: 'success',
          title: 'Thông Báo',
          timer: 1000,
          text: response.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
        });
      }
    },
    error: function(response) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo Lỗi',
        text: response.message,
      });
    }
  });
}

function Update_Data_Comment(Desc,CommentID){
  var comment = document.querySelectorAll('.container-comment');
  comment.forEach(function(item){
    var id = item.getAttribute('data-commentid');
    if(CommentID == id){
      var comment_des = item.querySelector('.comment-desc');
      comment_des.innerHTML  = Desc;
    }
  });
}

function Update_Ticket(Desc, TicketID){
  $.ajax({
    url: '/cap-nhat-chi-tiet-yeu-cau/',
    dataType: 'json',
    method: 'POST',
    data: {
      'Desc'        : Desc,
      'TicketID'   : TicketID,
    },
    success: function(response) {
      if (response.success) {     
        Update_Data_Ticket(Desc)
        $('#UpdateCommentTicketModal').modal('hide');
        Swal.fire({
          icon: 'success',
          title: 'Thông Báo',
          timer: 1000,
          text: response.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
        });
      }
    },
    error: function(response) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo Lỗi',
        text: response.message,
      });
    }
  });
}

function Update_Data_Ticket(Desc){
  var remove_data = document.querySelector('#image-gallery');
  if(remove_data){
    remove_data.innerHTML = '';
  }
  remove_data.innerHTML = Desc;
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
}
//updateComment

//upload files
// if (window.location.pathname.startsWith('/chi-tiet-yeu-cau/')) {
document.getElementById('file-input').addEventListener('change', function() {
  var files = this.files;
  var fileSizeLimit = 10 * 1024 * 1024; //10MB

  var fileSizeExceeded = false;
  var totalFileSize = 0;
  
  var fileDisplayInfo = "";
  var fileDisplayInfo = document.getElementById('file-display-info');
  fileDisplayInfo.innerHTML = '';

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var fileItem = document.createElement('div');
    fileItem.classList.add('attach-custom');
    fileItem.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    fileDisplayInfo.appendChild(fileItem);

    totalFileSize += file.size;

    if (file.size > fileSizeLimit) {
      fileSizeExceeded = true;
      break;
    }
  }
  

  if (fileSizeExceeded) {
    document.getElementById('file-size-info').textContent = 'Kích thước tệp tin vượt quá giới hạn cho phép';
    document.getElementById('upload-file-button').hidden = true;
  } else {
    document.getElementById('file-size-info').textContent = 'Tổng kích thước tệp tin: ' + formatFileSize(totalFileSize);
    document.getElementById('upload-file-button').hidden = false;
  }
});
// }

function formatFileSize(size) {
  var units = ['B', 'KB', 'MB', 'GB', 'TB'];
  var unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return size.toFixed(2) + ' ' + units[unitIndex];
}
$(document).on('click', '#upload-file-button', function() {
  var files = document.querySelector('#file-input').files;
  var ticketID = document.querySelector('.assign-ticket-id').textContent.replace('ID Yêu Cầu:','').trim();
  uploadFiles_Data(files, ticketID);
});

function uploadFiles_Data(files, ticketID) {
  console.log('Files:', files);

  // Check if any files are selected
  if (files.length > 0) {
    var formData = new FormData();

    // Append each file to the FormData
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append('files', file);
    }
    formData.append('ticketID', ticketID);

    // Send an AJAX request to the Django server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload-files/', true);

    // Handle the AJAX request completion event
    xhr.onload = function() {
      if (xhr.status === 200) {
        // var response = JSON.parse(xhr.responseText);
        // console.log(response.message);
        for(let z = 0 ; z < files.length; z++){
          $.ajax({
            url: '/get-file-name/',
            dataType: 'json',
            method: 'POST',
            data: {
              'name'        : files[z].name,
              'ticketID'   : ticketID,
            },
            success: function(response) {
              if (response.success) {     
                Add_Files_Data(response.name);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
        }
                  
        Swal.fire({
           icon: 'success',
           title: 'Thông Báo',
           timer: 1000,
           text: 'Thành Công',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: 'Error uploading files',
        });
      }
    };

    // Send the AJAX request with the FormData
    xhr.send(formData);
  } else {
    console.log('No files selected');
  }
}

function Add_Files_Data(name){
  $('#list-files').prepend('<div class="attachs-file">' +
         '<div class="attachs-file-item"><a class="attachment-download" href="/static/Asset/Attachment-Upload/'+name+'" download>'+name+'</a></div>' +
       '</div>');
}
//upload files

//download file all
if (window.location.pathname.startsWith('/chi-tiet-yeu-cau/')) {
document.getElementById('down-files-button').addEventListener('click', function() {
  download_all_file_view();
});
}
//event load file upload multiple 
// Hàm tạo và tải xuống file zip
function download_all_file_view() {
  var attachmentLinks = document.querySelectorAll('.attachs-file .attachment-download');
  var zip = new JSZip();

  var promises = Array.from(attachmentLinks).map(function(link) {
    var url = link.getAttribute('href');
    var fileName = link.innerText;

    return fetch(url)
      .then(function(response) {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then(function(blob) {
        zip.file(fileName, blob);
      })
      .catch(function(error) {
        console.error('Error downloading file:', error);
      });
  });

  Promise.all(promises)
    .then(function() {
      zip.generateAsync({ type: 'blob' })
        .then(function(content) {
          var downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(content);
          downloadLink.download = 'attachments.zip';

          document.body.appendChild(downloadLink);
          downloadLink.click();

          setTimeout(function() {
            URL.revokeObjectURL(downloadLink.href);
            downloadLink.remove();
          }, 100);
        });
    });
}
//download file all
}
//########### Danh Sách Ticket detail End ########### 

//########### Dashboard Start ###########  
if (window.location.pathname.startsWith('/dashboard/')) {
  $.ajax({
    url: '/data-dashboard/',
    dataType: 'json',
    success: function(response) {
        //Ticket Report
        var year = document.querySelector('.total_year');
        var month = document.querySelector('.total_month');
        var week = document.querySelector('.total_week');
        var day = document.querySelector('.total_day');
        year.textContent = response.Total_year;
        month.textContent = response.Total_month;
        week.textContent = response.Total_week;
        day.textContent = response.Total_day;
        var content_year = document.querySelector('.content-year-icon');
        var icon_value = response.Total_month - response.Total_last_month;
        var icon = '<i class="'+(icon_value > 0 ? 'ti-stats-up icon-up' : icon_value < 0 ? 'ti-stats-down icon-down' : '')+'"></i>'
        content_year.insertAdjacentHTML('beforeend', icon);

        var content_month = document.querySelector('.content-month-icon');
        var icon_value_month = response.Total_week - response.Total_last_week;
        var icon_month = '<i class="'+(icon_value_month > 0 ? 'ti-stats-up icon-up' : icon_value_month < 0 ? 'ti-stats-down icon-down' : '')+'"></i>'
        content_month.insertAdjacentHTML('beforeend', icon_month);

        google.charts.load("current", {packages:['corechart']});
        google.charts.setOnLoadCallback(function() {
        // column Chart Ticket by month
        ColumnChart_Month(response.Ticket_by_month);
        // column Chart Ticket by month and status
        ColumnChart_Month_Status(response.Ticket_by_status);
        // Pie Chart Ticket by weekly and status
        PieChart_Week_Status(response.Ticket_by_week);
          
        // if(response.IsAdmin ==  true){
          var user_number = document.querySelector('#report-user-number');
          var user_data = document.querySelector('#report-user-data');
          if(response.Dash_Role_Data[1].Status == 'True' || response.IsAdmin ==  true){
             //User Report
              var year = document.querySelector('.total_users_year');
              var month = document.querySelector('.total_users_month');
              var week = document.querySelector('.total_users_week');
              var day = document.querySelector('.total_users_day');
              year.textContent = response.Total_users_year;
              month.textContent = response.Total_users_month;
              week.textContent = response.Total_users_week;
              day.textContent = response.Total_users_day;
              var content_year_user = document.querySelector('.content-year-user-icon');
              var icon_value_user = response.Total_users_month - response.Total_users_last_month;
              var icon_user = '<i class="'+(icon_value_user > 0 ? 'ti-stats-up icon-user-up' : icon_value_user < 0 ? 'ti-stats-down icon-user-down' : '')+'"></i>'
              content_year_user.insertAdjacentHTML('beforeend', icon_user);

              var content_month_user = document.querySelector('.content-month-user-icon');
              var icon_user_month = response.Total_users_week - response.Total_users_last_week;
              var icon_month_user = '<i class="'+(icon_user_month > 0 ? 'ti-stats-up icon-user-up' : icon_user_month < 0 ? 'ti-stats-down icon-user-down' : '')+'"></i>'
              content_month_user.insertAdjacentHTML('beforeend', icon_month_user);

              // Area Chart User by Month and status
              AreaChart_User_Month_Status(response.User_by_month);       
              // Pie Chart User by role
              PieChart_User_Type(response.User_by_type);
              // Pie Chart User by type
              PieChart_User_Acc(response.User_by_acc);
              user_number.classList.remove('disable-report');
              user_data.classList.remove('disable-report');
          }
          else{
            user_number.classList.add('disable-report');
            user_data.classList.add('disable-report');
          }
         
          var per_data = document.querySelector('#report-per-data');
          if(response.Dash_Role_Data[2].Status == 'True' || response.IsAdmin ==  true){
            //User performance by Year
            year_user_per(response.User_by_year_per);
            //User performance by Month
            month_user_per(response.User_by_month_per);
            //Group Ticket Data
            PieChart_Group_Ticket(response.Group_Ticket_Data);
            per_data.classList.remove('disable-report');
          }
          else{
            per_data.classList.add('disable-report');
          }
          // }     
        });   

    },
    error: function(rs, e) {
        alert('Oops! something went wrong Dashboard');
    }
  });

  // column Chart Ticket by month
  function ColumnChart_Month(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Month');
    dataTable.addColumn('number', 'Ticket');
    dataTable.addColumn({role: 'style', type: 'string'});
  
    for (var i = 0; i < data.length ; i++) {
      var row = data[i];
      dataTable.addRow([row.month, row.count, '#4e73df']);
    }
  
    var options = {
      // title: 'Column Chart - Monthly Data',
      width: 600,
      height: 300,
      legend: { position: 'top' },
    };
  
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(dataTable, options);
  }
  // column Chart Ticket by month

   // column Chart Ticket by month and status
  function ColumnChart_Month_Status(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Month');
    dataTable.addColumn('number', 'Hoàn Thành');
    dataTable.addColumn('number', 'Đang Làm');
    dataTable.addColumn('number', 'Đang Treo');
    dataTable.addColumn('number', 'Hủy');
  
    for (var i = 0; i < data.length ; i++) {
      var row = data[i];
      dataTable.addRow([row.month, row.Done, row.Inprogress, row.Pendding, row.Cancel]);
    }

    var options = {
      chart: {
        title: 'Status Monthly Data',
        // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      bars: 'vertical',
      vAxis: {format: 'decimal'},
      // width: 1200,
      height: 350,
      colors: ['#1b9e77', '#4e73df', '#ccc','#C82A2E']
    };

    var chart_status = new google.visualization.ColumnChart(document.getElementById('chart_div_month_stautus'));
    chart_status.draw(dataTable, options);
  }
  // column Chart Ticket by month and status

   // Pie Chart Ticket by weekly and status
    function PieChart_Week_Status(data) {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'Status');
      dataTable.addColumn('number', 'Ticket');
    
      for (var i = 0; i < data.length ; i++) {
        var row = data[i];
        dataTable.addRow([row.Status, row.count]);
      }

      var options = {
        chart: {
          title: 'Ticket Status By Week',
         
        },
        // width: 1200,
        height: 300,
        colors: ['#1b9e77', '#4e73df', '#ccc','#C82A2E'],
        is3D: true,
      };

      var pie_status = new google.visualization.PieChart(document.getElementById('chart_pie_status'));
      pie_status.draw(dataTable, options);
    }
   // Donut Chart Ticket by weekly and status

    // Area Chart User by Month and status
    function AreaChart_User_Month_Status(data) {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'Month');
      dataTable.addColumn('number', 'Kích Hoạt');
      dataTable.addColumn('number', 'Không Kích Hoạt');
    
      for (var i = 0; i < data.length ; i++) {
        var row = data[i];
        dataTable.addRow([row.month, row.Active, row.Unactive]);
      }

      var options = {
        chart: {
          title: 'User Status By Month',
        },
        width: 1200,
        height: 300,
        // colors: ['#1b9e77', '#4e73df', '#ccc','#C82A2E']
      };

      var area_status = new google.visualization.AreaChart(document.getElementById('chart_user_month_stautus'));
      area_status.draw(dataTable, options);
    }
   // Area Chart User by Month and status

   // Pie Chart User by role
   function PieChart_User_Type(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Type');
    dataTable.addColumn('number', 'Users');
  
    for (var i = 0; i < data.length ; i++) {
      var row = data[i];
      dataTable.addRow([row.type, row.count]);
    }

    var options = {
      chart: {
        title: 'User Status By Role',
       
      },
      width: 500,
      height: 300,
      // colors: ['#1b9e77', '#4e73df', '#ccc','#C82A2E'],
      is3D: true,
    };

    var pie_status = new google.visualization.PieChart(document.getElementById('chart_pie_role'));
    pie_status.draw(dataTable, options);
  }
   // Pie Chart User by role

  // Pie Chart User by type
  function PieChart_User_Acc(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Acc');
    dataTable.addColumn('number', 'Users');
  
    for (var i = 0; i < data.length ; i++) {
      var row = data[i];
      dataTable.addRow([row.Acc, row.count]);
    }

    var options = {
      chart: {
        title: 'User Status By Account Type',
       
      },
      width: 500,
      height: 300,
      // colors: ['#1b9e77', '#4e73df', '#ccc','#C82A2E'],
      is3D: true,
    };

    var pie_status = new google.visualization.PieChart(document.getElementById('chart_pie_acc'));
    pie_status.draw(dataTable, options);
  }
  // Pie Chart User by type

  //performance data
  function year_user_per(data){
    for(i = 0 ; i < data.length; i++){
      var item = data[i];
      $('#year_user_per').append('<div class="row mb-20 year_user_per-item">' +
      '<div class="col-sm-2">' +
      (item.avatar !== "" ? '<img class="img-sm rounded-4" src="'+item.avatar+'" alt="profile">' : '<div class="avatar-container"><div class="avatar-title-dashboard">'+item.fullname.substring(0,1) + item.displayname.substring(0,1)+'</div></div>') +
      '</div>' +
      '<div class="col-sm-8">' +
        '<div class="d-flex justify-content-between">' +
        '<h6>'+item.name+'</h6>' +
          '<p class="font-weight-500 text-muted">'+item.per.toString().substring(0,4)+'%</p>' +
        '</div>' +
        '<div>'+
          '<div class="progress progress-sm">' +
            '<div class="progress-bar bg-danger" role="progressbar" aria-valuenow="'+item.per+'" style="width: '+item.per+'%" aria-valuemin="0" aria-valuemax="100"></div>' +
          '</div>' +
      ' </div>' +
      '</div>'+
    '</div>');
      } 
  }
  function month_user_per(data){
    for(i = 0 ; i < data.length; i++){
      var item = data[i];
      $('#month_user_per').append('<div class="row mb-20 year_user_per-item">' +
      '<div class="col-sm-2">' +
      (item.avatar !== "" ? '<img class="img-sm rounded-4" src="'+item.avatar+'" alt="profile">' : '<div class="avatar-container"><div class="avatar-title-dashboard">'+item.fullname.substring(0,1) + item.displayname.substring(0,1)+'</div></div>') +
      '</div>' +
      '<div class="col-sm-8">' +
        '<div class="d-flex justify-content-between">' +
        '<h6>'+item.name+'</h6>' +
          '<p class="font-weight-500 text-muted">'+item.per.toString().substring(0,4)+'%</p>' +
        '</div>' +
        '<div>'+
          '<div class="progress progress-sm">' +
            '<div class="progress-bar bg-success" role="progressbar" aria-valuenow="'+item.per+'" style="width: '+item.per+'%" aria-valuemin="0" aria-valuemax="100"></div>' +
          '</div>' +
      ' </div>' +
      '</div>'+
    '</div>');
      } 
  }

  // Pie Chart User by type
  function PieChart_Group_Ticket(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Group');
    dataTable.addColumn('number', 'Ticket');
  
    for (var i = 0; i < data.length ; i++) {
      var row = data[i];
      dataTable.addRow([row.Groups, row.count]);
    }

    var options = {
      chart: {
        title: 'User Status By Account Type',
       
      },
      width: 500,
      height: 300,
      // colors: ['#1b9e77', '#4e73df', '#ccc','#C82A2E'],
      is3D: true,
    };

    var pie_status = new google.visualization.PieChart(document.getElementById('chart_div_status'));
    pie_status.draw(dataTable, options);
  }
  // Pie Chart User by type
}
//########### Dashboard End ###########  

//########### Danh Sách Group Role Start ###########  
if (window.location.pathname === '/danh-sach-nhom-quyen/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-nhom-quyen/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Role_Group();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  // load data product
  function Load_Role_Group(){
    $.ajax({
      url: '/danh-sach-data-nhom-quyen/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id: $('#search-GroupRoleID').val().toLowerCase().trim(),
              group: $('#search-GroupRoleName').val().toLowerCase().trim(),
              menu: $('#search-MenuName').val().toLowerCase().trim(),
              address: $('#search-MenuAddress').val().toLowerCase().trim(),
              create: $('#search-GroupRoleCreate').val().toLowerCase().trim(),
              date: $('#search-GroupRoleDate').val().toLowerCase().trim(),
              time: $('#search-GroupRoleTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_Group_Role(context.data, currentPage, itemsPerPage,filters, context.data);
            auth_role();
          
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

  //authorization page
  function auth_role(){
    $.ajax({
      url: '/phan-quyen-nhom-quyen/',
      dataType: 'json',
      method: 'POST',
      success: function(response) {
        if (response.success) {
          var buttonAdd = document.querySelector('#addGroupRole');
          var buttonEdit = document.querySelectorAll('.update-group');
          var buttonDel = document.querySelectorAll('.delete-group');
          var buttonSta = document.querySelectorAll('.btn-grouprole-status');
          //Role Add New User
          if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
            buttonAdd.classList.remove('disable-button');
          }
          else{
            buttonAdd.classList.add('disable-button');
          }
          //Role Update User
          if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
            buttonEdit.forEach(function(edit){
              edit.classList.remove('disable-button');
            });  
            buttonSta.forEach(function(sta){
              sta.classList.remove('admin-button');
            });      
          }
          else{
            buttonEdit.forEach(function(edit){
              edit.classList.add('disable-button');
            });   
            buttonSta.forEach(function(sta){
              sta.classList.add('admin-button');
            });          
          }
          //Role Delete User
          if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
            buttonDel.forEach(function(del){
              del.classList.remove('disable-button');
            });
          }
          else{
            buttonDel.forEach(function(del){
              del.classList.add('disable-button');
            }); 
          }     
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        }
      },
      error: function(response) {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi',
          text: response.message,
        });
      }
    });
  }

    // Load data
      function display_Group_Role(products, currentPage, itemsPerPage, filters, data_temp) {

        $('#product-table tbody').empty();
        var filteredProducts = products.filter(function(product) {
            var IDMatch = filters.id === '' || product.Role_Group_ID.toString().toLowerCase().includes(filters.id);
            var GroupNameMatch = filters.group === '' || product.Role_Group_Name.toLowerCase().indexOf(filters.group) > -1;
            var MenuNameMatch = filters.menu === '' || product.Menu_Name.toLowerCase().indexOf(filters.menu) > -1;
            var AddNameMatch = filters.address === '' || product.Role_Group_Address.toLowerCase().indexOf(filters.address) > -1;
            var createMatch = filters.create === '' || product.Role_Group_CreateBy.toString().toLowerCase().indexOf(filters.create) > -1;
            var dateMatch = filters.date === '' || product.Role_Group_Date.toString().toLowerCase().indexOf(filters.date) > -1;
            var timeMatch = filters.time === '' || product.Role_Group_Time.toLowerCase().indexOf(filters.time) > -1;
            var statusMatch = filters.status === '' || product.Role_Group_Status.toString().toLowerCase().indexOf(filters.status) > -1;

            return IDMatch && GroupNameMatch && MenuNameMatch && AddNameMatch && createMatch && dateMatch && timeMatch && statusMatch ;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }

        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr data-product-id="'+product.Role_Group_ID+'">' +
            '<td data-column="id">#' + product.Role_Group_ID + '</td>' +           
            '<td data-column="group">' + product.Role_Group_Name + '</td>' +
            '<td data-column="menu">' + product.Menu_Name + '</td>' +
            '<td data-column="add">' + product.Role_Group_Address + '</td>' +
            '<td data-column="username">' + product.Role_Group_CreateBy + '</td>' +         
            '<td data-column="date">' + product.Role_Group_Date + '</td>' +
            '<td data-column="time">' + product.Role_Group_Time + '</td>' +
            '<td data-column="status"><button data-group-id="' + product.Role_Group_ID + '" data-group-status="' + product.Role_Group_Status + '" type="button" class="btn btn-'+(product.Role_Group_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-grouprole-status admin-button">'+  
            (product.Role_Group_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-group disable-button" name="Update[]" value="' + product.Role_Group_ID + '"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-group disable-button" name="delete[]" value="' + product.Role_Group_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
            event.preventDefault();
      
            var page = $(this).data('page');
            display_Group_Role(products, page, itemsPerPage, filters);
            auth_role();
        });
        
        // Handle First and Last button click event - start
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            display_Group_Role(products, 1, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Group_Role(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            display_Group_Role(products, numPages, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Group_Role(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        // Handle First and Last button click event - end
        
        //xử lý sự kiện update status
        $(document).on('click', '.btn-grouprole-status', function() {
            var comp   = $(this);
            var status = comp.attr('data-group-status');
            var id     = comp.attr('data-group-id');
            var status_new = (status === "true" ? "false" : "true");
            if(status){
              $.ajax({
                url: '/cap-nhat-nhom-quyen/',
                dataType: 'json',
                method: 'POST',
                data: {
                  'status': (status === "true" ? "False" : "True"),
                  'GroupID': id,
                },
                success: function(response) {
                  if (response.success) {     
                    var htmlStatus = '<button data-group-id="' + response.Role_Group_ID + '" data-group-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-grouprole-status">'+  
                    (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';

                    var btn_status = document.querySelector('tr[data-product-id="' + response.Role_Group_ID + '"]');
                    var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                    var btn_status_button = btn_status_column.querySelector('button');
                    if (btn_status_button) {
                      btn_status_button.remove();
                    }
                    btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);
                    Swal.fire({
                      icon: 'success',
                      title: 'Thông Báo',
                      timer: 1000,
                      text: response.message,
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: response.message,
                    });
                  }
                },
                error: function(response) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Thông Báo Lỗi',
                    text: response.message,
                  });
                }
              });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi', 
                text: 'Không update được status',
              })
            }
            
          });
        //xử lý sự kiện update status

        // Search data in textbox table - start
        $('#search-GroupRoleID, #search-GroupRoleName,#search-MenuName,#search-MenuAddress, #search-GroupRoleCreate,#search-GroupRoleDate,#search-GroupRoleTime,.db-status').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-GroupRoleID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-GroupRoleName').blur();
              $('#search-GroupRoleCreate').blur();
              $('#search-MenuName').blur();
              $('#search-MenuAddress').blur();
              var formattedDate ="";
              var date = $('#search-GroupRoleDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-GroupRoleID').val().toLowerCase().trim(),
                group: $('#search-GroupRoleName').val().toLowerCase().trim(),
                menu: $('#search-MenuName').val().toLowerCase().trim(),
                address: $('#search-MenuAddress').val().toLowerCase().trim(),
                create: $('#search-GroupRoleCreate').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-GroupRoleTime').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Group_Role(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
          }
        });

        $(document).on('click', '.btn-remove-filter', function() {
          $('#search-GroupRoleID').val('');
          $('#search-GroupRoleName').val('');
          $('#search-MenuName').val('');
          $('#search-MenuAddress').val('');
          $('#search-GroupRoleCreate').val('');
          $('#search-GroupRoleDate').val('');
          $('#search-GroupRoleTime').val('');
          $('.db-status').val('');
          reset_data();  
        });
        
        function reset_data(){
          $('#search-GroupRoleID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-GroupRoleName').blur();
              $('#search-GroupRoleCreate').blur();
              var formattedDate ="";
              var date = $('#search-GroupRoleDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-GroupRoleID').val().toLowerCase().trim(),
                group: $('#search-GroupRoleName').val().toLowerCase().trim(),
                create: $('#search-GroupRoleCreate').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-GroupRoleTime').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Group_Role(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
        }
        // Search data in textbox table - end

        //function button status update  - start
          var statusButtons = document.querySelectorAll('.btn-status');
          statusButtons.forEach(function(button) {
            button.addEventListener('click', function() {     
                $('#StatusModal').modal('show');
                if( $('#StatusModal').modal('show'))
                {
                  var value = this.getAttribute('status-value');
                  var ticketID = this.getAttribute('data-ticket-status');
                  var id = document.querySelector('.ticket-ID');
                  id.textContent =  ticketID;    
                  var statusOptions = document.querySelectorAll('#input_model_status option');
                  statusOptions.forEach(function(option) {
                    if (option.value === value) {
                      option.setAttribute('selected', 'selected');
                    } else {
                      option.removeAttribute('selected');
                    }
                  });
                }         
            });
          });

          $('#status-button').click(function(event){
            var ticket = document.querySelector('.ticket-ID');
            if(ticket){
              var ticketid = ticket.innerText;
              var new_status = $('#input_model_status').val();
              var new_name = $('#input_model_status option:selected').text();
              ticket_update_status(ticketid, new_status, new_name);            
            }            
          });

          function ticket_update_status(ticketid, new_status, new_name) {
            $.ajax({
              url: '/cap-nhat-ticket-status/',
              dataType: 'json',
              method: 'POST',
              data: {
                'ticketid': ticketid,
                'new_status': new_status,
              },
              success: function(response) {
                if (response.success) {
                  $('#StatusModal').modal('hide');
                  // Cập nhật lại giá trị status-value của button
                  var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
                  btn_ticket.attr('status-value', new_status);
                  btn_ticket.text(new_name);
                  // Xóa tất cả các lớp hiện tại của nút
                  btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

                  // Thêm lớp mới dựa trên giá trị trạng thái
                  if (new_status === '0') {
                    btn_ticket.addClass('btn-success');
                  } else if (new_status === '1') {
                    btn_ticket.addClass('btn-primary');
                  }
                  else if (new_status === '2') {
                    btn_ticket.addClass('btn-warning');
                  }
                  else if (new_status === '3') {
                    btn_ticket.addClass('btn-danger');
                  }

                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                  });
                }
              },
              error: function(response) {
                Swal.fire({
                  icon: 'error',
                  title: 'Thông Báo Lỗi',
                  text: response.message,
                });
              }
            });
          }    
          //function button status update ticket - end  

          function add_row_group(product){
            $('#product-table tbody').prepend('<tr data-product-id="'+product.Role_Group_ID+'">' +
            '<td data-column="id">#' + product.Role_Group_ID + '</td>' +           
            '<td data-column="group">' + product.Role_Group_Name + '</td>' +
            '<td data-column="menu">' + product.Menu_Name + '</td>' +
            '<td data-column="add">' + product.Role_Group_Address + '</td>' +
            '<td data-column="username">' + product.Role_Group_CreateBy + '</td>' +         
            '<td data-column="date">' + product.Role_Group_Date + '</td>' +
            '<td data-column="time">' + product.Role_Group_Time + '</td>' +
            '<td data-column="status"><button data-group-id="' + product.Role_Group_ID + '" data-group-status="' + product.Role_Group_Status + '" type="button" class="btn btn-'+(product.Role_Group_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-grouprole-status admin-button">'+  
            (product.Role_Group_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-group disable-button" name="Update[]" value="' + product.Role_Group_ID + '"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-group disable-button" name="delete[]" value="' + product.Role_Group_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
          var list = {
            'Role_Group_ID'  : product.Role_Group_ID,
            'Role_Group_Name': product.Role_Group_Name,
            'Menu_Name'      : product.Menu_Name,
            'Role_Group_Address' : product.Role_Group_Address,
            'Role_Group_CreateBy': product.Role_Group_CreateBy,
            'Role_Group_Date': product.Role_Group_Date,
            'Role_Group_Time': product.Role_Group_Time,
            'Role_Group_Status': product.Role_Group_Status,
          };
          data_temp.push(list);
      }

    //xử lý sự kiện close modal
      $('.close').click(function(event) {
        $('#CreateGroupRoleModal').modal('hide');
        $('#UpdateGroupRoleModal').modal('hide');
      });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
      $(document).on('click', '.delete-group', function() {
        var GroupRoleID = $(this).val();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success btn-success-cus',
            cancelButton: 'btn btn-danger btn-danger-cus'
          },
          buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Bạn muốn xóa Nhóm "+ GroupRoleID + " ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();          
            var parentRow = $(this).closest('tr');
            delete_Group_Role(GroupRoleID, parentRow);      
          } 
        })
      });

      function delete_Group_Role(GroupRoleID, parentRow){
        $.ajax({
          url: '/xoa-nhom-quyen/',
          dataType: 'json',
          method: 'POST',
          data: {
            'GroupRoleID': GroupRoleID,
          },
          success: function(response) {
            if (response.success) {
              parentRow.remove();
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
      $('.addGroupRole').click(function(event) {
        Load_Menu(function(data) {
          var input_menu = document.querySelector('#input_grouprole_menu');
          var option = '';
          for (i = 0; i < data.length; i++) {
            option += '<option value="' + data[i].Menu_ID + '">' + data[i].Menu_Name + '</option>';
          }
          input_menu.innerHTML = option;
          $('#CreateGroupRoleModal').modal('show');
        });     
      });
      $('#create-grouprole-button').click(function(event) {
        event.preventDefault(); // Prevent default form submission      
        var Group_Name = document.querySelector('#input_group_name').value;
        var MenuID = document.querySelector('#input_grouprole_menu').value;
        var Menu_Add = document.querySelector('#input_group_add').value;
        create_group_role(Group_Name,MenuID,Menu_Add);
      });
      function create_group_role(Group_Name,MenuID,Menu_Add){
        $.ajax({
          url: '/tao-nhom-quyen/',
          dataType: 'json',
          method: 'POST',
          data: {
            'Group_Name': Group_Name,
            'MenuID'    : MenuID,
            'Menu_Add'  : Menu_Add,
          },
          success: function(response) {
            if (response.success) {     
              add_row_group(response, product);
              auth_role();
              $('#CreateGroupRoleModal').modal('hide');           
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
     
      }
    // Xử lý sự kiện khi người dùng nhấn nút Create

    // Xử lý sự kiện khi người dùng nhấn nút Update
    $(document).on('click', '.update-group', function() {
      Load_Menu(function(data) {
        var input_menu = document.querySelector('#input_updaterole_menu');
        var option = '';
        for (i = 0; i < data.length; i++) {
          option += '<option value="' + data[i].Menu_ID + '">' + data[i].Menu_Name + '</option>';
        }
        input_menu.innerHTML = option;
        $('#UpdateGroupRoleModal').modal('show');        
      });
      if( $('#UpdateGroupRoleModal').modal('show'))
        {       
          var GroupRoleID = $(this).val();
          LoadDataUpdate_GroupRole(GroupRoleID);           
        }
    });

  // load data form update product
    function LoadDataUpdate_GroupRole(GroupRoleID){    
      $.ajax({
        url: '/data-update-group-role/',
        dataType: 'json',
        method: 'POST',
        data: {'GroupID': GroupRoleID},
        success: function(response) {
          if(response.success){
            var input = document.querySelector('#UpdateGroupRoleModal');
            var input_ID = input.querySelector('#input_grouprole_id');
            input_ID.value = response.Groups[0].Role_Group_ID;
            var input_Name = input.querySelector('#input_grouprole_name');
            input_Name.value = response.Groups[0].Role_Group_Name;

            var input_status = input.querySelectorAll('#input_grouprole_status option');            
            input_status.forEach(function(sta){
              var status = sta.getAttribute('value');
              var groupStatus = response.Groups[0].Role_Group_Status;                         
              if (status === String(groupStatus)) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected');
              }
            });

            var input_Add = input.querySelector('#input_updaterole_add');
            input_Add.value = response.Groups[0].Role_Group_Address;
            var input_menu = input.querySelectorAll('#input_updaterole_menu option');
            input_menu.forEach(function(item){
              var menu_val = item.getAttribute('value');
              var menu_value = response.Groups[0].Menu_ID;                         
              if (menu_val === String(menu_value) ) {
                item.setAttribute('selected', 'selected');
              } else {
                item.removeAttribute('selected');
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#Update-grouprole-button', function() {
    // $('#Update-company-button').click(function(event) {
      // $(document).on('click', 'update-company-button', function() {
      var modal = document.querySelector('#UpdateGroupRoleModal');
      var input_ID = modal.querySelector('#input_grouprole_id').value;
      var input_Name = modal.querySelector('#input_grouprole_name').value;
      var input_status = modal.querySelector('#input_grouprole_status').value;
      var input_menu = modal.querySelector('#input_updaterole_menu').value;
      var input_address = modal.querySelector('#input_updaterole_add').value;
    
      if (input_ID && input_Name && input_status && input_menu) {
        update_grouprole(input_ID, input_Name, input_status, input_menu,input_address);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    }); 

    function update_grouprole(GroupID, GroupName,status, Menu, Address){
      var status_new = (status == "true" ? "true" : "false")
      $.ajax({
            url: '/cap-nhat-nhom-quyen/',
            dataType: 'json',
            method: 'POST',
            data: {
              'GroupID': GroupID,
              'status': (status == "true" ? "True" : "False"),
              'GroupName': GroupName,
              'Menu': Menu,
              'Address': Address,
            },
            success: function(response) {
              if (response.success) {
                update_info_group(response, status_new);
                $('#UpdateGroupRoleModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }

    function update_info_group(Group_Data,status_new){
        // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
        var productRows = document.querySelectorAll('tr[data-product-id]');

        // Lặp qua từng phần tử tr
        productRows.forEach(function(row) {
          // Lấy giá trị của thuộc tính data-product-id
          var GroupID = parseInt(row.getAttribute('data-product-id'));

          // Kiểm tra xem productId có khớp với sản phẩm bạn đang quan tâm không
          if (GroupID === Group_Data.Role_Group_ID) {
            // Cập nhật thông tin của phần tử
            var groupElement = row.querySelector('[data-column="group"]');
            var statusElement = row.querySelector('[data-column="status"]');
            var menuElement = row.querySelector('[data-column="menu"]');
            var addElement = row.querySelector('[data-column="add"]');
            groupElement.textContent =  Group_Data.Role_Group_Name;
            menuElement.textContent =  Group_Data.Menu_Name;
            addElement.textContent =  Group_Data.Role_Group_Address ? Group_Data.Role_Group_Address : 'No Data' ;

            var htmlStatus = '<button data-group-id="' + Group_Data.Role_Group_ID + '" data-group-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-grouprole-status">'+  
            (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
            '</button>';
            var buttonStatusElement = statusElement.querySelector('button');
            if (buttonStatusElement) {
              buttonStatusElement.remove();
            }
            statusElement.insertAdjacentHTML('beforeend', htmlStatus);
          }
        });
    }
    // Xử lý sự kiện khi người dùng nhấn nút Update 

    function Load_Menu(callback){
      $.ajax({
        url: '/load-menu/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            callback(response.Menus);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }
}
//########### Danh Sách Group Role End ########### 

//########### Danh Sách Role Start ###########  
if (window.location.pathname === '/danh-sach-quyen/') {
  var currentPage = 1;
  var itemsPerPage = 10;
  //Check Role
  $.ajax({
    url: '/role-quyen/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Role();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });

  var group_role = [];
  // load data product
  function Load_Role(){
    $.ajax({
      url: '/danh-sach-data-quyen/',
      dataType: 'json',
      success: function(context) {
          var filters = {
              id: $('#search-RoleID').val().toLowerCase().trim(),
              name: $('#search-RoleName').val().toLowerCase().trim(),
              groupname: $('#search-RoleGroup').val().toLowerCase().trim(),
              create: $('#search-RoleCreate').val().toLowerCase().trim(),
              date: $('#search-RoleDate').val().toLowerCase().trim(),
              time: $('#search-RoleTime').val().toLowerCase().trim(),
              status: $('.db-status').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_Role(context.data, currentPage, itemsPerPage,filters, context.data);
            group_role = context.groups;
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }
    //authorization page
    function auth_role(){
      $.ajax({
        url: '/phan-quyen-quyen/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            var buttonAdd = document.querySelector('#addRole');
            var buttonEdit = document.querySelectorAll('.update-group');
            var buttonDel = document.querySelectorAll('.delete-group');
            var buttonSta = document.querySelectorAll('.btn-role-status');
            //Role Add New User
            if(response.IsAdmin == true || response.Roles[2].Status == 'True'){             
              buttonAdd.classList.remove('disable-button');
            }
            else{
              buttonAdd.classList.add('disable-button');
            }
            //Role Update User
            if(response.IsAdmin == true || response.Roles[1].Status == 'True'){   
              buttonEdit.forEach(function(edit){
                edit.classList.remove('disable-button');
              });    
              buttonSta.forEach(function(sta){
                sta.classList.remove('admin-button');
              });    
            }
            else{
              buttonEdit.forEach(function(edit){
                edit.classList.add('disable-button');
              }); 
              buttonSta.forEach(function(sta){
                sta.classList.add('admin-button');
              });            
            }
            //Role Delete User
            if(response.IsAdmin == true || response.Roles[3].Status == 'True'){             
              buttonDel.forEach(function(edit){
                edit.classList.remove('disable-button');
              });
            }
            else{
              buttonDel.forEach(function(edit){
                edit.classList.add('disable-button');
              }); 
            }
            
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    // Load data
      function display_Role(products, currentPage, itemsPerPage, filters, data_temp) {

        $('#product-table tbody').empty();
        var filteredProducts = products.filter(function(product) {
            var IDMatch = filters.id === '' || product.Role_ID.toString().toLowerCase().includes(filters.id);
            var NameMatch = filters.name === '' || product.Role_Name.toLowerCase().indexOf(filters.name) > -1;
            var GroupNameMatch = filters.groupname === '' || product.Role_Group_Name.toLowerCase().indexOf(filters.groupname) > -1;
            var createMatch = filters.create === '' || product.Role_CreateBy.toString().toLowerCase().indexOf(filters.create) > -1;
            var dateMatch = filters.date === '' || product.Role_Date.toString().toLowerCase().indexOf(filters.date) > -1;
            var timeMatch = filters.time === '' || product.Role_Time.toLowerCase().indexOf(filters.time) > -1;
            var statusMatch = filters.status === '' || product.Role_Status.toString().toLowerCase().indexOf(filters.status) > -1;

            return IDMatch && NameMatch && GroupNameMatch && createMatch && dateMatch && timeMatch && statusMatch ;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }

        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr data-product-id="'+product.Role_ID+'">' +
            '<td data-column="id">#' + product.Role_ID + '</td>' +           
            '<td data-column="name">' + product.Role_Name + '</td>' +
            '<td data-column="groupname">' + product.Role_Group_ID +' - ' +product.Role_Group_Name +'</td>' +
            '<td data-column="username">' + product.Role_CreateBy + '</td>' +         
            '<td data-column="date">' + product.Role_Date + '</td>' +
            '<td data-column="time">' + product.Role_Time + '</td>' +
            '<td data-column="status"><button data-group-id="' + product.Role_ID + '" data-group-status="' + product.Role_Status + '" type="button" class="btn btn-'+(product.Role_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-role-status admin-button">'+  
            (product.Role_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-group disable-button" name="Update[]" value="' + product.Role_ID + '" data-group-id="'+product.Role_Group_ID+'"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-group disable-button" name="delete[]" value="' + product.Role_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
            event.preventDefault();
      
            var page = $(this).data('page');
            display_Role(products, page, itemsPerPage, filters);
            auth_role();
        });
        
        // Handle First and Last button click event - start
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            display_Role(products, 1, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Role(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            display_Role(products, numPages, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_Role(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        // Handle First and Last button click event - end
        
        //xử lý sự kiện update status
        $(document).on('click', '.btn-role-status', function() {
            var comp   = $(this);
            var status = comp.attr('data-group-status');
            var id     = comp.attr('data-group-id');
            var status_new = (status === "true" ? "false" : "true");
            if(status){
              $.ajax({
                url: '/cap-nhat-quyen/',
                dataType: 'json',
                method: 'POST',
                data: {
                  'status': (status === "true" ? "False" : "True"),
                  'RoleID': id,
                },
                success: function(response) {
                  if (response.success) {     
                    var htmlStatus = '<button data-group-id="' + response.Role_ID + '" data-group-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-role-status">'+  
                    (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
                    '</button>';

                    var btn_status = document.querySelector('tr[data-product-id="' + response.Role_ID + '"]');
                    var btn_status_column = btn_status.querySelector('td[data-column="status"]');
                    var btn_status_button = btn_status_column.querySelector('button');
                    if (btn_status_button) {
                      btn_status_button.remove();
                    }
                    btn_status_column.insertAdjacentHTML('beforeend', htmlStatus);
                    Swal.fire({
                      icon: 'success',
                      title: 'Thông Báo',
                      timer: 1000,
                      text: response.message,
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: response.message,
                    });
                  }
                },
                error: function(response) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Thông Báo Lỗi',
                    text: response.message,
                  });
                }
              });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi', 
                text: 'Không update được status',
              })
            }
            
          });
        //xử lý sự kiện update status

        // Search data in textbox table - start
        $('#search-RoleID, #search-RoleName,#search-RoleGroup, #search-RoleCreate,#search-RoleDate,#search-RoleTime,.db-status').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-RoleID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-RoleName').blur();
              $('#search-RoleCreate').blur();
              $('#search-RoleGroup').blur();
              var formattedDate ="";
              var date = $('#search-RoleDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-RoleID').val().toLowerCase().trim(),
                name: $('#search-RoleName').val().toLowerCase().trim(),
                groupname: $('#search-RoleGroup').val().toLowerCase().trim(),
                create: $('#search-RoleCreate').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-RoleTime').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Role(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role()
              }
          }
        });

        $(document).on('click', '.btn-remove-filter', function() {
          $('#search-RoleID').val('');
          $('#search-RoleName').val('');
          $('#search-Role').val('');
          $('#search-RoleCreate').val('');
          $('#search-RoleDate').val('');
          $('#search-RoleTime').val('');
          $('.db-status').val('');
          reset_data();  
        });
        
        function reset_data(){
          $('#search-RoleID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-RoleName').blur();
              $('#search-RoleCreate').blur();
              $('#search-RoleGroup').blur();
              var formattedDate ="";
              var date = $('#search-RoleDate').val();
              if(date){
                var parts = date.split("-");
                formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
              }
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-RoleID').val().toLowerCase().trim(),
                name: $('#search-RoleName').val().toLowerCase().trim(),
                groupname: $('#search-RoleGroup').val().toLowerCase().trim(),
                create: $('#search-RoleCreate').val().toLowerCase().trim(),
                date: formattedDate,
                time: $('#search-RoleTime').val().toLowerCase().trim(),
                status: $('.db-status').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_Role(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role()
              }
        }
        // Search data in textbox table - end

        //function button status update  - start
          var statusButtons = document.querySelectorAll('.btn-status');
          statusButtons.forEach(function(button) {
            button.addEventListener('click', function() {     
                $('#StatusModal').modal('show');
                if( $('#StatusModal').modal('show'))
                {
                  var value = this.getAttribute('status-value');
                  var ticketID = this.getAttribute('data-ticket-status');
                  var id = document.querySelector('.ticket-ID');
                  id.textContent =  ticketID;    
                  var statusOptions = document.querySelectorAll('#input_model_status option');
                  statusOptions.forEach(function(option) {
                    if (option.value === value) {
                      option.setAttribute('selected', 'selected');
                    } else {
                      option.removeAttribute('selected');
                    }
                  });
                }         
            });
          });

          $('#status-button').click(function(event){
            var ticket = document.querySelector('.ticket-ID');
            if(ticket){
              var ticketid = ticket.innerText;
              var new_status = $('#input_model_status').val();
              var new_name = $('#input_model_status option:selected').text();
              ticket_update_status(ticketid, new_status, new_name);            
            }            
          });

          function ticket_update_status(ticketid, new_status, new_name) {
            $.ajax({
              url: '/cap-nhat-ticket-status/',
              dataType: 'json',
              method: 'POST',
              data: {
                'ticketid': ticketid,
                'new_status': new_status,
              },
              success: function(response) {
                if (response.success) {
                  $('#StatusModal').modal('hide');
                  // Cập nhật lại giá trị status-value của button
                  var btn_ticket = $('.btn-status[data-ticket-status="' + ticketid + '"]');
                  btn_ticket.attr('status-value', new_status);
                  btn_ticket.text(new_name);
                  // Xóa tất cả các lớp hiện tại của nút
                  btn_ticket.removeClass('btn-success btn-warning btn-primary btn-danger');

                  // Thêm lớp mới dựa trên giá trị trạng thái
                  if (new_status === '0') {
                    btn_ticket.addClass('btn-success');
                  } else if (new_status === '1') {
                    btn_ticket.addClass('btn-primary');
                  }
                  else if (new_status === '2') {
                    btn_ticket.addClass('btn-warning');
                  }
                  else if (new_status === '3') {
                    btn_ticket.addClass('btn-danger');
                  }

                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                  });
                }
              },
              error: function(response) {
                Swal.fire({
                  icon: 'error',
                  title: 'Thông Báo Lỗi',
                  text: response.message,
                });
              }
            });
          }    
          //function button status update ticket - end  

          function add_row_group(product){
            $('#product-table tbody').prepend('<tr data-product-id="'+product.Role_ID+'">' +
            '<td data-column="id">#' + product.Role_ID + '</td>' +           
            '<td data-column="name">' + product.Role_Name + '</td>' +
            '<td data-column="groupname">' + product.Role_Group_ID +' - ' +product.Role_Group_Name +'</td>' +
            '<td data-column="username">' + product.Role_CreateBy + '</td>' +         
            '<td data-column="date">' + product.Role_Date + '</td>' +
            '<td data-column="time">' + product.Role_Time + '</td>' +
            '<td data-column="status"><button data-group-id="' + product.Role_ID + '" data-group-status="' + product.Role_Status + '" type="button" class="btn btn-'+(product.Role_Status == 1 ? 'success' : 'danger' )+' btn-rounded btn-fw btn-role-status admin-button">'+  
            (product.Role_Status == 1 ? 'Kích Hoạt' : 'Không Kích Hoạt' )+
            '</button></td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon update-group admin-button" name="Update[]" value="' + product.Role_ID + '" data-group-id="'+product.Role_Group_ID+'"><i class="ti-pencil text-danger"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon delete-group admin-button" name="delete[]" value="' + product.Role_ID + '"><i class="ti-trash text-danger"></i></button>' +
            '</td>' +
          '</tr>');
          // var list = {
          //   'Role_ID'  : product.Role_ID,
          //   'Role_Name': product.Role_Name,
          //   'Role_Group_ID': product.Role_Group_ID,
          //   'Role_Group_Name': product.Role_Group_Name,
          //   'Role_CreateBy': product.Role_CreateBy,
          //   'Role_Date': product.Role_Date,
          //   'Role_Time': product.Role_Time,
          //   'Role_Status': product.Role_Status,
          // };
          // data_temp.push(list);
        }

    //xử lý sự kiện close modal
      $('.close').click(function(event) {
        $('#CreateRoleModal').modal('hide');
        $('#UpdateRoleModal').modal('hide');
      });
    //xử lý sự kiện close modal

    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
      $(document).on('click', '.delete-group', function() {
        var RoleID = $(this).val();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success btn-success-cus',
            cancelButton: 'btn btn-danger btn-danger-cus'
          },
          buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Bạn muốn xóa Quyền "+ RoleID + " ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();          
            var parentRow = $(this).closest('tr');
            delete_Role(RoleID, parentRow);      
          } 
        })
      });

      function delete_Role(RoleID, parentRow){
        $.ajax({
          url: '/xoa-quyen/',
          dataType: 'json',
          method: 'POST',
          data: {
            'RoleID': RoleID,
          },
          success: function(response) {
            if (response.success) {
              parentRow.remove();
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
    // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete

    // Xử lý sự kiện khi người dùng nhấn nút Create
      $('.addRole').click(function(event) {
        $('#CreateRoleModal').modal('show');
        if($('#CreateRoleModal').modal('show')){
          load_group_role(group_role,'Create')
        }
      });

      $('#create-role-button').click(function(event) {
        event.preventDefault(); // Prevent default form submission      
        var Role_Name = document.querySelector('#input_role_name').value;
        var Group_ID= document.querySelector('#input_role').value;
        create_role(Role_Name,Group_ID);
      });

      function load_group_role(group_role,Type_role){
        var options = '';
        for (var i = 0; i < group_role.length; i++) {
          options += '<option value="' + group_role[i].Role_Group_ID + '">' + group_role[i].Role_Group_ID + ' - ' + group_role[i].Role_Group_Name + '</option>';
        }
        if (Type_role == 'Create') {
          var intput_group = document.querySelector('#input_role');
          intput_group.innerHTML = options;
        } else if (Type_role == 'Update') {
          var intput_group_update = document.querySelector('#input_role_update');
          intput_group_update.innerHTML = options;
        }
        
      }

      function create_role(Role_Name,Group_ID){
        $.ajax({
          url: '/tao-quyen/',
          dataType: 'json',
          method: 'POST',
          data: {
            'Role_Name': Role_Name,
            'Group_ID': Group_ID,
          },
          success: function(response) {
            if (response.success) {     
              add_row_group(response, product);
              auth_role();
              $('#CreateRoleModal').modal('hide');           
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
      $(document).on('click', '.update-group', function() {
        $('#UpdateRoleModal').modal('show');
        if( $('#UpdateRoleModal').modal('show'))
        {       
          var RoleID = $(this).val();
          load_group_role(group_role,'Update');
          LoadDataUpdate_Role(RoleID);               
        }
      });
     
      }
    // Xử lý sự kiện khi người dùng nhấn nút Create

  // load data form update product
    function LoadDataUpdate_Role(RoleID){    
      $.ajax({
        url: '/data-update-role/',
        dataType: 'json',
        method: 'POST',
        data: {
          'RoleID': RoleID,
        },
        success: function(response) {
          if(response.success){
            var input = document.querySelector('#UpdateRoleModal');
            var input_ID = input.querySelector('#input_role_id');
            input_ID.value = response.Groups[0].Role_ID;
            var input_Name = input.querySelector('#input_role_name');
            input_Name.value = response.Groups[0].Role_Name;

            var input_group = input.querySelectorAll('#input_role_update option');            
            input_group.forEach(function(group){
              var grp = group.getAttribute('value');
              var group_Status = response.Groups[0].Role_Group_ID;                         
              if (grp === String(group_Status)) {
                group.setAttribute('selected', 'selected');
              } else {
                group.removeAttribute('selected');
              }
            });

            var input_status = input.querySelectorAll('#input_role_status option');            
            input_status.forEach(function(sta){
              var status = sta.getAttribute('value');
              var groupStatus = response.Groups[0].Role_Status;                         
              if (status === String(groupStatus)) {
                sta.setAttribute('selected', 'selected');
              } else {
                sta.removeAttribute('selected');
              }
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        },
        error: function(rs, e) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: 'Lỗi',
          });
        }
    });
    }

    $(document).on('click', '#Update-role-button', function() {
    // $('#Update-company-button').click(function(event) {
      // $(document).on('click', 'update-company-button', function() {
      var modal = document.querySelector('#UpdateRoleModal');
      var input_ID = modal.querySelector('#input_role_id').value;
      var input_Name = modal.querySelector('#input_role_name').value;
      var input_Group = modal.querySelector('#input_role_update').value;
      var input_status = modal.querySelector('#input_role_status').value;
    
      if (input_ID && input_Name && input_status && input_Group) {
        update_role(input_ID, input_Name, input_status,input_Group);  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thông Báo Lỗi', 
          text: 'Nhập thông tin vào các trường có *',
        });
      }
    }); 

    function update_role(RoleID, RoleName,status,GroupID){
      var status_new = (status == "true" ? "true" : "false")
      $.ajax({
            url: '/cap-nhat-quyen/',
            dataType: 'json',
            method: 'POST',
            data: {
              'RoleID': RoleID,
              'GroupID': GroupID,
              'status': (status == "true" ? "True" : "False"),
              'RoleName': RoleName,
            },
            success: function(response) {
              if (response.success) {
                update_info_group(response, status_new);
                $('#UpdateRoleModal').modal('hide');
                  Swal.fire({
                    icon: 'success',
                    title: 'Thông Báo',
                    timer: 1000,
                    text: response.message,
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: response.message,
                });
              }
            },
            error: function(response) {
              Swal.fire({
                icon: 'error',
                title: 'Thông Báo Lỗi',
                text: response.message,
              });
            }
          });
    }

    function update_info_group(Role_Data,status_new){
        // Lấy danh sách tất cả các phần tử tr có thuộc tính data-product-id
        var productRows = document.querySelectorAll('tr[data-product-id]');

        // Lặp qua từng phần tử tr
        productRows.forEach(function(row) {
          // Lấy giá trị của thuộc tính data-product-id
          var RoleID = parseInt(row.getAttribute('data-product-id'));

          // Kiểm tra xem productId có khớp với sản phẩm bạn đang quan tâm không
          if (RoleID === Role_Data.Role_ID) {
            // Cập nhật thông tin của phần tử
            var nameElement = row.querySelector('[data-column="name"]');
            var groupElement = row.querySelector('[data-column="groupname"]');
            var statusElement = row.querySelector('[data-column="status"]');
            nameElement.textContent =  Role_Data.Role_Name;
            groupElement.textContent =  Role_Data.Role_Group_ID + ' - ' +Role_Data.Role_Group_Name;
            var htmlStatus = '<button data-group-id="' + Role_Data.Role_Status + '" data-group-status="' + status_new + '" type="button" class="btn btn-'+(status_new === "true" ? 'success' : 'danger' )+' btn-rounded btn-fw btn-role-status">'+  
            (status_new === "true" ? 'Kích Hoạt' : 'Không Kích Hoạt' ) + 
            '</button>';
            var buttonStatusElement = statusElement.querySelector('button');
            if (buttonStatusElement) {
              buttonStatusElement.remove();
            }
            statusElement.insertAdjacentHTML('beforeend', htmlStatus);
          }
        });
    }
    // Xử lý sự kiện khi người dùng nhấn nút Update 
}
//########### Danh Sách Role End ############# 

//########### Danh Sách Authorize Start ###########  
if (window.location.pathname === '/danh-sach-phan-quyen/') {
//Scroll screen
// Get the button element
const buttonRole = document.querySelector('#addRole');
const buttonInitialTop = buttonRole.getBoundingClientRect().top + 'px'; // Convert to 'px'

// Listen for the scroll event
window.addEventListener('scroll', () => {
  // Get the current scroll position
  const scrollPosition = window.scrollY;

  // Check if the scroll position is greater than or equal to 191
  if (scrollPosition >= 107) {
    // Fix the button to the top of the page
    buttonRole.style.position = 'fixed';
    buttonRole.style.top = '107px';
    buttonRole.style.right = '0';
    buttonRole.classList.add('button-fix');
  } else {
    // Unfix the button and reset its position
    buttonRole.style.position = '';
    buttonRole.style.top = ''; // Reset to its original position
    buttonRole.style.right = '';
  }
});

  var currentPage = 1;
  var itemsPerPage = 25;
  //Check Role
  $.ajax({
    url: '/role-authorize/',
    dataType: 'json',
    success: function(response) {
      if(response.success){
        Load_Authorize();
      }
      else{
        window.location.href = '/dashboard/';
      }    
    },
    error: function(rs, e) {
      Swal.fire({
        icon: 'error',
        title: 'Thông Báo',
        text: response.message,
      });
    }
  });


  var group_role = [];
  // load data product
  function Load_Authorize(){
    $.ajax({
      url: '/danh-sach-data-phan-quyen/',
      dataType: 'json',
      success: function(context) {
          var filters = {           
              id: $('#search-UserID').val().toLowerCase().trim(),
              name: $('#search-Name').val().toLowerCase().trim(),
            };
            // Load_data(context.companys, context.tgroups, context.users)
            display_user(context.users, currentPage, itemsPerPage,filters, context.users);
            display_role_data(context.groups, context.roles);
            auth_role();
      },
      error: function(rs, e) {
          alert('Oops! something went wrong');
      }
    });
  }

    //authorization page
    function auth_role(){
      $.ajax({
        url: '/phan-quyen-authorize/',
        dataType: 'json',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            var buttonAdd = document.querySelector('#addRole');
            //Role Add New User
            if(response.IsAdmin == true || response.Roles[1].Status == 'True'){             
              buttonAdd.classList.remove('disable-button');
            }
            else{
              buttonAdd.classList.add('disable-button');
            }           
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }
        },
        error: function(response) {
          Swal.fire({
            icon: 'error',
            title: 'Thông Báo Lỗi',
            text: response.message,
          });
        }
      });
    }

    // Load data
      function display_user(products, currentPage, itemsPerPage, filters, data_temp) {
        $('#product-table-user tbody').empty();
        var filteredProducts = products.filter(function(product) {
            var IDMatch = filters.id === '' || product.ID_user.toString().toLowerCase().includes(filters.id);
            var NameMatch = filters.name === '' || product.FullName.toLowerCase().indexOf(filters.name) > -1;

            return IDMatch && NameMatch;
          });

          if(filteredProducts !== null || filteredProducts !== '')
          {
            products = filteredProducts
          }

        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table-user tbody').append('<tr data-product-id="'+product.ID_user+'">' +
            '<td data-column="check"><input type="checkbox" id="check-user" value="'+product.ID_user+'" /></td>' +           
            '<td data-column="id">#' + product.ID_user + '</td>' +           
            '<td data-column="name">' + product.FullName + '</td>' +
            '<td>' +
            '<button type="button" class="btn btn-outline-secondary btn-rounded btn-icon view-group" name="Update[]" value="' + product.ID_user + '"><i class="ti-settings text-danger"></i></button>' +
            '</td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          var activeClass = (i === currentPage) ? "active" : "";
          pagination.append('<li class="page-item ' + activeClass + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
            event.preventDefault();
      
            var page = $(this).data('page');
            display_user(products, page, itemsPerPage, filters);
            auth_role();
        });
        
        // Handle First and Last button click event - start
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            display_user(products, 1, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_user(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            display_user(products, numPages, itemsPerPage, filters);
            auth_role();
          }
          else
          {
            display_user(products, currentPage, itemsPerPage, filters);
            auth_role();
          }
        });
        // Handle First and Last button click event - end
        

        // Search data in textbox table - start
        $('#search-UserID, #search-Name').on('keydown', function(event) {
          if (event.keyCode === 13) { // Nếu nhấn phím Enter
              event.preventDefault(); // Tránh việc reload lại trang
              $('#search-UserID').blur(); // Mất focus khỏi textbox tìm kiếm
              $('#search-Name').blur();
              // Lấy giá trị của filters
              var filters = {
                id: $('#search-UserID').val().toLowerCase().trim(),
                name: $('#search-Name').val().toLowerCase().trim(),
              };
              if(data_temp){
                display_user(data_temp, currentPage, itemsPerPage, filters, data_temp);
                auth_role();
              }
          }
        });


    //xử lý sự kiện close modal
      $('.close').click(function(event) {
        $('#CreateRoleModal').modal('hide');
        $('#UpdateRoleModal').modal('hide');
      });
    //xử lý sự kiện close modal


    // Xử lý sự kiện khi người dùng nhấn nút Create
    $(document).on('click', '.addRole', function() {
        var date_from = document.querySelector('#input-from').value;
        var date_to =document.querySelector('#input-to').value;   
        var check_box_users = document.querySelectorAll('#check-user:checked');
        if(check_box_users.length > 0){      
              var check_box_roles = document.querySelectorAll('#checkbox-role');
              var list_users = [];
              var list_roles = [];
              check_box_users.forEach(function(item_user){
                var id_user = item_user.value;
                var data_user = {'UserID': id_user};
                list_users.push(JSON.stringify(data_user));
              });
              check_box_roles.forEach(function(item_role){
                var id_role = item_role.value;
                var data_role = {'RoleID': id_role,'Status': (item_role.checked ? 'True' : 'False')};
                list_roles.push(JSON.stringify(data_role));
              });
              create_authorize(date_from,date_to,list_users,list_roles);
        }
        else{
          Swal.fire({
            icon: 'success',
            title: 'Thông Báo',
            text: 'Chưa Chọn Danh Sách User Cần Phân Quyền',
          });
        }
      });


      function create_authorize(date_from,date_to,list_users,list_roles){
        $.ajax({
          url: '/phan-quyen-nguoi-dung/',
          dataType: 'json',
          method: 'POST',
          data: {
            'Date_From': date_from,
            'Date_To': date_to,
            'List_Users[]': list_users,
            'List_Roles[]': list_roles,
          },
          success: function(response) {
            if (response.success) {    
              var jsonUserID = JSON.parse(list_users[0]);  
              var userID = jsonUserID["UserID"];
              display_role(userID);             
              Swal.fire({
                icon: 'success',
                title: 'Thông Báo',
                timer: 1000,
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message,
              });
            }
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
     
      function display_role(userID){
        $.ajax({
          url: '/role-data-user/',
          dataType: 'json',
          method: 'POST',
          data: {
            'UserID': userID,
          },
          success: function(response) {
            display_role_user(response.groups, response.roles);
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      }
    }

      $(document).on('click', '.view-group', function() {
        var user = $(this).val();
        $.ajax({
          url: '/role-data-user/',
          dataType: 'json',
          method: 'POST',
          data: {
            'UserID': user,
          },
          success: function(response) {
            display_role_user(response.groups, response.roles);
          },
          error: function(response) {
            Swal.fire({
              icon: 'error',
              title: 'Thông Báo Lỗi',
              text: response.message,
            });
          }
        });
      });

      function display_role_data(data_groups, data_roles){
        for (var i = 0; i < data_groups.length; i++) {
          // var id = data_groups[i].Role_Group_ID;
          var roleData = '<div class="role-item checkbox-wrapper-14" value="' + data_groups[i].Role_Group_ID + '">' +
            '<div class="role-item-group">' +
            '<input type="checkbox" id="s1-14 checkbox-group" class="switch checkbox-group" value="' + data_groups[i].Role_Group_ID + '" />' +
            '<p>' + data_groups[i].Role_Group_Name + '</p>' +
            '</div>' +
            '<div class="role-item-data checkbox-wrapper-14">';
      
          for (var j = 0; j < data_roles.length; j++) {
            if(data_groups[i].Role_Group_ID == data_roles[j].Role_Group_ID){
              roleData += '<div class="role-single-item-data">' +
              '<input type="checkbox" id="checkbox-role" data-group="' + data_roles[j].Role_Group_ID + '" value="' + data_roles[j].Role_ID + '" />' +
              '<p>' + data_roles[j].Role_Name + '</p>' +
              '</div>';
            }    
          }
      
          roleData += '</div>' +
            '</div>';
      
          $('.role-container').append(roleData);
      }
    }

    function display_role_user(data_groups, data_roles){
      var roleContainer = document.querySelector('.role-container');
      while (roleContainer.firstChild) {
        roleContainer.removeChild(roleContainer.firstChild);
      }
      
      for (var i = 0; i < data_groups.length; i++) {
        // var id = data_groups[i].Role_Group_ID;
        var roleData = '<div class="role-item checkbox-wrapper-14" value="' + data_groups[i].Role_Group_ID + '">' +
          '<div class="role-item-group">' +
          '<input type="checkbox" id="s1-14 checkbox-group" class="switch checkbox-group" value="' + data_groups[i].Role_Group_ID + '" />' +
          '<p>' + data_groups[i].Role_Group_Name + '</p>' +
          '</div>' +
          '<div class="role-item-data checkbox-wrapper-14">'+
          '<table><thead><tr></tr></thead><tbody>';
    
        for (var j = 0; j < data_roles.length; j++) {
          if(data_groups[i].Role_Group_ID == data_roles[j].Role_Group_ID){
            roleData += '<tr>' +
            '<td>' +
              '<div class="role-single-item-data">' +
                '<input type="checkbox" id="checkbox-role" '+ data_roles[j].isStatus+' data-group="' + data_roles[j].Role_Group_ID + '" value="' + data_roles[j].Role_ID + '" />' +
                '<p>' + data_roles[j].Role_Name + '</p>' +             
              '</div>'+
            '</td>' +
            '<td>' + data_roles[j].DateFrom + '</td>' +
            '<td>' + data_roles[j].DateTo + '</td>' +
            '</tr>';
          }    
        }
    
        roleData += '</tbody></table></div>' +
          '</div>';
    
        $('.role-container').append(roleData);
    }
  }

    $(document).on('click', '.checkbox-group', function() {
      var isChecked = $(this).is(':checked');
      $(this).closest('.role-item').find('.role-single-item-data input[type="checkbox"]').prop('checked', isChecked);
    });

    // Xử lý sự kiện khi người dùng nhấn nút Create


}
//########### Danh Sách Authorize End ########### 

//################################################## PAGE TICKET HELPDESK - END ##################################################  