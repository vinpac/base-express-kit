import React, { PropTypes } from 'react';
import validators from '../../../common/validators';
import { forEach } from '../../../utils/object-utils';
import Validator from '../../../lib/Validator';
import has from 'has';

class Form extends React.Component {

  static defaultProps = {
    component: 'form'
  };

  static childContextTypes = {
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.any)
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    }

    this.components = {}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
    this.validateOne = this.validateOne.bind(this)
    this.validate = this.validate.bind(this)
    //this.isValid = this.isValid.bind(this)
    this.each = this.each.bind(this)
  }

  getChildContext() {
    return {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      validate: this.validateOne,
      errors: this.state.errors
    }
  }

  subscribe(field, component) {
    if (this.components.hasOwnProperty(field)) {
      console.warn(`Form Control with name ${field} already exists. Replacing it.`)
    }
    this.components[field] = component
  }

  unsubscribe(field) {
    const { errors } = this.state
    delete this.components[field]
    delete errors[field]

    this.setState({ errors })
  }

  validate() {
    const errors = {}
    this.each((component, inputName) => this.validateOne(inputName, errors))
    this.setState({ errors })
    return errors
  }

  isValid() {
    let d = this.validate()
    return !Object.keys(d).length
  }

  invalidateOne(field, rule, hint) {
    if (this.components[field]) {
      const { errors } = this.state
      errors[field] = rule
      this.components[field].invalidate(
        hint
          ? hint(this.components[field].value, this.components)
          : validators[rule].hint(this.components.value, this.components)
      )
      this.setState({
        errors
      })
    }
  }

  getInputErrors(inputName, validators=this.props.validators, returnFirstError) {
    const component = this.components[inputName]
    return Validator.validate(
      component.value,
      component.props.validate,
      validators,
      {
        returnFirstError,
        data: {
          inputName: inputName,
          components: this.components
        }
      }
    )
  }

  validateOne(inputName, initialErrors, shouldUpdate=!initialErrors) {
    const errors = initialErrors || this.state.errors
    const component = this.components[inputName]

    const inputError = this.getInputErrors(inputName, this.props.validators, true)

    if (!inputError) {
      delete errors[inputName]
    } else {
      errors[inputName] = [ inputError ]
    }

    if (shouldUpdate) {
      this.setState({
        errors
      })

      component.setState(
        inputError
        ? { isValid: false, hint: inputError.hint }
        : { isValid: true, hint: null }
      )
    }

    return inputError
  }

  getData() {
    const data = {}
    let keys;
    let obj;
    this.each((component, field) => {
      obj = data
      keys = field.split('.')
      forEach(keys, (key, i) => {
        if (i === keys.length -1) {
          console.log(obj)
          obj[key] = component.value
        } else {
          if(!has(obj, key)) {
            obj[key] = {}
          }

          if (typeof obj[key] !== 'object') {
            obj[key] = { '0': obj[key] }
          }

          obj = obj[key]
        }
      })
    })
    return data
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }

    if (!this.isValid()) {
      return e ? e.preventDefault() : false
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(e)
    }
  }

  each(fn) {
    forEach(this.components, fn)
  }

  clean() {
    this.each(component => component.clean ? component.clean() : component.value = "")
  }

  render() {
    const { children, component:Component, ...props } = this.props
    return (
      <Component {...props} onSubmit={this.handleSubmit}>
        { children }
      </Component>
    );
  }
}

export default Form;
