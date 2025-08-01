from io import BytesIO
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from PIL import Image, ImageOps

ALLOWED_EXT = ('jpg','jpeg','gif','png','txt')
MAX_TXT_BYTES = 100 * 1024
MAX_FILES_PER_OBJ = 3
MAX_IMAGE_SIZE = (320, 240)

def validate_file(f):
    ext = f.name.rsplit('.', 1)[-1].lower()
    if ext not in ALLOWED_EXT:
        raise ValidationError(f'Unsupported extension “.{ext}”')
    if ext == 'txt' and f.size > MAX_TXT_BYTES:
        raise ValidationError('Text files must be ≤100 KB.')

class Attachment(models.Model):
    ''' Generic attachment model to be used in Posts and Replies '''
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id    = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type','object_id')

    file = models.FileField(upload_to='attachments/', validators=[validate_file])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        ''' Resize image if it's larger than MAX_IMAGE_SIZE '''
        ext = self.file.name.rsplit('.',1)[-1].lower()
        if ext in ('jpg','jpeg','gif','png'):
            img = Image.open(self.file)
            img = ImageOps.exif_transpose(img)
            try:
                resample = Image.Resampling.LANCZOS
            except AttributeError:
                resample = Image.LANCZOS

            if img.width > MAX_IMAGE_SIZE[0] or img.height > MAX_IMAGE_SIZE[1]:
                img.thumbnail(MAX_IMAGE_SIZE, resample)
                buffer = BytesIO()
                fmt = ext.upper()
                if fmt in ('JPG', 'JPEG'):
                    fmt = 'JPEG'
                img.save(buffer, format=fmt, quality=85)
                buffer.seek(0)
                self.file.save(self.file.name,
                               ContentFile(buffer.read()),
                               save=False)
        super().save(*args, **kwargs)