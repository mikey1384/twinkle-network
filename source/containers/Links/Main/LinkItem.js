import React, {PropTypes, Component} from 'react'
import request from 'superagent'
import {embedlyKey} from 'constants/keys'
import ExecutionEnvironment from 'exenv'
import {timeSince} from 'helpers/timeStampHelpers'
import UsernameText from 'components/Texts/UsernameText'
import UserListModal from 'components/Modals/UserListModal'
import Link from 'components/Link'
import {loadLinkPage} from 'redux/actions/LinkActions'
import {connect} from 'react-redux'

@connect(
  null,
  {loadLinkPage}
)
export default class ContentLink extends Component {
  static propTypes = {
    link: PropTypes.object,
    loadLinkPage: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      imageUrl: '',
      userListModalShown: false
    }
    this.apiUrl = 'https://api.embedly.com/1/oembed'
    this.to = `/links/${props.link.id}`
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  componentWillMount() {
    const {link: {content}} = this.props
    if (ExecutionEnvironment.canUseDOM && content) {
      let params = {
        url: content,
        key: embedlyKey
      }

      request.get(this.apiUrl)
      .query(params)
      .end((err, res) => {
        if (err) console.error(err)
        if (this.mounted) {
          this.setState({imageUrl: res.body ? res.body.thumbnail_url : ''})
        }
      })
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {link: {title, timeStamp, uploaderName, uploader, likers, numComments}} = this.props
    const {imageUrl, userListModalShown} = this.state
    return (
      <li className="media">
        <div className="media-left">
          {imageUrl ?
            <Link to={this.to} onClickAsync={this.onLinkClick}>
              <div style={{
                width: '10rem',
                minHeight: '10rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  className="media-object"
                  src={imageUrl}
                  style={{width: '10rem'}}
                  alt=""
                />
              </div>
            </Link> :
            <Link to={this.to} onClickAsync={this.onLinkClick}>
              <img
                className="media-object"
                src="/img/link.png"
                style={{width: '10rem'}}
                alt=""
              />
            </Link>
          }
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            <Link to={this.to} onClickAsync={this.onLinkClick}>{title}</Link>
          </h4>
          <div>
            <small style={{position: 'absolute'}}>
              Uploaded {`${timeSince(timeStamp)} `}by <UsernameText user={{name: uploaderName, id: uploader}} />
            </small>
          </div>
          <p style={{marginTop: '1.5em'}}>
            <small>
              {likers.length > 0 &&
                <b>
                  <a
                    style={{cursor: 'pointer'}}
                    onClick={() => this.setState({userListModalShown: true})}
                  >
                    <span>{`${likers.length}`} like{likers.length > 1 ? 's' : ''}</span>
                  </a>&nbsp;&nbsp;
                </b>
              }
              {numComments > 0 && <b>{numComments} comment{numComments > 1 ? 's' : ''}</b>}
            </small>
          </p>
        </div>
        {userListModalShown &&
          <UserListModal
            users={likers}
            description="(You)"
            onHide={() => this.setState({userListModalShown: false})}
            title="People who liked this link"
          />
        }
      </li>
    )
  }

  onLinkClick() {
    const {loadLinkPage, link: {id}} = this.props
    return loadLinkPage(id)
  }
}
