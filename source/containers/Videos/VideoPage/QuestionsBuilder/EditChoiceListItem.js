import PropTypes from 'prop-types'
import React from 'react'
import Textarea from 'components/Texts/Textarea'
import { cleanString } from 'helpers/stringHelpers'

EditChoiceListItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  text: PropTypes.string
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
          style={{ cursor: 'pointer' }}
        />
      </span>
    </div>
  )
}
