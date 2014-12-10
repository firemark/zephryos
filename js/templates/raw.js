Zephyros.widgets.bool = Zephyros.createWidget({
    render: function () {
        return React.createElement("input", {type: "checkbox", onChange: this.change})
    }
});
Zephyros.widgets.text = Zephyros.createWidget({
    render: function () {
        return React.createElement("input", {type: "text", value: this.state.value, onChange: this.change})
    }
});

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            React.createElement("tr", null, 
                React.createElement("td", {for: field.name}, field.fullname), 
                React.createElement("td", null, widget)
            )
        );
    },
    formRender: function(fields) {
        return (
            React.createElement("form", null, 
                React.createElement("table", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", {width: "300px"}, "Field"), 
                        React.createElement("td", null, "Input")
                    ), 
                    fields
                ), 
                React.createElement("button", null, "Submit")
            )
        );
    }
});

Zephyros.forms.list = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            React.createElement("li", null, 
                React.createElement("b", {for: field.name}, field.fullname), 
                React.createElement("span", null, widget)
            )
        );
    },
    formRender: function(fields) {
        return (
            React.createElement("form", null, 
                React.createElement("ul", null, 
                    fields
                ), 
                React.createElement("button", null, "Submit")
            )
        );
    }
});