from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.serializers import  MyTokenObtainPairSerializer, UserSerializer, UserSerializerWithToken
from django.contrib.auth.hashers import make_password 
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

# this class logs in users
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    # print('<<REQUEST.DATA>> ', request.data,)
    # print('<<CONTENT TYPE>> ', request.headers.get('Content-Type'),)

    data = request.data
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        # Create a noice token for the newly created user 
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {
            'detail': 'User with this email already exists'
        }
        return Response(message, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    '''
    Accept a bearer jwt token in the GET request header
    use token to get user obj
    '''
    # print('AAAAAA>>> ', request.headers.get('Authorization'))
    user = request.user # Get user from token 
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    '''
    Accept a bearer jwt token in the GET request header
    use token to get user obj
    '''
    user = request.user # Get user from token 

    # Get the form data
    print('LOOKIE HERE update>>> ', request.data)
    data =  request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])
    user.save()

    # Return updated form data 
    serializer = UserSerializerWithToken(user, many=False)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def adminGetUserById(request, id):
    try:
        user = User.objects.get(id = id )
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User does not exist'}
        return Response(message, status = status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def adminUpdateUser(request, id):
    user = User.objects.get(id = id)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']
    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, id):
    userForDeletion = User.objects.get(id = id)
    userForDeletion.delete()
    return Response('User was Deleted')