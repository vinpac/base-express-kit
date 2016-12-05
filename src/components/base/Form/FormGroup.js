import React, { PropTypes } from 'react';
import cx from 'classnames'

class FormGroup extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  static contextTypes = {
    errors: PropTypes.objectOf(PropTypes.any)
  };

  static defaultProps = {
    component: 'div',
    className: 'form-group',
    errorClassName: 'form-group-warning'
  };

  render() {
    const {
      name,
      className,
      errorClassName,
      component:Component,
      children,
      ...props
    } = this.props
    const { errors } = this.context

    return (
      <Component {...props} className={cx(className, {[errorClassName]: errors[name]})}>
        {children}
      </Component>
    );
  }
}

export default FormGroup;
