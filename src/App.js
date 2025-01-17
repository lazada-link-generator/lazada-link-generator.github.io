
import './App.css';
import React, { useState, useEffect } from 'react';

const URL_PREFIX_KEY = "url_prefix";
const BITLY_TOKEN_KEY = "bitly_token";

function App() {

  const [urlPrefix, setUrlPrefixState] = useState("");
  const [bitlyToken, setBitlyTokenState] = useState("");
  const [inputUrl, setInputUrlState] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const setInputUrl = e => {
    setInputUrlState(e.target.value);
  };
  const setUrlPrefix = e => {
    setUrlPrefixState(e.target.value);
    localStorage.setItem(URL_PREFIX_KEY, e.target.value);
  };

  const setBitlyToken = e => {
    setBitlyTokenState(e.target.value);
    localStorage.setItem(BITLY_TOKEN_KEY, e.target.value);
  };

  const isValidHttpUrl = (string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  };

  const serialize = (obj) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  };

  const generateNow = async () => {
    // const text = await navigator.clipboard.readText();

    if (!isValidHttpUrl(inputUrl)) {
      return;
    }

    // const response = await fetch(inputUrl, {
    //   mode: 'no-cors'
    // });

    // const text = await response.text();
    // console.log(text);

    const d = {
      url: inputUrl
    };
    const validUrl = `${urlPrefix}?${serialize(d)}`;

    if (validUrl) {
      const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bitlyToken}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          domain: "bit.ly",
          long_url: validUrl
        })
      });

      const data = await response.json();
      setTargetUrl(data.link);
    };

  };

  useEffect(() => {
    setUrlPrefixState(localStorage.getItem(URL_PREFIX_KEY) || "");
    setBitlyTokenState(localStorage.getItem(BITLY_TOKEN_KEY) || "");
  }, []);

  return (
    <div className="container-fluid w-100">
      <div className="container-fluid bg-primary mb-3 text-white text-center h1 py-3">
        Utility for Lazada Retailers
      </div>
      <div className="container">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              URL ของคุณ
            </div>
            <div className="card-subtitle mb-2 text-muted">
              ตัวอย่าง https://c.lazada.co.th/t/xxxxxxx
            </div>
            <input className="form-control" value={urlPrefix} onChange={setUrlPrefix} />
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="card-title">
              Bitly Token
            </div>
            <div className="card-subtitle mb-2 text-muted">
              Token นี้จะเป็นตัวอักษรยาวๆ ใช้เพื่อสร้าง short url ให้อัตโนมัติ
            </div>
            <input type="text" className="form-control" value={bitlyToken} onChange={setBitlyToken} />
          </div>
        </div>

        <div className="card">
          <div className="card-body">

            <div className="card-title">
              วาง URL จาก web lazada
            </div>

            <input type="text" className="form-control" value={inputUrl} onChange={setInputUrl} />

            <button className="form-control mt-3" onClick={generateNow}>สร้าง link</button>


            <input type="text" className={`form-control mt-3`} value={targetUrl} onChange={() => { }} />
            {/* <div className={`container text-center mt-3 ${targetUrl === '' ? 'd-none' : ''} `}>{targetUrl}</div> */}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;;
