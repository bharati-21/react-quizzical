export default function Question(props) {
    const {question, id, handleUserSelection, options, quizEnded} = props; 
    
   
    let questionClassNames = 'question';
    if(quizEnded) {
        if(options.answeredCorrect) {
            questionClassNames+=' answered-correct';
        }
        else questionClassNames+= ' answered-incorrect';
    }

    return (
        <article className={questionClassNames} id={id} onClick={handleUserSelection}>
            <h2 className="question--text">{atob(question.toString())}</h2>
            <div className="question--options-container">
                {
                    
                    options.options.map((option,index) => {

                        
                        return <button className={`option ${quizEnded && option.correctAnswer ? 'correct-answer' : option.incorrectAnswer ? 'incorrect-answer' :''} ${option.isSelected ? 'selected' : ''}`} key={`${id}-${index}`} value={atob(option.option)}>{atob(option.option)}</button>
                    })
                }
            </div>
        </article>
        
    )
}