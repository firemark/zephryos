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
    var reset = args.reset || function (value) {
        this.setData(this.props.field.default);
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

Zephyros.createSubformWidget = function (args) {
    args = args || {};
    var render = args.render;
    var subformTemplate = args.subformTemplate || "subform";
    var getData = args.getData || function () {
        var data = [];
        _.forEach(this.refs, function (parentForm, key) {
            var keyMatch = /form_(\d+)/.exec(key);
            if (keyMatch === null)
                return;

            var form = parentForm._renderedChildren[".0"];
            data[keyMatch[1]] = form.getData();
        });

        return data;
    };
    var addForm = args.addForm || function (index) {
        var fields = this.props.field.fields;
        var len = this.state.forms.length;
        var form = Zephyros.createForm(fields, {
            template: subformTemplate
        }, {
            index: _.isNumber(index)? Math.min(index, len)  : this.state.index
        });

        if (!_.isUndefined(index))
            this.state.forms.splice(index, 0, form);
        else
            this.state.forms.push(form);
        this.setState({forms: this.state.forms, index: this.state.index + 1});
    };

    var delForm = args.delForm || function(index) {
        if (!_.isUndefined(index))
            this.state.forms.splice(index, 1);
        else
            this.state.forms.pop();
        this.setState({forms: this.state.forms});
    };
    var reset = args.reset || function () {
        this.setState({forms: []});
    };
    var change = args.change || function(event) {
        event.preventDefault();
        this.setData(event.target.value);
    };

    return React.createClass({
        getInitialState: function(){
            return {
                forms: [],
                index: 0
            };
        },
        change: change,
        render: render,
        getData: getData,
        addForm: addForm,
        delForm: delForm
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
        return _.map(fields, function (field, i) {
            var fieldWidget = field.widget || {};
            var widgetTemplate = (
                Zephyros.widgets[fieldWidget.type]
                || Zephyros.widgets[field.type_field]
            );

            return React.createElement(
                widgetTemplate, {
                    ref: field.name,
                    field: field,
                    index: i,
                    uniqId: Date.now() + "-" + field.name
                }
            );
        });
    };

    var generateViewField = function(widgets) {
        return _.map(widgets, function(widget, i) {
            return React.createElement(
                fieldTemplate, {
                    widget: widget,
                    field: widget.props.field,
                    index: i,
                    uniqId: widget.props.uniqId
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
            obj_values.forEach(function(value, key) {
                var widget = refs[key];
                widget.setData(value);
            });
        },
        reset: function () {
            _.forEach(this.refs, function(widget) {
                widget.reset();
            });
        },
        render: function () {
            var widgets = generateWidgets(this.props.fields);
            var viewFields = generateViewField(widgets);
            return formRender(viewFields);
        }
    });
};

Zephyros.createForm = function (fields, args, props) {
    args = args || {};
    props = props || {};
    var ref = args.ref || null;
    var key = args.key || null;
    var templateName = args.template || "default";
    var template = Zephyros.forms[templateName];
    if(_.isUndefined(template))
        throw "template not found";
    props.fields = fields;
    return React.createElement(template, props);
};