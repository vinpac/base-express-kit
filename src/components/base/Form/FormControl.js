import React, { PropTypes } from 'react';
import cx from 'classnames'
import FormGroup from './FormGroup';

class FormControl extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    validate: PropTypes.array,
    errorClassName: PropTypes.string,
    containerClassName: PropTypes.string,
    errorContainerClassName: PropTypes.string
  };

  static contextTypes = {
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    inputName: PropTypes.string
  };

  static defaultProps = {
    component: 'input',
    hintComponent: 'span',
    containerComponent: 'div',
    hintClassName: 'input-subtext',
    containerClassName: '',
    errorClassName: '',
    errorContainerClassName: 'form-group-warning',
    validate: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isValid: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.invalidate = this.invalidate.bind(this)
    this.validate = this.validate.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.context.unsubscribe(this.props.name)
      this.context.subscribe(nextProps.name, this)
    }
  }

  componentWillMount() {
    this.context.subscribe(this.props.name, this)
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.props.name)
  }

  validate() {
    this.context.validate(this.props.name)
  }

  handleChange(e) {
    this.validate()

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  invalidate(hint) {
    this.setState({
      isValid: false,
      hint
    })
  }

  get value() {
    const { component } = this.props
    const { input } = this.refs

    if ((input.type === 'checkbox' || input.type === 'radio') && component === 'input' ) {
      return this.refs.input.checked
    }
    return input.value
  }

  set value(value) {
    this.refs.input.value = value
  }

  render() {
    const {
      // eslint-disable-next-line
      validate,
      containerClassName,
      errorClassName,
      errorContainerClassName,
      className,
      hintClassName,
      component:Component,
      hintComponent:HintComponent,
      containerComponent:ContainerComponent,
      containerProps={},
      children,
      ...props
    } = this.props
    const { hint, isValid } = this.state

    if (ContainerComponent === FormGroup) {
      containerProps['name'] = this.props.name
    }

    return (
      <ContainerComponent
        {...containerProps}
        className={cx(containerClassName, { [errorContainerClassName]: !isValid })}
      >
        <Component
          {...props}
          ref="input"
          onChange={this.handleChange}
          className={cx(className, {[errorClassName]: !isValid })}
        >
          { children }
        </Component>
        { !isValid ?

          <HintComponent className={hintClassName}>{hint}</HintComponent>
        : null }
      </ContainerComponent>
    );
  }
}

export default FormControl;
