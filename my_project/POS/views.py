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
                'message': 'Login Successed',
                'dataPromotion': '-100000'}) 
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
