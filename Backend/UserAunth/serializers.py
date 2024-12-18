from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User

        fields = ('username', 'password', 'password2')

    def validate(self, attr):
        if attr['password'] != attr['password2']:
            raise serializers.ValidationError({"Password": "Password fields didn't match"})

        return attr

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username']

        )
        user.set_password(validated_data['password'])

        user.save()

        return user
    