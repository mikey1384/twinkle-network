import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import UsernameText from 'components/Texts/UsernameText'
import UserListModal from 'components/Modals/UserListModal'
import Link from 'components/Link'
import { loadLinkPage, editTitle, deleteLink } from 'redux/actions/LinkActions'
import { connect } from 'react-redux'
import DropdownButton from 'components/DropdownButton'
import EditTitleForm from 'components/Texts/EditTitleForm'
import { cleanString } from 'helpers/stringHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { Color } from 'constants/css'
import { css } from 'emotion'
import request from 'axios'
import { URL } from 'constants/URL'
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

  apiUrl = 'https://api.embed.rocks/api'
  fallbackImage = '/img/link.png'

  constructor({ link: { thumbUrl } }) {
    super()
    this.state = {
      confirmModalShown: false,
      imageUrl: thumbUrl
        ? thumbUrl.replace('http://', 'https://')
        : '/img/link.png',
      userListModalShown: false,
      onEdit: false
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  async componentDidUpdate(prevProps) {
    const { link: { content, id } } = this.props
    if (prevProps.link.content !== content) {
      try {
        const { data: { image } } = await request.put(`${API_URL}/embed`, {
          url: content,
          linkId: id
        })
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://')
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  render() {
    const {
      link: {
        id,
        title,
        timeStamp,
        uploaderName,
        uploader,
        likers,
        numComments
      },
      userId
    } = this.props
    const {
      confirmModalShown,
      imageUrl,
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
          <Link to={`/links/${id}`} onClickAsync={this.onLinkClick}>
            <img
              className={css`
                display: block;
                width: 7vw;
                height: 7vw;
                object-fit: cover;
              `}
              src={imageUrl}
              onError={this.onImageLoadError}
              alt=""
            />
          </Link>
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
                  <Link to={`/links/${id}`} onClickAsync={this.onLinkClick}>
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

  onDelete = () => {
    const { link, deleteLink } = this.props
    deleteLink(link.id)
  }

  onEditedTitleSubmit = text => {
    const { editTitle, link: { id } } = this.props
    return editTitle({ title: text, id }).then(() =>
      this.setState({ onEdit: false })
    )
  }

  onImageLoadError = () => {
    const { link: { thumbUrl } } = this.props
    this.setState(state => ({
      imageUrl:
        !thumbUrl || state.imageUrl === thumbUrl ? this.fallbackImage : thumbUrl
    }))
  }

  onLinkClick = () => {
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
