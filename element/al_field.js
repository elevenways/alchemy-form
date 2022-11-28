/**
 * The al-field element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.4
 */
const Field = Function.inherits('Alchemy.Element.Form.Base', 'Field');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setTemplateFile('form/elements/alchemy_field');

/**
 * Use a new Renderer scope for the contents
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setStatic('use_new_renderer_scope', true);

/**
 * The data source url/route to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
Field.setAttribute('data-src');

/**
 * The name of the field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setAttribute('field-name');

/**
 * The type of the field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
Field.setAttribute('field-type');

/**
 * The view override
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setAttribute('field-view');

/**
 * The wrapper view override
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 */
Field.setAttribute('wrapper-view');

/**
 * Is this a read only field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
Field.setAttribute('readonly', {boolean: true});

/**
 * Widget settings for use in the views
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
Field.setAssignedProperty('widget_settings');

/**
 * Get the parent al-form element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Field.enforceProperty(function alchemy_form(new_value) {

	if (new_value == null) {
		new_value = this.queryUp('al-form');

		if (!new_value && this.field_context) {
			new_value = this.field_context.queryUp('al-form');
		}

		if (!new_value && this.alchemy_field_schema && this.alchemy_field_schema.alchemy_field) {
			new_value = this.alchemy_field_schema.alchemy_field.alchemy_form;
		}
	}
	
	return new_value;
});

/**
 * Get the error area
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.addElementGetter('error_area', '.error-area');

/**
 * Get the optional al-field-schema it belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Field.enforceProperty(function alchemy_field_schema(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('al-field-schema');
	}

	return new_value;
});

/**
 * Get the field info
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.8
 */
Field.enforceProperty(function config(new_value, old_value) {

	if (!new_value && this.field_name) {

		let schema = this.schema;

		if (schema) {
			new_value = schema.getField(this.field_name);
		}
	}

	if (new_value && new_value.constructor && new_value.constructor.type_name) {
		this.field_type = new_value.constructor.type_name;
	} else if (new_value) {
		this.field_type = null;
	}

	return new_value;
});

/**
 * Get the schema this field belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.9
 */
Field.enforceProperty(function schema(new_value, old_value) {

	if (!new_value) {
		// See if this is in a schema field
		if (this.alchemy_field_schema) {
			new_value = this.alchemy_field_schema.schema;
		}
	}

	// See if the al-form element has an explicit schema instance
	if (!new_value && this.alchemy_form) {
		new_value = this.alchemy_form.schema;
	}

	if (!new_value) {

		let model_name = this.model;

		if (model_name) {
			let model = alchemy.getClientModel(model_name);

			if (model) {
				new_value = model.schema;
			}
		}
	}

	return new_value;
});

/**
 * Is this an array field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function is_array() {

	let config = this.config;

	if (config) {
		return config.is_array;
	}

	return false;
});

/**
 * Is this a schema field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
 Field.setProperty(function contains_schema() {

	let config = this.config;

	if (config) {
		return config instanceof Classes.Alchemy.Field.Schema;
	}

	return false;
});

/**
 * Is this a translatable field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function is_translatable() {

	let config = this.config;

	if (config) {
		return config.is_translatable;
	}

	return false;
});

/**
 * Get the title of this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.12
 */
Field.setProperty(function field_title() {

	let result = this._title || this.widget_settings?.title || this.config?.title;

	if (!result && this.field_name) {
		result = this.field_name.titleize();
	}

	return result;
}, function setTitle(value) {
	this._title = value;
});

/**
 * Get the description of this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.12
 */
Field.setProperty(function field_description() {

	let result = this.widget_settings?.description || this.config?.description;

	return result;
});

/**
 * Get the path of this field in the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
Field.setProperty(function field_path_in_schema() {
	return this.config && this.config.getPath();
});

/**
 * Get the name of this entry for use in a record path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @return   {String}
 */
 Field.setMethod(function getPathEntryName() {

	if (this.config && this.config.name) {
		return this.config.name;
	}

	return '';
});

/**
 * Get the name of the model this field belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function model() {

	if (this.hasAttribute('model')) {
		return this.getAttribute('model');
	}

	let form = this.alchemy_form;

	if (form) {
		return form.model;
	}
}, function setModel(model) {
	return this.setAttribute('model', model);
});

/**
 * Get the preferred view file to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 */
Field.enforceProperty(function view_file(new_value, old_value) {

	if (!new_value) {

		let view_type = this.view_type,
			field_view = this.field_view || this.field_type;
		
		if (!field_view) {
			let config = this.config;

			if (config) {
				field_view = config.constructor.type_name;
			}
		}

		new_value = this.generateTemplatePath('inputs', view_type, field_view);
	}

	return new_value;
});

/**
 * Get the preferred wrapper to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 */
Field.enforceProperty(function wrapper_file(new_value, old_value) {

	if (!new_value) {

		let wrapper_type = this.wrapper_type;

		if (wrapper_type === false) {
			return false;
		}

		let wrapper_view = this.wrapper_view || this.getFieldType(),
		     view_type = this.view_type;

		if (wrapper_view) {
			return this.generateTemplatePath('wrappers', view_type, wrapper_view);
		}
	}

	return new_value;
});

/**
 * Get the view files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 */
Field.setProperty(function view_files() {

	let result = [],
	    view_file = this.view_file;

	if (view_file) {
		result.push(view_file);
	}

	let field_type = this.getFieldType(),
	    view_type = this.view_type;

	if (field_type) {
		let view = this.generateTemplatePath('inputs', view_type, field_type);
		
		result.push(view);

		let purpose = this.purpose;

		if (purpose) {	
			view = this.generateTemplatePath('inputs', purpose, field_type);
			result.push(view);
		}
	}

	if (result.length == 0) {
		return false;
	}

	// Fallback to a simple string input
	result.push(this.generateTemplatePath('inputs', view_type, 'string'));

	return result;
});

/**
 * Get the wrapper files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 */
Field.setProperty(function wrapper_files() {

	let wrapper_file = this.wrapper_file;

	if (wrapper_file === false) {
		return false;
	}

	let result = [];

	if (wrapper_file) {
		result.push(wrapper_file);
	}

	let field_type = this.getFieldType(),
	    view_type = this.view_type;

	if (field_type) {
		let view = this.generateTemplatePath('wrappers', view_type, field_type);

		result.push(view);

		view = this.generateTemplatePath('wrappers', view_type, 'default');
		result.push(view);

		view = this.generateTemplatePath('wrappers', 'default', field_type);
		result.push(view);

		view = this.generateTemplatePath('wrappers', 'default', 'default');
		result.push(view);
	}

	if (result.length == 0) {
		return false;
	}

	return result;
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.8
 */
Field.setProperty(function original_value() {

	if (this.assigned_data.original_value != null) {
		return this.assigned_data.original_value;
	}

	let alchemy_field_schema = this.alchemy_field_schema,
	    path = this.field_path_in_current_schema;

	if (alchemy_field_schema) {
		let original_schema_value = alchemy_field_schema.original_value;

		if (original_schema_value) {
			if (path) {
				return Object.path(original_schema_value, path);
			}
		}

		return;
	}

	let form = this.alchemy_form;

	if (form && form.document) {
		return Object.path(form.document, path);
	}
}, function setOriginalValue(value) {
	return this.assigned_data.original_value = value;
});

/**
 * Get the main field value element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Field.setProperty(function value_element() {

	let input;

	// Translations always get preference
	if (this.is_translatable) {
		input = this.querySelector('al-field-translatable');
	} else if (this.is_array) {
		input = this.querySelector('al-field-array');
	} else if (this.contains_schema) {
		input = this.querySelector('al-field-schema');
	}

	if (!input) {
		input = this.querySelector('.alchemy-field-value');
	}

	return input;
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.8
 */
Field.setProperty(function value() {

	let element = this.value_element;

	if (element) {
		return element.value;
	} else {
		return this.original_value;
	}

}, function setValue(value) {

	let element = this.value_element;

	if (element) {
		element.value = value;
	} else if (this.original_value == null) {
		this.original_value = value;
	}
});

/**
 * Apply options
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 *
 * @param    {Object}   options
 */
Field.setMethod(function applyOptions(options) {

	if (!options || typeof options != 'object') {
		return;
	}

	if (options.purpose) {
		this.purpose = options.purpose;
	}

	if (options.mode) {
		this.mode = options.mode;
	}

	if (options.view) {
		this.field_view = options.view;
	}

	if (options.wrapper) {
		this.wrapper_view = options.wrapper;
	}

	if (options.readonly) {
		this.readonly = true;
	}

	if (options.widget_settings) {
		this.widget_settings = options.widget_settings;
	}

	if (options.data_src) {
		this.data_src = options.data_src;
	}

	if (options.title) {
		this.field_title = options.title;
	}

});

/**
 * Get the field type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 *
 * @return   {String}
 */
Field.setMethod(function getFieldType() {

	let result = this.field_type;

	if (!result) {
		let config = this.config;

		if (config) {
			result = config.constructor.type_name;
		}
	}

	return result;
});

/**
 * Generate a template path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 *
 * @param    {String}   container_type   The container (inputs/wrappers)
 * @param    {String}   view_type        The view (edit/view/edit_inline/...)
 * @param    {String}   field_type       The name of the field (and thus the view)
 *
 * @return   {String}
 */
Field.setMethod(function generateTemplatePath(container_type, view_type, field_type) {
	let result = 'form/' + container_type + '/' + view_type + '/' + field_type;
	return result;
});

/**
 * Get the rule violations for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Promise<Array>}
 */
Field.setMethod(async function getViolations() {

	let violations = [],
	    config = this.config;

	if (config) {

		let violation,
		    rules = config.getRules(),
		    rule;

		for (rule of rules) {
			violation = await rule.validateFieldValue(config, this.value);

			if (violation) {
				violations.push(violation);
			}
		}
	}

	return violations;
});

/**
 * Validate this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Promise<Boolean>}
 */
Field.setMethod(async function validate() {

	let violations = await this.getViolations();

	// Remove the errors AFTER the violations check
	// (Preventing a flash of empty errors)
	this.removeErrors();

	if (violations.length == 0) {
		return true;
	}

	let violation;

	for (violation of violations) {
		this.error_area.append('' + violation);
	}

	return false;
});

/**
 * Show the given error
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setMethod(function showError(err) {

	let message;

	if (err.microcopy) {

		let microcopy = this.hawkejs_renderer.t(err.microcopy, {
			field : this.field_title,
		});

		message = microcopy.toElement();
	} else {
		message = err.message;
	}

	this.error_area.append(message);
});

/**
 * Remove all errors
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setMethod(function removeErrors() {
	Hawkejs.removeChildren(this.error_area);
});

/**
 * The element is being assembled by hawkejs
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.1
 */
Field.setMethod(function retained() {

	if (!this.id) {
		let id = 'field-';

		if (this.alchemy_form) {
			id += this.alchemy_form.id + '-';
		}

		if (this.field_name) {
			id += this.field_name.slug();
		}

		this.id = id;
	}

	let label = this.querySelector('.form-field-info al-label');

	if (label && this.value_element) {
		let v_id = this.id + '_fv';

		label.setAttribute('for', v_id);
		this.value_element.setAttribute('id', v_id);
	}

});

/**
 * Load remote data for some fields
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.9
 *
 * @param    {Object}        config
 * @param    {HTMLElement}   element
 */
Field.setMethod(async function loadData(config, element) {

	let field = this.config;

	if (field) {

		let result;

		if (typeof field.loadData == 'function') {

			try {
				result = await field.loadData(config, element);
			} catch (err) {
				// Ignore
				console.error('Error loading field data:', err);
			}

			if (result) {
				return result;
			}
		}

		let resource_options = {
			name  : 'FormApi#related',
			post  : true,
			body  : {
				field        : field.name,
				model        : field.parent_schema.model_name,
				assoc_model  : field.options.modelName,
				config       : config,
			}
		};

		if (this.data_src) {
			resource_options.name = this.data_src;
		}

		return this.hawkejs_helpers.Alchemy.getResource(resource_options);
	}

});