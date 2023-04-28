
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
                window.location.href = "/login-pos-check/";
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