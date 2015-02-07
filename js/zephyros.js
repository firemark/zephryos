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
    var setErrors = args.setErrors || function(errors) {
        this.setState({errors: errors});
    };
    var clearErrors = args.clearErrors || function(errors) {
        this.setState({errors: []});
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
                value: this.props.field.default,
                errors: []
            };
        },
        change: change,
        render: render,
        getData: getData,
        setData: setData,
        setErrors: setErrors,
        clearErrors: clearErrors
    });
};

Zephyros.createSubformWidget = function (args) {
    args = args || {};
    var render = args.render;
    var subformTemplate = args.subformTemplate || "subform";

    var eachForm = function(callback) {

        _.forEach(this.refs, function (parentForm, key) {
            var keyMatch = /form_(\d+)/.exec(key);
            if (keyMatch === null)
                return;

            var form = parentForm._renderedChildren[".0"];
            callback(form, keyMatch[1]);
        });
    };

    var getData = args.getData || function () {
        var data = [];
        this.eachForm(function (form, key) {
            data[key] = form.getData();
        });
        return data;
    };
    var setErrors = function(errors) {
        this.eachForm(function (form, key) {
            form.setErrors(errors[key]);
        });
    };
    var clearErrors = function() {
        this.eachForm(function (form, key) {
            form.clearErrors();
        });
    };
    var addForm = args.addForm || function (index) {
        var fields = this.props.field.attrs.fields;
        var len = this.state.forms.length;
        var form = Zephyros.createForm(fields, {
            template: subformTemplate
        }, {
            index: _.isNumber(index)? Math.min(index, len) : this.state.index
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
        eachForm: eachForm,
        change: change,
        render: render,
        getData: getData,
        addForm: addForm,
        delForm: delForm,
        setErrors: setErrors,
        clearErrors: clearErrors
    });
};

Zephyros.createTemplateForm = function (args) {
    var formRender = args.formRender;
    var fieldRender = args.fieldRender;
    var events = args.events || {};

    var fieldTemplate = React.createClass({
        getInitialState: function() {
            return {errors: []}
        },
        render: fieldRender
    });

    var generateWidgets = function (fields) {
        return _.map(fields, function (field, i) {
            var fieldWidget = field.widget || {};
            var widgetTemplate = (
                Zephyros.widgets[fieldWidget.type] ||
                Zephyros.widgets[field.type_field]
            );
            if (_.isUndefined(widgetTemplate))
                throw 'widget ' + (field.type_field) + ' not found';
            return React.createElement(
                widgetTemplate, {
                    ref: "field_" + field.name,
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
                    ref: 'widget_' + widget.props.field.name,
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
                if (key.substring(0, 6) != 'field_')
                    return obj;
                obj[key.substring(6)] = widget.getData();
                return obj;
            }, {});
        },
        setData: function (obj_values) {
            var refs = this.refs;
            obj_values.forEach(function(value, key) {
                var widget = refs["field_" + key];
                widget.setData(value);
            });
        },
        setErrors: function(errors) {
            var refs = this.refs;
            _.forEach(errors, function(value, key) {
                refs["field_" + key].setErrors(value);
                refs["widget_" + key].setState({errors: value});
            });
        },
        clearErrors: function() {
            var refs = this.refs;
            _.forEach(this.props.fields, function(obj) {
                var key = obj.name;
                refs["field_" + key].clearErrors();
                refs["widget_" + key].setState({errors: []});
            });
        },
        reset: function () {
            var refs = this.refs;
            _.forEach(this.props.fields, function(obj) {
                var key = obj.name;
                var field = refs["field_" + key];
                field.reset();
                field.clearErrors();
                refs["widget_" + key].setState({errors: []});
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