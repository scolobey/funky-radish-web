import React, { useState, useRef } from 'react';

export default function Popover(props) {

  const textAreaRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');
  };

  return (
    <div className="auth-container">
      <div className="auth">
        <a className="popover_dismiss" onClick={e => {
          e.preventDefault();
          props.dismiss()
        }}>Dismiss</a>
        <div className="Title">
          <h1>{props.title}</h1>
        </div>

        <div className="Message">
          {props.message}
        </div>

        <br></br>
        {props.url ? <form>
          <textarea
            ref={textAreaRef}
            defaultValue={props.url}
          />
        </form> :
        <div></div>}

        {
          /* Logical shortcut for only displaying the
             button if the copy command exists */
          document.queryCommandSupported('copy') &&
           <div>
             <button onClick={copyToClipboard}>Copy</button>
             {copySuccess}
           </div>
         }
      </div>
    </div>
  );
}
