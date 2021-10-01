
import { database } from "../services/firebase"


function Reference(ref: string) {
    return(
       database.ref(database.getDatabase(), ref)
    )
    
}

export {Reference}