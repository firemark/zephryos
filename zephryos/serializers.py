def serialize_field(
    type_field, name, full_name=None, default=None,
    required=False, doc=None, attrs=None, widget=None):

    return dict(
        type_field=type_field,
        name=name,
        full_name=full_name or name,
        doc=doc,
        attrs=attrs or {},
        widget=widget,
        required=required,
        default=default
    )
