import React, { useEffect, useState } from 'react';
import { useAppContext } from 'contexts';

export default function Gif() {
  const [firstGif, setFirstGif] = useState('');
  const {
    requestHelpers: { searchGifs }
  } = useAppContext();

  useEffect(() => {
    init();
    async function init() {
      const gifs = await searchGifs('hello');
      console.log(gifs);
      // eslint-disable-next-line camelcase
      setFirstGif(gifs[0]?.embed_url);
    }
  }, []);

  return <div>{firstGif}</div>;
}
