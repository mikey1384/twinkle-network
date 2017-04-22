import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Textarea from 'react-textarea-autosize'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import SearchInput from 'components/SearchInput'
import {uploadVideoAsync} from 'redux/actions/VideoActions'
import {fetchCategoriesAsync, clearCategoriesSearchResults} from 'redux/actions/FeedActions'
import {connect} from 'react-redux'
import {isValidYoutubeUrl, stringIsEmpty} from 'helpers/stringHelpers'
import {Color} from 'constants/css'

@connect(
  state => ({
    categorySearchResult: state.FeedReducer.categorySearchResult
  }),
  {
    uploadVideo: uploadVideoAsync,
    fetchCategories: fetchCategoriesAsync,
    clearSearchResults: clearCategoriesSearchResults
  }
)
export default class AddVideoForm extends Component {
  static propTypes = {
    categorySearchResult: PropTypes.array,
    uploadVideo: PropTypes.func,
    clearSearchResults: PropTypes.func,
    fetchCategories: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      categorySearchText: '',
      selectedCategoryLabel: '',
      urlError: null,
      form: {
        url: '',
        title: '',
        description: '',
        selectedCategory: null
      }
    }
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.onClickOutSideSearch = this.onClickOutSideSearch.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSearchInputFocus = this.onSearchInputFocus.bind(this)
    this.onSearchInputChange = this.onSearchInputChange.bind(this)
    this.onUrlFieldChange = this.onUrlFieldChange.bind(this)
  }

  render() {
    const {categorySearchResult} = this.props
    const {urlError, form, selectedCategoryLabel, categorySearchText} = this.state
    const {url, title} = form
    return (
      <form className="container-fluid">
        <fieldset className="form-group" style={{marginBottom: '0.5em'}}>
          <label><strong>YouTube Url</strong></label>
          <div style={{display: 'inline'}}>
            <input
              ref={ref => { this.UrlField = ref }}
              style={{borderColor: !!urlError && 'red'}}
              value={form.url}
              onChange={this.onUrlFieldChange}
              className="form-control"
              placeholder="Paste video's YouTube url here"
              type="text"
            />
          </div>
          {urlError &&
            <span
              className="help-block"
              style={{
                color: 'red',
                marginBottom: '0px'
              }}
            >
              {urlError}
            </span>
          }
        </fieldset>
        <fieldset className="form-group" style={{marginBottom: '0.5em', marginTop: '1em'}}>
          <strong>
            <span
              style={{fontSize: selectedCategoryLabel ? '1.5em' : '1em'}}
            >Category:</span>&nbsp;&nbsp;&nbsp;<span
              style={{
                fontSize: selectedCategoryLabel ? '1.5em' : '1em',
                color: selectedCategoryLabel ? Color.blue : Color.gray,
                fontStyle: selectedCategoryLabel ? 'normal' : 'italic'
              }}
            >
              {selectedCategoryLabel || 'Not Selected'}
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
            onFocus={this.onSearchInputFocus}
            onSelect={this.onCategorySelect}
            onClickOutSide={this.onClickOutSideSearch}
          />
        </fieldset>
        <fieldset className="form-group">
          <label><strong>Title</strong></label>
          <div style={{display: 'inline'}}>
            <input
              value={form.title}
              onChange={event => this.setState({form: {...form, title: event.target.value}})}
              className="form-control"
              placeholder="Enter Title"
              type="text"
            />
          </div>
        </fieldset>
        <fieldset className="form-group">
          <label><strong>Description</strong></label>
          <Textarea
            value={form.description}
            className="form-control"
            minRows={4}
            placeholder="Enter Description (Optional, you don't need to write this)"
            onChange={event => this.setState({form: {...form, description: event.target.value}})}
          />
        </fieldset>
        <Modal.Footer>
          <Button
            className="btn btn-primary"
            type="submit"
            onClick={this.onSubmit}
            disabled={!selectedCategoryLabel || !url || !title || stringIsEmpty(title)}
          >
            Add
          </Button>
        </Modal.Footer>
      </form>
    )
  }

  onSubmit(event) {
    const {uploadVideo} = this.props
    const {form} = this.state
    const {url} = form
    let urlError
    event.preventDefault()

    if (!isValidYoutubeUrl(url)) urlError = 'That is not a valid YouTube url'
    if (urlError) {
      this.setState({urlError})
      return this.UrlField.focus()
    }

    uploadVideo(form)
  }

  onCategorySelect(item) {
    const {clearSearchResults} = this.props
    const {form} = this.state
    this.setState({
      categorySearchText: '',
      selectedCategoryLabel: item.label,
      form: {
        ...form,
        selectedCategory: item.id
      }
    })
    clearSearchResults()
  }

  onClickOutSideSearch() {
    const {clearSearchResults} = this.props
    this.setState({categorySearchText: ''})
    clearSearchResults()
  }

  onSearchInputChange(event) {
    const {fetchCategories} = this.props
    this.setState({categorySearchText: event.target.value})
    fetchCategories(event.target.value)
  }

  onSearchInputFocus() {
    const {fetchCategories} = this.props
    fetchCategories()
  }

  onUrlFieldChange(event) {
    const {form} = this.state
    const url = event.target.value
    this.setState({
      form: {...form, url, urlError: null},
      urlError: null
    })
  }
}
