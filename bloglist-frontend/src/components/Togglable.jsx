import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'


const Togglable = forwardRef((props, ref) => {
  Togglable.displayName = 'Togglable'
  const [visible, setVisible] = useState(false)
  const hideWhenVisble = { display: visible ? 'none' : '' }
  const showWhenVisble = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return(
    <div>
      <div style={hideWhenVisble}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisble}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable