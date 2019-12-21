import React, { useMemo, useRef } from 'react';
import Input from './Input';
import { Color } from 'constants/css';
import { useAppContext, useChatContext } from 'contexts';

export default function Dictionary() {
  const {
    requestHelpers: { lookUpDictionary }
  } = useAppContext();
  const {
    state: { wordObj },
    actions: { onSetWordObj }
  } = useChatContext();
  const inputRef = useRef(null);
  const variations = useMemo(() => wordObj.results || [], [wordObj.results]);

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
        {!wordObj.word && (
          <div
            style={{
              padding: '1rem',
              fontSize: '3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            Enter a word using the text box below
          </div>
        )}
        {wordObj.word && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%'
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
              {wordObj.word}
            </div>
            <div
              style={{
                width: '80%',
                padding: '1rem',
                height: '100%',
                overflow: 'scroll'
              }}
            >
              {variations.map((variation, index) => (
                <div key={index}>{variation.definition}</div>
              ))}
            </div>
          </div>
        )}
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
    console.log(wordObject);
    onSetWordObj(wordObject);
  }
}
