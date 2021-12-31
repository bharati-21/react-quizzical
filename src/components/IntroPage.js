export default function IntroPage(props) {
    return (
        <section className="intro-page">
            <h1 className="intro-page--head">Quizzical</h1>
            <p className="intro-page--lead">Test your love for Books!</p>
            <button className="btn btn-start-quiz" onClick={props.startQuizHandler}>
                Start Quiz
            </button>
        </section>
    )
}