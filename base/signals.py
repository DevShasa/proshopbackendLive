from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUser(sender, instance, **kwargs):
    user = instance
    # If there is an email field use that as the username 
    if user.email != "":
        user.username = user.email
pre_save.connect(updateUser, sender=User)