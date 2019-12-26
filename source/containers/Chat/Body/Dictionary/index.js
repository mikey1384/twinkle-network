import React, { useEffect, useMemo, useRef, useState } from 'react';
import Input from './Input';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { useAppContext, useChatContext, useInputContext } from 'contexts';

export default function Dictionary() {
  const {
    requestHelpers: { lookUpWord }
  } = useAppContext();
  const {
    state: { wordObj },
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
      timerRef.current = setTimeout(() => changeInput(inputText), 300);
    }
    async function changeInput(input) {
      setLoading(true);
      const wordObject = await lookUpWord(input);
      onSetWordObj(wordObject || {});
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  const details = useMemo(
    () =>
      wordObj.word && wordObj.results
        ? wordObj.results.filter(
            result => !result.definition.includes(wordObj.word)
          )
        : [],
    [wordObj.results, wordObj.word]
  );
  const nouns = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'noun'),
    [details]
  );
  const verbs = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'verb'),
    [details]
  );
  const adjectives = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'adjective'),
    [details]
  );
  const prepositions = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'preposition'),
    [details]
  );
  const adverbs = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'adverb'),
    [details]
  );
  const pronouns = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'pronoun'),
    [details]
  );
  const conjunctions = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'conjunctions'),
    [details]
  );
  const interjections = useMemo(
    () => details.filter(detail => detail.partOfSpeech === 'interjection'),
    [details]
  );
  const others = useMemo(
    () =>
      details.filter(
        detail =>
          ![
            'noun',
            'pronoun',
            'verb',
            'adverb',
            'adjective',
            'preposition',
            'conjunction',
            'interjection'
          ].includes(detail.partOfSpeech)
      ),
    [details]
  );

  const widgetHeight = useMemo(() => {
    return stringIsEmpty(inputText) ? '15rem' : '20rem';
  }, [inputText]);

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
          height: `CALC(100% - ${widgetHeight})`
        }}
      ></div>
      <div
        style={{
          borderTop: `1px solid ${Color.borderGray()}`,
          width: '100%',
          height: widgetHeight
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
                    <p>verb:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {verbs.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {nouns.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {adjectives.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {prepositions.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {adverbs.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {pronouns.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {conjunctions.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {interjections.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
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
                      {others.map(detail => (
                        <div key={detail.definition}>{detail.definition}</div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          ))}
      </div>
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
        />
      </div>
    </div>
  );

  async function handleSubmit(text) {
    const wordObject = await lookUpWord(text);
    onSetWordObj(wordObject);
  }
}
