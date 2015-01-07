from .widget import Widget

def serialize_field(
    type_field, name, fullname=None, default=None,
    required=False, description=None, attrs=None, widget=None):

    if isinstance(widget, Widget):
        data_widget = {"type": widget.name, "attrs": widget.args}
    else:
        data_widget = {}

    return dict(
        type_field=type_field,
        name=name,
        fullname=fullname or name,
        description=description if description else None,
        attrs=attrs or {},
        widget=data_widget,
        required=required,
        default=default
    )
