import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import {connect} from 'react-redux'
import request from 'axios'
import {URL} from 'constants/URL'
import LoadMoreButton from 'components/LoadMoreButton'
import SubjectItem from './SubjectItem'
import {Color} from 'constants/css'

const API_URL = `${URL}/chat`

@connect(state => ({
  userId: state.UserReducer.userId
}))
export default class SubjectsModal extends Component {
  static propTypes = {
    userId: PropTypes.number,
    onHide: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      mySubjects: {
        subjects: [],
        loadMoreButton: false
      },
      allSubjects: {
        subjects: [],
        loadMoreButton: false
      }
    }
  }

  componentWillMount() {
    const {userId} = this.props
    return request.get(`${API_URL}/chatSubject/modal?userId=${userId}`).then(
      ({data}) => {
        this.setState({
          ...this.state,
          ...data
        })
      }
    ).catch(
      error => console.error(error.response || error)
    )
  }

  render() {
    const {onHide} = this.props
    const {mySubjects, allSubjects} = this.state
    return (
      <Modal
        show
        onHide={onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>View Subjects</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="page-header" style={{marginTop: '0.5em'}}>
            <h3
              style={{
                marginTop: '0px',
                marginBottom: '0px',
                fontWeight: 'bold',
                color: Color.green
              }}
            >
              My Subjects
            </h3>
          </div>
          {mySubjects.subjects.map(subject => <SubjectItem key={subject.id} {...subject} />)}
          {mySubjects.loadMoreButton && <LoadMoreButton
            style={{marginTop: '1em'}}
            loading={false}
            onClick={() => console.log('clicked')}
          />}
          <div className="page-header" style={{marginTop: '1.5em'}}>
            <h3 style={{
              marginTop: '0px',
              marginBottom: '0px',
              fontWeight: 'bold',
              color: Color.green
            }}>
              All Subjects
            </h3>
          </div>
          {allSubjects.subjects.map(subject => <SubjectItem key={subject.id} {...subject} />)}
          {allSubjects.loadMoreButton && <LoadMoreButton
            style={{marginTop: '1em'}}
            loading={false}
            onClick={() => console.log('clicked')}
          />}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-default"
            onClick={onHide}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
