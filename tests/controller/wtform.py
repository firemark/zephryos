from wtforms import Form, BooleanField, StringField, validators
from zephyros import controller


class FooForm(Form):
    username = StringField(
        label='Username',
        validators=[validators.Length(min=4, max=25)],
        description='First name and Last name',
        default='Ivan Ivanowsky'
    )
    accept_rules = BooleanField('I accept the site rules',
                                [validators.input_required])


def test_controller_describe_fields():
    ctrl = controller.WTFormController(FooForm)
    fields = ctrl.describe_fields()

    assert len(fields) == 2
    assert fields[0] == dict(
        name='username', fullname='Username',
        require=False, type='text',
        attrs={}, default='Ivan Ivanowsky',
        widget={'type': 'input', 'attrs': {}},
        description='First name and Last name',
        validators=[{'type': 'length', 'attrs': {'min': 4, 'max': 25}}]
    )


def test_controller_describe_form():
    ctrl = controller.WTFormController(FooForm)