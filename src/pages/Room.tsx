import { async } from '@firebase/util'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import "../styles/room.scss"

type RoomParams = {
    id: string;
}

function Room() {
    const {user} = useAuth()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('')

    async function handleSendQuestion() {
        if(newQuestion.trim() === "") {
            return
        }

        if(!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswerd: false
        }

        await database.
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form>
                    <textarea
                        placeholder="O que você quer perguntar"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        <span>
                            Para enviar uma pergunta, <button>faça o seu login</button>.
                        </span>
                        <Button type="submit">Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export {Room}