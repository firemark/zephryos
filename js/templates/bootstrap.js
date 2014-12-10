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

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: this.props.uniqId, className: "col-sm-2 control-label"}, 
                    field.fullname
                ), 
                React.createElement("div", {className: "col-sm-10"}, widget)
            )
        );
    },
    formRender: function(fields) {
        return (
            React.createElement("form", {className: "form-horizontal"}, 
                fields, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
                        React.createElement("button", {type: "submit", className: "btn btn-default"}, 
                            "Sign in"
                        )
                    )
                )
            )
        );
    }
});