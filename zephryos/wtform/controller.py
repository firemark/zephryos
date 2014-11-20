from wtforms.validators import input_required
from wtforms import fields as wtform_fields

from ..serializers import serialize_field
from ..abstract.controller import AbstractController


class WTFormController(AbstractController):
    field_types = {}

    def describe_fields(self):
        fields = self.cls_form()._fields
        return [
            serialize_field(
                type_field=self.field_types[field.__class__],
                name=name,
                fullname=field.label.text,
                required=input_required in field.validators,
                default=field.default,
                description=field.description,
            ) for name, field in fields.items()
        ]


WTFormController.add_new_type("text", wtform_fields.StringField)
WTFormController.add_new_type("bool", wtform_fields.BooleanField)