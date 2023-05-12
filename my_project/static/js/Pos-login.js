
$(document).ready(function() {
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

  /* ======================================================================================================================== */
  /* ==============================================Order POS================================================================= */
  /* ======================================================================================================================== */

  // Show customer info form when table is clicked
const tableList = document.querySelectorAll('.left li a');
tableList.forEach(table => {
table.addEventListener('click', (event) => {
    event.preventDefault();
    const tableNumber = event.target.textContent;
    const orderList = document.querySelector('.order-list');
    orderList.innerHTML = '';
    const customerInfo = document.createElement('div');
    customerInfo.classList.add('customer-info');
    customerInfo.innerHTML = `
    <h2>Thông Tin Khách Hàng - Bàn ${tableNumber}</h2>
    <form>
    <label for="name">Tên Khách Hàng:</label>
    <input type="text" id="name" name="name" required>
    <label for="phone">Số Điện Thoại:</label>
                <input type="tel" id="phone" name="phone" required>

                <label for="address">Địa Chỉ:</label>
                <textarea id="address" name="address" required></textarea>

                <input type="submit" value="Đặt Món">
            </form>
        `;
        orderList.appendChild(customerInfo);
    });
});


// Add menu item to order list
const menuList = document.querySelectorAll('.menu li button');
const orderList = document.querySelector('.order-list ul');
menuList.forEach(menuItem => {
menuItem.addEventListener('click', () => {
const menuItemName = menuItem.parentElement.querySelector('h3').textContent;
const menuItemPrice = menuItem.parentElement.querySelector('p').textContent;
const orderItem = document.createElement('li');
orderItem.innerHTML = '${menuItemName} - ${menuItemPrice} <button class="remove-item">Xóa</button>';
orderList.appendChild(orderItem);
	// Remove item from order list
	const removeItemButtons = document.querySelectorAll('.remove-item');
	removeItemButtons.forEach(removeItemButton => {
		removeItemButton.addEventListener('click', () => {
			removeItemButton.parentElement.remove();
		});
	});
});
});


// Filter menu items by category
const categoryList = document.querySelectorAll('.category li a');
categoryList.forEach(category => {
    category.addEventListener('click', (event) => {
        event.preventDefault();
        const categoryName = event.target.textContent;
        const menuItems = document.querySelectorAll('.menu li');
        menuItems.forEach(menuItem => {
            if (menuItem.dataset.category === categoryName || categoryName === 'Tất Cả') {
                menuItem.style.display = 'block';
            } else {
                menuItem.style.display = 'none';
            }
        });
    });
});





// Lấy danh sách các món ăn đã chọn
const foods = JSON.parse(document.querySelector('#selected-food-list').getAttribute('data-foods'));

// Lấy nút "Thêm"
const addButton = document.getElementById('.add-food');

// Khi click vào nút "Thêm"
addButton.addEventListener('click', () => {
  // Lấy tên món ăn và giá tiền
  const foodName = prompt('Tên món ăn:');
  const foodPrice = parseFloat(prompt('Giá tiền:'));

  if (!foodName || !foodPrice || isNaN(foodPrice)) {
    alert('Vui lòng nhập đầy đủ thông tin và giá tiền là một số!');
    return;
  }

  // Kiểm tra xem món ăn đã được chọn trước đó chưa
  const foodIndex = foods.findIndex(food => food.name === foodName);
  if (foodIndex !== -1) {
    // Cập nhật số lượng và tính tổng giá tiền
    const food = foods[foodIndex];
    food.quantity++;
    food.totalPrice = foodPrice * food.quantity;
  } else {
    // Thêm món ăn vào danh sách
    foods.push({
      name: foodName,
      quantity: 1,
      price: foodPrice,
      totalPrice: foodPrice
    });
  }

  // Cập nhật danh sách các món ăn đã chọn
  const selectedFoodList = document.querySelector('#selected-food-list');
  selectedFoodList.setAttribute('data-foods', JSON.stringify(foods));

  // Hiển thị danh sách các món ăn đã chọn
  selectedFoodList.innerHTML = foods.map(food => `
    <li>
      <span>${food.name}</span>
      <span>Số lượng: ${food.quantity}</span>
      <span>Thành tiền: ${food.totalPrice}</span>
    </li>
  `).join('');
});

});

//Order POS
//up quantity Bill detail
    document.addEventListener('DOMContentLoaded', function() {
        // Lấy phần tử cha chứa các nút plus-invoice và note-invoice     
        const buttons_del_promotion = document.querySelector('.order-information-promotion');    
        buttons_del_promotion.addEventListener('click', function(event) {
          const target = event.target;
          if (target.classList.contains('del-promotion') || target.classList.contains('del-promotion-li')) {
            const promotion_item = target.closest('.order-information-promotion-item');
            var PromoID = promotion_item.getAttribute('value');
            const promotion_item_member = document.querySelector('.order-information-promotion-member-item');
            if(promotion_item_member){
              const promotion_item_member_value = promotion_item_member.getAttribute('value');
              var total_amount = document.querySelector('.total-amount-price').getAttribute('value');
              $.ajax({
                url: '/check-promotion-member/',
                method: 'POST',
                data: { 'PromotionID': promotion_item_member_value,
                        'PromotionValue': total_amount,
               },
                success: function(response) {
                  if (response.success) {   
                    var respone_discount_member =  Math.abs(parseInt(response.dataPromotion_Member));
                    if(respone_discount_member){
                      const discount_data = document.querySelector('.discount-value');
                      discount_data.textContent = (-respone_discount_member).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
                      discount_data.setAttribute('value', respone_discount_member);
                      promotion_item.remove();
                      calculate_total_payment();
                      $('.hr-invoice-promotion').addClass('hidden-promotion');
                    }
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
            else{
              if(PromoID){
                $.ajax({
                  url: '/check-promotion/',
                  method: 'POST',
                  data: { 'PromotionID': PromoID },
                  success: function(response) {
                    if (response.success) {   
                      var respone_discount =  Math.abs(parseInt(response.dataPromotion));
                      if(respone_discount > 0){
                        const discount_data = document.querySelector('.discount-value');
                        const discount_present = parseInt(discount_data.getAttribute('value'));
                        let discount_update = discount_present - respone_discount;
                        if(discount_update >= 0){
                          if(discount_update > 0){
                            discount_data.textContent = (-discount_update).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
                          }
                          else{
                            discount_data.textContent = discount_update.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
                          }
                          discount_data.setAttribute('value', discount_update);
                          promotion_item.remove();
                          calculate_total_payment();
                          $('.hr-invoice-promotion').addClass('hidden-promotion');
                        }
                       
                      }
            
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
            }
          } 
          else if(target.classList.contains('del-promotion-member') || target.classList.contains('del-promotion-memberli')){

          }

        });



        const orderItems = document.querySelector('.order-items');
        // Đăng ký sự kiện click cho phần tử cha
        orderItems.addEventListener('click', function(event) {
          // Kiểm tra xem phần tử được kích hoạt có phải là nút plus-invoice hoặc note-invoice hay không
          const target = event.target;
          if (target.classList.contains('plus-invoice') || target.classList.contains('plus-invoice-li')) {
            // // Lấy ra số lượng hiện tại
            // // const quantityElement = target.parentNode.parentNode.querySelector('.item-quantity p');
            // const quantityElement = target.closest('.order-item').querySelector('.item-quantity p');
            // const quantity = parseInt(quantityElement.textContent.trim().split(' ')[1]);
    
            // Lấy ra phần tử cha của nút plus-invoice để truy cập vào các phần tử con khác
            const orderItem = target.closest('.order-item');

            // Lấy ra số lượng hiện tại và giá của sản phẩm
            const quantityElement = orderItem.querySelector('.item-quantity p');
            const quantity = parseInt(quantityElement.textContent.trim().split(' ')[1]);
            const priceElement = orderItem.querySelector('.item-price p');
            // const price = parseInt(priceElement.textContent.trim().split(' ')[0].replace('.', ''));
            const price = parseInt(priceElement.textContent.trim().split(' ')[0].replace(/\./g, ''));
            const unit_price = price / quantity;

            // Tăng số lượng lên 1 và tính toán giá trị mới
            const newQuantity = quantity + 1;
            const newTotalPrice = (newQuantity * unit_price).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

            // Cập nhật số lượng và giá trị thành tiền lên giao diện
            quantityElement.textContent = `x ${newQuantity}`;
            // priceElement.textContent = `${price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})} x ${newQuantity}`;
            priceElement.textContent = newTotalPrice;
            // orderItem.querySelector('.item-total-price p').textContent = newTotalPrice;

            calculate_total_payment();

          } else if (target.classList.contains('note-invoice') || target.classList.contains('note-invoice-li')) {
            
            // Lấy ra element chứa note và hiển thị popup note
            let note = "";
            let noteElement = target.closest('.order-item').querySelector('.item-note'); 
            // let food_note = target.closest('.order-item').querySelector('.note-invoice [data-food-note]');         
            const IdElement = parseInt(target.closest('.order-item').querySelector('.item-id').textContent);          
            if (noteElement) {
              note = noteElement.textContent.trim().substring(0);
            }
            const orderItem = target.closest('.order-item');

            const modal = document.getElementById('note-modal');
            if (modal && !modal.classList.contains('modal-show')) {
              modal.classList.add('modal-show');
              // modal.setAttribute('id-product', IdElement);

              const noteInput = document.getElementById('note-input');
              if (note) {
                noteInput.value = note;
              }
              else {
                noteInput.value = "";
              }
            }

            const closeBtn = document.querySelector('.close');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('note-modal');
                if (modal) {
                  modal.classList.remove('modal-show');
                }
              });
            }

            window.addEventListener('click', (event) => {
              const modal = document.getElementById('note-modal');
              if (modal && event.target == modal) {
                modal.classList.remove('modal-show');
              }
            });

            const saveNoteBtn = document.getElementById('save-note-btn');
            if (saveNoteBtn) {
              const clickHandler = () => {
                const noteInput = document.getElementById('note-input');
                if (noteInput) {
                  // const newNote = '<sub>' + noteInput.value + '</sub>';
                  const newNote = noteInput.value;
                  // const updateNote = document.querySelectorAll('.item-note')[IdElement-1];
                  
                  var dataFood = document.getElementById("selected-food-list").getAttribute("data-foods");
                  var foodList = JSON.parse(dataFood);
                  for (var i = 0; i < foodList.length; i++) {
                    // So sánh giá trị id của phần tử hiện tại với giá trị mong muốn
                    if (foodList[i].id === IdElement) {
                      // Nếu tìm thấy phần tử có id bằng 4, cập nhật thông tin của phần tử đó
                      foodList[i].foodNote = newNote;
                    }
                  }
                  // foodList[IdElement-1].foodNote = newNote;
                  var updatedDataFood = JSON.stringify(foodList);
                  document.getElementById("selected-food-list").setAttribute("data-foods", updatedDataFood);
                  
                  noteElement.innerHTML = newNote;

                  const modal = document.getElementById('note-modal');
                  if (modal) {
                    modal.classList.remove('modal-show');
                  }
                  // Gỡ bỏ sự kiện click để tránh đăng ký nhiều lần
                  saveNoteBtn.removeEventListener('click', clickHandler);
                }
              };
              // Đăng ký sự kiện click
              saveNoteBtn.addEventListener('click', clickHandler);
            }       

            // // Hiển thị popup nhập ghi chú sử dụng SweetAlert
            // Swal.fire({
            //   title: 'Ghi chú',
            //   input: 'text',
            //   inputValue: note,
            //   showCancelButton: true,
            //   confirmButtonText: 'Lưu',
            //   cancelButtonText: 'Hủy'
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     // Cập nhật ghi chú mới vào element chứa note
            //     const newNote = result.value ? `<sub>${result.value}</sub>` : '';
            //     noteElement.innerHTML = newNote;
            //   }
            // });
          }
          else if (target.classList.contains('del-invoice') || target.classList.contains('del-invoice-li')) {
            // orderItems.innerHTML = '';
            // let dataFoods  = target.closest('.order-item').querySelector('.item-note');
            var dataFood = document.getElementById("selected-food-list").getAttribute("data-foods");
            var foodList = JSON.parse(dataFood);         
            const IdElement = parseInt(target.closest('.order-item').querySelector('.item-id').textContent);
            foodList = foodList.filter(function(item) {
              return item.id !== IdElement;
            });
            var updatedDataFood = JSON.stringify(foodList);
            document.getElementById("selected-food-list").setAttribute("data-foods", updatedDataFood);
            const button = event.target;
            const orderItem = button.closest('.order-item');
            if (orderItem) {
              // Xử lý với phần tử order-item
              // console.log(orderItem);
              orderItem.remove();
              calculate_total_payment();
              if(updatedDataFood.length <= 2){
                orderItems.insertAdjacentHTML('beforeend', '<p class="text-invoice">Chưa có sản phẩm</p>');
              }
            }
            // check_promotion();
            check_promotion_del();
          }
          // else if (target.classList.contains('img-invoice')) {
          //   alert("abc");
          // }
        });
      });

    
      // Lấy nút "Thêm"
      const addButtons = document.querySelectorAll('.add-food');
      let counter = 0;
      // const foodNotes = [];

      // Khi click vào nút "Thêm"
      addButtons.forEach(addButton => {
        addButton.addEventListener('click', event => {
          // Lấy tên món ăn và giá tiền
          let FoodList = document.querySelector('#selected-food-list');
          let foods = JSON.parse(FoodList.getAttribute('data-foods'));

          const foodName = addButton.parentElement.querySelector('.food-name').textContent;
          const foodPrice = parseFloat(addButton.parentElement.querySelector('.food-price').getAttribute('value'));

          const foodItem = event.target.closest('li');
          const imgInvoice = foodItem.querySelector('.food-img');        
          // const foodNote = foodNotes[counter];

          if (!foodName || !foodPrice || isNaN(foodPrice)) {
            alert('Sản phẩm chưa đủ thông tin!!');
            return;
          }
          let foodImage = imgInvoice ? imgInvoice.getAttribute('src') : '';
          // let food_note = addButton.getAttribute('data-food-note');

          const foodIndex = foods.findIndex(food => food.name === foodName);
          if (foodIndex !== -1) {
            //Cập nhật số lượng và tính tổng giá tiền
            let food_quantity = parseInt(document.querySelectorAll('.item-quantity p')[foodIndex].textContent.trim().split(' ')[1]);
            let food_note = document.querySelectorAll('.item-note')[foodIndex].textContent.trim().substring(0);
            const food = foods[foodIndex];
            food.quantity = food_quantity + 1;
            food.totalPrice = foodPrice * food.quantity;
            foodImage = foodImage;
            if(food_note){
              food.foodNote = food_note;
            }
            else{
              food.foodNote = "";
            }     
            FoodList.setAttribute('data-foods', JSON.stringify(foods));
            // addButton.removeEventListener('click', event);
          } else {
            counter++;
            foods.push({
              id: counter,
              name: foodName,
              quantity: 1,
              price: foodPrice,
              totalPrice: foodPrice,
              foodImage:foodImage,     
              // foodNote: foodNote || "",
              foodNote: "",
            });     
            FoodList.setAttribute('data-foods', JSON.stringify(foods));
          }       
          
          const selectedFoodList = document.querySelector('#order-items');
          selectedFoodList.setAttribute('data-food', JSON.stringify(foods));

          // Hiển thị danh sách các món ăn đã chọn
          selectedFoodList.innerHTML = foods.map(food => 
            `<div class="order-item">
              <div class="item-id">
                <p>${food.id}</p>
              </div>
              <div class="item-image">
                <img class="img-invoice" src="${food.foodImage}" alt="Product image">
              </div>
              <div class="item-info">
                <div class="item-quantity">
                  <p>x ${food.quantity}</p>
                </div>
                <div class="item-name">
                  <p class="item-title">${food.name}</p>
                 <p class="item-note">${food.foodNote}</p>                     
                </div>
               
                <div class="item-price">
                  <p>${food.totalPrice.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</p>
                </div>
                <div class="item-upquantity">
                  <button class="plus-invoice"><i class="ti-plus plus-invoice-li"></i></button>
                </div>
                <div class="item-delquantity">
                  <button class="del-invoice"><i class="ti-trash del-invoice-li"></i></button>
                </div>
                <div class="item-note-btn">
                  <button class="note-invoice add-note-btn" id="add-note-btn"><i class="ti-notepad note-invoice-li"></i></button>
                </div>
              </div>
            </div>`
          ).join('');

          calculate_total_payment();
          addButton.removeEventListener('click', event);
        });      
      });


//calculate total amount and total payment
function calculate_total_payment(){
  const item = document.querySelectorAll('.item-price');
  const totalPrices = document.querySelector('.total-amount-price');
  const payment = document.querySelector('.payment-value');

  let foodPriceTotal = 0;  
  item.forEach(price => {
    // foodPriceTotal += parseInt(price.textContent.trim().replace('.', '').replace(' đ', ''));
    foodPriceTotal += parseInt(price.textContent.trim().replace(' đ', '').replace(/\./g, ''));  
  });
  totalPrices.textContent = foodPriceTotal.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
  totalPrices.setAttribute('value', foodPriceTotal);

  const discount = document.querySelector('.discount-value');
  let discountTotal = 0;
  let discount_Total = 0;
  discount_Total += parseInt(discount.textContent.trim().replace(' đ', '').replace(/\./g, ''));
  discountTotal = Math.abs(discount_Total);

  let total_payment = foodPriceTotal - discountTotal; 
  if(total_payment > 0){
    if (discountTotal > 0){
      payment.textContent = total_payment.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
      payment.setAttribute('value', total_payment);
    }    
    else{
      payment.textContent = foodPriceTotal.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
      payment.setAttribute('value', foodPriceTotal);
    }
  }
  else{
    var dis = 0;
    discount.textContent = dis.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});  
    discount.setAttribute('value',dis);
  }
  
}


 //search material
const searchInput = document.querySelector('#SearchMaterial');
const foodList = document.querySelector('#food-list');

searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();
  const allFoodItems = foodList.querySelectorAll('li');
  
  allFoodItems.forEach(item => {
    const foodName = item.querySelector('.food-name').textContent.toLowerCase();
    const foodPrice = item.querySelector('.food-price').textContent.toLowerCase();
    
    if (foodName.includes(searchTerm) || foodPrice.includes(searchTerm)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
});


//Search Group Product
// Lấy danh sách các nút danh mục
const categoryButtons = document.querySelectorAll('#category-list li');

// Lấy danh sách các món ăn
const foodItems = document.querySelectorAll('#food-list li');

// Lặp qua danh sách các nút danh mục và thêm sự kiện click cho mỗi nút
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Lấy giá trị của nút danh mục được chọn
    const category_text = button.textContent.trim();
    const category_value = button.value;

    // Lặp qua danh sách các món ăn và ẩn những món ăn không thuộc danh mục được chọn
    foodItems.forEach(item => {
      const foodCategory = parseInt(item.querySelector('.food-group').getAttribute('value').trim());
      // const foodCategory = item.querySelector('.food-group').getAttribute('value');
      if (category_text === 'Tất cả' || category_value === foodCategory) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});


//Modal promotion
let ProID = 0;
let ProName = "";
function check_promotion(promotionID, promotionName){
  // var PromotionID = document.querySelector('.promotion-name').getAttribute('data-promotion');
  var PromotionID = promotionID;
  var PromotionName = promotionName;
  var PaymentValue = document.querySelector('.payment-value').getAttribute('value');
  var TotalAmount = document.querySelector('.total-amount-price').getAttribute('value');
  
  if(PaymentValue > 0 ){
    $.ajax({
      url: '/check-promotion/',
      method: 'POST',
      data: { 'PromotionID': PromotionID },
      success: function(response) {
        if (response.success) {   
          var respone_value =  Math.abs(parseInt(response.dataPromotion));
          if(respone_value > 0){
            let promo_member = document.querySelector('.order-information-promotion-member-item');
            if(promo_member){

              let promo_member_ID = promo_member.getAttribute('value');
              $.ajax({
                url: '/check-promotion-member/',
                method: 'POST',
                data: { 'PromotionID': promo_member_ID,
                        'PromotionValue': TotalAmount,
               },
                success: function(response) {
                  if (response.success) {   
                    var respone_value_member =  Math.abs(parseInt(response.dataPromotion_Member));                    
                    if(respone_value_member > 0){
                      var promotion_value_final = respone_value_member + respone_value;
                      if(TotalAmount > promotion_value_final){
                        var discount_promotion = document.querySelector('.discount-value');    
                        let discount =  parseInt(-promotion_value_final).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
                        discount_promotion.textContent = discount;
                        // discount_promotion.value = promotion_value_final;
                        discount_promotion.setAttribute('value', promotion_value_final);
                        add_promotion_title(PromotionName,PromotionID);
                        calculate_total_payment();
                        $('#promotion-modal').removeClass('modal-show'); 
                        // ProID = PromotionID;
                        
                      }
                      else{
                        calculate_total_payment();
                        remove_promotion_title(ProName);
                        Swal.fire({
                          icon: 'error',
                          title: 'Thông báo lỗi',
                          text: 'Số tiền thanh toán phải lớn hơn khuyển mãi/giảm giá.',
                        })
                      }
                    }
          
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
            else{
              if(TotalAmount > respone_value){
                var discount_promotion = document.querySelector('.discount-value');    
                let discount =  parseInt(response.dataPromotion).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
                discount_promotion.textContent = discount;
                discount_promotion.setAttribute('value', respone_value);
                calculate_total_payment();
                add_promotion_title(PromotionName,PromotionID);
                $('#promotion-modal').removeClass('modal-show'); 
                ProID = PromotionID;
                ProName = promotionName;
  
  
                // if(respone_value > 0){
                  // var discount_promotion = document.querySelector('.discount-value');
                  // var discount_present = parseInt(discount_promotion.getAttribute('value'));
                  // var discount_update = discount_present + respone_value;
                  // if(TotalAmount > discount_update){                
                  //   let discount =  (-discount_update).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
                  //   discount_promotion.textContent = discount;
                  //   discount_promotion.setAttribute('value', discount_update);
                  //   calculate_total_payment();
                  //   add_promotion_title(PromotionName,PromotionID);
                  //   $('#promotion-modal').removeClass('modal-show'); 
                  //   ProID = PromotionID;
                  //   ProName = promotionName;
                //   }
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: 'Thông báo lỗi',
                  text: 'Số tiền thanh toán phải lớn hơn khuyển mãi/giảm giá.',
                })
              }
            }
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Thông báo lỗi',
              text: 'Số tiền khuyến mãi phải lớn hơn 0.',
            })
          }

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
  else{
    Swal.fire({
      icon: 'error',
      title: 'Thông báo lỗi',
      text: 'Số tiền thanh toán phải lớn hơn 0.',
    })
  }
}

function check_promotion_del(){
  var PromotionID = document.querySelector('.order-information-promotion-item').getAttribute('value');
  var PromotionName = document.querySelector('.order-information-promotion-item').textContent;
  // var PromotionID = ProID;
  var PaymentValue = document.querySelector('.payment-value').getAttribute('value');
  var TotalAmount = document.querySelector('.total-amount-price').getAttribute('value');
  if(PaymentValue > 0 ){
    $.ajax({
      url: '/check-promotion/',
      method: 'POST',
      data: { 'PromotionID': PromotionID },
      success: function(response) {
        if (response.success) {   
          var respone_value =  Math.abs(parseInt(response.dataPromotion));
          if(respone_value > 0){
            if(TotalAmount > respone_value){
              var discount_promotion = document.querySelector('.discount-value');    
              let discount =  parseInt(response.dataPromotion).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
              discount_promotion.textContent = discount;
              discount_promotion.value = respone_value;
              calculate_total_payment();
              // $('#promotion-modal').removeClass('modal-show'); 
              ProID = PromotionID;
              
            }
            else{
              calculate_total_payment();
              remove_promotion_title(ProName);
              Swal.fire({
                icon: 'error',
                title: 'Thông báo lỗi',
                text: 'Số tiền thanh toán phải lớn hơn khuyển mãi/giảm giá.',
              })
            }
          }

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
  else{
    Swal.fire({
      icon: 'error',
      title: 'Thông báo lỗi',
      text: 'Số tiền thanh toán phải lớn hơn 0.',
    })
  }
}

// function check_promotion_del(){
//   var PromotionID = document.querySelector('.order-information-promotion-item').getAttribute('value');
//   // var PromotionID = ProID;
//   var PaymentValue = document.querySelector('.payment-value').getAttribute('value');
//   var TotalAmount = document.querySelector('.total-amount-price').getAttribute('value');
//   if(PaymentValue > 0 ){
//     $.ajax({
//       url: '/check-promotion/',
//       method: 'POST',
//       data: { 'PromotionID': PromotionID },
//       success: function(response) {
//         if (response.success) {   
//           var respone_value =  Math.abs(parseInt(response.dataPromotion));
//           if(respone_value > 0){
//             if(TotalAmount > respone_value){
//               var discount_promotion = document.querySelector('.discount-value');    
//               let discount =  parseInt(response.dataPromotion).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
//               discount_promotion.textContent = discount;
//               discount_promotion.value = respone_value;
//               calculate_total_payment();
//               // $('#promotion-modal').removeClass('modal-show'); 
//               ProID = PromotionID;
              
//             }
//             else{
//               calculate_total_payment();
//               remove_promotion_title(ProName);
//               Swal.fire({
//                 icon: 'error',
//                 title: 'Thông báo lỗi',
//                 text: 'Số tiền thanh toán phải lớn hơn khuyển mãi/giảm giá.',
//               })
//             }
//           }

//         } else {
//           Swal.fire({
//               icon: 'error',
//               title: 'Oops...',
//               text: response.error,
//             })
//         }
//       },
//       error: function(response) {
//           Swal.fire({
//               icon: 'error',
//               title: 'Oops...',
//               text: response.error,
//             })
//       }
//     });
//   }
//   else{
//     Swal.fire({
//       icon: 'error',
//       title: 'Thông báo lỗi',
//       text: 'Số tiền thanh toán phải lớn hơn 0.',
//     })
//   }
// }

$(document).on('click', '#save-promotion-btn', function(event) {
  // check_promotion();
  var promotionID = $(this).prev('.promotion-name').attr('data-promotion');
  var promotionName = $(this).prev('.promotion-name').text();
  check_promotion(promotionID,promotionName);
});

$('.close-promotion').click(function(event) {
  $('#promotion-modal').removeClass('modal-show');
});      
$('.btn-promotion-button').click(function(event) {
  $('#promotion-modal').addClass('modal-show');
}); 


function add_promotion_title(PromotionName, PromotionID){
  // let order_information_promotion = document.querySelector('.order-information-promotion');
  let order_information_promotion = document.querySelector('.order-information-promotion-items');
  order_information_promotion.innerHTML = 
  '<div class="order-information-promotion-item" value="'+PromotionID+'">' +
    '<p>'+PromotionName+'</p>' +
    '<button type="button" class="del-promotion"><i class="ti-close del-promotion-li"></i></button>' +
  '</div>';
  $('.order-information-promotion').removeClass('hidden-promotion');
  $('.hr-invoice-promotion').removeClass('hidden-promotion');
}

function remove_promotion_title(PromotionName){
  const promotions = document.querySelectorAll('.order-information-promotion-item');
  promotions.forEach(promotion => {
    if (promotion.querySelector('p').textContent === PromotionName) {
      promotion.remove();
      $('.order-information-promotion').addClass('hidden-promotion');
      $('.hr-invoice-promotion').addClass('hidden-promotion');
    }
  });
}

function check_promotion_member(PromotionID, PromotionValue){
  
}

// document.addEventListener('DOMContentLoaded', function() {
//   const buttons_del_promotion = document.querySelectorAll('.del-promotion');
//   buttons_del_promotion.forEach(button => {
//     button.addEventListener('click', () => {
//       buttons_del_promotion.forEach(item => {
//         const promotion_item = parseInt(item.querySelector('.order-information-promotion-item'));
//         var a = 0;
//       });
//     });
//   });
// });


 //search material
 const searchpromotion = document.querySelector('#promotion-input');
 const promotionList = document.querySelector('.promotion-list');
 
 searchpromotion.addEventListener('input', function() {
   const searchTerm = searchpromotion.value.toLowerCase();
   const allPromotionItems = promotionList.querySelectorAll('.promotion-item');
   
   allPromotionItems.forEach(item => {
     const PromotionName = item.querySelector('.promotion-name').textContent.toLowerCase();
     
     if (PromotionName.includes(searchTerm)) {
       item.style.display = 'flex';
     } else {
       item.style.display = 'none';
     }
   });
 });
 


//  document.addEventListener('DOMContentLoaded', () => {
//   // Lấy tất cả các div có class là "order-item"
//   const orderItems = document.querySelectorAll('.order-item');

//   // Lặp qua từng order-item và thêm sự kiện double click
//   orderItems.forEach(orderItem => {
//     orderItem.addEventListener('dblclick', () => {
//       // Xử lý sự kiện double click ở đây
//       console.log('Double clicked on order item!');
//       console.log('Item name:', orderItem.querySelector('.item-name .item-title').textContent);
//     });
//   });
// });


//Function order type
// const buttons = document.querySelectorAll('.btn-order-type');

// buttons.forEach(button => {
//   button.addEventListener('click', function() {
//     // Bỏ đi class 'active' của tất cả các button
//     buttons.forEach(btn => btn.classList.remove('active'));

//     // Thêm class 'active' vào button được click
//     this.classList.add('active');
//   });
// });

const buttons = document.querySelectorAll('.btn-order-type');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(button => {
      button.classList.remove('active');
    });
    button.classList.add('active');
    // const color = window.getComputedStyle(button).getPropertyValue('background-color');
    // document.documentElement.style.setProperty('--button-active-color', color);
    const color = window.getComputedStyle(button).getPropertyValue('background-color');
    const lightColor = tinycolor.mix(color, 'white', 40).toHexString();
    document.documentElement.style.setProperty('--button-active-color', lightColor);
  });
});



//Clock time function
function updateTime() {
  const now = new Date();
  const options_day = { 
    timeZone: 'Asia/Ho_Chi_Minh', 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour12: false 
  };
  const options_time = { 
    timeZone: 'Asia/Ho_Chi_Minh', 
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false 
  };
  const date = now.toLocaleDateString('en-US', options_day);
  const time = now.toLocaleTimeString('en-US', options_time);

  document.querySelector('.date').textContent = date;
  document.querySelector('.time').textContent = time;
}

setInterval(updateTime, 1000);
