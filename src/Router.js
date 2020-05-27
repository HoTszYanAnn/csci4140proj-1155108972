import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import LoadingPage from "./LoadingPage"
import ErrorPage from "./Error";
import { Suspense} from 'react';

const LoadableHomePage =  React.lazy(() => import('./HomePage'));

const LoadableAiPage =  React.lazy(() => import('./AIPage'));


const LoadableOnlinePage =  React.lazy(() => import('./OnlinePage'));

//temp
const LoadablelobbyPage =  React.lazy(() => import('./LobbyPage'));

// TODO add react-loadable
const Routes = () => (
  // Hash router is used because of github-pages issues with browser router
  <Router>
    <Switch>
      <Route exact path="/">
        <Suspense fallback={<LoadingPage/>}>
          <LoadableHomePage />
        </Suspense>  
      </Route>
      <Route path="/ai">
        <Suspense fallback={<LoadingPage/>}>
          <LoadableAiPage />
        </Suspense>  
      </Route>
      <Route path="/online">
        <Suspense fallback={<LoadingPage/>}>
          <LoadableOnlinePage />
        </Suspense>  
      </Route>
      
      <Route path="/lobby">
        <Suspense fallback={<LoadingPage/>}>
          <LoadablelobbyPage />
        </Suspense>  
      </Route>
      <Route path="/loading" component={LoadingPage} />
  
      <Route path="*" component={ErrorPage} />
    </Switch>
  </Router>
);

export default Routes;