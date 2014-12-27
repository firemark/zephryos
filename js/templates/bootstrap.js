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
        var symbol = "$";
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
        );

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

Zephyros.widgets.many_nested = Zephyros.createSubformWidget({
    render: function () {
        var self = this;
        var forms = this.state.forms;
        var renderedForms = forms.map(function (form, index) {
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
        });
        return (
            React.createElement("div", null, 
                React.createElement("a", {className: "btn btn-primary", onClick: this.addForm}, 
                    "Add new"
                ), 
                React.createElement("ul", {className: "list-group"}, 
                    renderedForms
                )
            )
        );
    }
});

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        var is_nested = field.type_field === 'many_nested';
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