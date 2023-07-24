import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaClipboard } from 'react-icons/fa';
import { useform } from './useform';
import { getRanChar, getSym } from './utils';

function App() {
  const [vals, setVals] = useform({
    length: 6,
    capper: true,
    smol: true,
    num: false,
    sym: false,
    phrase: '',
  });

  const [res, setRes] = useState('');

  const fieldsArray = [
    {
      field: vals.capper,
      getChar: () => getRanChar(65, 90),
    },
    {
      field: vals.smol,
      getChar: () => getRanChar(97, 122),
    },
    {
      field: vals.num,
      getChar: () => getRanChar(48, 57),
    },
    {
      field: vals.sym,
      getChar: () => getSym(),
    },
    {
      field: vals.phrase !== '',
      getChar: () => vals.phrase.charAt(Math.floor(Math.random() * vals.phrase.length)),
    },
  ];

  const handle_sub = (e) => {
    e.preventDefault();
    let genpass = '';
    const check_fields = fieldsArray.filter(({ field }) => field);
    let phraseAdded = false;
  
    // no phrase?
    let totalCharsNeeded = vals.length;
  
    // check if phrase length is too long for limit
    const phraseLength = vals.phrase.trim().length;
    if (phraseLength >= vals.length) {
      toast.error('The phrase is too long to fit within the selected password length.');
      return;
    }
  
    // if phrase, adjust totalCharsNeeded
    if (phraseLength > 0) {
      totalCharsNeeded -= phraseLength;
    }
  
    for (let i = 0; i < totalCharsNeeded; i++) {
      const index = Math.floor(Math.random() * check_fields.length);
      const letter = check_fields[index]?.getChar();
  
      if (letter) {
        genpass += letter;
      }
    }
  
    // add the phrase at a specific position
    if (phraseLength > 0) {
      const phrasePosition = Math.floor(Math.random() * (genpass.length + 1));
      genpass =
        genpass.slice(0, phrasePosition) +
        vals.phrase +
        genpass.slice(phrasePosition, genpass.length);
    }
  
    if (genpass) {
      setRes(genpass);
    } else {
      toast.error('Please select at least one parameter or provide a phrase :(');
    }
  };

  const handleClipboard = async () => {
    if (res) {
      await navigator.clipboard.writeText(res);
      toast.success('Copied to your clipboard :D');
    } else {
      toast.error('No password to copy');
    }
  };

  return (
    <section>
      <div className="container">
        <form id="pg-form" onSubmit={handle_sub}>
          <div className="result">
            <input
              type="text"
              id="result"
              placeholder="Minimum of 6 Characters"
              readOnly
              value={res}
            />
            <div className="clipboard" onClick={handleClipboard}>
              <FaClipboard></FaClipboard>
            </div>
          </div>
          <div>
            <div className="field">
              <label htmlFor="length">Length</label>
              <input
                type="number"
                id="length"
                min={6}
                max={22}
                name="length"
                value={vals.length}
                onChange={setVals}
              />
            </div>
            <div className="field">
              <label htmlFor="capper">Upper Case</label>
              <input
                type="checkbox"
                id="capper"
                name="capper"
                checked={vals.capper}
                onChange={setVals}
              />
            </div>
            <div className="field">
              <label htmlFor="smol">Lower Case</label>
              <input
                type="checkbox"
                id="smol"
                name="smol"
                checked={vals.smol}
                onChange={setVals}
              />
            </div>
            <div className="field">
              <label htmlFor="num">Number</label>
              <input
                type="checkbox"
                id="num"
                name="num"
                checked={vals.num}
                onChange={setVals}
              />
            </div>
            <div className="field">
              <label htmlFor="sym">Symbol</label>
              <input
                type="checkbox"
                id="sym"
                name="sym"
                checked={vals.sym}
                onChange={setVals}
              />
            </div>
            <div className="field">
              <label htmlFor="phrase">Phrase</label>
              <input 
                type="text" 
                id="phrase"
                name="phrase"
                checked={vals.phrase}
                onChange={setVals}
              />
            </div>
          </div>
          <button type="submit">Generate Password</button>
        </form>
      </div>
    </section>
  );
}

export default App;
