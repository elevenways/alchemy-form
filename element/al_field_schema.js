/**
 * The al-field-schema element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FieldSchema = Function.inherits('Alchemy.Element.Form.FieldCustom', 'FieldSchema');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldSchema.setTemplateFile('form/elements/alchemy_field_schema');

/**
 * Get the actual schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.4
 */
FieldSchema.setProperty(function schema() {

	const field = this.alchemy_field?.config;

	if (field?.options) {

		let schema = field.options.schema;

		if (typeof schema == 'string') {
			const form = this.alchemy_field.alchemy_form;

			// @TODO: This will always get the "root" form value,
			// so this might not work with nested schemas
			let record_value = form.value;

			if (form.model) {
				record_value = record_value[form.model];
			}

			return field.getSubschema(record_value, schema)
		}

		return schema;
	}
});

/**
 * Get the actual subschema fields
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.3
 */
FieldSchema.setProperty(function sub_fields() {

	let schema = this.schema;

	if (schema) {

		if (typeof schema != 'object') {
			throw new Error('Expected a schema object, but found "' + typeof schema + '" instead');
		}

		if (schema) {
			return schema.getSorted();
		}
	}

	return [];
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldSchema.setProperty(function value() {

	let entries = this.queryAllNotNested('al-field'),
	    result = {},
	    entry,
	    i;

	for (i = 0; i < entries.length; i++) {
		entry = entries[i];
		result[entry.field_name] = entry.value;
	}

	return result;

}, function setValue(value) {
	throw new Error('Unable to set value of schema field');
});

/**
 * Get the optional field that is supplying the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FieldSchema.setMethod(function getSchemaSupplierField() {

	if (!this.alchemy_field || !this.alchemy_field.config || !this.alchemy_field.config.options) {
		return;
	}

	let schema = this.alchemy_field.config.options.schema;

	if (typeof schema == 'string') {
		let other_field_path = this.resolvePath(schema);

		schema = null;
	
		let form = this.alchemy_field.alchemy_form;

		if (form) {
			return form.findFieldByPath(other_field_path);
		}
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FieldSchema.setMethod(function introduced() {

	let supplier_field = this.getSchemaSupplierField();

	if (supplier_field) {
		supplier_field.addEventListener('change', e => {
			this.rerender();
		});

		this.rerender();
	}
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
FieldSchema.setProperty(function original_value() {

	let field = this.alchemy_field,
	    path = this.field_path_in_record;

	if (field && path) {
		let form = field.alchemy_form || this.alchemy_form || this.field_context.alchemy_form;

		if (form) {
			return Object.path(form.document, path);
		}
	}

	let context = this.field_context.alchemy_field_schema,
	    data;

	if (context) {
		data = context.original_value;
	} else {
		context = this.field_context.alchemy_form || this.alchemy_field.alchemy_form;
		data = context.document;
	}

	path = this.field_path_in_current_schema;

	let result = Object.path(data, path);

	return result;
});
