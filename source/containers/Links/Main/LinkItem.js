import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import request from 'axios'
import ExecutionEnvironment from 'exenv'
import { timeSince } from 'helpers/timeStampHelpers'
import UsernameText from 'components/Texts/UsernameText'
import UserListModal from 'components/Modals/UserListModal'
import Link from 'components/Link'
import { loadLinkPage, editTitle, deleteLink } from 'redux/actions/LinkActions'
import { connect } from 'react-redux'
import DropdownButton from 'components/DropdownButton'
import EditTitleForm from 'components/Texts/EditTitleForm'
import { cleanString } from 'helpers/stringHelpers'
import { URL } from 'constants/URL'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { Color } from 'constants/css'
import { css } from 'emotion'

const API_URL = `${URL}/content`

class LinkItem extends Component {
  static propTypes = {
    deleteLink: PropTypes.func.isRequired,
    editTitle: PropTypes.func.isRequired,
    link: PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      uploaderName: PropTypes.string.isRequired,
      uploader: PropTypes.number.isRequired,
      likers: PropTypes.array.isRequired,
      numComments: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired
    }).isRequired,
    loadLinkPage: PropTypes.func.isRequired,
    userId: PropTypes.number
  }

  constructor({ link: { id, thumbUrl } }) {
    super()
    this.state = {
      confirmModalShown: false,
      imageUrl: thumbUrl ? thumbUrl.replace('http://', 'https://') : '',
      fallbackImage: thumbUrl,
      userListModalShown: false,
      onEdit: false
    }
    this.apiUrl = 'https://api.embed.rocks/api'
    this.to = `/links/${id}`
    this.onDelete = this.onDelete.bind(this)
    this.onEditedTitleSubmit = this.onEditedTitleSubmit.bind(this)
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  componentWillMount() {
    const { link: { content, id, siteUrl } } = this.props
    if (ExecutionEnvironment.canUseDOM && content && !siteUrl) {
      return request
        .put(`${API_URL}/embed`, { url: content, linkId: id })
        .then(({ data: { image, title, description, site } }) => {
          if (this.mounted) {
            this.setState({
              imageUrl: image.url.replace('http://', 'https://'),
              fallbackImage: image.url,
              title,
              description,
              site
            })
          }
        })
        .catch(error => console.error(error.response || error))
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {
      link: { title, timeStamp, uploaderName, uploader, likers, numComments },
      userId
    } = this.props
    const {
      confirmModalShown,
      imageUrl,
      fallbackImage,
      userListModalShown,
      onEdit
    } = this.state
    return (
      <nav
        className={css`
          display: flex;
          width: 100%;
          section {
            width: 100%;
            margin-left: 2rem;
            display: flex;
            justify-content: space-between;
          }
        `}
      >
        <div>
          {imageUrl ? (
            <Link to={this.to} onClickAsync={this.onLinkClick}>
              <img
                className={css`
                  display: block;
                  width: 7vw;
                  height: 7vw;
                  object-fit: cover;
                `}
                src={imageUrl}
                onError={() => this.setState({ imageUrl: fallbackImage })}
                alt=""
              />
            </Link>
          ) : (
            <Link to={this.to} onClickAsync={this.onLinkClick}>
              <img src="/img/link.png" style={{ width: '10rem' }} alt="" />
            </Link>
          )}
        </div>
        <section>
          <div
            className={css`
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div style={{ width: '100%' }}>
              <div
                className={css`
                  width: 100%;
                  a {
                    font-size: 2rem;
                    font-weight: bold;
                  }
                `}
              >
                {!onEdit && (
                  <Link to={this.to} onClickAsync={this.onLinkClick}>
                    {cleanString(title)}
                  </Link>
                )}
                {onEdit && (
                  <EditTitleForm
                    autoFocus
                    style={{ width: '80%' }}
                    maxLength={200}
                    title={title}
                    onEditSubmit={this.onEditedTitleSubmit}
                    onClickOutSide={() => this.setState({ onEdit: false })}
                  />
                )}
              </div>
              <div
                className={css`
                  font-size: 1.2rem;
                  line-height: 2rem;
                `}
              >
                Uploaded {`${timeSince(timeStamp)} `}by{' '}
                <UsernameText user={{ name: uploaderName, id: uploader }} />
              </div>
            </div>
            <div
              className={css`
                font-size: 1.3rem;
                font-weight: bold;
                color: ${Color.darkGray()};
                margin-bottom: 0.5rem;
              `}
            >
              {likers.length > 0 && (
                <Fragment>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.setState({ userListModalShown: true })}
                  >
                    {`${likers.length}`} like{likers.length > 1 ? 's' : ''}
                  </span>&nbsp;&nbsp;
                </Fragment>
              )}
              {numComments > 0 && (
                <span>
                  {numComments} comment{numComments > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div>
            {!onEdit &&
              userId === uploader && (
                <DropdownButton
                  snow
                  direction="left"
                  icon="pencil"
                  menuProps={[
                    {
                      label: 'Edit',
                      onClick: () => this.setState({ onEdit: true })
                    },
                    {
                      label: 'Remove',
                      onClick: () => this.setState({ confirmModalShown: true })
                    }
                  ]}
                />
              )}
          </div>
        </section>
        {confirmModalShown && (
          <ConfirmModal
            title="Remove Link"
            onConfirm={this.onDelete}
            onHide={() => this.setState({ confirmModalShown: false })}
          />
        )}
        {userListModalShown && (
          <UserListModal
            users={likers}
            description="(You)"
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this link"
          />
        )}
      </nav>
    )
  }

  onDelete() {
    const { link, deleteLink } = this.props
    deleteLink(link.id)
  }

  onEditedTitleSubmit(text) {
    const { editTitle, link: { id } } = this.props
    return editTitle({ title: text, id }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  onLinkClick() {
    const { loadLinkPage, link: { id } } = this.props
    return loadLinkPage(id)
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  { loadLinkPage, deleteLink, editTitle }
)(LinkItem)
