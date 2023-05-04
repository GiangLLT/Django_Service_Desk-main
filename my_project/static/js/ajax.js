
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

      // Search data in textbox table
// $('#search-name, #search-cate, #search-price').on('keydown', function(event) {
//   if (event.keyCode === 13) { // Nếu nhấn phím Enter
//       event.preventDefault(); // Tránh việc reload lại trang
//       $('#search-name').blur(); // Mất focus khỏi textbox tìm kiếm
//       $('#search-cate').blur();
//       $('#search-price').blur();

//       // Lấy giá trị của filters
//       var filters = {
//           name: $('#search-name').val().toLowerCase().trim(),
//           category: $('#search-cate').val().toLowerCase().trim(),
//           price: $('#search-price').val().toLowerCase().trim()
//       };

//       // Nếu textbox không có dữ liệu thì không thêm filter vào request
//       // if (!filters.name) {
//       //   delete filters.name;
//       // }
//       // if (!filters.category) {
//       //   delete filters.category;
//       // }
//       // if (!filters.price) {
//       //   delete filters.price;
//       // }

//       $.ajax({
//         url: '/danh-sach-test1/',
//         dataType: 'json',
//         data: filters, // Dữ liệu được gửi về máy chủ
//         success: function(data) {
//             displayProducts(data, currentPage, itemsPerPage, filters);
//         },
//         error: function(rs, e) {
//             alert('Oops! something went wrong..');
//         }
//       });
//   }
// });

      
  //   $('#search-name, #search-cate, #search-price').on('keyup', function(event) {
  //     if (event.keyCode === 13) { // Nếu nhấn phím Enter         
  //         event.preventDefault(); // Tránh việc reload lại trang
  //     } 
      
  //     var filters = {
  //         name: $('#search-name').val().toLowerCase().trim(),
  //         category: $('#search-cate').val().toLowerCase().trim(),
  //         price: $('#search-price').val().toLowerCase().trim()
  //       };

  //       $.ajax({
  //         url: '/danh-sach-test1/',
  //         dataType: 'json',
  //         data: filters, // Dữ liệu được gửi về máy chủ
  //         success: function(data) {
  //             displayProducts(data, currentPage, itemsPerPage,filters)

  //         },
  //         error: function(rs, e) {
  //             alert('Oops! something went wrong..');
  //         }
  //     });
  // });
  
  // $('#search-name, #search-cate, #search-price').on('keydown', function(event) {
  //     if (event.keyCode === 13) { // Nếu nhấn phím Enter
  //         event.preventDefault(); // Tránh việc reload lại trang
  //         $('#search-name').blur(); // Mất focus khỏi textbox tìm kiếm
  //         $('#search-cate').blur();
  //         $('#search-price').blur();
  //     }
  // });
     
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
          window.location.href = "/danh-sach-test/";
        
          // Swal.fire(
          //   'success',
          //   'Login Sucess',
          //   'success'
          // )
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
  var clientId = '5c17ff26-50a1-4003-bc31-f0545709c2f7'; // Replace with your own client ID
  var redirectUri = 'https://localhost:8000/login/callback/'; // Replace with your own redirect URI
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
document.getElementById('google-login-btn').addEventListener('click', function() {
  // Chuyển hướng đến trang xác thực của Google
  google_login();
});

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
document.getElementById('facebook-login-btn').addEventListener('click', function() {
  FB.login(function(response) {
      if (response.authResponse) {
          console.log('Đăng nhập thành công!');
      } else {
          console.log('Đăng nhập không thành công!');
      }
  }, {scope: 'public_profile,email'});
});

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





$('#logout-button').click(function(event) {
  event.preventDefault();
  console.log("abc")
  logout();
});

function logout(){
  $.ajax({
    url: '/logout/',
    method: 'POST',
    success: function(response) {
      if (response.success) {
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



    // $('#search-name, #search-cate, #search-price').on('keyup', function() {
    //     var name = $('#search-name').val().toLowerCase().trim();
    //     var category = $('#search-cate').val().toLowerCase().trim();
    //     var price = $('#search-price').val().toLowerCase().trim();
    //     console.log(category);
    //     $('#product-table tbody tr').filter(function() {
    //         var row = $(this);
    //         var nameMatch = name === '' || row.find('[data-column="name"]').text().toLowerCase().indexOf(name) > -1;
    //         var cateMatch = category === '' || row.find('[data-column="cate"]').text().toLowerCase().indexOf(category) > -1;
    //         var priceMatch = price === '' || row.find('[data-column="price"]').text().toLowerCase().indexOf(price) > -1;
    //         return nameMatch && cateMatch && priceMatch;
    //     }).toggle(true).siblings().toggle(false);
    
    //     if (name === '' && category === '' && price === '') {
    //         $('#product-table tbody tr').toggle(true);
    //     }
    // });

    // $('#search-name, #search-cate, #search-price').on('keyup', function() {
    //     var name = $('#search-name').val().toLowerCase();
    //     var category = $('#search-cate').val().toLowerCase();
    //     var price = $('#search-price').val().toLowerCase();
    //     $('#product-table tbody tr').filter(function() {
    //         var row = $(this);
    //         var nameMatch = name === '' || row.find('[data-column="name"]').text().toLowerCase().includes(name);
    //         var cateMatch = category === '' || row.find('[data-column="category"]').text().toLowerCase().includes(category);
    //         var priceMatch = price === '' || row.find('[data-column="price"]').text().toLowerCase().includes(price);
    //         return nameMatch && cateMatch && priceMatch;
    //     }).toggle(true).siblings().toggle(false);
    
    //     if (name === '' && category === '' && price === '') {
    //         $('#product-table tbody tr').toggle(true);
    //     }
    // });



//     // tạo các biến lưu trữ giá trị của các ô tìm kiếm
//     var searchName = $('#search-name');
//     var searchCate = $('#search-cate');
//     var searchPrice = $('#search-price');

//     // lưu trữ các giá trị ban đầu của các ô tìm kiếm
//     var initSearchName = searchName.val();
//     var initSearchCate = searchCate.val();
//     var initSearchPrice = searchPrice.val();

// // tạo sự kiện khi người dùng nhập vào các ô tìm kiếm
//     searchName.add(searchCate).add(searchPrice).on('keyup', function() {
//     // lấy giá trị của các ô tìm kiếm
//         var nameVal = searchName.val().toLowerCase();
//         var cateVal = searchCate.val().toLowerCase();
//         var priceVal = searchPrice.val().toLowerCase();

//     // kiểm tra các giá trị tìm kiếm có rỗng hay không
//     if (nameVal.length === 0 && cateVal.length === 0 && priceVal.length === 0) {
//         // nếu rỗng, hiển thị lại toàn bộ hàng
//         $('#product-table tbody tr').toggle(true);
//     } else {
//         // sử dụng filter để lọc các hàng phù hợp
//         $('#product-table tbody tr').filter(function() {
//             var row = $(this);
//             var name = row.find('[data-column="name"]').text().toLowerCase();
//             var cate = row.find('[data-column="category"]').text().toLowerCase();
//             var price = row.find('[data-column="price"]').text().toLowerCase();
//             var nameMatch = nameVal.length === 0 || name.indexOf(nameVal) > -1;
//             var cateMatch = cateVal.length === 0 || cate.indexOf(cateVal) > -1;
//             var priceMatch = priceVal.length === 0 || price.indexOf(priceVal) > -1;
//             return nameMatch && cateMatch && priceMatch;
//         }).toggle(true).siblings().toggle(false);
//     }
// });

// // tạo sự kiện khi người dùng xóa nội dung trong các ô tìm kiếm
// searchName.add(searchCate).add(searchPrice).on('change keyup', function() {
//     // kiểm tra xem các giá trị tìm kiếm có rỗng hay không
//     if (searchName.val().length === 0 && searchCate.val().length === 0 && searchPrice.val().length === 0) {
//         // nếu rỗng, hiển thị lại toàn bộ hàng
//         $('#product-table tbody tr').toggle(true);
//     }
// });

// // tạo sự kiện khi người dùng focus out khỏi các ô tìm kiếm
// searchName.add(searchCate).add(searchPrice).on('focusout', function() {
//     // kiểm tra xem các giá trị tìm kiếm có rỗ
//     // nếu rỗng, đặt lại giá trị ban đầu
//     if (searchName.val().length === 0) {
//         searchName.val(initSearchName);
//     }
//     if (searchCate.val().length === 0) {
//         searchCate.val(initSearchCate);
//     }
//     if (searchPrice.val().length === 0) {
//         searchPrice.val(initSearchPrice);
//     }
// });

    // $('#search-name').on('keyup', function() {
    //     var value = $(this).val().toLowerCase();
    //     if (value.length === 0) {
    //         $('#product-table tbody tr').toggle(true);
    //     } else {
    //         $('#product-table tbody tr').filter(function() {
    //             var row = $(this);
    //             var name = row.find('[data-column="name"]').text().toLowerCase();
    //             return name.indexOf(value) > -1;
    //         }).toggle(true).siblings().toggle(false);
    //     }
    // });


    // $('#search-box').on('keyup', function() {
    //     var value = $(this).val().toLowerCase();
    //     $('#product-table tbody tr').filter(function() {
    //         var row = $(this);
    //         var name = row.find('[data-column="name"]').text().toLowerCase();
    //         return name.indexOf(value) > -1;
    //     }).toggle(true).siblings().toggle(false);
    // });




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




