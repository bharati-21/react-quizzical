export default function Question(props) {
    const {question, options, id} = props; 
    return (
        <article className="question" id={id}>
            <h2 className="question--text">{atob(question.toString())}</h2>
            <div className="question--options-container">
                {
                    options.map(option => <button className="option" key={`${id}-${option}`}>{atob(option)}</button>)
                }
            </div>
        </article>
        
    )
}