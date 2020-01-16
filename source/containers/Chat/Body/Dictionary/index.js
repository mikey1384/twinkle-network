import React, { useEffect, useMemo, useRef, useState } from 'react';
import Input from './Input';
import Loading from 'components/Loading';
import ActivitiesContainer from './ActivitiesContainer';
import EntriesContainer from './EntriesContainer';
import Definition from './Definition';
import Icon from 'components/Icon';
import FilterBar from 'components/FilterBar';
import WordRegisterStatus from './WordRegisterStatus';
import { Color } from 'constants/css';
import {
  useAppContext,
  useChatContext,
  useContentContext,
  useInputContext
} from 'contexts';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';

export default function Dictionary() {
  const {
    requestHelpers: { lookUpWord, registerWord }
  } = useAppContext();
  const {
    state: { wordsObj, wordRegisterStatus },
    actions: { onRegisterWord, onSetWordRegisterStatus, onSetWordsObj }
  } = useChatContext();
  const {
    actions: { onChangeUserXP }
  } = useContentContext();
  const {
    state,
    actions: { onEnterComment }
  } = useInputContext();
  const { userId } = useMyState();
  const inputText = state['dictionary'] || '';
  const wordObj = useMemo(() => wordsObj[inputText] || {}, [
    inputText,
    wordsObj
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activitiesTabShown, setActivitiesTabShown] = useState(true);
  const [loading, setLoading] = useState(false);

  const text = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    text.current = inputText;
    if (!stringIsEmpty(inputText)) {
      clearTimeout(timerRef.current);
      setLoading(true);
      timerRef.current = setTimeout(() => changeInput(inputText), 1000);
    }
    async function changeInput(input) {
      const word = await lookUpWord(input);
      if (
        (!wordObj.content && word.notFound) ||
        (word.content &&
          word.content.toLowerCase() === text.current.toLowerCase())
      ) {
        onSetWordsObj(word);
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  const widgetHeight = useMemo(() => {
    return stringIsEmpty(inputText) || loading ? '16rem' : `20rem`;
  }, [inputText, loading]);

  const containerHeight = useMemo(() => {
    return `CALC(100% - ${widgetHeight})`;
  }, [widgetHeight]);

  const notRegistered = useMemo(
    () => wordObj.isNew && !stringIsEmpty(inputText) && !loading,
    [wordObj.isNew, inputText, loading]
  );

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column'
      }}
    >
      <FilterBar>
        <nav
          className={activitiesTabShown ? 'active' : ''}
          onClick={() => setActivitiesTabShown(true)}
        >
          Activities
        </nav>
        <nav
          className={!activitiesTabShown ? 'active' : ''}
          onClick={() => setActivitiesTabShown(false)}
        >
          My Vocabs
        </nav>
      </FilterBar>
      {activitiesTabShown && (
        <ActivitiesContainer
          style={{
            width: '100%',
            overflow: 'scroll',
            height: containerHeight
          }}
        />
      )}
      {!activitiesTabShown && (
        <EntriesContainer
          style={{
            width: '100%',
            overflow: 'scroll',
            height: containerHeight
          }}
        />
      )}
      <div
        style={{
          zIndex: 5,
          width: '100%',
          height: widgetHeight,
          boxShadow:
            !wordRegisterStatus &&
            stringIsEmpty(inputText) &&
            `0 -5px 6px -3px ${Color.gray()}`,
          borderTop:
            (!!wordRegisterStatus || !stringIsEmpty(inputText)) &&
            `1px solid ${Color.borderGray()}`
        }}
      >
        {stringIsEmpty(inputText) && !!wordRegisterStatus && (
          <WordRegisterStatus />
        )}
        {!wordRegisterStatus && stringIsEmpty(inputText) && (
          <div
            style={{
              padding: '1rem',
              fontSize: '3.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              background: Color.black(),
              color: '#fff'
            }}
          >
            <div>
              <span>Type a word in the text box below</span>
              <Icon style={{ marginLeft: '1rem' }} icon="arrow-down" />
            </div>
          </div>
        )}
        {!stringIsEmpty(inputText) &&
          (loading ? (
            <Loading style={{ height: '100%' }} text="Looking up..." />
          ) : (
            <div
              style={{
                display: 'flex',
                position: 'relative',
                paddingRight: '1rem',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                overflow: 'scroll'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '20%',
                  alignItems: 'center',
                  padding: '1rem',
                  fontSize: '3rem'
                }}
              >
                {wordObj.content}
              </div>
              <Definition wordObj={wordObj} />
            </div>
          ))}
      </div>
      {notRegistered && (
        <div
          style={{
            display: 'flex',
            background: Color.green(),
            color: '#fff',
            width: '100%',
            padding: '1rem',
            fontSize: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
            height: '7rem'
          }}
        >
          This word has not been registered yet. Register and earn XP!
        </div>
      )}
      <div
        style={{
          background: Color.inputGray(),
          padding: '1rem',
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        <Input
          onSubmit={handleSubmit}
          innerRef={inputRef}
          registerButtonShown={notRegistered}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );

  async function handleSubmit() {
    const { isNew, ...definitions } = wordObj;
    if (isNew && !isSubmitting) {
      setIsSubmitting(true);
      const { xp, rank, word } = await registerWord(definitions);
      onChangeUserXP({ xp, rank, userId });
      onRegisterWord(word);
      onSetWordRegisterStatus(wordObj);
      onEnterComment({
        contentType: 'dictionary',
        text: ''
      });
      setIsSubmitting(false);
    }
  }
}
