import React, { PropTypes } from 'react';

const ButtonControl = ({ children, disabled, ...props}, { errors }) => {
  return (
    <button
      {...props}
      disabled={disabled || !!Object.keys(errors).length}
    >
      {children}
    </button>
  );
};

ButtonControl.displayName = 'ButtonControl';

ButtonControl.contextTypes = {
  errors: PropTypes.objectOf(PropTypes.any)
};

export default ButtonControl;
