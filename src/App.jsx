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
  
    const totalCharsNeeded = vals.length - check_fields.length;
    const phraseLength = vals.phrase.trim().length;
  
    // check if all parameters are unchecked and the phrase length doesn't match the limit
    if (check_fields.length === 0 && phraseLength !== vals.length) {
      toast.error('Please check more parameters or provide a phrase that matches the length limit.');
      return;
    }
  
    // if phraseLength equals character limit set by user, return phrase
    if (phraseLength === vals.length) {
      toast.error('A random password was not generated.');
      setRes(vals.phrase);
      return;
    }
  
    // check if the phraseLength is too long to fit within the password length
    if (phraseLength > vals.length) {
      toast.error('The phrase is too long to fit within the selected password length.');
      return;
    }
  
    // if no phrase, generate random characters up to the length limit
    if (phraseLength === 0) {
      for (let i = 0; i < totalCharsNeeded; i++) {
        const index = Math.floor(Math.random() * check_fields.length);
        const letter = check_fields[index]?.getChar();
  
        if (letter) {
          genpass += letter;
        }
      }
    } else {
      // if phrase, adjust the totalCharsNeeded
      const adjustedTotalCharsNeeded = totalCharsNeeded - phraseLength;
  
      for (let i = 0; i < adjustedTotalCharsNeeded; i++) {
        const index = Math.floor(Math.random() * check_fields.length);
        const letter = check_fields[index]?.getChar();
  
        if (letter) {
          genpass += letter;
        }
      }
  
      // add the phrase at specific locations in the password
      const phrasePosition = Math.floor(Math.random() * (genpass.length + 1));
      genpass =
        genpass.slice(0, phrasePosition) +
        vals.phrase +
        genpass.slice(phrasePosition, genpass.length);
    }
  
    // ensure the password reaches the desired length by appending random characters if needed
    while (genpass.length < vals.length) {
      const index = Math.floor(Math.random() * check_fields.length);
      const letter = check_fields[index]?.getChar();
  
      if (letter) {
        genpass += letter;
      }
    }
  
    if (genpass) {
      setRes(genpass.slice(0, vals.length)); // if password too long, shorten it
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
              <input
                type="checkbox"
                id="capper"
                name="capper"
                checked={vals.capper}
                onChange={setVals}
              />
              <label htmlFor="capper">Upper Case</label>
            </div>
            <div className="field">
              <input
                type="checkbox"
                id="smol"
                name="smol"
                checked={vals.smol}
                onChange={setVals}
              />
              <label htmlFor="smol">Lower Case</label>
            </div>
            <div className="field">
              <input
                type="checkbox"
                id="num"
                name="num"
                checked={vals.num}
                onChange={setVals}
              />
              <label htmlFor="num">Number</label>
            </div>
            <div className="field">
              <input
                type="checkbox"
                id="sym"
                name="sym"
                checked={vals.sym}
                onChange={setVals}
              />
              <label htmlFor="sym">Symbol</label>
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
