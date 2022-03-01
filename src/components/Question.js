export default function Question({quizItem, handleUserSelection, quizEnded}) {
    let questionClassNames = 'question';
    
    const {id, question, options, correctAnswer} = quizItem;

    if(quizEnded) {
        const selectedOption = options.find(option => option.isSelected);
        questionClassNames += (selectedOption.option === correctAnswer) ? ' answered-correct' : ' answered-incorrect'
    }

    return (
        <article className={questionClassNames} id={id}>
            <h2 className="question--text">{atob(question.toString())}</h2>
            <div className="question--options-container">
                {
                    options.map((option,index) => {
                        return <button className={`option ${option.isSelected ? 'selected' : ''} ${option === correctAnswer ? 'correct-answer' : ''}`} value={atob(option.option)} onClick={e => handleUserSelection(e, id)}>{atob(option.option)}</button>
                    })
                }
            </div>
        </article>
        
    )
}