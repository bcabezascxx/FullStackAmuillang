import React from "react"
import {Link} from "react-router-dom"

export default function NotFound(){
    return(
        <div><h2>Página no encontrada</h2>
            <button className="btn btn-primary"><Link to="/" style={{color:"white"}}>Volver al logeo</Link></button>
        </div>
    )
}