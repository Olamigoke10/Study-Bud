from django.forms import ModelForm
from .models import Room
from django.contrib.auth.models import User



class RoomForm(ModelForm):
    class Meta:
        model = Room
        fields = '__all__'
        exclude = ['host', 'participants']

class UserForm(ModelForm):
    class Meta:
        model = User  # Use your User model here
        fields = ['username', 'email']

