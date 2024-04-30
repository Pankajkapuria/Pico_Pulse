import React from 'react'
import { Link } from 'react-router-dom'
import '../usable/Suggestion.css'

const Suggestion = () => {
    return (
        <div className='Suggestion'>
            <Link to={`/Suggested/user/profile/`} className='SuggestionProfile'>
                <div className="SuggestionDetials">
                    <img className='img1' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVvYaBHUm-EgMU_f7atHv0uItBRkEmA6gPPg&usqp=CAU' alt='' />
                    <div className="SuggestionDetialsName">
                        <p>Pankajjj07595</p>
                        <p>Pankaj</p>
                    </div>
                </div>
                <Link className='postbtn'> Follow </Link>
            </Link>
        </div>
    )
}

export default Suggestion
