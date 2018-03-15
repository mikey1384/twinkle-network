import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import Button from 'components/Button'
import { connect } from 'react-redux'
import request from 'axios'
import { URL } from 'constants/URL'
import LoadMoreButton from 'components/LoadMoreButton'
import SubjectItem from './SubjectItem'
import { Color } from 'constants/css'
import { queryStringForArray } from 'helpers/apiHelpers'
import Loading from 'components/Loading'
import SubjectMsgsModal from '../SubjectMsgsModal'

const API_URL = `${URL}/chat`

class SubjectsModal extends Component {
  static propTypes = {
    currentSubjectId: PropTypes.number,
    userId: PropTypes.number,
    onHide: PropTypes.func,
    selectSubject: PropTypes.func
  }

  state = {
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
    },
    msgsModal: {
      shown: false,
      subjectId: null,
      title: ''
    }
  }

  componentWillMount() {
    const { userId } = this.props
    return request
      .get(`${API_URL}/chatSubject/modal?userId=${userId}`)
      .then(({ data }) => {
        this.setState({
          ...this.state,
          ...data,
          loaded: true
        })
      })
      .catch(error => console.error(error.response || error))
  }

  render() {
    const { currentSubjectId, onHide, selectSubject } = this.props
    const { loaded, mySubjects, allSubjects, msgsModal } = this.state
    return (
      <Modal onHide={onHide} style={{ overflow: msgsModal.shown && 'hidden' }}>
        <header>View Subjects</header>
        <main>
          {!loaded && <Loading />}
          {msgsModal.shown && (
            <SubjectMsgsModal
              subjectId={msgsModal.subjectId}
              subjectTitle={msgsModal.title}
              onHide={() =>
                this.setState({
                  msgsModal: { shown: false, subjectId: null, title: '' }
                })
              }
            />
          )}
          {mySubjects.subjects.length > 0 && (
            <div style={{ width: '100%' }}>
              <h3
                style={{
                  color: Color.green(),
                  marginBottom: '1rem'
                }}
              >
                My Subjects
              </h3>
              {mySubjects.subjects.map(subject => (
                <SubjectItem
                  key={subject.id}
                  currentSubjectId={currentSubjectId}
                  selectSubject={() => selectSubject(subject.id)}
                  showMsgsModal={() =>
                    this.setState({
                      msgsModal: {
                        shown: true,
                        subjectId: subject.id,
                        title: subject.content
                      }
                    })
                  }
                  {...subject}
                />
              ))}
              {mySubjects.loadMoreButton && (
                <LoadMoreButton
                  style={{ marginTop: '1rem' }}
                  loading={mySubjects.loading}
                  onClick={() => this.loadMoreSubjects(true)}
                />
              )}
            </div>
          )}
          {loaded && (
            <div style={{ margin: '1rem 0', width: '100%' }}>
              <h3
                style={{
                  color: Color.green()
                }}
              >
                All Subjects
              </h3>
            </div>
          )}
          {allSubjects.subjects.map(subject => (
            <SubjectItem
              key={subject.id}
              currentSubjectId={currentSubjectId}
              selectSubject={() => selectSubject(subject.id)}
              showMsgsModal={() =>
                this.setState({
                  msgsModal: {
                    shown: true,
                    subjectId: subject.id,
                    title: subject.content
                  }
                })
              }
              {...subject}
            />
          ))}
          {allSubjects.loadMoreButton && (
            <LoadMoreButton
              style={{ marginTop: '1em' }}
              loading={allSubjects.loading}
              onClick={() => this.loadMoreSubjects()}
            />
          )}
        </main>
        <footer>
          <Button transparent onClick={onHide}>
            Close
          </Button>
        </footer>
      </Modal>
    )
  }

  loadMoreSubjects = mineOnly => {
    const { userId } = this.props
    const { mySubjects, allSubjects } = this.state
    const { subjects } = mineOnly ? mySubjects : allSubjects
    const subjectLabel = `${mineOnly ? 'mySubjects' : 'allSubjects'}`
    this.setState({
      [subjectLabel]: { ...this.state[subjectLabel], loading: true }
    })
    return request
      .get(
        `
      ${API_URL}/chatSubject/modal/more?${
          mineOnly ? `mineOnly=${mineOnly}&` : ''
        }userId=${userId}&${queryStringForArray(subjects, 'id', 'subjectIds')}
    `
      )
      .then(({ data: { subjects, loadMoreButton } }) =>
        this.setState({
          [subjectLabel]: {
            subjects: this.state[subjectLabel].subjects.concat(subjects),
            loadMoreButton,
            loading: false
          }
        })
      )
      .catch(error => console.error(error.response || error))
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(SubjectsModal)
