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
import {queryStringForArray} from 'helpers/apiHelpers'
import Loading from 'components/Loading'

const API_URL = `${URL}/chat`

class SubjectsModal extends Component {
  static propTypes = {
    currentSubjectId: PropTypes.number,
    userId: PropTypes.number,
    onHide: PropTypes.func,
    selectSubject: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      loaded: false,
      mySubjects: {
        subjects: [],
        loadMoreButton: false,
        loading: false
      },
      allSubjects: {
        subjects: [],
        loadMoreButton: false,
        loading: false
      }
    }
    this.loadMoreSubjects = this.loadMoreSubjects.bind(this)
  }

  componentWillMount() {
    const {userId} = this.props
    return request.get(`${API_URL}/chatSubject/modal?userId=${userId}`).then(
      ({data}) => {
        this.setState({
          ...this.state,
          ...data,
          loaded: true
        })
      }
    ).catch(
      error => console.error(error.response || error)
    )
  }

  render() {
    const {currentSubjectId, onHide, selectSubject} = this.props
    const {loaded, mySubjects, allSubjects} = this.state
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
          {!loaded && <Loading />}
          {mySubjects.subjects.length > 0 &&
            <div style={{marginTop: '0.5em', marginBottom: '1.5em'}}>
              <div className="page-header" style={{marginTop: '0px'}}>
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
              {mySubjects.subjects.map(subject => <SubjectItem
                key={subject.id}
                currentSubjectId={currentSubjectId}
                selectSubject={() => selectSubject(subject.id)}
                {...subject}
              />)}
              {mySubjects.loadMoreButton && <LoadMoreButton
                style={{marginTop: '1em'}}
                loading={mySubjects.loading}
                onClick={() => this.loadMoreSubjects(true)}
              />}
            </div>
          }
          {loaded && <div className="page-header" style={{marginTop: '0.5em'}}>
            <h3 style={{
              marginTop: '0px',
              marginBottom: '0px',
              fontWeight: 'bold',
              color: Color.green
            }}>
              All Subjects
            </h3>
          </div>}
          {allSubjects.subjects.map(subject => <SubjectItem
            key={subject.id}
            currentSubjectId={currentSubjectId}
            selectSubject={() => selectSubject(subject.id)}
            {...subject}
          />)}
          {allSubjects.loadMoreButton && <LoadMoreButton
            style={{marginTop: '1em'}}
            loading={allSubjects.loading}
            onClick={() => this.loadMoreSubjects()}
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

  loadMoreSubjects(mineOnly) {
    const {userId} = this.props
    const {mySubjects, allSubjects} = this.state
    const {subjects} = mineOnly ? mySubjects : allSubjects
    const subjectLabel = `${mineOnly ? 'mySubjects' : 'allSubjects'}`
    this.setState({[subjectLabel]: {...this.state[subjectLabel], loading: true}})
    return request.get(`
      ${API_URL}/chatSubject/modal/more?${mineOnly ? `mineOnly=${mineOnly}&` : ''}userId=${userId}&${queryStringForArray(subjects, 'id', 'subjectIds')}
    `).then(
      ({data: {subjects, loadMoreButton}}) => this.setState({
        [subjectLabel]: {
          subjects: this.state[subjectLabel].subjects.concat(subjects),
          loadMoreButton,
          loading: false
        }
      })
    ).catch(
      error => console.error(error.response || error)
    )
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(SubjectsModal)
