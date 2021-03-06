import { useHistory, useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import deleteImg from '../assets/images/delete.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useRoom } from '../hooks/useRoom'
import "../styles/room.scss"
import { Reference } from '../utilities/Reference'
import { database } from '../services/firebase'




type RoomParams = {
    id: string;
}

function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const {title, questions} = useRoom(roomId)

    async function handleEndRoom() {
        const roomRef = Reference(`rooms/${roomId}`)
        await database.update(roomRef, {
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            const questionRef = Reference(`rooms/${roomId}/questions/${questionId}`)
            await database.remove(questionRef)
        }

    }

    async function handleCheckQuestionAsAnswered(questionId:string) {
        const questionRef = Reference(`rooms/${roomId}/questions/${questionId}`)
        await database.update(questionRef, {
          isAnswered: true  
        })
    }

    async function handleHighlightQuestion(questionId:string) {
        const questionRef = Reference(`rooms/${roomId}/questions/${questionId}`)
        await database.update(questionRef, {
          isHighlighted: true  
        })
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="list-questions">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id)}>
                                        <img src={answerImg} alt="Dar destaque a pergunta" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}>
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </div>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div >
    )
}

export { AdminRoom }