from bs4 import BeautifulSoup
from rest_framework.exceptions import ValidationError

ALLOWED_TAGS = ['a', 'code', 'i', 'strong']
ALLOWED_ATTRIBUTES = {'a': ['href', 'title']}

def validate_allowed_html(html: str):
    """
    Ensure the HTML string contains only allowed tags and attributes.
    Raises ValidationError if disallowed tags or attributes are found.
    """
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup.find_all(True):
        if tag.name not in ALLOWED_TAGS:
            raise ValidationError(f'Tag <{tag.name}> is not allowed.')
        allowed_attrs = ALLOWED_ATTRIBUTES.get(tag.name, [])
        for attr in tag.attrs:
            if attr not in allowed_attrs:
                raise ValidationError(f'Attribute "{attr}" not allowed on <{tag.name}> tags.')