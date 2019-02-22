import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Body from './Body';
import SearchInput from 'components/Texts/SearchInput';
import Input from 'components/Texts/Input';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import { useOutsideClick } from 'helpers/hooks';
import { profileThemes } from 'constants/defaultValues';
import { connect } from 'react-redux';
import { addEmoji, stringIsEmpty } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

SectionPanel.propTypes = {
  canEdit: PropTypes.bool,
  title: PropTypes.string,
  button: PropTypes.node,
  emptyMessage: PropTypes.string,
  innerRef: PropTypes.func,
  inverted: PropTypes.bool,
  isEmpty: PropTypes.bool,
  isSearching: PropTypes.bool,
  loaded: PropTypes.bool,
  loadMore: PropTypes.func,
  profileTheme: PropTypes.string,
  children: PropTypes.node,
  loadMoreButtonShown: PropTypes.bool,
  onEditTitle: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  searchQuery: PropTypes.string,
  customColorTheme: PropTypes.string,
  style: PropTypes.object
};

function SectionPanel({
  button,
  canEdit,
  children,
  customColorTheme,
  emptyMessage,
  innerRef,
  inverted,
  isEmpty,
  isSearching,
  loaded,
  loadMore,
  loadMoreButtonShown,
  onEditTitle,
  onSearch,
  placeholder = 'Enter Title',
  profileTheme,
  searchPlaceholder,
  searchQuery = '',
  style = {},
  title
}) {
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const themeColor = customColorTheme || profileTheme || 'logoBlue';
  const TitleInputRef = useRef(null);
  useOutsideClick(TitleInputRef, () => {
    setOnEdit(false);
    setEditedTitle(title);
  });

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
          background: #fff;
          color: ${profileThemes[themeColor].color};
          border-top-left-radius: ${borderRadius};
          border-top-right-radius: ${borderRadius};
          padding: 1rem;
          padding-top: ${inverted ? '1.7rem' : '1rem'};
          font-weight: bold;
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
              <Input
                inputRef={TitleInputRef}
                maxLength={100}
                placeholder={placeholder}
                autoFocus
                onChange={text => setEditedTitle(addEmoji(text))}
                onKeyPress={event => {
                  if (!stringIsEmpty(editedTitle) && event.key === 'Enter') {
                    onChangeTitle(editedTitle);
                  }
                }}
                value={editedTitle}
              />
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
                onClick={() => {
                  setOnEdit(true);
                  setEditedTitle(title);
                }}
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
            addonColor={profileThemes[themeColor].color}
            borderColor={profileThemes[themeColor].color}
            style={{
              color: '#fff',
              gridArea: 'search',
              width: '100%',
              justifySelf: 'center',
              zIndex: 0
            }}
            onChange={search}
            placeholder={searchPlaceholder}
            value={searchQuery}
          />
        )}
        <div style={{ gridArea: 'buttons', justifySelf: 'end' }}>{button}</div>
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
            statusMsgStyle={css`
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
            `}
          />
        ) : (
          <Loading />
        )}
        {loadMoreButtonShown && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              transparent
              disabled={loading}
              onClick={onLoadMore}
              style={{ fontSize: '2rem' }}
            >
              Load More
            </Button>
          </div>
        )}
      </main>
    </div>
  );

  async function onChangeTitle(title) {
    await onEditTitle(title);
    setOnEdit(false);
  }

  function search(text) {
    onSearch(text);
  }

  async function onLoadMore() {
    if (!loading) {
      setLoading(true);
      await loadMore();
      setLoading(false);
    }
  }
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(SectionPanel);
