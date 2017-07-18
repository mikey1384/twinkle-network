import PropTypes from 'prop-types'
import React, {Component} from 'react'
import request from 'axios'
import {URL} from 'constants/URL'

const API_URL = `${URL}/content`

export default class Embedly extends Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    style: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      imageUrl: '',
      fallbackImage: '',
      title: '',
      description: '',
      site: ''
    }
  }

  componentDidMount() {
    const {url} = this.props
    return request.get(`${API_URL}/embed?url=${url}`).then(
      ({data, data: {images: [image = {url: ''}]}}) => {
        this.setState({
          imageUrl: image.safe.replace('http://', 'https://'),
          fallbackImage: image.safe || image.url,
          title: data.title,
          description: data.description,
          site: data.site
        })
      }
    ).catch(
      error => console.error(error)
    )
  }

  componentDidUpdate(prevProps) {
    const {url} = this.props
    if (prevProps.url !== url) {
      this.setState({}, () => {
        return request.get(`${API_URL}/embed?url=${url}`).then(
          ({data, data: {images: [image = {url: ''}]}}) => {
            this.setState({
              imageUrl: image.safe.replace('http://', 'https://'),
              fallbackImage: image.safe || image.url,
              title: data.title,
              description: data.description,
              site: data.site
            })
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
    /* eslint-disable camelcase */
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
