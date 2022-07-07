from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status 
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user #Atribute gotten from token passed in auth header 
    data = request.data

    orderItems = data['orderItems'] # List of objects

    if orderItems and len(orderItems) == 0:
        # If orderitems is present but its length is zero
        return Response({'detail': 'No Order Items'},  status=status.HTTP_400_BAD_REQUEST)
    else:
        # Create order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'], 
            totalPrice = data['totalPrice']
        )
        # Create shipping Address
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'],
            shippingPrice = data['shippingAddress']['shippingPrice']
        )
        # Loop through orderitems, and connect them to order
        for x in orderItems:
            db_product = Product.objects.get(_id = x['product'])
            orderItem = OrderItem.objects.create(
                product = db_product,
                order = order,
                name = db_product.name,
                qty = x['qty'],
                price = x['price'], 
                image = db_product.image.url,
            ) 

            # Update product.countInstock 
            db_product.countInStock -= orderItem.qty
            db_product.save()
    
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data) 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, id):
    user = request.user

    try:
        order = Order.objects.get(_id=id)
        # Making sure that a user only views their order or have admin priv
        if user.is_staff or order.user == user:
                serializer = OrderSerializer(order, many=False)
                return Response(serializer.data)
        else:
            return Response({'detail':'Not authorised to view this information'}, status = status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id = pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save() 

    return Response('Order successfully paid')
    # serializr = OrderSerializer(order, many=False)
    # return Response(serializr.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def adminGetOrders(request):
    # print (request.META['HTTP_AUTHORIZATION'])

    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
# @permission_classes([IsAdminUser])
def updateOrderToDelivered(request, id):


    user = request.user
    print (request.META['HTTP_AUTHORIZATION'])
    # print('<<<<EMAIL>>>>',user.email)
    if user.is_staff:
        order = Order.objects.get(_id = id)
        order.isDelivered = True
        order.deliveredAt = datetime.now()
        order.save() 
        return Response('Order successfully delivered 👍')
    else:
        return Response({'detail':'Not authorised to view this information'}, status = status.HTTP_400_BAD_REQUEST)