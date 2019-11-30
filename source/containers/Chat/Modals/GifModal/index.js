import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import { useAppContext } from 'contexts';
import GifList from './GifList';

GifModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function GifModal({ onHide }) {
  let [title, setTitle] = useState('');

  const [gifs, setGifs] = useState('');
  const {
    requestHelpers: { searchGifs }
  } = useAppContext();

  useEffect(() => {
    init();
    async function init() {
      const gifs = await searchGifs(title);
      console.log(gifs);
      setGifs(gifs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <Modal onHide={onHide}>
      <header>Search for Gifs</header>
      <main>
        <form style={{ width: '50%' }}>
          <Input
            autoFocus
            placeholder={'Search Gifs'}
            value={title}
            onChange={setTitle}
          />
        </form>
        <div>{gifs.length} gifs found</div>
        <GifList data={gifs} />
      </main>
      <footer>
        <Button onClick={onHide}>Cancel</Button>
        <Button>Submit</Button>
      </footer>
    </Modal>
  );
}
