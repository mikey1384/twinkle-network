import React, {PropTypes} from 'react'

Links.propTypes = {
  children: PropTypes.object
}
export default function Links({children}) {
  return (
    <div id="contents" className="container-fluid">
      {children}
    </div>
  )
}
