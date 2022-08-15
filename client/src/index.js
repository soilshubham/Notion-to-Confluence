import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';
import Dashboard from './components/Dashboard';
import RedirectNotion from './components/RedirectNotion';
import RedirectConf from './components/RedirectConf';
import Page from './components/Page';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="redirect_url" element={<RedirectNotion />} />
      <Route path="redirect_url_conf" element={<RedirectConf />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="page" >
        <Route path=":id" element={<Page />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

