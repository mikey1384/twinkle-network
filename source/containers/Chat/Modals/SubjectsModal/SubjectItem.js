import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import UsernameText from 'components/Texts/UsernameText'
import { Color } from 'constants/css'
import ButtonGroup from 'components/Buttons/ButtonGroup'

const marginHeight = 1.1
const subjectTitleHeight = 24

export default class SubjectItem extends Component {
  static propTypes = {
    id: PropTypes.number,
    currentSubjectId: PropTypes.number,
    content: PropTypes.string,
    numMsgs: PropTypes.string,
    userId: PropTypes.number,
    username: PropTypes.string,
    selectSubject: PropTypes.func,
    showMsgsModal: PropTypes.func,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  constructor() {
    super()
    this.state = {
      marginBottom: `${marginHeight}rem`
    }
  }

  componentDidMount() {
    const numLines = this.subjectTitle.clientHeight / subjectTitleHeight
    this.setState({ marginBottom: `${numLines * marginHeight}rem` })
  }

  render() {
    const {
      currentSubjectId,
      selectSubject,
      id,
      content,
      userId,
      username,
      timeStamp,
      numMsgs,
      showMsgsModal
    } = this.props
    const { marginBottom } = this.state
    let buttons = []
    if (numMsgs > 0) {
      buttons.push({
        buttonClass: 'logo',
        opacity: 0.5,
        onClick: showMsgsModal,
        label: 'View',
        onHover: false
      })
    }
    if (currentSubjectId !== id) {
      buttons.push({
        buttonClass: 'success',
        opacity: 0.5,
        onClick: selectSubject,
        label: 'Select',
        onHover: false
      })
    }
    return (
      <div
        style={{
          minHeight: '50px',
          height: 'auto',
          width: '100%'
        }}
      >
        <ButtonGroup
          style={{ position: 'absolute', right: '1.5rem' }}
          buttons={buttons}
        />
        <div
          style={{
            width: '100%',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
        >
          <div
            ref={ref => {
              this.subjectTitle = ref
            }}
            style={{ marginBottom }}
          >
            {currentSubjectId === id && (
              <b style={{ fontSize: '1.5rem', color: Color.green() }}>
                Current:{' '}
              </b>
            )}
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />{' '}
            {numMsgs &&
              numMsgs > 0 && <b style={{ color: Color.blue() }}>({numMsgs})</b>}
            <div>
              <UsernameText
                color={Color.darkGray()}
                user={{
                  id: userId,
                  username: username
                }}
              />{' '}
              <small>{moment.unix(timeStamp).format('LLL')}</small>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
