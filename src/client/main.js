require('../../stylesheets/home.scss');

import {
  IndexRoute,
  Router,
  Route
} from 'react-router';
import IndexContainer from './components/index';
import {Index} from './components/index';
import Login from './components/login';
import RestaurantsIndex, {RestaurantsIndexComponent} from './components/restaurantsindex';

import RestaurantsMap from './components/restaurantsmap';
import RestaurantsList from './components/restaurantslist';
import Users from './components/users';
import Start from './components/start/start';
import StartCard from './components/start/card';
import StartSettings from './components/start/settings';
import StartMap from './components/start/map';
import StartSubmit from './components/start/submit';
import Board from './components/board/board';
import BoardTimeLine from './components/board/timeline';
import BoardCard from './components/board/card';
import BoardSettings from './components/board/settings';
import Ordering from './components/ordering';
import Profile from './components/profile';
import React from 'react';
import ReactDom from 'react-dom';
import {createHistory} from 'history';
import Relay from 'react-relay';
// import rootQuery from '../indexroute.js';
import ReactRouterRelay from 'react-router-relay';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin',
  })
);

const histori = createHistory();

window.variables = {};
console.log('main', window.variables);

var ViewerQuery = {
  user: (Component) => Relay.QL `
  query {
    root {
      ${Component.getFragment('user')},
    },
  }
  `
};

var RestaurantQuery = {
  restaurant: (Component) => Relay.QL `
  query {
    root (id: $id) {
      ${Component.getFragment('restaurant')}
    }
  }
  `
};

var RestaurantsQuery = {
  restaurant: (Component) => Relay.QL `
  query {
    root {
      ${Component.getFragment('restaurant')}
    }
  }
  `
};
//I pass restaurant id to root and then from root to restaurant in the schema.js field
var FullQuery = {
  user: (Component) => Relay.QL`
  query {
    root (id: $id) {
      ${Component.getFragment('user')}
    },
  }
  `,
  restaurant: (Component) => Relay.QL`
  query {
    root (id: $id) {
      ${Component.getFragment('restaurant')}
    }
  }
  `
};

ReactDom.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={histori}
  >
    <Route path='/' component={IndexContainer} queries={ViewerQuery}>
      <IndexRoute component={Users} queries={ViewerQuery}/>
      <Route path='restaurant/:id' component={Ordering} queries={FullQuery}/>
      <Route path='profile' component={Profile} queries={ViewerQuery}/>
      <Route path="restaurants" component={RestaurantsIndex} queries={RestaurantsQuery}>
        <Route path='map' component={RestaurantsMap} />
        <Route path='list' component={RestaurantsList} />
      </Route>
      <Route path="start" component={Start} queries={ViewerQuery}>
        <Route path='card' component={StartCard}/>
        <Route path='settings' component={StartSettings}/>
        <Route path='map' component={StartMap}>
          <Route path='/start/submit' component={StartSubmit}/>
        </Route>
      </Route>
      <Route path="register" component={Login} queries={ViewerQuery} />
      <Route path="board/:id" component={Board} queries={FullQuery}>
        <Route path="/settings/:id" component = {BoardSettings} queries={RestaurantQuery} />
        <Route path="/timeline/:id" component = {BoardTimeLine} queries={RestaurantQuery}/>
        <Route path="/card/:id" component = {BoardCard} queries={RestaurantQuery}/>
      </Route>
    </Route>
  </Router>, document.getElementById('app'));
