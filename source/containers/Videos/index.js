import React, {PropTypes} from 'react'

Videos.propTypes = {
  children: PropTypes.object
}
export default function Videos({children}) {
  return (
    <div id="contents" className="container-fluid">
      {children}
    </div>
  )
}
