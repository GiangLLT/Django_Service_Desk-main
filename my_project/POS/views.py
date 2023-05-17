from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.views.generic import ProtectedResourceView

from django.core.paginator import Paginator
from django.db.models import Count
# from .models import Users

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

def POS(request):
    #load template in folder teamplates
    template =  loader.get_template('Login-POS.html')
    return HttpResponse(template.render())

@csrf_exempt
def login_pos_system(request):
    try:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            if(username == '1' and  password =='123'):
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',}) 
    # except Users.DoesNotExist:
    #     return JsonResponse({
    #         'success': False,
    #         'message': 'User does not exist',
    #     })
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'message': f'Login Failed: {str(ex)}',
        })

def Order_POS(request):
    #load template in folder teamplates
    template =  loader.get_template('Order-POS.html')
    return HttpResponse(template.render())

def Home_POS(request):
    #load template in folder teamplates
    template =  loader.get_template('Home-POS.html')
    return HttpResponse(template.render())

@csrf_exempt
def Check_promotion(request):
    try:
        if request.method == 'POST':
            PromotionID = request.POST.get('PromotionID')
            if(PromotionID == '1'):
                return JsonResponse({
                'success': True,
                'message': 'Successed',
                'dataPromotion': '-100000'})
            elif(PromotionID == '2'):
                return JsonResponse({
                'success': True,
                'message': 'Successed',
                'dataPromotion': '-20000'})  
            else:
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'dataPromotion': '0'})
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'message': f'Login Failed: {str(ex)}',
        })
    

@csrf_exempt
def Check_promotion_member(request):
    try:
        if request.method == 'POST':
            PromotionID = request.POST.get('PromotionID')
            PromotionValue = request.POST.get('PromotionValue')
            if(PromotionID == '1'):
                percent = 0
                promoMember = 0 
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'dataPromotion_Member': promoMember})
            elif(PromotionID == '2'):
                percent = 5
                promoMember = int(PromotionValue) * percent / 100 
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'dataPromotion_Member': promoMember})
            elif(PromotionID == '3'):
                percent = 10
                promoMember = int(PromotionValue) * percent / 100 
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'dataPromotion_Member': promoMember})  
            elif(PromotionID == '4'):
                percent = 15
                promoMember = int(PromotionValue) * percent / 100 
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'dataPromotion_Member': promoMember})  
            else:
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'dataPromotion_Member': '0'})
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'message': f'Login Failed: {str(ex)}',
        })
    

@csrf_exempt
def Check_info_customer(request):
    try:
        if request.method == 'POST':
            CustomerID = request.POST.get('CustomerID')
            Total_value = request.POST.get('TotalValue')
            if(CustomerID == '1000000001'):
                return JsonResponse({
                'success': True,
                'message': 'Successed',
                'CustID': '1000000001',
                'CustType': '',
                'CustName': 'Khách Hàng Vãng Lai',
                'CustBirth': '',
                'CustPhone': '',
                'CustEmail': '',
                'CustAdd': '',
                'CustProValue': '',
                'CustProID': '',
                'CustProName': '',
                'CustStatus': False})
            elif(CustomerID == '1000000002'):
                if(int(Total_value) > 0):
                    Total_discount = (int(Total_value) * 5) / 100  
                else:
                    Total_discount =  Total_value                        
                Name_discount = "Thành Viên Bạc - Giảm 5%"
                return JsonResponse({
                'success': True,
                'message': 'Successed',
                'CustID': '1000000002',
                'CustType': 'Khách hàng Bạc',
                'CustName': 'Phạm Thanh Thúy',
                'CustBirth': '16/10/1990',
                'CustPhone': '0909009999',
                'CustEmail': 'thuy.pt@bamboocap.com.vn',
                'CustAdd': '27 Quốc Hương, Phường 6, Quận 2, Thành Phố HCM.',
                'CustProValue': Total_discount,
                'CustProID': '2',
                'CustProName': Name_discount,
                 'CustStatus': True})  
            elif(CustomerID == '1000000003'):
                if(int(Total_value) > 0):
                    Total_discount = (int(Total_value) * 10 )/ 100
                else:
                    Total_discount =  Total_value 
                Name_discount = "Thành Viên Vàng - Giảm 10%"
                return JsonResponse({
                'success': True,
                'message': 'Login Successed',
                'CustID': '1000000003',
                'CustType': 'Khách hàng Vàng',
                'CustName': 'Lê Lộc Trường Giang',
                'CustBirth': '16/10/1990',
                'CustPhone': '0909009999',
                'CustEmail': 'giang.llt@bamboocap.com.vn',
                'CustAdd': '27 Quốc Hương, Phường 6, Quận 2, Thành Phố HCM.',
                'CustProValue': Total_discount,
                'CustProID': '3',
                'CustProName': Name_discount,
                'CustStatus': True})   
            # else:
            #     return JsonResponse({
            #     'success': True,
            #     'message': 'Login Successed',
            #     'dataPromotion_Member': '0'})
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'message': f'Login Failed: {str(ex)}',
        })


# def login_pos_system(request):
#     try:
#         if request.method == 'POST':
#             email = request.POST.get('email')
#             password = request.POST.get('pass')

#             user = Users.objects.filter(Mail = email, Password = password, User_Status = True)
#             if(user):
#                  # Lưu dữ liệu vào session
#                  for user in user:
#                     request.session['UserInfo'] = {
#                         'ID_user': user.ID_user,
#                         'Mail': user.Mail,
#                         'FullName': user.FullName,
#                         'displayName': user.displayName,
#                         'Avatar': user.Avatar,
#                         'Photo': user.displayName[0] +user.FullName[0],
#                     }
#                     session_data = json.dumps(request.session['UserInfo'])

#                     # Lưu chuỗi JSON vào cookie
#                     # Lưu access_token vào cookie (lưu ý: cần kiểm tra tính bảo mật của cookie)
#                     if(remember == 'true'):
#                         url_redirect = '/danh-sach-test/'
#                         response = HttpResponse('cookie success')
#                         response = SetCookie(response , 'cookie_system_data', session_data, url_redirect)
#                         response = DeleteCookie(response , 'cookie_microsoft_data')
#                         response = DeleteCookie(response , 'cookie_google_data')
#                         response = DeleteCookie(response , 'cookie_facebook_data')
#                         return response                               
#                  return JsonResponse({
#                 'success': True,
#                 'message': 'Login Successed',}) 
#             else:
#                 return JsonResponse({
#                 'success': False,
#                 'message': 'Login Failed',})
#     except Users.DoesNotExist:
#         return JsonResponse({
#             'success': False,
#             'message': 'User does not exist',
#         })
#     except Exception as ex:
#         return JsonResponse({
#             'success': False,
#             'message': f'Login Failed: {str(ex)}',
#         })
