from flask import Flask
from flask.json import jsonify
from zephryos.wtform.controller import WTFormController
from wtforms import Form, BooleanField, StringField, validators
from wtforms.validators import input_required as inp_req

app = Flask(__name__, static_url_path='', static_folder='./')


class SignForm(Form):
    first_name = StringField('First Name', validators=[inp_req])
    last_name = StringField('Last Name', validators=[inp_req])
    email = StringField(
        'Email',
        validators=[validators.Email(), inp_req]
    )
    re_email = StringField(
        'Retype email',
        validators=[validators.EqualTo('email'), inp_req]
    )
    accept_rules = BooleanField(
        label='I accept the site rules',
        validators=[inp_req]
    )

@app.route("/sign/form")
def sign_form():
    ctrl = WTFormController(SignForm)
    return jsonify({
        'fields': ctrl.describe_fields()
    })

@app.route("/")
def index():
    return app.send_static_file('example3.html')

if __name__ == "__main__":
    app.run('0.0.0.0', 9069, debug=True)
