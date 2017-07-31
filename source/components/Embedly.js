import PropTypes from 'prop-types'
import React, {Component} from 'react'
import request from 'axios'
import ExecutionEnvironment from 'exenv'
import {URL} from 'constants/URL'

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

  constructor({actualTitle, actualDescription, siteUrl, thumbUrl}) {
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
    const {id, siteUrl, url} = this.props
    if (ExecutionEnvironment.canUseDOM && url && !siteUrl) {
      return request.put(`${API_URL}/embed`, {url, linkId: id}).then(
        ({data: {image, title, description, site}}) => {
          if (this.mounted) {
            this.setState({
              imageUrl: image.url.replace('http://', 'https://'),
              fallbackImage: image.url,
              title,
              description,
              site
            })
          }
        }
      ).catch(
        error => console.error(error.response || error)
      )
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentDidUpdate(prevProps) {
    const {id, url} = this.props
    if (prevProps.url !== url) {
      this.setState({}, () => {
        return request.put(`${API_URL}/embed`, {url, linkId: id}).then(
          ({data: {image, title, description, site}}) => {
            if (this.mounted) {
              this.setState({
                imageUrl: image.url.replace('http://', 'https://'),
                fallbackImage: image.url,
                title,
                description,
                site
              })
            }
          }
        ).catch(
          error => console.error(error)
        )
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {imageUrl, fallbackImage, description, title, site} = this.state
    let aStyle = {
      color: '#222',
      textDecoration: 'none',
      position: 'relative',
      border: 'solid 1px #E1E8ED',
      display: 'block',
      borderRadius: '5px',
      overflow: 'hidden'
    }
    let imageStyle = {
      width: '80px',
      height: '80px',
      overflow: 'hidden',
      position: 'absolute',
      left: 0,
      top: 0
    }
    let imgStyle = {
      height: '100%',
      width: 'auto',
      transform: 'translateX(-50%)',
      position: 'relative',
      left: '50%'
    }
    let textStyle = {
      marginLeft: '85px',
      minHeight: '80px',
      padding: '5px',
      boxSizing: 'border-box'
    }
    let titleStyle = {
      margin: 0,
      fontSize: '15px',
      fontWeight: 'bold'
    }
    let descStyle = {
      margin: '5px 0 0',
      fontSize: '11px'
    }
    let providerStyle = {
      margin: '5px 0 0',
      fontSize: '11px'
    }

    return (
      <div style={this.props.style}>
        <a
          className="embedly"
          target="_blank"
          rel="noopener noreferrer"
          href={this.props.url}
          style={aStyle}
        >
          <div className="embedly__image" style={imageStyle}>
            <img
              src={imageUrl || '/img/link.png'}
              onError={() => this.setState({imageUrl: fallbackImage})}
              alt={title}
              style={imgStyle}
            />
          </div>
          <div className="embedly__text" style={textStyle}>
            <p className="embedly__title" style={titleStyle}>{title || this.props.title}</p>
            <p className="embedly__desc" style={descStyle}>{description}</p>
            <p className="embedly__provider" style={providerStyle}>{site}</p>
          </div>
        </a>
      </div>
    )
  }
}
