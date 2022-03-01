
export default function CheckAnswers(props) {
    const {numCorrectAnswers, handleRetakeQuiz} = props;


    return (
        <div className="quiz-ended-wrapper">
            <p className="score">You answered <strong>{numCorrectAnswers}/10</strong> questions correctly</p>
            <button className='btn btn-check' onClick={handleRetakeQuiz}>Retake Quiz</button>
        </div>
    )
}