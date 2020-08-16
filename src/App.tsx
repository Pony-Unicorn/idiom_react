import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './pages/Home';
import AnswerPage from './pages/Answer';
import EndPage from './pages/End';

function App() {
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
