import { push } from "@firebase/database"
import { Method } from "@testing-library/dom"
import { database } from "../services/firebase"


async function Reference(ref: string, fun: Function, ) {
    const Ref = await database.ref(database.getDatabase(), ref)
    database.fun(Ref, )
}

Reference('hh', push)

export {Reference}