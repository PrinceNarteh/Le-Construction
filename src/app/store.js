import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./feature/user/userSlice";
import resetPasswordReducer from "./feature/resetPassword/resetPasswordSlice";
import companyReducer from "./feature/company/companySlice";
import modalReducer from "./feature/modal/modalSlice";
import companySettingsSlice from "./feature/companySettings/companySettingsSlice";
import websiteSlice from "./feature/company/websiteSlice";
import loadingBarReducer from "./feature/loadingBar/loadingBarSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loadingBar"],
};

const rootReducer = combineReducers({
  user: userReducer,
  resetPassword: resetPasswordReducer,
  company: companyReducer,
  companySettings: companySettingsSlice,
  website: websiteSlice,
  modal: modalReducer,
  loadingBar: loadingBarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistedStore = persistStore(store);
