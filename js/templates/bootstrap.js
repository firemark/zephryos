Zephyros.widgets.unknown = Zephyros.createWidget({
    render: function () {
        return React.createElement("strong", null, "undefined");
    },
    setData: function (value) {},
    getData: function () {return null;}
});

Zephyros.widgets.bool = Zephyros.createWidget({
    render: function () {
        return React.createElement("input", {
            id: this.props.uniqId, 
            type: "checkbox", 
            checked: !!this.state.value, 
            onChange: this.change});
    },
    change: function (event) {
        //event.preventDefault();
        this.setData(!this.state.value);
    },
    setData: function (value) {
        this.setState({value: !!value});
    }

});

Zephyros.widgets.select = Zephyros.createWidget({
    render: function () {
        var attrs = this.props.field.attrs || {};
        var choices = attrs.choices || [];
        return (
            React.createElement("select", {value: this.state.value, onChange: this.change, className: "form-control"}, 
                choices.map(function (choice) {
                    return React.createElement("option", {value: choice.value}, choice.name)
                })
            )
        );
    }
});

Zephyros.widgets.text = Zephyros.createWidget({
    render: function () {
        var field = this.props.field;
        return React.createElement("input", {
            type: "text", 
            id: this.props.uniqId, 
            className: "form-control", 
            value: this.state.value, 
            onChange: this.change});
    }
});

Zephyros.widgets.integer = Zephyros.createWidget({
    getData: function (value) {
        return parseInt(this.state.value);
    },
    change: function (event) {
        var value = event.target.value;
        event.preventDefault();
        this.setData(value.replace(/[^0-9]+/, ''));
    },
    render: function () {
        var field = this.props.field;
        var widget = field.widget || {};
        var attrs = widget.attrs || {};
        var symbol = attrs.symbol || "Integer";
        return (
            React.createElement("div", {className: "input-group"}, 
                React.createElement("span", {className: "input-group-addon"}, symbol), 
                React.createElement("input", {
                    type: "numeric", 
                    id: this.props.uniqId, 
                    className: "form-control", 
                    value: this.state.value, 
                    onChange: this.change})
            )
        )

    }
});

Zephyros.widgets.email = Zephyros.createWidget({
    render: function () {
        var field = this.props.field;
        return React.createElement("input", {
            type: "text", 
            id: this.props.uniqId, 
            className: "form-control", 
            value: this.state.value, 
            onChange: this.change});
    }
});

Zephyros.widgets.listed_subform = Zephyros.createSubformWidget({
    render: function () {
        var self = this;
        var forms = this.state.forms;
        return (
            React.createElement("div", null, 
                React.createElement("a", {className: "btn btn-primary", onClick: this.addForm}, 
                    "Add new"
                ), 
                React.createElement("ul", {className: "list-group"}, 
                    forms.map(function (form, index) {
                return (
                    React.createElement("li", {key: form.props.index, className: "list-group-item"}, 
                        React.createElement("div", {ref: 'form_' + index}, form), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
                                React.createElement("a", {
                                    className: "btn btn-danger", 
                                    onClick: self.delForm.bind(self, index)}, "Delete")
                            )
                        )
                    )
                );
                })
                )
            )
        );
    }
});

Zephyros.widgets.tabled_subform = Zephyros.createSubformWidget({
    subformTemplate: 'table',
    render: function () {
        var self = this;
        var fields = this.props.field.attrs.fields;
        var forms = this.state.forms;
        return (
            React.createElement("table", {className: "table table-striped"}, 
                React.createElement("br", null), 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", {className: "col-sm-1"}, " * "), 
                    fields.map(function (field){
                        var reqWidget = field.required? React.createElement("b", {style: {color: 'red'}}, "*") : "";
                        return React.createElement("th", null, field.fullname, " ", reqWidget);
                    }), 
                        React.createElement("td", null, " - ")
                    )
                ), 
                React.createElement("tfoot", null, 
                    React.createElement("th", {colSpan: fields.length}, 
                        React.createElement("a", {className: "btn btn-primary", onClick: this.addForm}, 
                            "Add new"
                        )
                    )
                ), 
                React.createElement("tbody", null, 
                    forms.map(function (form, index) {
                return (
                    React.createElement("tr", {key: form.props.index}, 
                        React.createElement("th", null, index + 1), 
                        React.createElement("div", {ref: 'form_' + index}, form), 
                        React.createElement("td", null, 
                            React.createElement("a", {
                                className: "btn btn-danger", 
                                onClick: self.delForm.bind(self, index)}, "Delete")
                        )
                    )
                );
                })
                )
            )
        );
    }
});

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        var is_nested = field.type_field === 'listed_subform';
        var reqWidget = field.required? React.createElement("b", {style: {color: 'red'}}, "*") : "";
        return (
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: this.props.uniqId, className: "col-sm-3 control-label"}, 
                    React.createElement("span", null, field.fullname), " ", reqWidget
                ), 
                React.createElement("div", {className: !is_nested? "col-sm-9" : ""}, widget)
            )
        );
    },
    formRender: function(fields) {
        return (
            React.createElement("form", {className: "form-horizontal"}, 
                fields, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("div", {className: "col-sm-offset-3 col-sm-9"}, 
                        React.createElement("b", {style: {color: 'red'}}, "*"), " are required"
                    )
                )
            )
        );
    }
});

Zephyros.forms.table = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return React.createElement("td", {className: "form-group col-sm-3"}, widget);
    },
    formRender: function(fields) {
        return React.createElement("span", null, fields);
    }
});

Zephyros.forms.subform = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: this.props.uniqId, className: "col-sm-2 control-label"}, 
                    field.fullname
                ), 
                React.createElement("div", {className: "col-sm-9"}, widget)
            )
        );
    },
    formRender: function(fields) {
        return React.createElement("div", {className: "form-group"}, fields);
    }
});