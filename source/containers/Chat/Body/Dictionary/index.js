import React, { useEffect, useMemo, useRef, useState } from 'react';
import Input from './Input';
import uuidv1 from 'uuid/v1';
import Loading from 'components/Loading';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { useAppContext, useChatContext, useInputContext } from 'contexts';

export default function Dictionary() {
  const {
    requestHelpers: { lookUpDictionary }
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
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => changeInput(inputText), 300);
    async function changeInput(input) {
      setLoading(true);
      const wordObject = await lookUpDictionary(input);
      onSetWordObj(wordObject);
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
  const others = useMemo(
    () =>
      details.filter(
        detail =>
          ![
            'noun',
            'verb',
            'adjective',
            'preposition',
            'adverb',
            'pronoun'
          ].includes(detail.partOfSpeech)
      ),
    [details]
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
          height: 'CALC(100% - 20rem)'
        }}
      ></div>
      <div
        style={{
          borderTop: `1px solid ${Color.borderGray()}`,
          width: '100%',
          height: '20rem'
        }}
      >
        {stringIsEmpty(inputText) && (
          <div
            style={{
              padding: '1rem',
              fontSize: '3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <div>Enter a word using the text box below</div>
          </div>
        )}
        {!stringIsEmpty(inputText) &&
          (loading ? (
            <Loading text="Looking up" />
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
              <div style={{ padding: '1rem' }}>
                {verbs.length > 0 && (
                  <div>
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
                        <div key={uuidv1()}>{detail.definition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {nouns.length > 0 && (
                  <div>
                    <p>noun:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {nouns.map(detail => (
                        <div key={uuidv1()}>{detail.definition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {adjectives.length > 0 && (
                  <div>
                    <p>adjective:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {adjectives.map(detail => (
                        <div key={uuidv1()}>{detail.definition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {prepositions.length > 0 && (
                  <div>
                    <p>preposition:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {prepositions.map(detail => (
                        <div key={uuidv1()}>{detail.definition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {adverbs.length > 0 && (
                  <div>
                    <p>adverb:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {adverbs.map(detail => (
                        <div key={uuidv1()}>{detail.definition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {pronouns.length > 0 && (
                  <div>
                    <p>pronoun:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {pronouns.map(detail => (
                        <div key={uuidv1()}>{detail.definition}</div>
                      ))}
                    </div>
                  </div>
                )}
                {others.length > 0 && (
                  <div>
                    <p>other:</p>
                    <div
                      style={{
                        width: '80%',
                        padding: '1rem',
                        height: '100%',
                        overflow: 'scroll'
                      }}
                    >
                      {others.map(detail => (
                        <div key={uuidv1()}>
                          {detail.definition}
                          {detail.partOfSpeech
                            ? ` (${detail.partOfSpeech})`
                            : ''}
                        </div>
                      ))}
                    </div>
                  </div>
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
    const wordObject = await lookUpDictionary(text);
    onSetWordObj(wordObject);
  }
}
