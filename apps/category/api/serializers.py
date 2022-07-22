from rest_framework import serializers
from apps.category.models import Category


class SubCategoriesSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Category
        fields=('id','name',)
        
    def to_representation(self,instance):
        return {
            'id':instance.id,
            'name':instance.name,
            'sub_categories':[]
        }
    
    

# class RecursiveField(serializers.Serializer):
#     def to_representation(self, value):
#         serializer = self.parent.parent.__class__(value, context=self.context)
#         return serializer.data

class CategorySerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Category   
        fields='__all__'  
        
    def to_representation(self, instance):
        parent = []
        query = Category.objects.filter(parent=instance.id)            
        parent = SubCategoriesSerializer(query, many=True).data        
            
        return {
            'id':instance.id,
            'name':instance.name,
            'sub_categories':parent if parent is not None else ''
        }


#Esto si funciona de maravilla para listar hijos
# class CategorySerializers(serializers.ModelSerializer):
#     class Meta:
#         model = Category        
#         fields = ('id','name','parent')

#     def to_representation(self, instance):
#         self.fields['parent'] = CategorySerializers(read_only=True)
#         return super(CategorySerializers, self).to_representation(instance)