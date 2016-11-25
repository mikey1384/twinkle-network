import React, {Component} from 'react';
import {reduxForm, Field, reset} from 'redux-form';
import {connect} from 'react-redux';
import Textarea from 'react-textarea-autosize';
import Button from 'components/Button';
import SearchInput from 'components/SearchInput';
import {
  fetchCategoriesAsync,
  clearCategoriesSearchResults,
  uploadContentAsync
} from 'redux/actions/FeedActions';
import {
  isValidYoutubeUrl,
  stringIsEmpty
} from 'helpers/stringHelpers';

const renderInput = (
  {
    input, type, autoFocus, className, placeholder, checked,
    checkIfYouTubeVideo, toggleCheck, meta: {touched, error}
  }
) => (
  <div style={{display: 'inline'}}>
    <input
      {...input}
      onChange={event => {
        input.onChange(event)
        if (input.name === 'url') {
          checkIfYouTubeVideo(event.target.value);
        }
      }}
      autoFocus={autoFocus}
      checked={checked}
      onClick={() => {if (input.name === 'isVideo') toggleCheck()}}
      className={className}
      placeholder={placeholder}
      type={type}
      style={{borderColor: touched && error ? 'red' : '#e7e7e7'}}
    />
    {touched && error && (error !== 'Enter url') && (error !== 'Enter title') &&
      <span
        className="help-block"
        style={{
          color: 'red',
          marginBottom: '0px'
        }}
      >{error}</span>
    }
  </div>
)

const renderTextarea = ({input, className, minRows, placeholder}) =>
<Textarea
  {...input}
  className={className}
  minRows={minRows}
  placeholder={placeholder}
/>

@reduxForm({
  form: 'UploadVideoForm',
  validate
})
@connect(
  state => ({
    username: state.UserReducer.username,
    categorySearchResult: state.FeedReducer.categorySearchResult
  }),
  {
    fetchCategories: fetchCategoriesAsync,
    clearSearchResults: clearCategoriesSearchResults,
    uploadContent: uploadContentAsync,
    resetForm: reset
  }
)
export default class FeedInputPanel extends Component {
  constructor() {
    super()
    this.state = {
      checkedVideo: false,
      categoryText: '',
      selectedCategoryLabel: '',
      selectedCategory: null,
      categoryNotSelected: false,
      descriptionFieldsShown: false
    }
    this.checkIfYouTubeVideo = this.checkIfYouTubeVideo.bind(this)
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.onSearchInputChange = this.onSearchInputChange.bind(this)
    this.onSearchInputFocus = this.onSearchInputFocus.bind(this)
    this.onClickOutSideSearch = this.onClickOutSideSearch.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {categorySearchResult = [], handleSubmit, username, submitting} = this.props;
    const {
      checkedVideo, categoryText, descriptionFieldsShown,
      selectedCategoryLabel, categoryNotSelected
    } = this.state;
    return (
      <div className="panel panel-default"
        style={{
          borderTop: '1px solid rgb(231, 231, 231)'
        }}
      >
        <div className="panel-heading flexbox-container">
          <p className="panel-title pull-left" style={{fontWeight: 'bold'}}>Hello{`${username ? ' ' + username : ''}`}! Got anything interesting you want to share?</p>
        </div>
        <div className="panel-body">
          <form className="container-fluid" onSubmit={handleSubmit(this.onSubmit)}>
            <fieldset className="form-group" style={{marginBottom: '0.5em'}}>
              <label style={{paddingBottom: '0.3em'}}><strong>Enter Url</strong></label>
              <Field
                name="url"
                placeholder="Enter url. For example: www.google.com"
                className="form-control"
                component={renderInput}
                checkIfYouTubeVideo={this.checkIfYouTubeVideo}
                type="text"
              />
            </fieldset>
            <fieldset className="form-group">
              <label>YouTube Video:&nbsp;&nbsp;&nbsp;</label>
              <Field
                name="isVideo"
                toggleCheck={() => this.setState({checkedVideo: !this.state.checkedVideo})}
                checked={checkedVideo}
                component={renderInput}
                type="checkbox"
              />
            </fieldset>
            <fieldset className="form-group">
              <strong>
                <span
                  style={{fontSize: selectedCategoryLabel ? '1.5em' : '1em',}}
                >Category:</span>&nbsp;&nbsp;&nbsp;<span
                  style={{
                    fontSize: selectedCategoryLabel ? '1.5em' : '1em',
                    color: selectedCategoryLabel ? '#158cba' : '#999999',
                    fontStyle: selectedCategoryLabel ? 'normal' : 'italic'
                  }}
                >
                  {`${selectedCategoryLabel ? selectedCategoryLabel : 'Not Selected'}`}
                </span>
              </strong>
            </fieldset>
            <fieldset className="form-group">
              <SearchInput
                placeholder="Select Category"
                onChange={this.onSearchInputChange}
                value={categoryText}
                searchResults={categorySearchResult}
                renderItemLabel={
                  item => <span>{item.label}</span>
                }
                onClear={this.onClickOutSideSearch}
                onClickOutSide={this.onClickOutSideSearch}
                onFocus={this.onSearchInputFocus}
                onSelect={this.onCategorySelect}
              />
              <span
                className="help-block"
                style={{color: 'red'}}
              >{`${categoryNotSelected ? 'Select category' : ''}`}</span>
            </fieldset>
            {descriptionFieldsShown && <div>
              <fieldset className="form-group">
                <Field
                  autoFocus
                  name="title"
                  placeholder="Enter Title"
                  className="form-control"
                  component={renderInput}
                  type="text"
                />
              </fieldset>
              <fieldset className="form-group">
                <Field
                  name="description"
                  className="form-control"
                  minRows={4}
                  placeholder="Enter Description (Optional, you don't need to write this)"
                  component={renderTextarea}
                />
              </fieldset>
            </div>}
            <Button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              Share!
            </Button>
          </form>
        </div>
      </div>
    )
  }

  checkIfYouTubeVideo(url) {
    if (isValidYoutubeUrl(url)) {
      this.setState({checkedVideo: true})
    }
  }

  onCategorySelect(item) {
    const {clearSearchResults} = this.props;
    this.setState({
      categoryText: '',
      selectedCategoryLabel: item.label,
      selectedCategory: item.id,
      descriptionFieldsShown: true
    })
    clearSearchResults()
  }

  onClickOutSideSearch() {
    const {clearSearchResults} = this.props;
    this.setState({
      categoryText: ''
    })
    clearSearchResults()
  }

  onSearchInputChange(event) {
    const {fetchCategories} = this.props;
    this.setState({categoryText: event.target.value})
    fetchCategories(event.target.value)
  }

  onSearchInputFocus() {
    const {fetchCategories} = this.props;
    this.setState({categoryNotSelected: false})
    fetchCategories()
  }

  onSubmit(props) {
    const {selectedCategory, checkedVideo} = this.state;
    const {uploadContent, resetForm} = this.props;
    if (selectedCategory === null) {
      return this.setState({categoryNotSelected: true})
    }
    let params = Object.assign({}, props, {
      categoryId: selectedCategory,
      checkedVideo
    })
    resetForm('UploadVideoForm')
    this.setState({
      checkedVideo: false,
      categoryText: '',
      selectedCategoryLabel: '',
      selectedCategory: null
    })
    uploadContent(params)
  }
}

function validate (values) {
  const {url, title, isVideo} = values;
  const errors = {};

  if ((title && stringIsEmpty(title)) || !title) {
    errors.title = 'Enter title';
  }
  if (!url) {
    errors.url = 'Enter url';
  }
  if (url && !isValidYoutubeUrl(url)) {
    if (isVideo) {
      errors.url = 'That is not a valid YouTube url';
    } else {
      if (!isValidUrl(url)) {
        errors.url = 'That is not a valid url';
      }
    }
  }

  return errors;
}

function isValidUrl(url) {
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return regex.test(url);
}
