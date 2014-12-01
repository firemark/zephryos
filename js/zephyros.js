/**
 Maybe docstring blablabla
 **/

var Zephyros = {};

Zephyros.widgets = {};
Zephyros.fields = {};

Zephyros.createWidget = function (args) {
    var render = args.render;
    var change = args.change || function(event) {
        this.setState({value: event.target.value});
    };

    return React.createClass({
        getInitialState: function () {
            return {
                value: args.default,
                name: args.name,
                fullname: args.fullname,
                required: args.required,
                description: args.description,
                type: args.type_field
            };
        },
        change: change,
        render: render
    });
};

Zephyros.createForm = function (form, fields) {
    var widgets = [];
    _.each(fields, function (field) {
        var widget = Zephyros.widgets[field.type_field];
        widgets.push(widget(field));
    });

    return React.createElement("form", null, widgets);
};