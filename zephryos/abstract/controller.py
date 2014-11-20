class AbstractController(object):
    cls_form = None
    field_types = {}  # todo: add metaclass to generate empty dict in every new class

    def __init__(self, cls_form):
        self.cls_form = cls_form

    def describe_fields(self):
        raise NotImplemented('describe_fields')

    def create_and_set_form(self, document):
        raise NotImplemented('create_and_set_form')

    def create_empty_form(self):
        raise NotImplemented('create_empty_form')

    @classmethod
    def add_new_type(cls, name, cls_type):
        cls.field_types[cls_type] = name