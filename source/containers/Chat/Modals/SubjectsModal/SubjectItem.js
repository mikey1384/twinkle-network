import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'
import ButtonGroup from 'components/ButtonGroup'
import SubjectMsgsModal from '../SubjectMsgsModal'

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
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  constructor() {
    super()
    this.state = {
      marginBottom: `${marginHeight}em`,
      menuShown: false,
      msgsModalShown: false
    }
  }

  componentDidMount() {
    const numLines = this.subjectTitle.clientHeight / subjectTitleHeight
    this.setState({marginBottom: `${numLines * marginHeight}em`})
  }

  render() {
    const {
      currentSubjectId, selectSubject, id, content, userId,
      username, timeStamp, numMsgs
    } = this.props
    const {marginBottom, menuShown, msgsModalShown} = this.state
    let buttons = []
    if (numMsgs > 0) {
      buttons.push({
        buttonClass: 'btn-info',
        hoverClass: 'btn-success',
        onClick: () => this.setState({msgsModalShown: true}),
        label: 'View Conversations'
      })
    }
    if (currentSubjectId !== id) {
      buttons.push({
        buttonClass: 'btn-info',
        hoverClass: 'btn-success',
        onClick: selectSubject,
        label: 'Select'
      })
    }
    return (
      <div
        className="media"
        style={{
          minHeight: '50px',
          height: 'auto',
          width: '100%',
          marginTop: '0px'
        }}
        onMouseEnter={() => this.setState({menuShown: true})}
        onMouseLeave={() => this.setState({menuShown: false})}
      >
        {msgsModalShown && <SubjectMsgsModal
          subjectId={id}
          subjectTitle={content}
          onHide={() => this.setState({msgsModalShown: false})}
        />}
        {menuShown &&
          <ButtonGroup
            style={{position: 'absolute', right: '1.5em'}}
            buttons={buttons}
          />
        }
        <div
          className="media-body"
          style={{
            width: '100%',
            wordBreak: 'break-all'
          }}
        >
          <div ref={ref => { this.subjectTitle = ref }} style={{marginBottom}}>
            {currentSubjectId === id && <b style={{fontSize: '1.2em', color: Color.green}}>Current: </b>}
            <span
              className="media-heading"
              style={{
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}
              dangerouslySetInnerHTML={{__html: content}}
            /> {numMsgs && (numMsgs > 0) && <b style={{color: Color.blue}}>({numMsgs})</b>}
            <div style={{position: 'absolute'}}>
              <UsernameText
                color={Color.darkGray}
                user={{
                  id: userId,
                  name: username
                }}
              /> <small>{moment.unix(timeStamp).format('LLL')}</small>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
