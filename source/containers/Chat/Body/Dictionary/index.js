import React, { useEffect, useMemo, useRef, useState } from 'react';
import Input from './Input';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { useAppContext, useChatContext, useInputContext } from 'contexts';

export default function Dictionary() {
  const {
    requestHelpers: { lookUpWord, registerWord }
  } = useAppContext();
  const {
    state: {
      wordObj,
      wordObj: {
        nouns = [],
        verbs = [],
        adjectives = [],
        prepositions = [],
        adverbs = [],
        pronouns = [],
        conjunctions = [],
        interjections = [],
        others = [],
        isNew
      }
    },
    actions: { onSetWordObj }
  } = useChatContext();
  const { state } = useInputContext();
  const inputText = state['dictionary'] || '';
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!stringIsEmpty(inputText)) {
      clearTimeout(timerRef.current);
      setLoading(true);
      timerRef.current = setTimeout(() => changeInput(inputText), 300);
    }
    async function changeInput(input) {
      const wordObject = await lookUpWord(input);
      onSetWordObj(wordObject);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  const widgetHeight = useMemo(() => {
    return stringIsEmpty(inputText) || loading ? '15rem' : `20rem`;
  }, [inputText, loading]);

  const messagesContainerHeight = useMemo(() => {
    return `CALC(100% - ${widgetHeight})`;
  }, [widgetHeight]);

  const notRegistered = useMemo(
    () => isNew && !stringIsEmpty(inputText) && !loading,
    [inputText, isNew, loading]
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
      <div
        style={{
          width: '100%',
          height: messagesContainerHeight
        }}
      ></div>
      <div
        style={{
          width: '100%',
          height: widgetHeight,
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        {stringIsEmpty(inputText) && (
          <div
            style={{
              padding: '1rem',
              fontSize: '3.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              background: Color.logoBlue(),
              color: '#fff'
            }}
          >
            <div>Type a word in the text box below</div>
          </div>
        )}
        {!stringIsEmpty(inputText) &&
          (loading ? (
            <Loading style={{ height: '100%' }} text="Looking up..." />
          ) : (
            <div
              style={{
                display: 'flex',
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
                {inputText}
              </div>
              <div
                className={css`
                  > section {
                    > p {
                      font-size: 1.7rem;
                      font-style: italic;
                    }
                  }
                `}
                style={{ padding: '1rem' }}
              >
                {verbs.length > 0 && (
                  <section>
                    <p>verb</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {verbs.map((verb, index) => (
                        <div key={verb}>
                          {index + 1}. {verb}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {nouns.length > 0 && (
                  <section>
                    <p>noun</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {nouns.map((noun, index) => (
                        <div key={noun}>
                          {index + 1}. {noun}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {adjectives.length > 0 && (
                  <section>
                    <p>adjective</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {adjectives.map((adjective, index) => (
                        <div key={adjective}>
                          {index + 1}. {adjective}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {prepositions.length > 0 && (
                  <section>
                    <p>preposition</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {prepositions.map((preposition, index) => (
                        <div key={preposition}>
                          {index + 1}. {preposition}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {adverbs.length > 0 && (
                  <section>
                    <p>adverb</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {adverbs.map((adverb, index) => (
                        <div key={adverb}>
                          {index + 1}. {adverb}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {pronouns.length > 0 && (
                  <section>
                    <p>pronoun</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {pronouns.map((pronoun, index) => (
                        <div key={pronoun}>
                          {index + 1}. {pronoun}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {conjunctions.length > 0 && (
                  <section>
                    <p>conjunction</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {conjunctions.map((conjunction, index) => (
                        <div key={conjunction}>
                          {index + 1}. {conjunction}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {interjections.length > 0 && (
                  <section>
                    <p>interjection</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {interjections.map((interjection, index) => (
                        <div key={interjection}>
                          {index + 1}. {interjection}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {others.length > 0 && (
                  <section>
                    <p>other</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {others.map((other, index) => (
                        <div key={other}>
                          {index + 1}. {other}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          ))}
      </div>
      {notRegistered && (
        <div
          style={{
            display: 'flex',
            background: Color.brownOrange(),
            color: '#fff',
            width: '100%',
            padding: '1rem',
            fontSize: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
            height: '7rem'
          }}
        >
          This word has not been registered yet. Register and earn 100 XP!
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
          onHeightChange={() => console.log('height changing')}
          onSubmit={handleSubmit}
          innerRef={inputRef}
          registerButtonShown={notRegistered}
        />
      </div>
    </div>
  );

  async function handleSubmit(text) {
    const { isNew, ...definitions } = wordObj;
    if (isNew) {
      const wordObject = await registerWord({ word: text, definitions });
      onSetWordObj(wordObject);
    }
  }
}
