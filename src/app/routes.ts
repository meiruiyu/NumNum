import { createElement } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { AuthGate } from './components/AuthGate';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { RecommendedDishes } from './pages/RecommendedDishes';
import { Reservation } from './pages/Reservation';
import { Search } from './pages/Search';
import { MapView } from './pages/MapView';
import { MyLists } from './pages/MyLists';
import { Profile } from './pages/Profile';
import { LanguageSettings } from './pages/LanguageSettings';
import { FriendsSpacePermission } from './pages/FriendsSpacePermission';
import { FriendsSpace } from './pages/FriendsSpace';
import { AddFriends } from './pages/AddFriends';
import { Chat } from './pages/Chat';
import { Rankings } from './pages/Rankings';
import { NotFound } from './pages/NotFound';

// Wraps a page component in <AuthGate> so we can declare it via the
// `Component:` field of a route entry. Used for standalone (non-Layout) pages.
const guarded = (Component: any) => () =>
  createElement(AuthGate, null, createElement(Component));

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/splash',
    Component: Splash,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'map',
        Component: MapView,
      },
      {
        path: 'search',
        Component: Search,
      },
      {
        path: 'lists',
        Component: MyLists,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ],
  },
  {
    path: '/restaurant/:id',
    Component: guarded(RestaurantDetail),
  },
  {
    path: '/restaurant/:id/dishes',
    Component: guarded(RecommendedDishes),
  },
  {
    path: '/restaurant/:id/reservation',
    Component: guarded(Reservation),
  },
  {
    path: '/language-settings',
    Component: guarded(LanguageSettings),
  },
  {
    path: '/friends-space-permission',
    Component: guarded(FriendsSpacePermission),
  },
  {
    path: '/friends-space',
    Component: guarded(FriendsSpace),
  },
  {
    path: '/friends-space/add',
    Component: guarded(AddFriends),
  },
  {
    path: '/friends-space/chat/:id',
    Component: guarded(Chat),
  },
  {
    path: '/rankings',
    Component: guarded(Rankings),
  },
  {
    path: '*',
    Component: NotFound,
  },
]);