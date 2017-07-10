import PropTypes from 'prop-types'
import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import {cleanString, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'
import SearchDropdown from 'components/SearchDropdown'
import Button from 'components/Button'
import {Color} from 'constants/css'
import {timeSince} from 'helpers/timeStampHelpers'

class EditSubjectForm extends Component {
  static propTypes = {
    currentSubjectId: PropTypes.number,
    onChange: PropTypes.func,
    onClickOutSide: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    reloadChatSubject: PropTypes.func,
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    searchResults: PropTypes.array
  }

  handleClickOutside = (event) => {
    this.props.onClickOutSide()
  }

  constructor(props) {
    super()
    this.state = {
      title: cleanString(props.title),
      highlightedIndex: -1
    }
    this.onEditSubmit = this.onEditSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.renderItemLabel = this.renderItemLabel.bind(this)
  }

  render() {
    const {title, highlightedIndex} = this.state
    const {style, autoFocus, maxLength = 100, searchResults} = this.props
    return (
      <div>
        <div className="col-xs-10" style={{paddingLeft: '0px', paddingRight: '0px'}}>
          <form onSubmit={event => this.onEditSubmit(event)}>
            <input
              style={style}
              autoFocus={autoFocus}
              type="text"
              className="form-control"
              placeholder="Enter Title..."
              value={title}
              onChange={this.onInputChange}
              onKeyUp={event => this.setState({title: addEmoji(event.target.value)})}
              onKeyDown={this.onKeyDown}
            />
            <small style={{color: title.length > maxLength && 'red'}}>{title.length}/{maxLength} Characters</small>
            {title.length <= maxLength &&
              <small> (Press <b>Enter</b> to Apply)</small>
            }
          </form>
          {searchResults.length > 0 &&
            <SearchDropdown
              onUpdate={this.onUpdate}
              onUnmount={() => this.setState({highlightedIndex: -1})}
              onItemClick={this.onItemClick}
              renderItemLabel={this.renderItemLabel}
              startingIndex={-1}
              indexToHighlight={highlightedIndex}
              searchResults={searchResults}
            />
          }
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

  onKeyDown(event) {
    const {searchResults} = this.props
    const {highlightedIndex} = this.state
    let index = highlightedIndex
    if (searchResults.length > 0) {
      if (event.keyCode === 40) {
        event.preventDefault()
        this.setState({highlightedIndex: Math.min(++index, searchResults.length - 1)})
      }

      if (event.keyCode === 38) {
        event.preventDefault()
        this.setState({highlightedIndex: Math.max(--index, -1)})
      }
    }
  }

  onInputChange(event) {
    const {onChange} = this.props
    this.setState({title: event.target.value})
    return onChange(event.target.value).then(
      () => {
        const {searchResults} = this.props
        const {title} = this.state
        let exactMatchExists = false
        let matchIndex
        for (let i = 0; i < searchResults.length; i++) {
          if (searchResults[i].content === title) {
            exactMatchExists = true
            matchIndex = i
            break
          }
        }
        this.setState({highlightedIndex: exactMatchExists ? matchIndex : -1})
      }
    )
  }

  onUpdate() {
    const {searchResults} = this.props
    const {title} = this.state
    let exactMatchExists = false
    let matchIndex
    for (let i = 0; i < searchResults.length; i++) {
      if (searchResults[i].content === title) {
        exactMatchExists = true
        matchIndex = i
        break
      }
    }
    this.setState({
      highlightedIndex: exactMatchExists ? matchIndex : -1
    })
  }

  onEditSubmit(event) {
    const {
      onEditSubmit, onClickOutSide, maxLength = 100,
      reloadChatSubject, searchResults, currentSubjectId
    } = this.props
    const {title, highlightedIndex} = this.state
    event.preventDefault()
    if (highlightedIndex > -1) {
      const {id: subjectId} = searchResults[highlightedIndex]
      if (subjectId === currentSubjectId) return onClickOutSide()
      return reloadChatSubject(subjectId)
    }

    if (title && title.length > maxLength) return
    if (title && title !== this.props.title) {
      onEditSubmit(finalizeEmoji(title))
    } else {
      onClickOutSide()
    }
  }

  onItemClick(item) {
    const {currentSubjectId, reloadChatSubject, onClickOutSide} = this.props
    const {id: subjectId} = item
    if (subjectId === currentSubjectId) return onClickOutSide()
    return reloadChatSubject(subjectId)
  }

  renderItemLabel(item) {
    return (
      <div>
        <div
          style={{
            color: Color.green,
            fontWeight: 'bold'
          }}
        >
          {item.content}<span style={{color: Color.blue}}>{(Number(item.numMsgs) > 0) && ` (${item.numMsgs})`}</span>
        </div>
        <div><small>Posted by <b>{item.username}</b> ({timeSince(item.timeStamp)})</small></div>
      </div>
    )
  }
}

export default onClickOutside(EditSubjectForm)
