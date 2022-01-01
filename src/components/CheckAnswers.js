import { useEffect } from "react";

export default function CheckAnswers(props) {
    const {options, numCorrectAnswers} = props;

    useEffect(() => {
        let numCorrect = 0;

        options.forEach(option => {
            numCorrect += option.answeredCorrect ? 1 : 0;
        })
        props.setNumCorrectAnswers(numCorrect);
    }, [props, options]) 


    return (
        <div className="quiz-ended-wrapper">
            <p className="score">You answered <strong>{numCorrectAnswers}/10</strong> questions correctly</p>
            <button className='btn btn-check' onClick={props.checkAnswers}>Check Anwers</button>
        </div>
    )
}