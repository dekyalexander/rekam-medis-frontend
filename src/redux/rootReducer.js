import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
// slices
import uiReducer from './slices/ui';
import userReducer from './slices/user';
import authReducer from './slices/auth';
import settingsReducer from './slices/settings';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['settings']
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const authPersistConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['isAuthenticated']
};

const rootReducer = combineReducers({
  user: userReducer,
  ui:uiReducer,
  settings: settingsReducer,
  auth: persistReducer(authPersistConfig, authReducer)
});

export { rootPersistConfig, rootReducer };
