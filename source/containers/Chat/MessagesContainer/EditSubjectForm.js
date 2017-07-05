import PropTypes from 'prop-types'
import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import {cleanString, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'
import SearchDropdown from 'components/SearchDropdown'
import Button from 'components/Button'

class EditSubjectForm extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onClickOutSide: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number
  }

  handleClickOutside = (event) => {
    this.props.onClickOutSide()
  }

  constructor(props) {
    super()
    this.state = {
      title: cleanString(props.title),
      dropdownItemToHighlight: -1
    }
    this.onEditSubmit = this.onEditSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  render() {
    const {title, dropdownItemToHighlight} = this.state
    const {style, autoFocus, maxLength = 100} = this.props
    return (
      <div>
        <div className="col-xs-10" style={{paddingLeft: '0px', paddingRight: '0px'}}>
          <form onSubmit={event => this.onEditSubmit(event, title)}>
            <input
              style={style}
              autoFocus={autoFocus}
              type="text"
              className="form-control"
              placeholder="Enter Title..."
              value={title}
              onChange={this.onInputChange}
              onKeyUp={event => this.setState({title: addEmoji(event.target.value)})}
            />
            <small style={{color: title.length > maxLength && 'red'}}>{title.length}/{maxLength} Characters</small> {title.length <= maxLength &&
              <small>(Press the <b>Enter</b> Key to Apply)</small>
            }
          </form>
          <SearchDropdown
            onUpdate={() => console.log('update')}
            onUnmount={() => console.log('unmounting')}
            onItemClick={() => console.log('clicked')}
            renderItemLabel={item => <div>{item.content}</div>}
            dropdownItemToHighlight={dropdownItemToHighlight}
            searchResults={[{content: 'one'}, {content: 'two'}, {content: 'three'}]}
          />
        </div>
        <div className="col-xs-2 col-offset-xs-10" style={{float: 'right', paddingRight: '0px'}}>
          <Button
            className="btn btn-primary"
            style={{float: 'right', marginRight: '1em'}}
            onClick={() => console.log('clicked')}
          >
            View Past Subjects
          </Button>
        </div>
      </div>
    )
  }

  onInputChange(event) {
    const {onChange} = this.props
    this.setState({title: event.target.value})
    onChange(event.target.value)
  }

  onEditSubmit(event, title) {
    const {onEditSubmit, onClickOutSide, maxLength = 100} = this.props
    event.preventDefault()
    if (title && title.length > maxLength) return
    if (title && title !== this.props.title) {
      onEditSubmit(finalizeEmoji(title))
    } else {
      onClickOutSide()
    }
  }
}

export default onClickOutside(EditSubjectForm)
