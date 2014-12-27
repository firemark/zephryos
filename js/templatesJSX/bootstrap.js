Zephyros.widgets.bool = Zephyros.createWidget({
    render: function () {
        return <input
            id={this.props.uniqId}
            type="checkbox"
            checked={!!this.state.value}
            onChange={this.change} />;
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
        return <input
            type="text"
            id={this.props.uniqId}
            className="form-control"
            value={this.state.value}
            onChange={this.change} />;
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
            <div className="input-group">
                <span className="input-group-addon">{symbol}</span>
                <input
                    type="numeric"
                    id={this.props.uniqId}
                    className="form-control"
                    value={this.state.value}
                    onChange={this.change} />
            </div>
        );

    }
});

Zephyros.widgets.email = Zephyros.createWidget({
    render: function () {
        var field = this.props.field;
        return <input
            type="text"
            id={this.props.uniqId}
            className="form-control"
            value={this.state.value}
            onChange={this.change} />;
    }
});

Zephyros.widgets.many_nested = Zephyros.createSubformWidget({
    render: function () {
        var self = this;
        var forms = this.state.forms;
        var renderedForms = forms.map(function (form, index) {
            return (
                <li key={form.props.index} className="list-group-item">
                    <div ref={'form_' + index}>{form}</div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <a
                                className="btn btn-danger"
                                onClick={self.delForm.bind(self, index)}>Delete</a>
                        </div>

                    </div>
                </li>
            );
        });
        return (
            <div>
                <a className="btn btn-primary" onClick={this.addForm}>
                    Add new
                </a>
                <ul className="list-group">
                    {renderedForms}
                </ul>
            </div>
        );
    }
});

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        var is_nested = field.type_field === 'many_nested';
        var reqWidget = field.required? <b style={{color: 'red'}}>*</b> : "";
        return (
            <div className="form-group">
                <label htmlFor={this.props.uniqId} className="col-sm-3 control-label">
                    <span>{field.fullname}</span> {reqWidget}
                </label>
                <div className={!is_nested? "col-sm-9" : ""}>{widget}</div>
            </div>
        );
    },
    formRender: function(fields) {
        return (
            <form className="form-horizontal">
                {fields}
                <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-9">
                        <b style={{color: 'red'}}>*</b> are required
                    </div>
                </div>
            </form>
        );
    }
});

Zephyros.forms.subform = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            <div className="form-group">
                <label htmlFor={this.props.uniqId} className="col-sm-2 control-label">
                    {field.fullname}
                </label>
                <div className="col-sm-9">{widget}</div>
            </div>
        );
    },
    formRender: function(fields) {
        return <div className="form-group">{fields}</div>;
    }
});