/**
 Maybe docstring blablabla
 **/

var Zephyros = {};

Zephyros.widgets = {};
Zephyros.fields = {};
Zephyros.forms = {};

Zephyros.createWidget = function (args) {
    args = args || {};
    var render = args.render;
    var getData = args.getData || function () {
        return this.state.value;
    };
    var setData = args.setData || function (value) {
        this.setState({value: value});
    };
    var change = args.change || function(event) {
        event.preventDefault();
        this.setData(event.target.value);
    };

    return React.createClass({
        getInitialState: function(){
            return {
                value: this.props.field.default
            };
        },
        change: change,
        render: render,
        getData: getData,
        setData: setData
    });
};

Zephyros.createTemplateForm = function (args) {
    var formRender = args.formRender;
    var fieldRender = args.fieldRender;
    var events = args.events || {};

    var fieldTemplate = React.createClass({
        render: fieldRender
    });

    var generateWidgets = function (fields) {
        return _.map(fields, function (field) {
            var widgetTemplate = Zephyros.widgets[field.type_field];
            return React.createElement(
                widgetTemplate, {ref: field.name, field: field}
            );
        });
    };

    var generateViewField = function(widgets) {
        return _.map(widgets, function(widget) {
            return React.createElement(
                fieldTemplate, {
                    widget: widget,
                    field: widget.props.field
                }
            );
        });
    };

    return React.createClass({
        getInitialState: function () {
            return {
                errors: {}
            };
        },
        events: events,
        getData: function () {
            return _.reduce(this.refs, function (obj, widget, key) {
                obj[key] = widget.getData();
                return obj;
            }, {});
        },
        setData: function (obj_values) {
            var refs = this.refs;
            _.forEach(obj_values, function(value, key) {
                var widget = refs[key];
                widget.setData(value);
            });
        },
        reset: function () {
            _.forEach(this.refs, function(widget) {
                widget.setData(widget.props.field.default);
            });
        },
        render: function () {
            var widgets = generateWidgets(this.props.fields);
            var viewFields = generateViewField(widgets);
            return formRender(viewFields);
        }
    });
};

Zephyros.createForm = function (fields, args) {
    args = args || {};
    var templateName = args.template || "default";
    var template = Zephyros.forms[templateName];
    return React.createElement(template, {fields: fields});
};