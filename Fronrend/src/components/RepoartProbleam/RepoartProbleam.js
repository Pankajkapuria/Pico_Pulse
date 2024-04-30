import React from 'react'
import '../RepoartProbleam/RepoartProbleam.css'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RepoartProbleam = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className=' ReportProblemMain d-flex justify-content align-items'>
                <div className='ReportProblem b1'>
                    <p className='textalignc p3 mtb1'>Report a problem</p>
                    <div className="textarea HelpTextArea b1 mtb1" >
                        <textarea className='bg1 reportTextArea' style={{ height: '10vmax' }} maxLength='500' placeholder=' Please include as much info as possible...' />
                    </div>
                    <button className='btn2 bg3' onClick={() => {
                        toast.success('Thank you for reporting this problem.')
                        setTimeout(() => {
                            navigate('/')
                        }, [2100])
                    }}>Send Report</button>
                    <p className='p2 mtb1'>Your PicoPulse username and browser information will be automatically included in your report.</p>
                </div>
            </div>
        </>
    )
}

export default RepoartProbleam
