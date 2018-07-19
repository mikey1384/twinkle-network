import PropTypes from 'prop-types'
import React, { Component } from 'react'
import request from 'axios'
import { URL } from 'constants/URL'
import { css } from 'emotion'
import { Color } from 'constants/css'

const API_URL = `${URL}/content`

export default class Embedly extends Component {
  static propTypes = {
    small: PropTypes.bool,
    id: PropTypes.number.isRequired,
    siteUrl: PropTypes.string,
    style: PropTypes.object,
    thumbUrl: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string.isRequired
  }

  fallbackImage = '/img/link.png'

  constructor({ thumbUrl, actualTitle, actualDescription, siteUrl }) {
    super()
    this.state = {
      imageUrl: thumbUrl
        ? thumbUrl.replace('http://', 'https://')
        : '/img/link.png',
      title: actualTitle,
      description: actualDescription,
      site: siteUrl
    }
  }

  async componentDidMount() {
    this.mounted = true
    const { id, siteUrl, url } = this.props
    if (url && !siteUrl) {
      try {
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, { url, linkId: id })
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://'),
            title,
            description,
            site
          })
        }
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { id, url } = this.props
    if (url && prevProps.url !== url) {
      try {
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, { url, linkId: id })
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://'),
            title,
            description,
            site
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { imageUrl, description, title, site } = this.state
    const { small, style, url } = this.props
    return (
      <div
        className={css`
          width: 100%;
          a {
            color: ${Color.darkGray()};
            position: relative;
            overflow: hidden;
            text-decoration: none;
          }
          h3 {
            font-size: 1.9rem;
          }
          p {
            font-size: 1.5rem;
            margin-top: 1rem;
          }
        `}
        style={style}
      >
        <a
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            ${!small ? 'flex-direction: column;' : ''};
          `}
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          <section
            className={css`
              position: relative;
              width: ${small ? '40%' : '100%'};
              height: ${small ? '40%' : '100%'};
            `}
          >
            <img
              className={css`
                width: 100%;
                max-height: ${small ? '30vh' : '70vh'};
                object-fit: scale-down;
              `}
              src={imageUrl}
              onError={this.onImageLoadError}
              alt={title}
            />
          </section>
          <section
            className={css`
              width: 100%;
              padding: 1rem;
              ${small ? 'margin-left: 1rem;' : ''};
            `}
          >
            <h3>{title || this.props.title}</h3>
            <p>{description}</p>
            <p style={{ fontWeight: 'bold' }}>{site}</p>
          </section>
        </a>
      </div>
    )
  }

  onImageLoadError = () => {
    const { thumbUrl } = this.props
    this.setState(state => ({
      imageUrl:
        !thumbUrl || state.imageUrl === thumbUrl ? this.fallbackImage : thumbUrl
    }))
  }
}
