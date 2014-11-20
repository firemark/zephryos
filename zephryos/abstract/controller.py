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