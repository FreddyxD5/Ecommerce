from argparse import Action
from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Q
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny


from apps.product.api.serializers import ProductSerializer
from apps.product.models import Product
from apps.category.models import Category
# Create your views here.
def index(self, request):    
    return HttpResponse('Holitasd e mar')

class ProductDetailView(APIView):    
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get(self, request, productId, format=None):        
        try:
            product_id = int(productId)
        except:
            return Response({'error':'Product ID must be an integer'}, status=status.HTTP_404_NOT_FOUND)

        if Product.objects.filter(active=True, id=product_id).exists():
            product = Product.objects.filter(id=product_id).first()            
            product = self.serializer_class(product)
            return Response({'product':product.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error':'Product with this ID doesn\'t exits'}, status=status.HTTP_404_NOT_FOUND)        

class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        sortBy = request.query_params.get('sortBy')        
        if not (sortBy=='date_created' or sortBy =='price' or sortBy=='sold' or sortBy=='name'):
            sortBy='date_created'
        
        order = request.query_params.get('order')
        limit = request.query_params.get('limit')

        if not limit:
            limit = 6
        
        try:
            limit = int(limit)
        except:
            return Response({'error':'Limist must be an Integer'}, status=status.HTTP_404_NOT_FOUND)

        if limit <= 0:
            limit=6

        if order =='desc':            
            sortBy='-' + sortBy
            products = Product.objects.order_by(sortBy).all()[:int(limit)]
        elif order=='asc':            
            products = Product.objects.order_by(sortBy).all()[:int(limit)]
        else:                        
            products = Product.objects.order_by(sortBy).all()
        
        if products:
            products = ProductSerializer(products, many=True)
            return Response({'products':products.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error':'no products lists.'}, status=status.HTTP_400_BAD_REQUEST)


class ListSearchView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data        
        try:
            category_id = int(data['category_id'])
        except:
            return Response({'error':'CategoryID must be an integer'}, status=status.HTTP_404_NOT_FOUND)
        
        search = data['search']

        if len(search) == 0:
            search_results = Product.objects.order_by('-date_created').all()
        else:
            search_results = Product.objects.filter(Q(description__icontains=search)| Q(name__icontains=search)).all()
        
        if category_id==0:
            search_results =ProductSerializer(search_results, many=True)
            return Response({'search_products':search_results.data}, status=status.HTTP_200_OK)
        
        #revisar si existe categoria
        if not Category.objects.filter(id=category_id).exists():
            return Response({'error':'Category not Found'}, status=status.HTTP_404_NOT_FOUND)

        category = Category.objects.filter(id=category_id).first()

        if category.parent:
            search_results=search_results.order_by('-date_created').filter(category=category)
        else:
            if not Category.objects.filter(parent=category).exists():
                search_results = search_results.order_by('-date_created').filter(category=category)
            else:                

                categories = Category.objects.filter(parent=category)
                filtered_categories = [category]

                for cat in categories:
                    filtered_categories.append(cat)
                
                filtered_categories = tuple(filtered_categories)
                
                filtered_categories = search_results.order_by('-date_created').filter(category__in=filtered_categories)                
        
        search_results = ProductSerializer(search_results, many=True)          
        return Response({'search_products':search_results.data}, status=status.HTTP_200_OK)


class ListRelatedView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, productId, format=None):        
        try:
            product_id = int(productId)
        except:
            return Response({'error':'Product ID must be an integer'}, status=status.HTTP_404_NOT_FOUND)
        
        if not Product.objects.filter(id=product_id).exists():
            return Response({'error':'Produc with this ID does not exists'},
                            status = status.HTTP_404_NOT_FOUND)
        
        category = Product.objects.get(id=product_id).category
        if Product.objects.filter(category=category).exists():
            if category.parent:
                related_products = Product.objects.order_by(
                    '-sold'
                ).filter(category=category)
            else:
                if not Category.objects.filter(parent=category).exists():                    
                    related_products = related_products.order_by(
                        '-sold'
                    ).filter(category=category)
                    
                else:
                    categories = Category.objects.filter(parent=category)
                    filtered_categories = [category]

                    for cat in categories:
                        filtered_categories.append(cat)

                    filtered_categories = tuple(filtered_categories)
                    related_products = Product.objects.filter(category__in=filtered_categories)
                    related_products = related_products.order_by(
                        '-sold'
                        ).filter(category__in = filtered_categories)

                        
            #Exluir producto que estamos viendo
            related_products = related_products.exclude(id=product_id)
            related_products = ProductSerializer(related_products, many=True)

            cantidad_productos = len(related_products.data)

            if cantidad_productos>3:
                return Response({'related_products':related_products.data[:3]}, status=status.HTTP_200_OK)
            elif cantidad_productos>0:
                return Response({'related_products':related_products.data}, status=status.HTTP_200_OK)
            else:
                return Response({'error':'No related products found'}, status=status.HTTP_200_OK)            
        else:
            return Response({'error':'No related products fund'}, status=status.HTTP_200_OK)



class ListBySearchView(APIView):    
    permission_classes  = [AllowAny]

    def post(self, request, format=None):        
        data = request.data                
        try:
            category_id = int(data['category_id'])
        except:
            return Response({'error':'Category ID must be an integer'},
                            status=status.HTTP_404_NOT_FOUND)

        price_range = data['price_range']
        sort_by =data['sort_by']

        if not(sort_by=='date_created' or sort_by=='price' or sort_by=='sold' or sort_by=='name'):
            sort_by='date_created'
        
        order = data['order']
        #Si los CategoryId= 0, filtrar todas las categorias
        if category_id==0:
            product_results = Product.objects.all()
        elif not Category.objects.filter(id=category_id).exists():
            return Response({'error':'This category doesn\'t exists'},
                            status=status.HTTP_404_NOT_FOUND)
        else:
            category = Category.objects.filter(id=category_id).first()

            if category.parent:
                #Si la categoria tiene un padre, filtrar por la categoria más no por el padre
                product_results = Product.objects.filter(category=category)                
            else:
                if not Category.objects.filter(parent = category).exists():
                    product_results = Product.objects.filter(category=category)
                else:
                    categories = Category.objects.filter(parent = category)
                    filtered_categories = [category]

                    for cat in categories:
                        filtered_categories.append(cat)
                
                    filtered_categories = tuple(filtered_categories)
                    product_results=Product.objects.filter(
                                category__in=filtered_categories, active=True)
        
        
        #Filtrar por precio
        if price_range == '1 - 19':
            product_results = product_results.filter(price__gte=1)
            product_results = product_results.filter(price__lt=20)
        elif price_range == '20 - 39':
            product_results = product_results.filter(price__gte=20)
            product_results = product_results.filter(price__lt=40)
        elif price_range == '40 - 59':
            product_results = product_results.filter(price__gte=40)
            product_results = product_results.filter(price__lt=60)
        elif price_range == '60 - 79':
            product_results = product_results.filter(price__gte=60)
            product_results = product_results.filter(price__lt=80)
        elif price_range == 'More than 80':
            product_results = product_results.filter(price__gte=80)            
        
        #Filtrar producto por sortBy

        if order=='desc':
            sort_by = '-'+sort_by
            product_results = product_results.order_by(sort_by)
        elif order=='asc':
            product_results = product_results.order_by(sort_by)
        else:
            product_results = product_results.order_by(sort_by)
        
        product_results = ProductSerializer(product_results, many=True)

        if len(product_results.data)>0:
            return Response({'filtered_products': product_results.data},
                            status = status.HTTP_200_OK)
        else:
            return Response({'error':'No products found'}, status.HTTP_200_OK)







                    
                    

            

class ProductViewSet(viewsets.ViewSet):    
    model = Product
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):   
       return self.model.objects.filter(active=True)

    @action(methods=['get'], detail=False, url_path='vista_previa/(?P<pk>[^/.]+)')
    def vista_previa(self, request, pk=None):
        product = self.model.objects.filter(id=self.kwargs['pk'],active=True).first()
        if product:
            product = self.serializer_class(product)
            return Response(product.data, status= status.HTTP_200_OK)
        return Response({'error':'No se ha encontrado el producto'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False, url_path='')
    def product_filter(self, request):
        return Response({}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):              
        products = self.model.objects.filter(active=True)
        if products:
            products = self.serializer_class(products, many=True)
            return Response({'products':products.data}, status=status.HTTP_200_OK)
        return Response({'error':'There\'s no products yet'}, status=status.HTTP_400_BAD_REQUEST)        

    def create(self, request):
        return Response({'message':'Creado correctamente'}, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        return Response({'mensaje':'update correct'}, status=status.HTTP_200_OK)

    def retrieve(self, request,*args,**kwargs): 
        query = self.model.objects.filter(id=self.kwargs['pk'],active=True).first()
        if query:
            serializer_product = self.serializer_class(query)            
            return Response({'product':serializer_product.data}, status=status.HTTP_200_OK)
        return Response({'error':'No se ha encontrado el producto'}, status =status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):                
        query = self.model.objects.filter(id=self.kwargs['pk'],active=True).first()
        if query:
            query.active=False
            query.save()            
            return Response({'message':'Producto eliminado correctamente.'}, status=status.HTTP_200_OK)
        return Response({'error':'No se ha encontrado el producto'}, status =status.HTTP_400_BAD_REQUEST)

