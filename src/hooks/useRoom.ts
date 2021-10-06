import { stringify } from "querystring"
import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { Reference } from "../utilities/Reference"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likes: Record<string, {
        athorId: string
    }>
}>

function useRoom(roomId: string) {
    const {user} = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = Reference(`rooms/${roomId}`)

        database.onValue(roomRef, room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};


            const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.keys(value.likes ?? {})[0],
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parseQuestions)
        })

        return () => {
            database.off(roomRef, 'value')
        }
    }, [roomId, user?.id])

    return {questions, title}
}

export{useRoom}