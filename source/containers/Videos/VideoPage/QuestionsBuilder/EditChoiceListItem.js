import PropTypes from 'prop-types'
import React from 'react'
import Textarea from 'react-textarea-autosize'
import {cleanString} from 'helpers/stringHelpers'

EditChoiceListItem.propTypes = {
  index: PropTypes.number,
  onEdit: PropTypes.func,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  checked: PropTypes.bool
}
export default function EditChoiceListItem(props) {
  return (
    <div className="list-group-item container-fluid">
      <form
        className="pull-left"
        style={{
          paddingLeft: '0px',
          width: '95%'
        }}
      >
        <Textarea
          type="text"
          className="form-control"
          onChange={event => props.onEdit(props.index, event.target.value)}
          value={cleanString(props.text)}
          placeholder={props.placeholder}
        />
      </form>
      <span className="input pull-right">
        <input
          type="radio"
          onChange={props.onSelect}
          checked={props.checked}
          style={{cursor: 'pointer'}}
        />
      </span>
    </div>
  )
}
