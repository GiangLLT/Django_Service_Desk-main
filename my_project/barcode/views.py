from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
import json

from django.core.paginator import Paginator
from django.db.models import Count
# from .models import T001, Product, Category

import pyrfc
import configparser
from pyrfc import Connection
from django.conf import settings
from django.http import JsonResponse


def connection():
    # Read the SAP configuration from the config file
    config = configparser.ConfigParser()
    path_ini = settings.BASE_DIR/'static'/'Asset'/'config.ini'
    # config.read('..\\my_project\\static\\Asset\\config.ini')
    config.read(path_ini)
    # Create a connection to SAP
    conn    = Connection(
    user        = config['SAP']['User'],
    passwd      = config['SAP']['Password'],
    client      = config['SAP']['Client'],
    ashost      = config['SAP']['AppServer'],
    sysnr       = config['SAP']['SystemNumber'],
    saprouter   = config['SAP']['Saprouter']
)
    return conn

def function_get_user(request):
    data = []
    # Call the RFC function to get the user data
    destination = connection()
    username = "MS01"
    # username = "GIANGLE"
    # password = "123456"
    # result = connect.call('ZFM_READ_USER', IM_USER = username, IM_PASS = password )
    result = destination.call('ZFM_READ_USER', IM_INFO = username )
    if(len(result['O_STRUCT']) > 0):
        data_list = result['O_STRUCT']
        # Process the result of the RFC function call
        # for item in data_list:
            # Data_result = result['O_STRUCT'][item]
            # user_data = {}
            # user_data['IDUSER'] = item['IDUSER']
            # user_data['BRAND']  = item['BRAND']
            # user_data['NAME']   = item['NAME']
            # user_data['EMAIL']  = item['EMAIL']
        list_json = [{'UserID' :  Data['IDUSER'], 
                    'Brand' :  Data['BRAND'], 
                    'Name': Data['NAME'], 
                    'Email'    : Data['EMAIL']} 
                    for Data in data_list]
        
    data = json.dumps(list_json, ensure_ascii=False)

    destination.close()
    return HttpResponse(data, content_type='application/json')



def function_get_article(request):
    data = []
    # Call the RFC function to get the user data
    destination = connection()
    GTin = request.GET.get('search_text')
    # GTin = '5054322075258'
    result = destination.call('ZRFC_READ_DATA', IF_BARCODE = GTin )
    if(len(result['O_MARA']) > 0):
        article_data = result['O_MARA']
        # Process the result of the RFC function call
        # for item in data_list:
            # Data_result = result['O_STRUCT'][item]
            # article_data = {}
            # article_data['MATNR'] = item['MATNR']
            # article_data['EAN11'] = item['EAN11']
            # article_data['MTART'] = item['MTART']
            # article_data['MEINS'] = item['MEINS']
            # article_data['MATKL'] = item['MATKL']
            # article_data['BISMT'] = item['BISMT']
            # article_data['SAISO'] = item['SAISO']
            # article_data['ERSDA'] = item['ERSDA']
            # article_data['ERNAM'] = item['ERNAM']

    article_json = [{'Article' :  Article['MATNR'],
                 'Barcode' :   Article['EAN11'],
                 'Art_type':   Article['MTART'],
                 'Unit'    :   Article['MEINS'],
                 'Category':   Article['MATKL'],
                 'Old_Art' :   Article['BISMT'],
                 'Season'  :   Article['SAISO'],
                 'Create_on':  Article['ERSDA'],
                #  'price': int(p.price)} for p in article_data]
                 'Create_by':  Article['ERNAM']} 
                 for Article in article_data]
    
    data = json.dumps(article_json, ensure_ascii=False)

    destination.close()
    return HttpResponse(data, content_type='application/json')



def load_data(request):
    #load template in folder teamplates 
    # load_data(request)
    return render(request, 'barcode.html')

