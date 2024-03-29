from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        field= (
            'id',
            'email',
            'first_name',
            'last_name',
            'get_full_name',
            'get_shot_name'
        )

