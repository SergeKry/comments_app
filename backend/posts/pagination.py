from rest_framework.pagination import PageNumberPagination

class PostPagination(PageNumberPagination):
    page_size = 25
    # Allow client to override page size using ?page_size=
    page_size_query_param = 'page_size'
    # Set an upper bound on page size
    max_page_size = 100