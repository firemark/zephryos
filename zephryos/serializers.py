def serialize_field(
    type_field, name, fullname=None, default=None,
    required=False, description=None, attrs=None, widget=None):

    return dict(
        type_field=type_field,
        name=name,
        fullname=fullname or name,
        description=description if description else None,
        attrs=attrs or {},
        #widget=widget,
        required=required,
        default=default
    )
