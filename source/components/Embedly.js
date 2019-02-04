import PropTypes from 'prop-types';
import React, { Component } from 'react';
import request from 'axios';
import { URL } from 'constants/URL';
import { css } from 'emotion';
import { Color } from 'constants/css';

const API_URL = `${URL}/content`;

export default class Embedly extends Component {
  static propTypes = {
    actualDescription: PropTypes.string,
    actualTitle: PropTypes.string,
    small: PropTypes.bool,
    id: PropTypes.number.isRequired,
    imageOnly: PropTypes.bool,
    noLink: PropTypes.bool,
    siteUrl: PropTypes.string,
    style: PropTypes.object,
    thumbUrl: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string
  };

  fallbackImage = '/img/link.png';

  constructor({ thumbUrl, actualTitle, actualDescription, siteUrl }) {
    super();
    this.state = {
      imageUrl: thumbUrl
        ? thumbUrl.replace('http://', 'https://')
        : '/img/link.png',
      title: actualTitle,
      description: actualDescription,
      site: siteUrl
    };
  }

  async componentDidMount() {
    this.mounted = true;
    const { id, siteUrl, url } = this.props;
    if (url && !siteUrl) {
      try {
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, { url, linkId: id });
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://'),
            title,
            description,
            site
          });
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { id, url } = this.props;
    if (url && prevProps.url !== url) {
      try {
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, { url, linkId: id });
        if (this.mounted) {
          this.setState({
            imageUrl: image.url.replace('http://', 'https://'),
            title,
            description,
            site
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { noLink, small, style, url } = this.props;
    const contentCss = css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      color: ${Color.darkerGray()};
      position: relative;
      overflow: hidden;
      ${!small ? 'flex-direction: column;' : ''};
    `;
    return (
      <div
        className={css`
          width: 100%;
          > a {
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
        {noLink ? (
          <div className={contentCss}>{this.renderInner()}</div>
        ) : (
          <a
            className={contentCss}
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >
            {this.renderInner()}
          </a>
        )}
      </div>
    );
  }

  onImageLoadError = () => {
    const { thumbUrl } = this.props;
    this.setState(state => ({
      imageUrl:
        !thumbUrl || state.imageUrl === thumbUrl ? this.fallbackImage : thumbUrl
    }));
  };

  renderInner = () => {
    const { imageUrl, description, title, site } = this.state;
    const { imageOnly, small } = this.props;
    return (
      <>
        <section
          className={css`
            position: relative;
            width: ${small ? '25%' : '100%'};
            &:after {
              content: '';
              display: block;
              padding-bottom: ${small ? '100%' : '60%'};
            }
          `}
        >
          <img
            className={css`
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
            src={imageUrl}
            onError={this.onImageLoadError}
            alt={title}
          />
        </section>
        {!imageOnly && (
          <section
            className={css`
              width: 100%;
              padding: 1rem;
              ${small ? 'margin-left: 1rem;' : ''};
              ${small ? '' : 'margin-top: 1rem;'};
            `}
          >
            <h3>{title || this.props.title}</h3>
            <p>{description}</p>
            <p style={{ fontWeight: 'bold' }}>{site}</p>
          </section>
        )}
      </>
    );
  };
}
