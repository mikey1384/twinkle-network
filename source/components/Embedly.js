import PropTypes from 'prop-types'
import React, { Component } from 'react'
import request from 'axios'
import ExecutionEnvironment from 'exenv'
import { URL } from 'constants/URL'
import { css } from 'emotion'
import { Color } from 'constants/css'

const API_URL = `${URL}/content`

export default class Embedly extends Component {
  static propTypes = {
    actualTitle: PropTypes.string,
    actualDescription: PropTypes.string,
    id: PropTypes.number.isRequired,
    siteUrl: PropTypes.string,
    style: PropTypes.object,
    thumbUrl: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string.isRequired
  }

  constructor({ actualTitle, actualDescription, siteUrl, thumbUrl }) {
    super()
    this.state = {
      imageUrl: thumbUrl ? thumbUrl.replace('http://', 'https://') : '',
      fallbackImage: thumbUrl,
      title: actualTitle,
      description: actualDescription,
      site: siteUrl
    }
  }

  componentWillMount() {
    const { id, siteUrl, url } = this.props
    if (ExecutionEnvironment.canUseDOM && url && !siteUrl) {
      return request
        .put(`${API_URL}/embed`, { url, linkId: id })
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

  componentDidUpdate(prevProps) {
    const { id, url } = this.props
    if (prevProps.url !== url) {
      this.setState({}, () => {
        return request
          .put(`${API_URL}/embed`, { url, linkId: id })
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
          .catch(error => console.error(error))
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { imageUrl, fallbackImage, description, title, site } = this.state
    const { style, url } = this.props
    return (
      <div
        className={css`
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
            flex-direction: column;
          `}
          target="_blank"
          rel=""
          href={url}
        >
          <section
            className={css`
              position: relative;
              width: 100%;
            `}
          >
            <img
              className={css`
                width: 100%;
                height: 80%;
                object-fit: scale-down;
              `}
              src={imageUrl || '/img/link.png'}
              onError={() => this.setState({ imageUrl: fallbackImage })}
              alt={title}
            />
          </section>
          <section
            className={css`
              width: 100%;
              padding: 1rem;
            `}
          >
            <h3>{title || this.props.title}</h3>
              <p>{description}</p>
              <p style={{fontWeight: 'bold'}}>{site}</p>
          </section>
        </a>
      </div>
    )
  }
}
