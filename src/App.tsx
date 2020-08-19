import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { gameInit_ac } from './actions';
import HomePage from './pages/Home';
import AnswerPage from './pages/Answer';
import EndPage from './pages/End';

function App() {

  const dispatch = useDispatch();

  useEffect(
    () => {
      const uid = localStorage.getItem('uid');
      if (uid && typeof uid != 'undefined') {
        dispatch(gameInit_ac({ uid }));
      } else {
        const js_code = Date.now().toString();
        dispatch(gameInit_ac({ js_code }));
      }
    }, []
  )

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/answer" component={AnswerPage} />
          <Route path="/end" component={EndPage} />
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default App;
