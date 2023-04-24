from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.views.generic import ProtectedResourceView

from django.core.paginator import Paginator
from django.db.models import Count
from .models import T001, Product, Category, Users

from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.urls import reverse
from urllib.parse import urlencode

from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import login
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

import datetime
import json
import adal
import requests
import msal


# Create your views here.
def Admin(request):
    #load template in folder teamplates
    template =  loader.get_template('Master_page.html')
    return HttpResponse(template.render())

def Home(request):
    #load template in folder teamplates
    template =  loader.get_template('Home_Admin.html')
    return HttpResponse(template.render())

def Page_data(request):
    #load template in folder teamplates
    data =  T001.objects.using('default').all()
    return render(request, 'Page_data.html', {'data': data})

#function Product
def Product_data(request):
    #load template in folder teamplates
    # data =  Product.objects.all().select_related('category')
    # data =  Product.objects.prefetch_related('id_cate').filter(price__gte=20000, price__lte=1000000)
    SearchMaterial = request.GET.get('SearchMaterial')
    SearchCategory = request.GET.get('SearchCategory')
    # if SearchMaterial != "" or SearchMaterial != None or SearchCategory != "" or SearchCategory != None:
    if (SearchMaterial is not None and SearchMaterial != "" ) and (SearchCategory is not None and SearchCategory != ""):
        data = Product.objects.prefetch_related('id_cate').filter(name__icontains=SearchMaterial,category__icontains=SearchCategory)
    elif (SearchMaterial is not None and SearchMaterial != "" ):
        data = Product.objects.prefetch_related('id_cate').filter(name__icontains=SearchMaterial)
    elif (SearchCategory is not None and SearchCategory != ""):
        data = Product.objects.prefetch_related('id_cate').filter(category__icontains=SearchCategory)
    else:
        data =  Product.objects.prefetch_related('id_cate')
    combobox = Category.objects.using('default').all()
    paginator = Paginator(data, 4)  # hiển thị 10 đối tượng trên mỗi trang
    page_number = request.GET.get('page') # get current page - default page 1
    page_obj = paginator.get_page(page_number)

    return render(request, 'Product.html',  {'page_obj': page_obj, 'combobox': combobox})

def load_data(request):
    userinfo = request.session.get('UserInfo')
    if userinfo:
        #load template in folder teamplates
        products = Product.objects.prefetch_related('id_cate').order_by('-id')
        list = [{'id': p.id, 'name': p.name, 'category': p.category, 'price': int(p.price), 'id_cate': p.id_cate.pk} for p in products]
        data = json.dumps(list, ensure_ascii=False)
        userinfo = request.session.get('UserInfo')
        return HttpResponse(data, content_type='application/json')
    else:
        return redirect('/login/')
    # return JsonResponse({'json_data': json_data})
    # json_data = json.dumps(list, ensure_ascii=False)
    # template = loader.get_template('ajax.html')
    # context = {'list': list}
    # data = template.render(context, request)

def load_Product(request):
    cookie_microsoft_data  = GetCookie(request, 'cookie_microsoft_data')
    cookie_facebook_data   = GetCookie(request, 'cookie_facebook_data')
    cookie_google_data     = GetCookie(request, 'cookie_google_data')
    if(cookie_microsoft_data or cookie_google_data or cookie_facebook_data):
        return render(request, 'ajax.html')
    else:
        return redirect('/login/')

@csrf_exempt
def delete_Product(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return JsonResponse({'success': True})
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'ID ' + product_id +' does not exist'})
    else:
        return JsonResponse({'success': False, 'message': 'Yêu cầu không hợp lệ'})

@csrf_exempt
def add_product(request):
    if request.method == 'POST':
        # print(request.POST)
        # data = json.loads(request.data)
        name = request.POST.get('name')
        id_cate = request.POST.get('category')
        price = request.POST.get('price')
        category = Category.objects.get(pk=id_cate)

        # name = data['name']
        # id_cate = data['category']
        # category = Category.objects.get(pk=id_cate)
        # price = data['price']
        product = Product.objects.create(name=name, id_cate=category, category=category.name, price=price)
        product.save()
        # return JsonResponse(response, status=201)
        return JsonResponse({
                'success': True,
                'message': 'Product added successfully!',
                'name': name,
                'category': category.name,
                'price': price
            })
    else:
        response = {'success': False, 'message': 'Invalid request method'}
        # return JsonResponse(response, status=405)
        return JsonResponse({
            'success': False,
            'message': 'Invalid request method'
            })

def Data_Category(request):
      data =  Category.objects.using('default').all()
      List = [{'id': c.id, 'category': c.name} for c in data]
      cate = json.dumps(List, ensure_ascii=False)
      return HttpResponse(cate, content_type='application/json')

@csrf_exempt
def Data_Update_Product(request):
       if request.method == 'POST':
        id = request.POST.get('id_product')
        product = Product.objects.prefetch_related('id_cate').filter(id = id)
        list = [{'id': p.id, 'name': p.name, 'category': p.category, 'price': int(p.price), 'id_cate': p.id_cate.pk} for p in product]
        data = json.dumps(list, ensure_ascii=False)
        return HttpResponse(data, content_type='application/json')

@csrf_exempt
def update_product(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        name = request.POST.get('name')
        category_id = request.POST.get('category')
        price = request.POST.get('price')

        # Cập nhật đối tượng Product trong CSDL
        product = Product.objects.get(id=id)
        categrogy = Category.objects.get(id=category_id)
        product.name = name
        product.id_cate = categrogy
        product.category = categrogy.name
        product.price = price
        product.save()
        # list = [{
        #     'success': True,
        #     'message': 'Product updated successfully!',
        #     'id': p.id,
        #     'name': p.name,
        #     'category': p.category,
        #     'price': int(p.price),
        #     'id_cate': p.id_cate.pk} for p in product]
        # data = json.dumps(list, ensure_ascii=False)
        # return HttpResponse(data, content_type='application/json')
        return JsonResponse({
            'success': True,
            'message': 'Product updated successfully!',
            'id': product.id,
            'name': product.name,
            'category': product.category,
            'price': int(product.price),
            'id_cate': product.id_cate.pk
            })

    else:
        return JsonResponse({
            'success': False,
            'message': 'Invalid request method'
            })
#function Product


#function Login
# Page Login account office 365
def microsoft_login_token(request):
    code = request.GET.get('code')

    if code is None:
        # Redirect to the Microsoft login page
        url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        params = {
            'client_id': '5c17ff26-50a1-4003-bc31-f0545709c2f7',
            'response_type': 'code',
            'redirect_uri': 'https://localhost:8000/login/callback/',
            'scope': 'https://graph.microsoft.com/.default',
        }
        auth_url = url + '?' + urlencode(params)
        return redirect(auth_url)

    # Exchange the authorization code for an access token and a refresh token
    token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://localhost:8000/login/callback/',
        'client_id': '5c17ff26-50a1-4003-bc31-f0545709c2f7',
        'client_secret': 'EeJ8Q~ip-6TA~p1C7Y9t24l81qig0lFv1t5CPdwO',
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    response = requests.post(token_url, data=data, headers=headers)
    response_data = response.json()

    # Save the access token and refresh token in the session
    access_token = response_data['access_token']
    request.session['access_token'] = access_token
    if 'refresh_token' in response_data:
        refresh_token = response_data['refresh_token']
        request.session['refresh_token'] = refresh_token
    else:
        refresh_token = None  # or handle the error in some other way


    # Use the access token to get the user's profile
    user_url = 'https://graph.microsoft.com/v1.0/me'
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Accept': 'application/json',
    }
    response = requests.get(user_url, headers=headers)
    response_data = response.json()
    #get avatar
    photo_data = response_data.get('photo', {})
    photo_url = ''
    if 'small' in   photo_data:
        photo_url = photo_data['small']
    elif 'large' in photo_data:
            photo_url = photo_data['large']

    #check user exit
    email = response_data.get('mail')
    exit_IDuser = Users.objects.filter(Mail = email)
    if(exit_IDuser):
        for user in exit_IDuser:
            # Cậẻp nhật các thuộc tính của User
            user.Mail = email
            user.FullName = response_data.get('surname') + " " + response_data.get('givenName')
            user.displayName = response_data.get('displayName')
            if(response_data.get('jobTitle')):
                user.Jobtitle = response_data.get('jobTitle')
            if(response_data.get('mobilePhone')):
                user.Phone = response_data.get('mobilePhone')
            user.Avatar = photo_url

            user.save()
    else:
        #check data ID User -get new ID
        UserID = Check_IDUser()
        # Insert dữ liệu vào cơ sở dữ liệu
        user = Users(
            ID_user     =UserID,
            Mail        =email,
            Password    ='',
            FullName    =response_data.get('surname') + " " + response_data.get('givenName'),
            displayName =response_data.get('displayName'),
            Birthday    = datetime.date(1990, 1, 1),  # Chưa có thông tin về ngày sinh trong Microsoft Graph API
            Acc_Type    ='Microsoft',
            Address     ='',
            Jobtitle    =response_data.get('jobTitle') if response_data.get('jobTitle') else "",
            Phone       =response_data.get('mobilePhone') if response_data.get('jobTitle') else 0,
            Avatar      =photo_url,
            User_Status =True  #User_Status là True khi mới đăng ký
        )
        user.save()


    # Lưu dữ liệu vào session
    request.session['UserInfo'] = {
        'ID_user': user.ID_user,
        'Mail': user.Mail,
        'FullName': user.FullName,
        'displayName': user.displayName,
        'Avatar': user.Avatar,
        'Photo': user.displayName[0] +user.FullName[0],
    }

    # Save the user's profile in a cookie
   # Chuyển đổi session data thành chuỗi JSON
    session_data = json.dumps(request.session['UserInfo'])

    # Lưu chuỗi JSON vào cookie
     # Lưu access_token vào cookie (lưu ý: cần kiểm tra tính bảo mật của cookie)
    url_redirect = '/danh-sach-test/'
    response = SetCookie(response , 'cookie_microsoft_data', session_data, url_redirect)
    response = DeleteCookie(response , 'cookie_google_data')
    response = DeleteCookie(response , 'cookie_facebook_data')  
    return response

#Login account google
def google_login(request):
    # Lấy mã truy cập từ Google
    code = request.GET.get('code', None)
    if code:
        # Gửi yêu cầu lấy mã truy cập
        client_id = settings.GOOGLE_OAUTH2_CLIENT_ID
        client_secret = settings.GOOGLE_OAUTH2_CLIENT_SECRET
        # redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
        redirect_uri = request.build_absolute_uri('/google/callback/') # URL callback
        url = 'https://accounts.google.com/o/oauth2/token'
        data = {
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }
        response = requests.post(url, data=data)
        if response.status_code == 200:
            # Lưu thông tin người dùng vào session và cookie
            json_data = response.json()
            access_token = json_data['access_token']

            # Lấy thông tin người dùng từ Google API
            user_info = get_user_info_google(access_token)  # Hàm lấy thông tin người dùng từ Google API
            email = user_info.get("email")
            User_exit =  check_User_exit(email)
            if(User_exit):
                 for user in User_exit:
                    if(user.User_Status == True):
                          # Cập nhật các thuộc tính của User
                        user.Mail = email
                        user.FullName = user_info.get('family_name') + " " + user_info.get('given_name')
                        user.displayName = user_info.get('displayName')
                        if(user_info.get('jobtitle')):
                            user.Jobtitle = user_info.get('jobtitle')
                        if(user_info.get('phone')):
                            user.Phone = user_info.get('phone')
                        user.Avatar = user_info.get('picture')
                        user.save()
                    else:
                        return HttpResponseRedirect('/login/')
            else:
                #check data ID User -get new ID
                UserID = Check_IDUser()
                # Insert dữ liệu vào cơ sở dữ liệu
                user = Users(
                    ID_user     = UserID,
                    Mail        = email,
                    Password    = '',
                    FullName    = user_info.get('family_name') + " " + user_info.get('given_name'),
                    displayName = user_info.get('displayName'),
                    Birthday    = user_info.get('birthday') if user_info.get('birthday') else datetime.date(1990, 1, 1),
                    Acc_Type    ='Google',
                    Address     ='',
                    Jobtitle    = user_info.get('jobtitle') if user_info.get('jobtitle') else "",
                    Phone       = user_info.get('phone') if user_info.get('phone') else 0,
                    Avatar      = user_info.get('picture'),
                    User_Status =True  #User_Status là True khi mới đăng ký
                )
                user.save()

            # Lưu dữ liệu vào session
            request.session['UserInfo'] = {
                'ID_user': user.ID_user,
                'Mail': user.Mail,
                'FullName': user.FullName,
                'displayName': user.displayName,
                'Avatar': user.Avatar,
                'Photo': user.displayName[0] +user.FullName[0],
            }

            # Lưu access_token vào session
            request.session['access_token'] = access_token
            session_data = json.dumps(request.session['UserInfo'])
    
            # Lưu access_token vào cookie (lưu ý: cần kiểm tra tính bảo mật của cookie)
            url_redirect = '/danh-sach-test/'
            # response = SetCookie(response , 'cookie_google_token', access_token, url_redirect)
            response = SetCookie(response , 'cookie_google_data', session_data, url_redirect)
            response = DeleteCookie(response , 'cookie_microsoft_data')
            response = DeleteCookie(response , 'cookie_facebook_data')
            return response
        else:
            return HttpResponseRedirect('/login/')
            # pass
    else:
        return HttpResponseRedirect('/login/')
        # pass

#Function login by facebook
@csrf_exempt
def facebook_login(request):
   # Lấy thông tin token từ request
    access_token = request.GET.get('access_token')

    # Gọi API Facebook để lấy thông tin người dùng
    response = requests.get(f'https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token={access_token}')
    data = response.json()

    # Kiểm tra thông tin người dùng có hợp lệ không
    if 'email' not in data:
        return redirect('/login/')

    # Tìm hoặc tạo tài khoản người dùng
    user = authenticate(request, email=data['email'])
    if user is None:
        user = Users.objects.create_user(username=data['email'], email=data['email'], password=Users.objects.make_random_password())

    # Đăng nhập và tạo session cho người dùng
    login(request, user)
    return redirect('/')


def Login_page(request):
    cookie_microsoft_data  = GetCookie(request, 'cookie_microsoft_data')
    cookie_facebook_data   = GetCookie(request, 'cookie_facebook_data')
    cookie_google_data     = GetCookie(request, 'cookie_google_data')
    if(cookie_microsoft_data):
        response_data = json.loads(cookie_microsoft_data)
        # Lưu dữ liệu vào session
        request.session['UserInfo'] = {
            'ID_user': response_data.get('ID_user'),
            'Mail': response_data.get('Mail'),
            'FullName': response_data.get('FullName'),
            'displayName': response_data.get('displayName'),
            'Avatar': response_data.get('Avatar'),
            'Photo': response_data.get('displayName')[0] + response_data.get('FullName')[0],
        }
        return redirect('/danh-sach-test/')
    elif(cookie_google_data):
        response_data = json.loads(cookie_google_data)
        # Truy cập các giá trị trong response_data
        request.session['UserInfo'] = {
            'ID_user': response_data.get('ID_user'),
            'Mail': response_data.get('Mail'),
            'FullName': response_data.get('FullName'),
            'displayName': response_data.get('displayName'),
            'Avatar': response_data.get('Avatar'),
            'Photo': response_data.get('displayName')[0] + response_data.get('FullName')[0],
        }
        return redirect('/danh-sach-test/')
    elif(cookie_facebook_data):
        response_data = json.loads(cookie_facebook_data)
        request.session['UserInfo'] = {
            'ID_user': response_data.get('ID_user'),
            'Mail': response_data.get('Mail'),
            'FullName': response_data.get('FullName'),
            'displayName': response_data.get('displayName'),
            'Avatar': response_data.get('Avatar'),
            'Photo': response_data.get('displayName')[0] + response_data.get('FullName')[0],
        }
        return redirect('/danh-sach-test/')
    else:
        #load template in folder teamplates
        template =  loader.get_template('Login.html')
        return HttpResponse(template.render())
#function Login

#function check
def logout(request):
    # Xóa cookie 'user_microsoft'
    response = HttpResponseRedirect('/login/')  # Chuyển hướng đến trang home (có thể thay đổi tên view tương ứng)
    response.delete_cookie('cookie_microsoft_data')
    response.delete_cookie('cookie_facebook_data')
    response.delete_cookie('cookie_google_data')
    request.session.flush()
    return response

def Check_IDUser():
     User_data =  Users.objects.using('default').all()
     if(User_data):
         count = User_data.count()
         if count > 0:
             last_user = User_data[count - 1]
             id = last_user.ID_user
             UserID = 'U' + str(int(id[1:]) + 1).zfill(9)
         else:
             UserID = "U000000001"
     else:
            UserID = "U000000001"
     return UserID

def check_User_exit(email):
    exit_IDuser = Users.objects.filter(Mail = email)
    if(exit_IDuser):
        return exit_IDuser
    else:
        return None

# Hàm lấy thông tin người dùng từ Google API
def get_user_info_google(access_token):
    url = 'https://www.googleapis.com/oauth2/v1/userinfo'
    headers = {'Authorization': 'Bearer {}'.format(access_token)}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        # Parse dữ liệu json
        json_data = response.json()
        user_info = {
            'id': json_data.get('id'),
            'email': json_data.get('email'),
            'displayName': json_data.get('name'),
            'given_name': json_data.get('given_name'),
            'family_name': json_data.get('family_name'),
            'picture': json_data.get('picture'),
            'jobtitle': json_data.get('jobtitle'),
            'phone': json_data.get('phone'),
            'birthday': json_data.get('birthday')
        }
        return user_info
    else:
        # Xử lý lỗi khi không thể lấy thông tin người dùng từ Google API
        pass

# Hàm lấy thông tin người dùng từ Microsoft API
def get_user_info_microsoft(access_token):
    user_url = 'https://graph.microsoft.com/v1.0/me'
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Accept': 'application/json',
    }
    response = requests.get(user_url, headers=headers)
    if response.status_code == 200:
        # Parse dữ liệu json
        json_data = response.json()
        user_info = {
            'id': json_data.get('id'),
            'email': json_data.get('email'),
            'displayName': json_data.get('name'),
            'given_name': json_data.get('given_name'),
            'family_name': json_data.get('family_name'),
            'picture': json_data.get('picture'),
            'jobtitle': json_data.get('jobtitle'),
            'phone': json_data.get('phone'),
            'birthday': json_data.get('birthday')
        }
        return user_info
    else:
        # Xử lý lỗi khi không thể lấy thông tin người dùng từ Microsoft API
        pass



#functon set session User
def set_session_user(request, data_user):
    request.session['UserInfo'] = {
         'ID_user': data_user['ID_user'],
         'Mail': data_user['Mail'],
         'FullName': data_user['FullName'],
         'displayName': data_user['displayName'],
         'Avatar': data_user['Avatar'],
         'Photo': data_user['displayName'][0] + data_user['FullName'][0],
    }

#functon set get delete cookies
def SetCookie(response , name_data, cookie_data, url_redirect):
    age =  90 * 24 * 60 * 60 #90 day, cookie lifes
    response = HttpResponseRedirect(url_redirect)
    response.set_cookie(name_data,cookie_data,age)
    return response

def GetCookie(request, name_data):
    response = request.COOKIES.get(name_data)
    return response

def DeleteCookie(response, name_data):
    response.delete_cookie(name_data)
    return response











#test link
def test(request):
    #load template in folder teamplates
    template =  loader.get_template('testlogin.html')
    return HttpResponse(template.render())
