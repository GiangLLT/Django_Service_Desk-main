// $(document).ready(function() {
//     // Load data
//     $.ajax({
//         // type: 'GET',
//         url: '/danh-sach-test1/',
//         dataType: 'json',
//         success: function(data) {
//             for (var i = 0; i < data.length; i++) {
//                 var product = data[i];
//                 $('#product-table tbody').append('<tr>' +
//                     '<td id="name">' + product.name + '</td>' +
//                     '<td id="category">' + product.category + '</td>' +
//                     '<td id="price">' + product.price + '</td>' +
//                     '<td><input type="checkbox" name="delete[]" value="' + product.id + '"></td>' +
//                 '</tr>');
//             }
//         },
//         error: function(rs, e) {
//             alert(e.text); //throw actual error, just for debugging purpose
//             // alert(rs.responseText); //throw actual error, just for debugging purpose
//             alert('Oops! something went worng..'); // alert user that something goes wrong
//          }
//     });

//     // Search
//     $('#search-box').on('keyup', function() {
//         var value = $(this).val().toLowerCase();
//         $('#product-table tbody tr').filter(function() {
//             $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
//         });
//     });
// });


$(document).ready(function() {

   
    // Load data
    // $.ajax({
    //     // type: 'GET',
    //     url: '/danh-sach-test1/',
    //     dataType: 'json',
    //     success: function(data) {
    //         for (var i = 0; i < data.length; i++) {
    //             var product = data[i];
    //             $('#product-table tbody').append('<tr>' +
    //                 '<td data-column="name">' + product.name + '</td>' +
    //                 '<td data-column="cate">' + product.category + '</td>' +
    //                 '<td data-column="price">' + product.price + '</td>' +
    //                 '<td><input type="checkbox" name="delete[]" value="' + product.id + '"></td>' +
    //             '</tr>');
    //         }
    //     },
    //     error: function(rs, e) {
    //         alert(e.text); //throw actual error, just for debugging purpose
    //         // alert(rs.responseText); //throw actual error, just for debugging purpose
    //         alert('Oops! something went worng..'); // alert user that something goes wrong
    //      }
    // });

    var currentPage = 1;
    var itemsPerPage = 5;

    function displayProducts(products, currentPage, itemsPerPage, filter) {
        $('#product-table tbody').empty();

        // var filteredProducts = products.filter(function(product) {
        //     var nameMatch = filter.name === '' || product.name.toLowerCase().includes(filter.name);
        //     var cateMatch = filter.category === '' || product.category.toLowerCase().indexOf(filter.category) > -1;
        //     var priceMatch = filter.price === '' || product.price.toLowerCase().indexOf(filter.price) > -1;
        
        //     return nameMatch && cateMatch && priceMatch;
        //   });

        for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < products.length; i++) {
          var product = products[i];
          $('#product-table tbody').append('<tr>' +
            '<td data-column="name">' + product.name + '</td>' +
            '<td data-column="cate">' + product.category + '</td>' +
            '<td data-column="price">' + product.price + '</td>' +
            '<td><input type="checkbox" name="delete[]" value="' + product.id + '"></td>' +
          '</tr>');
        }
      
        var numPages = Math.ceil(products.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
        
        // Add First button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="1">&laquo;</a></li>');
        
        for (var i = 1; i <= numPages; i++) {
          pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }
        
        // Add Last button
        pagination.append('<li class="page-item"><a class="page-link" href="#" data-page="' + numPages + '">&raquo;</a></li>');
      
        pagination.find('.page-link').click(function(event) {
          event.preventDefault();
      
          var page = $(this).data('page');
          displayProducts(products, page, itemsPerPage);
        });
        
        // Handle First button click event
        pagination.find('.page-item:first-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage > 1) {
            displayProducts(products, 1, itemsPerPage);
          }
        });
        
        // Handle Last button click event
        pagination.find('.page-item:last-child .page-link').click(function(event) {
          event.preventDefault();
          
          if (currentPage < numPages) {
            displayProducts(products, numPages, itemsPerPage);
          }
        });
      
        // Xử lý sự kiện khi người dùng chọn checkbox và nhấn nút Delete
        // $('#delete-selected').click(function(event) {
        //   event.preventDefault();
      
        //   var selectedProducts = $('#product-table input:checked').map(function() {
        //     return $(this).val();
        //   }).get();
      
        //   // Gọi hàm xử lý xóa sản phẩm
        //   deleteProducts(selectedProducts);
        // });
      }
      
      
    
    // load data product
    $.ajax({
        url: '/danh-sach-test1/',
        dataType: 'json',
        success: function(data) {
            displayProducts(data, currentPage, itemsPerPage)
            // setupPagination(data);
            // displayProducts(data.slice(0, itemsPerPage));
        },
        error: function(rs, e) {
            alert('Oops! something went wrong..');
        }
    });






    // Search
    $('#search-name, #search-cate, #search-price').on('keyup', function(event) {
        if (event.keyCode === 13) { // Nếu nhấn phím Enter
            event.preventDefault(); // Tránh việc reload lại trang
        }

        // var filter = {
        //     name: $('#search-name').val().toLowerCase().trim(),
        //     category: $('#search-cate').val().toLowerCase().trim(),
        //     price: $('#search-price').val().toLowerCase().trim()
        //   };
        // displayProducts(products, 1, itemsPerPage, filter);
        var name = $('#search-name').val().toLowerCase().trim();
        var category = $('#search-cate').val().toLowerCase().trim();
        var price = $('#search-price').val().toLowerCase().trim();
        var count = 0;
        $('#product-table tbody tr').each(function() {
            var row = $(this);
            var nameMatch = name === '' || row.find('[data-column="name"]').text().toLowerCase().includes(name);
            var cateMatch = category === '' || row.find('[data-column="cate"]').text().toLowerCase().indexOf(category) > -1;
            var priceMatch = price === '' || row.find('[data-column="price"]').text().toLowerCase().indexOf(price) > -1;
            if (nameMatch && cateMatch && priceMatch) {
                row.toggle(true);
                count++;
            } else {
                row.toggle(false);
            }
        });
        if (count === 0) {
            $('#product-table tbody tr').toggle(true);
        }
    });
    
    $('#search-name, #search-cate, #search-price').on('keydown', function(event) {
        if (event.keyCode === 13) { // Nếu nhấn phím Enter
            event.preventDefault(); // Tránh việc reload lại trang
            $('#search-name').blur(); // Mất focus khỏi textbox tìm kiếm
            $('#search-cate').blur();
            $('#search-price').blur();
        }
    });
    

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
      
    //   function loadData() {
    //     var searchText = $('#barcode-search').val();
    //     $.ajax({
    //       type: 'GET',
    //       url: '/load-article/',
    //       data: {
    //         search_text: searchText
    //       },
    //       dataType: 'json',
    //       success: function(data) {
    //         for (var i = 0; i < data.length; i++) {
    //           var product = data[i];
    //           var newRow = '<tr>' +
    //             '<td class="name">' + product.Article + '</td>' +
    //             '<td class="barcode">' + product.Barcode + '</td>' +
    //             '<td class="quantity">1</td>' +
    //             '<td class="type">' + product.Art_type + '</td>' +
    //             '<td><input type="checkbox" name="delete[]" value="' + product.Barcode + '"></td>' +
    //             '</tr>';
    //           var barcodeExists = false;
    //           $('#mara-table tbody tr').each(function() {
    //             var row = $(this);
    //             var barcode = row.find('.barcode').text();
    //             if (product.Barcode === barcode) {
    //               barcodeExists = true;
    //               var quantity = parseInt(row.find('.quantity').text()) + 1;
    //               row.find('.quantity').text(quantity);
    //               return false;
    //             }
    //           });
    //           if (!barcodeExists) {
    //             $('#mara-table tbody').append(newRow);
    //           }
    //         }
    //         $('#barcode-search').val(null);
    //       },
    //       error: function(rs, e) {
    //         alert(e.text);
    //         // alert('Oops! something went wrong..');
    //       }
    //     });
    //   }

    

});


//Barcode
// $(document).ready(function() {
//     // Load data
//     function loadData() {
//         var searchText = $('#search-textbox').val(); // Lấy giá trị của textbox tìm kiếm
//         $.ajax({
//             type: 'GET',
//             url: 'barcode/data_mara/',
//             data: {
//                 search_text: searchText // Truyền tham số tìm kiếm vào request
//             },
//             dataType: 'json',
//             success: function(data) {
//                 // Xóa hết các dòng cũ trong bảng
//                 $('#product-table tbody').empty();
//                 // Thêm các dòng mới vào bảng
//                 for (var i = 0; i < data.length; i++) {
//                     var product = data[i];
//                     $('#product-table tbody').append('<tr>' +
//                         '<td id="name">' + product.MATNR + '</td>' +
//                         '<td id="category">' + product.EAN11 + '</td>' +
//                         '<td id="price">' + product.MTART + '</td>' +
//                         '<td><input type="checkbox" name="delete[]" value="' + product.id + '"></td>' +
//                     '</tr>');
//                 }
//             },
//             error: function(rs, e) {
//                 alert(e.text); //throw actual error, just for debugging purpose
//                 // alert(rs.responseText); //throw actual error, just for debugging purpose
//                 alert('Oops! something went worng..'); // alert user that something goes wrong
//              }
//         });
//     }
    
//     // Lắng nghe sự kiện khi người dùng nhập dữ liệu vào textbox
//     $('#search-textbox').on('keyup', function() {
//         loadData();
//     });
    
//     // Ban đầu, tải dữ liệu lên bảng
//     loadData();
// });
