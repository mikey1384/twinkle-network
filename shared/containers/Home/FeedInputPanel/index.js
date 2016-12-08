import React, {Component} from 'react';
import {connect} from 'react-redux';
import Textarea from 'react-textarea-autosize';
import Button from 'components/Button';
import SearchInput from 'components/SearchInput';
import {Color} from 'constants/css';
import {
  fetchCategoriesAsync,
  clearCategoriesSearchResults,
  uploadContentAsync
} from 'redux/actions/FeedActions';
import {
  isValidYoutubeUrl,
  stringIsEmpty
} from 'helpers/stringHelpers';


@connect(
  state => ({
    username: state.UserReducer.username,
    categorySearchResult: state.FeedReducer.categorySearchResult
  }),
  {
    fetchCategories: fetchCategoriesAsync,
    clearSearchResults: clearCategoriesSearchResults,
    uploadContent: uploadContentAsync
  }
)
export default class FeedInputPanel extends Component {
  constructor() {
    super()
    this.state = {
      categorySearchText: '',
      selectedCategoryLabel: '',
      categoryNotSelected: false,
      descriptionFieldsShown: false,
      form: {
        url: '',
        checkedVideo: false,
        selectedCategory: null,
        title: '',
        description: ''
      },
      errors: {
        url: null,
        title: null
      }
    }
    this.checkIfYouTubeVideo = this.checkIfYouTubeVideo.bind(this)
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.onSearchInputChange = this.onSearchInputChange.bind(this)
    this.onSearchInputFocus = this.onSearchInputFocus.bind(this)
    this.onClickOutSideSearch = this.onClickOutSideSearch.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {categorySearchResult = [], username, submitting} = this.props;
    const {
      form, errors, categorySearchText, descriptionFieldsShown,
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
          <form className="container-fluid">
            <fieldset className="form-group" style={{marginBottom: '0.5em'}}>
              <label style={{paddingBottom: '0.3em'}}><strong>Enter Url</strong></label>
              <div style={{display: 'inline'}}>
                <input
                  style={{borderColor: !!errors.url && 'red'}}
                  value={form.url}
                  onChange={event => this.setState({form: {...form, url: event.target.value}})}
                  className="form-control"
                  placeholder="Enter url. For example: www.google.com"
                  type="text"
                />
              </div>
              {!!errors.url &&
                <span
                  className="help-block"
                  style={{
                    color: 'red',
                    marginBottom: '0px'
                  }}
                >
                  {errors.url}
                </span>
              }
            </fieldset>
            <fieldset className="form-group">
              <label>YouTube Video:&nbsp;&nbsp;&nbsp;</label>
              <input
                onClick={() => this.setState({
                  form: {
                    ...form,
                    checkedVideo: !form.checkedVideo
                  }
                })}
                checked={form.checkedVideo}
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
                    color: selectedCategoryLabel ? Color.blue : Color.gray,
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
                value={categorySearchText}
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
                  <div style={{display: 'inline'}}>
                    <input
                      autoFocus
                      value={form.title}
                      onChange={event => this.setState({form: {...form, title: event.target.value}})}
                      className="form-control"
                      placeholder="Enter Title"
                      type="text"
                    />
                  </div>
                </fieldset>
                <fieldset className="form-group">
                  <Textarea
                    value={form.description}
                    className="form-control"
                    minRows={4}
                    placeholder="Enter Description (Optional, you don't need to write this)"
                    onChange={event => this.setState({form: {...form, description: event.target.value}})}
                  />
                </fieldset>
              </div>
            }
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
      this.setState({
        form: {
          ...this.state.form,
          checkedVideo: true
        }
      })
    }
  }

  onCategorySelect(item) {
    const {clearSearchResults} = this.props;
    const {form, errors} = this.state;
    this.setState({
      categorySearchText: '',
      selectedCategoryLabel: item.label,
      form: {
        ...form,
        selectedCategory: item.id,
      }
    })
    clearSearchResults()
    if (stringIsEmpty(form.url))
    return this.setState({errors: {...errors, url: 'Enter url'}});
    if (!isValidUrl(form.url)) return this.setState({errors: {...errors, url: 'That is not a valid url'}})
    if (form.checkedVideo && !isValidYoutubeUrl(form.url))
    return this.setState({errors: {...errors, url: 'That is not a valid YouTube url'}});
    this.setState({descriptionFieldsShown: true})
  }

  onClickOutSideSearch() {
    const {clearSearchResults} = this.props;
    this.setState({
      categorySearchText: ''
    })
    clearSearchResults()
  }

  onSearchInputChange(event) {
    const {fetchCategories} = this.props;
    this.setState({categorySearchText: event.target.value})
    fetchCategories(event.target.value)
  }

  onSearchInputFocus() {
    const {fetchCategories} = this.props;
    this.setState({categoryNotSelected: false})
    fetchCategories()
  }

  onSubmit(props) {
    const {form} = this.state;
    const {selectedCategory} = form;
    const {uploadContent, resetForm} = this.props;
    if (selectedCategory === null) {
      return this.setState({categoryNotSelected: true})
    }
    let params = Object.assign({}, props, {
      categoryId: selectedCategory,
      checkedVideo: form.checkedVideo
    })
    resetForm('UploadVideoForm')
    this.setState({
      categorySearchText: '',
      selectedCategoryLabel: '',
      form: {
        url: '',
        checkedVideo: false,
        selectedCategory: null,
        title: '',
        description: ''
      }
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
