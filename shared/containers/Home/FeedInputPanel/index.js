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

const renderInput = ({input, type, className, placeholder, meta: {touched, error}}) => (
  <div style={{display: 'inline'}}>
    <input
      {...input}
      className={className}
      placeholder={placeholder}
      type={type}
    />
    <span
      className="help-block"
      style={{color: 'red'}}
    >{touched && error && error}</span>
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
      categoryNotSelected: false
    }
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.onSearchInputChange = this.onSearchInputChange.bind(this)
    this.onSearchInputFocus = this.onSearchInputFocus.bind(this)
    this.onClickOutSideSearch = this.onClickOutSideSearch.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {categorySearchResult = [], handleSubmit, username, submitting} = this.props;
    const {checkedVideo, categoryText, selectedCategoryLabel, categoryNotSelected} = this.state;
    return (
      <div className="panel panel-default"
        style={{
          borderTop: '1px solid rgb(231, 231, 231)'
        }}
      >
        <div className="panel-heading">
          <strong>Hello{`${username ? ' ' + username : ''}`}! Got anything interesting you want to share?</strong>
        </div>
        <div className="panel-body">
          <form className="container-fluid" onSubmit={handleSubmit(this.onSubmit)}>
            <fieldset className="form-group" style={{marginBottom: '0px'}}>
              <label>YouTube Video:&nbsp;&nbsp;&nbsp;</label>
              <Field
                name="isVideo"
                checked={checkedVideo}
                onClick={()=>this.setState({checkedVideo:!checkedVideo})}
                component={renderInput}
                type="checkbox"
              />
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
              <Field
                name="url"
                placeholder="Enter url"
                className="form-control"
                component={renderInput}
                type="text"
              />
            </fieldset>
            <fieldset className="form-group">
              <Field
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

  onCategorySelect(item) {
    const {clearSearchResults} = this.props;
    this.setState({
      categoryText: '',
      selectedCategoryLabel: item.label,
      selectedCategory: item.id
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
    const {selectedCategory} = this.state;
    const {uploadContent, resetForm} = this.props;
    if (selectedCategory === null) {
      return this.setState({categoryNotSelected: true})
    }
    let params = Object.assign({}, props, {categoryId: selectedCategory})
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

  if ((title && containsOnlySpaces(title)) || !title) {
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

function containsOnlySpaces(string) {
  return string.replace(/\s/g, "").replace(/\r?\n/g, "") === "";
}

function isValidUrl(url) {
  const regex = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return regex.test(url);
}

function isValidYoutubeUrl(url) {
  var trimmedUrl = url.split("v=")[1];
  return typeof trimmedUrl !== "undefined";
}
