import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import request from 'axios';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import SubjectItem from './SubjectItem';
import Loading from 'components/Loading';
import SubjectMsgsModal from '../SubjectMsgsModal';
import { Color } from 'constants/css';
import { queryStringForArray } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import URL from 'constants/URL';

const API_URL = `${URL}/chat`;

SubjectsModal.propTypes = {
  currentSubjectId: PropTypes.number,
  onHide: PropTypes.func,
  selectSubject: PropTypes.func
};

export default function SubjectsModal({
  currentSubjectId,
  onHide,
  selectSubject
}) {
  const { userId } = useMyState();
  const [loaded, setLoaded] = useState(false);
  const [mySubjects, setMySubjects] = useState({
    subjects: [],
    loadMoreButton: false,
    loading: false
  });
  const [allSubjects, setAllSubjects] = useState({
    subjects: [],
    loadMoreButton: false,
    loading: false
  });
  const [msgsModal, setMsgsModal] = useState({
    shown: false,
    subjectId: null,
    title: ''
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadSubjects();
    async function loadSubjects() {
      try {
        const {
          data: { mySubjects, allSubjects }
        } = await request.get(`${API_URL}/chatSubject/modal?userId=${userId}`);
        if (mounted.current) {
          setMySubjects(mySubjects);
          setAllSubjects(allSubjects);
          setLoaded(true);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

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
              setMsgsModal({ shown: false, subjectId: null, title: '' })
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
                  setMsgsModal({
                    shown: true,
                    subjectId: subject.id,
                    title: subject.content
                  })
                }
                {...subject}
              />
            ))}
            {mySubjects.loadMoreButton && (
              <LoadMoreButton
                filled
                color="lightBlue"
                loading={mySubjects.loading}
                onClick={() => loadMoreSubjects(true)}
              />
            )}
          </div>
        )}
        {loaded && (
          <div
            style={{
              margin: '1rem 0',
              marginTop: mySubjects.subjects.length > 0 ? '3rem' : '1rem',
              width: '100%'
            }}
          >
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
              setMsgsModal({
                shown: true,
                subjectId: subject.id,
                title: subject.content
              })
            }
            {...subject}
          />
        ))}
        {allSubjects.loadMoreButton && (
          <LoadMoreButton
            filled
            color="lightBlue"
            loading={allSubjects.loading}
            onClick={() => loadMoreSubjects(false)}
          />
        )}
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );

  async function loadMoreSubjects(mineOnly) {
    if (mineOnly) {
      setMySubjects({ ...mySubjects, loading: true });
    } else {
      setAllSubjects({ ...allSubjects, loading: true });
    }

    const queryString = queryStringForArray({
      array: mineOnly ? mySubjects.subjects : allSubjects.subjects,
      originVar: 'id',
      destinationVar: 'subjectIds'
    });

    try {
      const {
        data: { subjects, loadMoreButton }
      } = await request.get(
        `${API_URL}/chatSubject/modal/more?${
          mineOnly ? `mineOnly=${mineOnly}&` : ''
        }userId=${userId}&${queryString}`
      );
      if (mineOnly) {
        setMySubjects({
          ...mySubjects,
          subjects: mySubjects.subjects.concat(subjects),
          loadMoreButton,
          loading: false
        });
      } else {
        setAllSubjects({
          ...allSubjects,
          subjects: allSubjects.subjects.concat(subjects),
          loadMoreButton,
          loading: false
        });
      }
    } catch (error) {
      console.error(error.response || error);
    }
  }
}
