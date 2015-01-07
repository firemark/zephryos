from wtforms.widgets import TextInput


class Widget(TextInput):
    args = None
    name = ""

    def __init__(self, name, **kwargs):
        super(Widget, self).__init__()
        self.name = name
        self.args = kwargs

    def __call__(self, field, **kwargs):
        return "<strong>!!Dynamic field!!</strong>";