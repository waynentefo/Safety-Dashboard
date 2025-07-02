import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import auditsSlice from "./audits/auditsSlice";
import documentsSlice from "./documents/documentsSlice";
import inspectionsSlice from "./inspections/inspectionsSlice";
import risk_managementsSlice from "./risk_managements/risk_managementsSlice";
import safety_ticketsSlice from "./safety_tickets/safety_ticketsSlice";
import she_meetingsSlice from "./she_meetings/she_meetingsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
audits: auditsSlice,
documents: documentsSlice,
inspections: inspectionsSlice,
risk_managements: risk_managementsSlice,
safety_tickets: safety_ticketsSlice,
she_meetings: she_meetingsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
