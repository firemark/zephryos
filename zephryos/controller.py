from wtforms.validators import input_required
from .serializers import serialize_field


class AbstractController(object):
    cls_form = None

    def __init__(self, cls_form):
        self.cls_form = cls_form

    def describe_fields(self):
        raise NotImplemented('describe_fields')

    def create_and_set_form(self, document):
        raise NotImplemented('create_and_set_form')

    def create_empty_form(self):
        raise NotImplemented('create_empty_form')


class WTFormController(AbstractController):
    def describe_fields(self):
        fields = self.cls_form._unbounds_fields
        return {
            name: serialize_field(
                type_field='string',
                name=name,
                required=input_required in field.validators
            ) for name, field in fields
        }
