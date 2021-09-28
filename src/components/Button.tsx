import { ButtonHTMLAttributes } from "react"

import '../styles/button.scss'

type ButtomProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button(props: ButtomProps) {
    return (
        <button className="button" {...props}/>
    )
}

export {Button}