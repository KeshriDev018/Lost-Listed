import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.ts"
import lostitemSlice from "./lostitemSlice.ts"
import founditemSlice from "./founditemSlice.ts"
import productSlice from "./productSlice.ts"
import activitySlice from "./activitySlice.ts"
import notificationSlice from "./notificationSlice.ts"


import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  lostitem:lostitemSlice,
  founditem:founditemSlice,
  product:productSlice,
  activity:activitySlice,
  notification: notificationSlice
  
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;

/*
Normally jab tum Redux use karte ho:
App reload karte hi Redux ka state reset ho jaata hai.
Example: Agar tum login karke refresh maarte ho, toh user logout ho jaata hai 😅
Toh iska solution hai → Redux Persist
Redux Persist kya karta hai?
👉 Redux store ka data localStorage (ya AsyncStorage) me save (persist) kar deta hai.
Jab app reload hoti hai, wo data wapis Redux me load (rehydrate) kar deta hai.

Step 1️⃣ — Redux Persist ke imports
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

👉 Ye sab Redux Persist ke functions hain:
storage — batata hai data localStorage me save hoga
persistReducer — tumhara reducer ko ek wrapper deta hai jo save/load handle karega
persistStore — ek persistor object banata hai jisse data store me load hota rahega


Step 2️⃣ — Config banana
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

👉 Ye config batata hai:
key: "root" → localStorage me kis naam se save hoga
version → future ke liye (migrations, etc.)
storage → kaha save karna hai (yahan localStorage)


Step 3️⃣ — Root Reducer banana
const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice
})
👉 Dono slice ko combine kar diya ek root reducer me.


Step 4️⃣ — Persisted Reducer banana
const persistedReducer = persistReducer(persistConfig, rootReducer);

👉 Ab rootReducer ko Redux Persist ke wrapper se wrap kar diya.
Ye ensure karega ki jab bhi store me change hoga, wo localStorage me save ho jaaye.



Step 5️⃣ — Store banana
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

👉 Yahaan:
Tum persistedReducer ko store me laga rahe ho (normal reducer nahi)
Middleware me kuch actions ignore kar rahe ho kyunki Redux Persist kuch non-serializable values bhejta hai.


*/
