---
title: Surviving TypeScript with React + Redux + Redux Thunk + Redux Immutable + Redux Batched Actions + Reselect
---

The first thing you'll need to do is check out the instructions on using TypeScript in the [Redux docs](https://redux.js.org/recipes/usage-with-typescript), they're extremely well written and are our saving grace here, allowing us to get up-and-running quickly with a slightly verbose — but clean and type-safe — initial set-up.

We'll only be writing a small application that toggles a single property in the store, but everything here gives you the toolset you need to expand upon and build a real-world application with. In fact, most of the code is taken directly from the new [SuperHi Editor](https://subeditor.superhi.com/) that I've been working on.

We'll dive in:

```typescript
import { Record } from 'immutable'

export type AuthStatus = 'LOGGED_IN' | 'LOGGED_OUT'

export interface AuthStateProps {
  status: AuthStatus
}

const initialAuthState = Record<AuthStateProps>({
  status: 'LOGGED_OUT'
})

export class AuthState extends initialAuthState implements AuthStateProps {}

export const LOGGED_IN = 'LOGGED_IN'
export const LOGGED_OUT = 'LOGGED_OUT'

interface LoggedInAction {
  type: typeof LOGGED_IN
}

interface LoggedOutAction {
  type: typeof LOGGED_OUT
}

export type AuthActionTypes = LoggedInAction | LoggedOutAction
```

The first file is `auth/types.ts`, it's very similar to the Redux docs on [Type Checking Actions & Action Creators](th-typescript#type-checking-actions-action-creators) but deviates with the use of `immutable.js`, we're using [Immutable](https://immutable-js.github.io/immutable-js/docs/#/) in the SuperHi Editor because it's noticeably faster than working with large JavaScript objects. The Redux docs on [Using Immutable.JS with Redux](https://redux.js.org/recipes/using-immutablejs-with-redux) are again a good starting point but we're ignoring their best practices — such as using a Higher order Component to convert Immutable objects to JS objects — in the name of speed, _everything_ is an Immutable object — typically `Record`s — and we'll work with them directly.

Why Immutable Records? Because they're much "safer" than Immutable Maps. Basically, a record allows us to guarantee the keys, so when we type `record.get('filenamr')` instead of `record.get('filename')` TypeScript will tell us we've done something wrong.

First we set up the plain object — or "props" — for the state:

```typescript
export interface AuthStateProps {
  status: AuthStatus
}
```

Then we create the initial state given the default props:

```typescript
const initialAuthState = Record<AuthStateProps>({
  status: 'LOGGED_OUT'
})
```

And then we build a `class` that extends this Record, allowing us to build records with `new AuthState(props)`:

```typescript
export class AuthState extends initialAuthState implements AuthStateProps {}
```

Typically in this `class` we'd also want to add the props — in this case there's just one: `public readonly status!: AuthStatus` — but if you're using `create-react-app` — as we do in the SuperHi Editor — then you're compiling your TypeScript with Babel, not with TypeScript itself and this will lead to a runtime error of `Cannot set on an immutable record`.

Now for `auth/actions.ts`

```typescript
import { LOGGED_IN, LOGGED_OUT, AuthActionTypes } from './types'

export const loggedIn = (): AuthActionTypes => ({
  type: LOGGED_IN
})

export const loggedOut = (): AuthActionTypes => ({
  type: LOGGED_OUT
})
```

This is really simple and — for now! — exactly the same as the Redux docs. We'll come back to actions when we implement thunk actions later.

For `auth/reducers.ts`

```typescript
import { AuthState, AuthActionTypes, LOGGED_IN, LOGGED_OUT } from './types'

export const initialState = new AuthState()

export default (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case LOGGED_IN:
      return state.set('status', 'LOGGED_IN')
    case LOGGED_OUT:
      return state.set('status', 'LOGGED_OUT')
    default:
      return state
  }
}
```

Pretty similar here too, though we build an `initialState` with our `AuthState` Record and `export` it for later. Because we're using `AuthActionTypes` here TypeScript will know
exactly what payload to expect with each `case`, although in our demo it'll always be empty.

We'll also add `auth/selectors.ts` so we can grab that `status` as needed:

```typescript
import { createSelector } from 'reselect'
import { AuthStatus } from './types'
import { AppState } from '../reducers'

export const selectAuthStatus = createSelector(
  (state: AppState) => state.getIn(['auth', 'status']),
  (authStatus: AuthStatus) => authStatus
)
```

We can use `createSelector` here as `authStatus` is going to be a standard JS string but if we instead wanted to select the entire `auth` slice of the store we'd need to do:

```typescript
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { is } from 'immutable'
import { AuthState } from './types'
import { AppState } from '../reducers'

const createImmutableSelector = createSelectorCreator(defaultMemoize, is)

export const selectAuth = createImmutableSelector(
  (state: AppState) => state.get('auth'),
  (auth: AuthState) => auth
)
```

This allows us to use Immutable's `is` function to compare two immutable objects — in this case the previous auth state and the new auth state — guaranteeing whether or not they're the same and making sure we don't re-render the React app accidentally.

Our root `reducers.ts` file is where things get a little messy:

```typescript
import { Record } from 'immutable'
import { Reducer } from 'redux'
import { ThunkDispatch as TDispatch, ThunkAction as TAction } from 'redux-thunk'
import { combineReducers } from 'redux-immutable'
import { BatchAction } from 'redux-batched-actions'
import authReducer, { initialState as initialAuthState } from './auth/reducers'
import { AuthState, AuthActionTypes } from './auth/types'

interface AppStateProps {
  auth: AuthState
}

const initialAppState = Record<AppStateProps>({
  auth: initialAuthState
})

export class AppState extends initialAppState implements AppStateProps {}

export type AllActionTypes = AuthActionTypes | BatchAction

export type ThunkDispatch = TDispatch<AppState, null, AllActionTypes>

export type ThunkAction = TAction<void, AppState, null, AllActionTypes>

const rootReducer = combineReducers({ auth: authReducer })

export default (rootReducer as unknown) as Reducer<AppState, AllActionTypes>
```

The first thing we do is set up `AppState` just as we did with `AuthState`, using the `initialAuthState` we defined in `auth/reducers.ts`

We `export` a union of all action types, this includes the `AuthActionTypes` — and as any other action types you might've used — as well as the special `BatchAction` type, allowing us to safely dispatch `batchActions` too. We also `export` a `ThunkDispatch` built up of the `AppState`, `void` — because we're not using any extra arguments with `redux-thunk` — and `AllActionTypes` as well as `ThunkAction` built the same way, with `void` as the first type argument as we won't be returning anything from our thunk actions.

Finally we build the `rootReducer` and then, because `redux-immutable` only allows us to use a `Map` here, we lie to TypeScript — and ourselves — and say this is actually a `Reducer` of `AppState` and `AllActionTypes`. This will give us type-checking for keys in the store even though in practice we don't have these guarantees, the API for Immutable Maps and Records are very similar so we can get away with it here.

And then in `store.ts`:

```typescript
import { createStore, applyMiddleware } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import thunk from 'redux-thunk'
import reducers from './reducers'
import middlewareReducer from './middleware/reducers'

const middleware = applyMiddleware(thunk, middlewareReducer)

const store = createStore(enableBatching(reducers), middleware)

export default store
```

This looks pretty much as you'd expect, but wait, where did that middleware come from? We'll have a look at how to use middleware with all of this:

```typescript
import { MiddlewareAPI } from 'redux'
import { AllActionTypes, ThunkDispatch } from '../reducers'

export default ({ dispatch }: MiddlewareAPI<ThunkDispatch>) => (next: ThunkDispatch) => async (
  action: AllActionTypes
) => {
  next(action)
}
```

It's actually not too bad! We're using our previously declared `ThunkDispatch` here to make sure we can `dispatch` on both normal actions and thunk actions. We could even set up a `switch` statement here and get the same level of safety we did in `auth/reducers.ts`. Note if you add your own special middleware-only actions you're also going to want to set up `middleware/types.ts` and `middleware/actions.ts` files for these and add the actions to `AllActionTypes` in `reducers.ts`.

Speaking of auth, we'll add a thunk action to `auth/actions.ts`:

```typescript
export const handleLogIn = (payload: {
  username: string
  password: string
}): ThunkAction => dispatch => {
  // do stuff with the username and password, typically done in middleware for
  // side-effecting stuff like this.
  dispatch(loggedIn())
}
```

We'll use our `ThunkAction` here from `reducers.ts` to keep TypeScript happy, and if we use this in a component:

```js
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AppState, ThunkDispatch } from '../store/reducers'
import { selectAuthStatus } from '../store/auth/selectors'
import { handleLogIn } from '../store/auth/actions'

const mapStateToProps = (state: AppState) => ({
  authStatus: selectAuthStatus(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) =>
  bindActionCreators({ handleLogIn }, dispatch)

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const Index = ({ authStatus, handleLogIn }: Props) => {
  return authStatus === 'LOGGED_IN' ? (
    <div>Logged In</div>
  ) : (
    <div
      onClick={() =>
        handleLogIn({
          username: 'artcommacode',
          password: 'this-is-not-my-password'
        })
      }
    >
      Log In
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
```

Here it's again mostly the same as you'll see in docs, the trick is using `AppState` and `ThunkDispatch` from our root reducer file in `mapStateToProps` and `mapDispatchToProps`, and `ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>` to get the actual shape of our props for the component. You can also extend `Props` if there's any props being passed in from above. We're also using our selector from `auth/selectors.ts` to make sure our data is memoised.

One final gotcha is if you're importing your `store` in a file and using that directly — say you're trying to do something right up top before you add your `<Provider>` wrapper — and dispatching a thunk action. Instead of `store.dispatch(action())` you'll want to do `(store.dispatch as ThunkDispatch)(action())` so TypeScript knows what you're trying to achieve here.

We're also using Apollo in the SuperHi Editor and I considered adding detailed instructions on getting that set up as well, but in practice it depends on what you need. The easiest method is to throw out Redux and just use Apollo, but although Apollo gives you an internal cache it doesn't have the tools — see above for the sheer number of them we're using here! — for working on state like you would in Redux.

Instead, the solution we came up with was to implement Apollo as a Redux middleware which allows us to use Apollo's `client.watchQuery`, `client.mutate` and `client.queryManager.startGraphQLSubscription` methods directly to talk to our API. It looks something like this:

```typescript
switch (action.type) {
  case APOLLO_WATCH_QUERY: {
    const { name, query, variables, onResult, onError } = action.payload
    try {
      const observable = client.watchQuery({ query, variables })
      const { data } = await observable.result()
      if (data && data[name]) {
        dispatch(onResult({ [name]: data[name] }))
      } else {
        throw new Error(`${name} wasn't found in the response`)
      }
    } catch (error) {
      dispatch(onError({ error: error.message }))
    }
    break
  }
}
```

And we're done. If you're interested in how this all comes together then sign up for a [SuperHi course](https://www.superhi.com/courses) and use our [Editor](https://www.superhi.com/editor)!

![The beta SuperHi Editor](/images/editor-beta-screenshot.png)
