import PropTypes from 'prop-types';
import React from 'react';
import Textarea from 'components/Texts/Textarea';

EditChoiceListItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  choiceId: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  text: PropTypes.string
};

export default function EditChoiceListItem({
  checked,
  choiceId,
  onEdit,
  onSelect,
  placeholder,
  text
}) {
  return (
    <nav>
      <main>
        <Textarea
          onChange={event => onEdit({ choiceId, text: event.target.value })}
          value={text}
          placeholder={placeholder}
        />
      </main>
      <aside>
        <input
          type="radio"
          onChange={onSelect}
          checked={checked}
          style={{ cursor: 'pointer' }}
        />
      </aside>
    </nav>
  );
}
