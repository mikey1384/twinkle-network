import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'
import ButtonGroup from 'components/ButtonGroup'

const marginHeight = 1.1
const subjectTitleHeight = 24

export default class SubjectItem extends Component {
  static propTypes = {
    content: PropTypes.string,
    userId: PropTypes.number,
    username: PropTypes.string,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  constructor() {
    super()
    this.state = {
      marginBottom: `${marginHeight}em`,
      menuShown: false
    }
  }

  componentDidMount() {
    const numLines = this.subjectTitle.clientHeight / subjectTitleHeight
    this.setState({marginBottom: `${numLines * marginHeight}em`})
  }

  render() {
    const {content, userId, username, timeStamp} = this.props
    const {marginBottom, menuShown} = this.state
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
        {menuShown &&
          <ButtonGroup
            style={{position: 'absolute', right: '1.5em'}}
            buttons={[
              {
                buttonClass: 'btn-sm btn-default',
                hoverClass: 'btn-sm btn-success',
                onClick: () => console.log('clicked'),
                label: 'View Conversations'
              },
              {
                buttonClass: 'btn-sm btn-default',
                hoverClass: 'btn-sm btn-success',
                onClick: () => console.log('clicked'),
                label: 'Select'
              }
            ]}
          />
        }
        <div
          className="media-body"
          style={{
            width: '100%',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
        >
          <div ref={ref => { this.subjectTitle = ref }} style={{marginBottom}}>
            <span
              className="media-heading"
              style={{
                fontSize: '1.2em',
                fontWeight: 'bold'
              }}
              dangerouslySetInnerHTML={{__html: content}}
            />
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
