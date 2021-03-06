import * as React from 'react';
import { Link } from 'react-router-dom';
import { Panel, FormControl, Grid, Row, Col } from 'react-bootstrap';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {
    IField,
    IFormError,
    FieldRegistry,
    FieldOptionEditor,
    FieldSelector,
    FormBuilder,
    NestedFormBuilder,
    FormBuilderContext,
    FormInput,
    NestedFormInput,
    FormDisplay,
    NestedFormDisplay,
    NestedForm,
} from 'react-dynamic-formbuilder';
import SingleSelector from './fields/SingleSelector';
import SingleSelectorOptionEditor from './fields/SingleSelectorOptionEditor';
import SingleLineTextField from './fields/SingleLineTextField';
import SingleLineTextFieldOptionEditor from './fields/SingleLineTextFieldOptionEditor'
import KeyValueDisplay from './fields/KeyValueDisplay';

import './DemoPage.css';

interface IState {
    fields: IField[],
    selectedField: IField,
    value: any,
    error: IFormError,
}

const registry: FieldRegistry = {
    'SingleSelector': {
        field: {
            key: '',
            label: 'Please select:',
            type: 'SingleSelector',
            options: {
                selectOpts: ['a', 'b', 'c'],
            }
        },
        displayName: '单选(selector)',
        input: SingleSelector,
        builder: SingleSelector,
        editor: SingleSelectorOptionEditor,
        display: KeyValueDisplay,
    },
    'SingleLineTextField': {
        field: {
            key: '',
            label: 'Name',
            type: 'SingleLineTextField',
            options: {
                hint: 'Please enter your name',
                required: true,
                unique: false,
            }
        },
        displayName: '单行输入(input)',
        input: SingleLineTextField,
        builder: SingleLineTextField,
        editor: SingleLineTextFieldOptionEditor,
        display: KeyValueDisplay,
    },
};

registry[NestedForm.Type] = {
    field: NestedForm.FieldTemplate,
    displayName: '明细(NestForm)',
    input: NestedFormInput,
    builder: NestedFormBuilder,
    display: NestedFormDisplay,
};

class DemoPage extends React.Component<void, IState> {
    private fieldEdited: (field: IField) => void;

    constructor() {
        super()
        this.onChangeFields = this.onChangeFields.bind(this);
        this.onFieldEditing = this.onFieldEditing.bind(this);
        this.onDeleteField = this.onDeleteField.bind(this);
        this.onFieldOptionChanged = this.onFieldOptionChanged.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.onBeforeAddField = this.onBeforeAddField.bind(this);
        this.state = {
            fields: [],
            selectedField: null,
            value: {},
            error: null,
        };
    }

    private onFieldEditing(field: IField, done: (field: IField) => void) {
        this.setState({ selectedField: field } as IState);
        this.fieldEdited = done;
    }

    private onDeleteField(fields: IField[]) {
        this.setState({ fields } as IState);
    }

    private onChangeFields(fields: IField[]) {
        this.setState({ fields } as IState);
    }

    private onFieldOptionChanged(field: IField) {
        this.setState({ selectedField: field } as IState);
        this.fieldEdited(field);
    }

    private onValueChanged(value: any, error: IFormError) {
        this.setState({ value, error } as IState);
    }

    private onBeforeAddField(field: IField) {
        field.key = Math.floor((Math.random() * 10000000) + 1).toString();
        return true;
    }

    render() {
        const form = JSON.stringify(this.state.fields);
        const value = JSON.stringify(this.state.value);
        const error = JSON.stringify(this.state.error);

        return (
            <div>
                <Grid bsClass='demo-page-grid-fluid'>
                    <Row>
                        <Col md={3}>
                            <span>Field Selector</span>
                            <Panel>
                                <FieldSelector
                                    registry={registry}
                                />
                            </Panel>
                        </Col>
                        <Col md={5}>
                            <span>Form Builder</span>
                            <Panel>
                                <div className='form-horizontal'>
                                    <FormBuilder
                                        onFieldEditing={this.onFieldEditing}
                                        onChange={this.onChangeFields}
                                        registry={registry}
                                        fields={this.state.fields}
                                        onBeforeAddField={this.onBeforeAddField}
                                    />
                                </div>
                            </Panel>
                        </Col>
                        <Col md={4}>
                            <span>Option Editor</span>
                            <Panel>
                                <FieldOptionEditor
                                    registry={registry}
                                    field={this.state.selectedField}
                                    onChange={this.onFieldOptionChanged}
                                />
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <Panel>
                                <div>Form Preview</div>
                                <FormInput
                                    fields={this.state.fields}
                                    registry={registry}
                                    value={this.state.value}
                                    onChange={this.onValueChanged} />
                            </Panel>
                        </Col>
                        <Col md={4}>
                            <Panel>
                                <div>Form View</div>
                                <div className='form-horizontal'>
                                    <FormDisplay
                                        fields={this.state.fields}
                                        registry={registry}
                                        value={this.state.value}
                                    />
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <Panel>
                                <div>Debug: Form definitions</div>
                                <FormControl componentClass='textarea' style={{ width: '100%', height: 120 }} readOnly value={form} />
                                <div>Debug: Form values</div>
                                <FormControl componentClass='textarea' style={{ width: '100%', height: 120 }} readOnly value={value} />
                                <div>Debug: Form validation error</div>
                                <FormControl componentClass='textarea' style={{ width: '100%', height: 120 }} readOnly value={error} />
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <Link to='/'>Go back to doc page</Link>
                        </Col>
                    </Row>
                </Grid>
            </div >
        );
    }
}

export default DemoPage
