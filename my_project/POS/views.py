from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.views.generic import ProtectedResourceView

from django.core.paginator import Paginator
from django.db.models import Count
# from .models import Company
from .models import *
from django.db.models import Prefetch
from django.db import connection
from django.db.models import Q

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
    # template =  loader.get_template('Login-POS.html')
    template =  'Login-POS.html'
    companies = Company.objects.filter(CompanyStatus = True)
    # Trả về template và danh sách công ty qua context
    context = {'companies': companies}
    # return HttpResponse(request, template, context)
    return render(request, template, context)


@csrf_exempt
def login_pos_system(request):
    try:
        if request.method == 'POST':
            Userid = request.POST.get('UserID')
            password = request.POST.get('password')
            company_cookie = request.COOKIES.get('company-POS')
            if company_cookie:
                user = UserSY.objects.filter(UserID=Userid, Password=password, CompanyCode=company_cookie)
                if not user.exists():
                    return JsonResponse({
                        'success': False,
                        'message': 'UserID không tồn tại.',
                    })
                else:
                    user = user.first()
                    group = UserGroup.objects.filter(UserGroupID = user.UserGroupID.UserGroupID).first()
                    request.session['User_Info'] = {
                        'UserID': user.UserID,
                        'Username': user.Username,
                        'FullName': user.FullName,
                        'ImageUrl': user.ImageUrl,
                        'Group_User': group.UserGroupName
                    }
                    request.session.save()
                    # a = request.session.get('User_Info').get('UserID')
                    if not user.UserStatus:
                        return JsonResponse({
                            'success': False,
                            'message': 'User chưa được kích hoạt.',
                        })
                    else:    
                        if user.UserGroupID.UserGroupName == "Quản Trị":
                            return JsonResponse({
                                'success': True,
                                'message': 'Đăng nhập thành công.',
                                'Group': 'Admin'
                            })
                        else:
                            return JsonResponse({
                                'success': True,
                                'message': 'Đăng nhập thành công.',
                                'Group': 'Member'
                            })

    except Exception as ex:
        return JsonResponse({
            'success': False,
            'message': f'Đăng nhập không thành công: {str(ex)}',
        })



# def Order_POS(request):
#     #load template in folder teamplates
#     template =  loader.get_template('Order-POS.html')
#     return HttpResponse(template.render())

# def Home_POS(request):
#     #load template in folder teamplates
#     template =  'Home-POS.html'
#     company_cookie = request.COOKIES.get('company-POS')
#     current_time = datetime.datetime.now().date()
#     Groups = MaterialGroup.objects.filter(MaterialGroupStatus = True)
#     Customers = Customer.objects.filter(CustomerStatus = True)
#     query_sql = """
#     select a.MaterialID as MaterialID, a.MaterialName, a.CompanyCode, b.MaterialImage, b.MaterialGroupID, c.PriceAmount, c.PriceFrom, c.PriceTo
#     from MATERIAL_COMPANY as a, material as b, PRICE_MATERIAL as c
#     where a.MaterialID = b.MaterialID and a.MaterialID = c.MaterialID
#     and a.MaterialStatus = 1 and a.CompanyCode = 1002
#     and a.MaterialComFrom <= '2023-05-19' and a.MaterialComTo >= '2023-05-19'
#     and c.CompanyCode = 1002 and c.PriceFrom <= '2023-05-19' and c.PriceTo >= '2023-05-19'
#     """

#     materials = execute_raw_sql_query(query_sql)
#     context = {
#         'Groups': Groups,
#         'Customers': Customers,
#         'Materials': materials}
#     return render(request, template, context)

def Home_POS(request):
    Session_User = request.session.get('User_Info')
    if(Session_User):
        template =  'Home-POS.html'
        company_cookie = request.COOKIES.get('company-POS')
        current_time = datetime.datetime.now().date()
        Groups = MaterialGroup.objects.filter(MaterialGroupStatus = True)
        Customers = Customer.objects.filter(CustomerStatus = True)
        Material_companys =  list(MaterialCompany.objects.filter(
                MaterialStatus = True,
                MaterialComFrom__lte = current_time ,  
                CompanyCode = company_cookie, 
                MaterialComTo__gte = current_time).select_related('MaterialID', 'CompanyCode').prefetch_related(
                Prefetch('MaterialID__pricematerial_set', queryset=PriceMaterial.objects.filter(
                PriceFrom__lte=current_time,
                CompanyCode=company_cookie,
                PriceTo__gte=current_time
            ).order_by('-MaterialID'))
        ))
        # materials = list(Material.objects.filter(MaterialID__in = Material_companys.values('MaterialID')).values('MaterialImage'))
        promotions = list(Promotion.objects.filter(
            Q(CompanyCode=None) | Q(CompanyCode=company_cookie),
            PromotionStatus   = True,
            PromotionFrom__lte = current_time,
            PromotionTo__gte   = current_time,
            ))
        
        tableOrders = list(TableOrder.objects.all())
        for Order in tableOrders:
            tableOrder = SaleOrderHeader.objects.filter(
                TableOrderID = Order.TableOrderID, 
                SaleOrderDate = current_time, 
                SaleOrderStatus = 'Chưa thanh toán',
                CompanyCode = company_cookie).values('SaleOrderID','FullName','SaleHeaderNote','SaleOrderAmount').first()
            if(tableOrder):
                SaleOrrderItems = SaleOrderItem.objects.filter(
                    SaleOrderID = tableOrder['SaleOrderID']).values('MaterialName','SaleQuantity')

                Order.SaleOrderID = tableOrder['SaleOrderID']
                Order.FullName    = tableOrder['FullName']
                Order.TablePerson = tableOrder['SaleHeaderNote']
                Order.Amount = tableOrder['SaleOrderAmount']
                Order.Items = list(SaleOrrderItems)
            else:
                Order.SaleOrderID = ''
                Order.FullName    = ''
                Order.TablePerson = ''
                Order.Amount = ''

        # Đếm số lượng bàn có khách
        table_with_guests_count = SaleOrderHeader.objects.filter(
            TableOrderID__in=tableOrders,
            SaleOrderDate = current_time, 
            SaleOrderStatus = 'Chưa thanh toán',
            CompanyCode = company_cookie
            ).count()
        
        table_with_all_count = TableOrder.objects.all().count()

        # Đếm số lượng bàn không có khách
        table_without_guests_count = table_with_all_count -  table_with_guests_count     
        context = { 
            'Groups': Groups,
            'Customers': Customers,
            'Materials': Material_companys,
            'promotions': promotions,
            'tableOrders': tableOrders,
            'table_all': table_with_all_count,
            'table_guests': table_with_guests_count,
            'table_without_guests': table_without_guests_count}
        return render(request, template, context)
    else:
       return redirect ('/login-pos/')   

    

    
@csrf_exempt
def Check_promotion(request):
    try:
        if request.method == 'POST':
            promotionID = request.POST.get('PromotionID')
            TotalAmount = int(request.POST.get('TotalAmount'))
            channel = request.POST.get('Channel')
            # int_TotalAmount = int(TotalAmount)
            int_Channel = int(channel)
            if(promotionID and TotalAmount):
                promotions = Promotion.objects.filter(PromotionID = promotionID).first()
                if(promotions):
                    DiscountPer = int(promotions.PromotionDiscountPer)
                    DiscountAmount = int(promotions.PromotionDiscountAmount)
                    DiscountMax = int(promotions.PromotionDiscountMax)
                    DiscountOrderMin = int(promotions.PromotionRoleID.PromotionRoleMin)
                    DiscountChannel = int(promotions.PromotionRoleID.PromotionRoleChannel)
                    # discount có giá trị nhỏ nhất được áp dụng
                    if(DiscountOrderMin > 0): 
                        # discount có giá trị nhỏ trên đơn hàng có tổng lớn hơn Min => áp dụng khuyến Mãi
                        if(TotalAmount >= DiscountOrderMin):
                           # discount có áp dụng theo kênh bán hàng.
                            if(DiscountChannel > 0):
                                if(DiscountChannel == int_Channel):
                                    if(DiscountAmount):
                                        return JsonResponse({
                                        'success': True,
                                        'message': 'Success',
                                        'dataPromotion': DiscountAmount})
                                    if(DiscountPer):
                                        Total_discount = (DiscountPer * TotalAmount )/ 100
                                        if(Total_discount > DiscountMax):
                                                return JsonResponse({
                                                'success': True,
                                                'message': 'Success',
                                                'dataPromotion': DiscountMax})
                                        else:
                                                return JsonResponse({
                                                'success': True,
                                                'message': 'Success',
                                                'dataPromotion': Total_discount})
                                    else:
                                        return JsonResponse({
                                        'success': False,
                                        'message': 'Tổng giá trị đơn hàng phải lớn hơn '+ DiscountOrderMin + ' Đồng'})
                                else:
                                    channel_name =  Channel.objects.filter(ChannelID = DiscountChannel).values('ChannelName').first()
                                    if channel_name:
                                        
                                        return JsonResponse({
                                            'success': False,
                                            'message': 'Promotion chỉ áp dụng cho đơn hàng ' + channel_name['ChannelName'],
                                            'Channel_failed': True,
                                            'Channel_val': DiscountChannel
                                        })
                            # discount không áp dụng theo kênh bán hàng.
                            else:
                                if(DiscountAmount):
                                        return JsonResponse({
                                        'success': True,
                                        'message': 'Success',
                                        'dataPromotion': DiscountAmount})
                                if(DiscountPer):
                                    Total_discount = (DiscountPer * TotalAmount )/ 100
                                    if(Total_discount > DiscountMax):
                                            return JsonResponse({
                                            'success': True,
                                            'message': 'Success',
                                            'dataPromotion': DiscountMax})
                                    else:
                                            return JsonResponse({
                                            'success': True,
                                            'message': 'Success',
                                            'dataPromotion': Total_discount})
                        # discount có giá trị nhỏ trên đơn hàng có tổng nhỏ hơn Min => không áp dụng khuyến Mãi
                        else:
                            return JsonResponse({
                                'success': False,
                                'message': 'Tổng giá trị đơn hàng phải lớn hơn '+ DiscountOrderMin + ' Đồng' }) 
                    #DiscountOrderMin > 0 - discount có giá trị nhỏ nhất không được áp dụng
                    else:
                        if(DiscountChannel > 0):
                                if(DiscountChannel == int_Channel):
                                    if(DiscountAmount):
                                        return JsonResponse({
                                        'success': True,
                                        'message': 'Success',
                                        'dataPromotion': DiscountAmount})
                                    if(DiscountPer):
                                        Total_discount = (DiscountPer * TotalAmount )/ 100
                                        if(Total_discount > DiscountMax):
                                                return JsonResponse({
                                                'success': True,
                                                'message': 'Success',
                                                'dataPromotion': DiscountMax})
                                        else:
                                                return JsonResponse({
                                                'success': True,
                                                'message': 'Success',
                                                'dataPromotion': Total_discount})
                                    else:
                                        return JsonResponse({
                                        'success': False,
                                        'message': 'Tổng giá trị đơn hàng phải lớn hơn '+ DiscountOrderMin + ' Đồng' })
                                else:
                                    channel_name =  Channel.objects.filter(ChannelID = DiscountChannel).values('ChannelName').first()                                    
                                    if channel_name:
                                        return JsonResponse({
                                            'success': False,
                                            'message': 'Promotion chỉ áp dụng cho đơn hàng ' + channel_name['ChannelName'],
                                            'Channel_failed': True,
                                            'Channel_val': DiscountChannel
                                        })
                            # discount không áp dụng theo kênh bán hàng.
                        else:
                            if(DiscountAmount):
                                    return JsonResponse({
                                    'success': True,
                                    'message': 'Success',
                                    'dataPromotion': DiscountAmount})
                            if(DiscountPer):
                                Total_discount = (DiscountPer * TotalAmount )/ 100
                                if(Total_discount > DiscountMax):
                                        return JsonResponse({
                                        'success': True,
                                        'message': 'Success',
                                        'dataPromotion': DiscountMax})
                                else:
                                        return JsonResponse({
                                        'success': True,
                                        'message': 'Success',
                                        'dataPromotion': Total_discount}) 
                #discount không tồn tại
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Khuyến mãi Không tồn tại, vui lòng liên hệ administrator để kiểm tra lại.' })  
            else:
                return JsonResponse({
                'success': False,
                'message': 'Dữ liệu trống'})

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
            if(PromotionID and  PromotionValue):
                promotion_status = CustomerType.objects.filter(CustomerTypeID = PromotionID).first()
                if(promotion_status):
                    percent = int(promotion_status.CustomerTypePercent)
                    if(percent > 0):
                        promoMember = int(PromotionValue) * percent / 100 
                        return JsonResponse({
                        'success': True,
                        'message': 'Successed',
                        'dataPromotion_Member': promoMember})  
                    else:
                       return JsonResponse({
                        'success': True,
                        'message': 'Successed',
                        'dataPromotion_Member': '0'})   
                else:
                    return JsonResponse({
                    'success': False,
                    'message': 'Không tìm thấy Promotion'})         
            else:
                return JsonResponse({
                'success': False,
                'message': 'Dữ Liệu Trống.'})      

            # if(PromotionID == '1'):
            #     percent = 0
            #     promoMember = 0 
            #     return JsonResponse({
            #     'success': True,
            #     'message': 'Login Successed',
            #     'dataPromotion_Member': promoMember})
            # elif(PromotionID == '2'):
            #     percent = 5
            #     promoMember = int(PromotionValue) * percent / 100 
            #     return JsonResponse({
            #     'success': True,
            #     'message': 'Login Successed',
            #     'dataPromotion_Member': promoMember})
            # elif(PromotionID == '3'):
            #     percent = 10
            #     promoMember = int(PromotionValue) * percent / 100 
            #     return JsonResponse({
            #     'success': True,
            #     'message': 'Login Successed',
            #     'dataPromotion_Member': promoMember})  
            # elif(PromotionID == '4'):
            #     percent = 15
            #     promoMember = int(PromotionValue) * percent / 100 
            #     return JsonResponse({
            #     'success': True,
            #     'message': 'Login Successed',
            #     'dataPromotion_Member': promoMember})  
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
    
@csrf_exempt
def Check_info_customer(request):
    try:
        if request.method == 'POST':
            CustomerID = request.POST.get('CustomerID')
            Total_value = int(request.POST.get('TotalValue'))
            Customer_Info = Customer.objects.filter(CustomerID = CustomerID,CustomerStatus = True ).first()
            if(Customer_Info):
               if Customer_Info is not None and hasattr(Customer_Info, 'CustomerTypeID'):
                    Customer_TypeID = Customer_Info.CustomerTypeID.CustomerTypeID
                    customer_type =  CustomerType.objects.filter(CustomerTypeID = Customer_TypeID , CustomerTypeStatus = True).first()
                    if(customer_type):
                            Customer_TypePercent = customer_type.CustomerTypePercent
                            if(int(Total_value) > 0):
                                cust_percent = int(Customer_TypePercent) / 100
                                # Total_discount = (int(Total_value) * 5) / 100  
                                Total_discount = Total_value *  cust_percent
                            else:
                                Total_discount =  Total_value  
                            Name_discount = customer_type.CustomerTypeName
                            CustProName = Name_discount + ' - Giảm ' + str(Customer_TypePercent) + '%'
                            return JsonResponse({
                                'success': True,
                                'message': 'Successed',
                                'CustID': Customer_Info.CustomerID,
                                'CustType': Name_discount,
                                'CustName': Customer_Info.CustomerName,
                                'CustBirth': Customer_Info.CustomerBirthday.strftime("%d/%m/%Y"),
                                'CustPhone': Customer_Info.CustomerPhone,
                                'CustEmail': Customer_Info.CustomerEmail,
                                'CustAdd': Customer_Info.CustomerAddress,
                                'CustProValue': Total_discount,
                                'CustProID': customer_type.CustomerTypeID,
                                'CustProName': CustProName,
                                'CustStatus': True})
                    else:
                         return JsonResponse({
                        'success': True,
                        'message': 'Successed',
                        'CustID': Customer_Info.CustomerID,
                        'CustType': '',
                        'CustName': Customer_Info.CustomerName,
                        'CustBirth': Customer_Info.CustomerBirthday.strftime("%d/%m/%Y"),
                        'CustPhone': Customer_Info.CustomerPhone,
                        'CustEmail': Customer_Info.CustomerEmail,
                        'CustAdd': Customer_Info.CustomerAddress,
                        'CustProValue': Total_discount,
                        'CustProID': '',
                        'CustProName': '',
                        'CustStatus': False})
               else:
                    Total_discount =  Total_value
                    return JsonResponse({
                        'success': True,
                        'message': 'Successed',
                        'CustID': Customer_Info.CustomerID,
                        'CustType': '',
                        'CustName': Customer_Info.CustomerName,
                        'CustBirth': Customer_Info.CustomerBirthday.strftime("%d/%m/%Y"),
                        'CustPhone': Customer_Info.CustomerPhone,
                        'CustEmail': Customer_Info.CustomerEmail,
                        'CustAdd': Customer_Info.CustomerAddress,
                        'CustProValue': Total_discount,
                        'CustProID': '',
                        'CustProName': '',
                        'CustStatus': False})     
            else:
                 return JsonResponse({
                'success': False,
                'message': 'Không có dữ liệu khách hàng'})
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'message': f'Failed: {str(ex)}',
        })

def Logout_POS(request):
    if 'User_Info' in request.session:
        del request.session['User_Info']
    return redirect('/login-pos/')

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


def execute_raw_sql_query(QuerySQL):
    
    with connection.cursor() as cursor:
        sql_query = QuerySQL
        cursor.execute(sql_query)
        results = cursor.fetchall()
        connection.commit()
        return results