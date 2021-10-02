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
    isAnswerd: boolean,
    isHighlighted: boolean,
    likeCount: number,
    hasLiked: boolean
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswerd: boolean,
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
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {}

            const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswerd: value.isAnswerd,
                    likeCount: Object.values(value.likes ?? {}).length,
                    hasLiked: Object.values(value.likes ?? {}).some(like => like.athorId === user?.id)
                }
            })
            setTitle(room.val().title)
            setQuestions(parseQuestions)
        })

        return () => {
            database.off(roomRef, 'value')
        }
    }, [roomId, user?.id])

    return {questions, title}
}

export{useRoom}