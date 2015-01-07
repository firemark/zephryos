from wtforms.validators import input_required
from wtforms import fields as wtform_fields

from ..serializers import serialize_field
from ..abstract.controller import AbstractController


class WTFormController(AbstractController):
    field_types = {}

    def describe_fields(self, form=None):
        form = form or self.cls_form()
        fields = form._fields
        return [
            self.serialize_field(name, field)
            for name, field in fields.items()
        ]

    def describe_form(self, form=None):
        form = form or self.cls_form()
        return {
            "template": getattr(form, "__template__", "default")
        }

    def get_field_type(self, field):
        return self.field_types.get(field.__class__, ('unknown', None))

    def serialize_field(self, name, field):
        field_type, func = self.get_field_type(field)
        if func is None:
            attrs = {}
        else:
            args = func(self, field)
            if isinstance(args, tuple) and len(args) == 2:
                field_type, attrs = args
            else:
                attrs = args

        return serialize_field(
            type_field=field_type,
            name=name,
            fullname=field.label.text,
            required=input_required in field.validators,
            default=field.default,
            description=field.description,
            attrs=attrs,
            widget=field.widget
        )

    @classmethod
    def add_new_type(cls, name, cls_type, func=None):
        cls.field_types[cls_type] = (name, func)

        def outer(decorated_func):
            cls.field_types[cls_type] = (name, decorated_func)
            return decorated_func

        return outer


WTFormController.add_new_type("text", wtform_fields.StringField)
WTFormController.add_new_type("bool", wtform_fields.BooleanField)
WTFormController.add_new_type("integer", wtform_fields.IntegerField)

@WTFormController.add_new_type("listed", wtform_fields.FieldList)
def listed_type(ctrl, field):
    nested_field = field._add_entry()

    if isinstance(nested_field, wtform_fields.FormField):
        return 'listed_subform', {'fields': ctrl.describe_fields(nested_field)}
    else:
        return {'field': ctrl.serialize_field(nested_field)}

@WTFormController.add_new_type("select", wtform_fields.SelectField)
def select_type(ctrl, field):
    choices = field.choices
    return {
        'choices': [{'name': name, 'value': value} for value, name in choices]
    }


#todo: add more types