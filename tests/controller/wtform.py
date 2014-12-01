from wtforms import Form, BooleanField, StringField, validators
from zephryos.wtform import controller


class FooForm(Form):
    username = StringField(
        'Username',
        #validators=[validators.Length(min=4, max=25)],
        description='First name and Last name',
        default='Ivan Ivanowsky'
    )
    accept_rules = BooleanField(
        label='I accept the site rules',
        validators=[validators.input_required]
    )


def test_controller_describe_fields():
    ctrl = controller.WTFormController(FooForm)
    fields = ctrl.describe_fields()

    assert len(fields) == 2
    assert fields[0] == dict(
        name='username', fullname='Username',
        required=False, type_field='text',
        attrs={}, default='Ivan Ivanowsky',
        #widget={'type': 'input', 'attrs': {}},
        description='First name and Last name',
        #validators=[{'type': 'length', 'attrs': {'min': 4, 'max': 25}}]
    )
    assert fields[1] == dict(
        name='accept_rules', fullname='I accept the site rules',
        required=True, type_field='bool',
        attrs={}, default=None,
        #widget={'type': 'checkbox', 'attrs': {}},
        description=None,
        #validators=[]
    )


def test_controller_describe_form():
    ctrl = controller.WTFormController(FooForm)
    data = ctrl.describe_form()

    assert data['template'] == 'default'