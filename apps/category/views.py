from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


from apps.category.models import Category
from apps.category.api.serializers import CategorySerializers

# Create your views here.

# class ListCategoriesView(APIView):
#     permission_classes = (permissions.AllowAny)
#     def get(self, request, format=None):
#         if Category.objects.all().exists():
#             categories = Category.objects.all()
#             result = []

#             for category in categories:
#                 if not category.parent:
#                     item = {}
#                     item['id'] = category.id
#                     item['name'] = category.name

#                     item['sub_categories'] = []

#                     for cat in categories:
#                         sub_item = {}
#                         if cat.parent and cat.parent.id == category.id:
#                             sub_item['id']=cat.id
#                             sub_item['name']=cat.name


        

class CategoryViewSet(ModelViewSet):
    model = Category
    serializer_class = CategorySerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        return self.model.objects.all()


    def list(self, request):        
        query = self.model.objects.filter(parent__isnull=True)
        if query:            
            serializer = self.serializer_class(query, many=True)
            return Response({'categories':serializer.data}, status = status.HTTP_200_OK)
        return Response({'error':'No categories Found'}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request):
        print('what')
        return Response({'message':'Categoria creada correctamente'}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args,**kwargs):
        print(request.data)
        print('siuuuuuu')
        return Response({'message':'yay'}, status= status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return Response({'message':'Categoria eliminada correctamente'}, status=status.HTTP_201_CREATED)
    
        