import { createContext, useState } from "react";

import { BrowserRouter, Route } from "react-router-dom";

import { auth } from "./services/firebase";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

type UserType = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: UserType | undefined;
  singInWithGoogle: () => void
}

export const AuthContext = createContext({} as AuthContextType);

function App() {
  const [user, setUser] = useState<UserType>()

  function singInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    auth.signInWithPopup(auth.getAuth(), provider).then(result => {
      if(result.user) {
        const {displayName, photoURL, uid} = result.user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{user, singInWithGoogle}}>
        <Route path="/" exact component={Home}/>
        <Route path="/rooms/new" component={NewRoom}/>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App;
