import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';


class EditTitleForm extends Component {
  state = {
    title: this.props.title
  }

  handleClickOutside = (event) => {
    this.props.onClickOutSide();
  }
  onEditSubmit(event, title) {
    event.preventDefault();
    this.props.onEditSubmit(title);
  }

  render () {
    const { title } = this.state;
    return (
      <form
        {...this.props}
        onSubmit={ event => this.onEditSubmit(event, title) }
      >
        <input
          autoFocus
          ref="editTitleInput"
          type="text"
          className="form-control"
          placeholder="Enter Title..."
          value={title}
          onChange={event => this.setState({title: event.target.value})}
        />
      </form>
    )
  }
}

export default onClickOutside(EditTitleForm)
