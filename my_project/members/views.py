from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from django.template import loader
from .models import T001


# Create your views here.
def members(request):
    #load template in folder teamplates 
    template =  loader.get_template('Home.html')
    return HttpResponse(template.render())

def Data_list(request):
    # import pdb; pdb.set_trace()
    #load template in folder teamplates
    data =  T001.objects.using('default').all()
    return render(request, 'Home.html', {'data': data}) 

def Data_list_id(request, id):
    # import pdb; pdb.set_trace()
    #load template in folder teamplates
    data = get_object_or_404(T001, id=id) 
    return render(request, 'Detail.html', {'data': data}) 
    # data =  T001.objects.get(id=id)
    # data =  T001.objects.using('default').all() 
    #  
    # template =  loader.get_template('Home.html')
    # return HttpResponse(template.render())

