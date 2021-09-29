import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";


type UserType = {
    id: string,
    name: string,
    avatar: string
}

type AuthContextType = {
    user: UserType | undefined;
    singInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
    children: ReactNode
}

function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<UserType>()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(auth.getAuth(), user => {
            if (user) {
                const { displayName, photoURL, uid } = user

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

        return () => {
            unsubscribe()
        }
    }, [])

    async function singInWithGoogle() {
        const provider = new auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(auth.getAuth(), provider)

        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }


    return (
        <AuthContext.Provider value={{ user, singInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider }