import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'components/Button';
import Body from './Body';
import SearchInput from 'components/Texts/SearchInput';
import Input from 'components/Texts/Input';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import { addEmoji, stringIsEmpty } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

export default class SectionPanel extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    title: PropTypes.string,
    button: PropTypes.node,
    emptyMessage: PropTypes.string,
    innerRef: PropTypes.func,
    inverted: PropTypes.bool,
    isEmpty: PropTypes.bool,
    isSearching: PropTypes.bool,
    headerTheme: PropTypes.object,
    loaded: PropTypes.bool,
    loadMore: PropTypes.func,
    children: PropTypes.node,
    loadMoreButtonShown: PropTypes.bool,
    onEditTitle: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    searchQuery: PropTypes.string,
    style: PropTypes.object
  };

  constructor({ title }) {
    super();
    this.state = {
      loading: false,
      onEdit: false,
      editedTitle: title
    };
  }

  render() {
    const {
      canEdit,
      headerTheme = { color: '#fff', background: Color.logoBlue() },
      innerRef,
      inverted,
      title,
      button,
      loadMoreButtonShown,
      onEditTitle,
      onSearch,
      placeholder = 'Enter Title',
      searchPlaceholder,
      searchQuery = '',
      style = {},
      children,
      emptyMessage,
      isEmpty,
      isSearching,
      loaded
    } = this.props;
    const { loading, onEdit, editedTitle } = this.state;
    return (
      <div
        className={css`
          border: 1px solid ${Color.borderGray()};
          width: 100%;
          background: #fff;
          border-radius: ${borderRadius};
          margin-bottom: 1rem;
          > header {
            display: grid;
            width: 100%;
            grid-template-areas: 'title search buttons';
            grid-template-columns: auto ${onSearch ? '40%' : 'auto'} auto;
            background: ${inverted
              ? headerTheme.color
              : headerTheme.background};
            color: ${inverted ? headerTheme.background : headerTheme.color};
            border-top-left-radius: ${borderRadius};
            border-top-right-radius: ${borderRadius};
            padding: 1rem;
            padding-top: ${inverted ? '1.7rem' : '1rem'};
            font-weight: ${inverted ? 'bold' : ''};
            font-size: 2.5rem;
            align-items: center;
          }
          > main {
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            width: 100%;
            justify-content: center;
            min-height: 15rem;
          }
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border: 0;
            > header {
              border-radius: 0;
            }
          }
        `}
      >
        <header ref={innerRef}>
          <div
            style={{
              gridArea: 'title',
              marginRight: '1rem',
              display: 'flex'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              {onEdit ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Input
                    maxLength={100}
                    placeholder={placeholder}
                    autoFocus
                    onChange={text =>
                      this.setState({ editedTitle: addEmoji(text) })
                    }
                    onKeyPress={event => {
                      if (
                        !stringIsEmpty(editedTitle) &&
                        event.key === 'Enter'
                      ) {
                        this.onChangeTitle(editedTitle);
                      }
                    }}
                    value={editedTitle}
                  />
                  <div
                    className={css`
                      &:hover {
                        text-decoration: underline;
                      }
                    `}
                    style={{
                      color: Color.gray(),
                      position: 'abolute',
                      zIndex: 3,
                      marginLeft: '1rem',
                      fontWeight: 'normal',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      lineHeight: '1.7rem',
                      alignItems: 'flex-end'
                    }}
                    onClick={() =>
                      this.setState({ onEdit: false, editedTitle: title })
                    }
                  >
                    <span>Cancel</span>
                  </div>
                </div>
              ) : (
                <div style={{ lineHeight: '3rem' }}>{title}</div>
              )}
              {canEdit && onEditTitle && !onEdit ? (
                <div
                  className={css`
                    &:hover {
                      text-decoration: underline;
                    }
                  `}
                  style={{
                    color: Color.gray(),
                    fontWeight: 'normal',
                    marginTop: '0.5rem',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    lineHeight: '1.7rem',
                    alignItems: 'flex-end'
                  }}
                  onClick={() =>
                    this.setState({ onEdit: true, editedTitle: title })
                  }
                >
                  <span>
                    <Icon icon="pencil-alt" />
                    &nbsp;&nbsp;Edit
                  </span>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          {onSearch && (
            <SearchInput
              style={{
                color: Color.black(),
                gridArea: 'search',
                width: '100%',
                justifySelf: 'center',
                zIndex: 0
              }}
              onChange={this.onSearch}
              placeholder={searchPlaceholder}
              value={searchQuery}
            />
          )}
          <div style={{ gridArea: 'buttons', justifySelf: 'end' }}>
            {button}
          </div>
        </header>
        <main style={style}>
          {loaded ? (
            <Body
              content={children}
              emptyMessage={emptyMessage}
              loadMoreButtonShown={loadMoreButtonShown}
              isEmpty={isEmpty}
              isSearching={isSearching}
              searchQuery={searchQuery}
              statusMsgStyle={this.statusMsg}
            />
          ) : (
            <Loading />
          )}
          {loadMoreButtonShown && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                transparent
                disabled={loading}
                onClick={this.onLoadMore}
                style={{ fontSize: '2rem' }}
              >
                Load More
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  onChangeTitle = async title => {
    const { onEditTitle } = this.props;
    await onEditTitle(title);
    this.setState({ onEdit: false });
  };

  onSearch = text => {
    const { onSearch } = this.props;
    onSearch(text);
  };

  onLoadMore = async() => {
    const { loadMore } = this.props;
    const { loading } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      await loadMore();
      this.setState({ loading: false });
    }
  };

  statusMsg = css`
    font-size: 3rem;
    font-weight: bold;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
}
