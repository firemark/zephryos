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

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            <div className="form-group">
                <label htmlFor={this.props.uniqId} className="col-sm-2 control-label">
                    {field.fullname}
                </label>
                <div className="col-sm-10">{widget}</div>
            </div>
        );
    },
    formRender: function(fields) {
        return (
            <form className="form-horizontal">
                {fields}
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-default">
                            Sign in
                        </button>
                    </div>
                </div>
            </form>
        );
    }
});