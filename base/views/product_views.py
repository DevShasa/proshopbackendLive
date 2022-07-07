from queue import Empty
from base.models import Product, Review 
from base.serializers import ProductSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status  
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

@api_view(['GET'])
def getProducts(request):
    # Get keyword from url
    query = request.query_params.get('keyword')
    print(f'<<<QUERY>>> : ', query)
    if query == None: # there is no ?keyword in the url
        query = ""

    # Filter productlist by query if none return whole list 
    products = Product.objects.filter(name__icontains=query)

    # Grab page from url 
    page = request.query_params.get('page')

    # paginate products Paginator(listItem, items_per_page)
    paginator = Paginator(products, 4)

    # page can be passed in as a string or int
    # page(1) or page("1")
    try:
        products =  paginator.page(page)
    except PageNotAnInteger:
        firstpage = 1
        products = paginator.page(firstpage)
        page = firstpage
    except EmptyPage: #page exeeds available pages, grab the last page
        products = paginator.page(paginator.num_pages)

    serializer = ProductSerializer(products, many=True)

    return Response({
        'products': serializer.data,
        'page': int(page), 
        'pages': paginator.num_pages
    })


@api_view(['GET'])
def getTopProducts(request):
    # Get rating greater than 4
    products = Product.objects.filter(rating__gt=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id = pk)
    serializer = ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, id):
    product = Product.objects.get(_id = id)
    product.delete()
    return Response('Product has been deleted')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user = user,
        name = 'Sample Name',
        price = 0,
        brand = 'Sample Brand',
        countInStock = 0,
        category = 'Sample category', 
        description =  'lorem ipsum dolor sit amet'
    )
    
    serializer = ProductSerializer(product, many=False )
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, id):
    try:
        product = Product.objects.get(_id = id)
        data = request.data

        product.name = data['name']
        product.brand = data['brand']
        product.category = data['category']
        product.description = data['description']
        product.price = data['price']
        product.countInStock = data['countInStock']

        product.save()

        serializer = ProductSerializer(product, many=False )
        return Response(serializer.data)

    except:
        message = {
            'detail': 'Product does not exist'
        }
        return Response(message, status = status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id = product_id)
    # product.image = request.FILES.get('newProductImage')
    product.image = data['newProductImage']
    product.save()

    return Response('Image was Uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, product_key):
    user = request.user
    product = Product.objects.get(_id = product_key)
    data = request.data

    # 1  A review alreay exists
    reviewExists = product.review_set.filter(user=user).exists()
    if reviewExists:
        content = { 'detail': f'Product already has a review by {user.username }' }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # 2 Customer submitted review with no rating
    elif data['rating'] == 0:
        content = { 'detail': 'Please select a rating' }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # 3 Create a review
    else:
        review = Review.objects.create(
            product = product,
            user = user,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment']
        )

        # Count all the reviews
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        # Get the total rating across all the reviews for the product
        total = 0
        for i in reviews:
            total += i.rating
        
        # Rating 
        product.rating = total / len(reviews)
        product.save()

        return Response('Review added')