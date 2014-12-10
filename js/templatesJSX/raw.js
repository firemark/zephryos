Zephyros.widgets.bool = Zephyros.createWidget({
    render: function () {
        return <input type="checkbox" onChange={this.change} />
    }
});
Zephyros.widgets.text = Zephyros.createWidget({
    render: function () {
        return <input type="text" value={this.state.value} onChange={this.change} />
    }
});

Zephyros.forms.default = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            <tr>
                <td for={field.name}>{field.fullname}</td>
                <td>{widget}</td>
            </tr>
        );
    },
    formRender: function(fields) {
        return (
            <form>
                <table>
                    <tr>
                        <th width='300px'>Field</th>
                        <td>Input</td>
                    </tr>
                    {fields}
                </table>
                <button>Submit</button>
            </form>
        );
    }
});

Zephyros.forms.list = Zephyros.createTemplateForm({
    fieldRender: function () {
        var field = this.props.field;
        var widget = this.props.widget;
        return (
            <li>
                <b for={field.name}>{field.fullname}</b>
                <span>{widget}</span>
            </li>
        );
    },
    formRender: function(fields) {
        return (
            <form>
                <ul>
                    {fields}
                </ul>
                <button>Submit</button>
            </form>
        );
    }
});