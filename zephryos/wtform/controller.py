from wtforms.validators import input_required

from ..serializers import serialize_field
from ..abstract.controller import AbstractController

class WTFormController(AbstractController):

    def describe_fields(self):
        fields = self.cls_form()._fields
        return [
            serialize_field(
                type_field='text',
                name=name,
                fullname=field.label.text,
                required=input_required in field.validators,
                default=field.default,
                description=field.description,
            ) for name, field in fields.items()
        ]

