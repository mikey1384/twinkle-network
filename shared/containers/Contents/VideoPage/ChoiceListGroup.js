import React from 'react';

export default function ChoiceListGroup({listItems, onSelect}) {
  return (
    <ul
      className="list-group unselectable"
      style={{
        marginTop: '2em',
        cursor: 'pointer'
      }}
    >
      {listItems.map((item, index) => {
        return (
          <li
            key={index}
            className={`list-group-item ${item.checked ? 'choice-item-checked' : 'choice-item-unchecked'}`}
            dangerouslySetInnerHTML={{__html: item.label}}
            onClick={() => onSelect(index)}
          />
        )
      })}
    </ul>
  )
}
