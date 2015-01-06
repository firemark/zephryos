from flask import Flask
from flask.json import jsonify
from zephryos.wtform.controller import WTFormController
from wtforms import (
    Form, BooleanField, StringField, FieldList, SelectField, IntegerField,
    FormField
)
from wtforms import validators
from wtforms.validators import input_required as inp_req

app = Flask(__name__, static_url_path='', static_folder='./')


class ItemForm(Form):
    __template__ = 'table'
    name = StringField(validators=[inp_req])
    category = SelectField(choices=[
        ('armor', 'Armor'),
        ('weapon', 'Weapon'),
        ('potion', 'Potion'),
        ('food', 'Food')
    ], default='armor')
    level = IntegerField()


class HeroForm(Form):
    name = StringField(validators=[inp_req])
    level = IntegerField(validators=[inp_req])
    race = SelectField(choices=[
        ('human', 'Human'),
        ('dwarf', 'Dwarf'),
        ('elf', 'Elf'),
        ('ogre', 'Ogre')
    ], default='elf')
    items = FieldList(FormField(ItemForm))

HeroCtrl = WTFormController(HeroForm)

@app.route("/hero/form")
def add_form():
    return jsonify({
        'fields': HeroCtrl.describe_fields()
    })

@app.route("/")
def index():
    return app.send_static_file('example4.html')

if __name__ == "__main__":
    app.run('0.0.0.0', 9069, debug=True)