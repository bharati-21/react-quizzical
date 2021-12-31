import {useState, useEffect} from 'react';
import axios from 'axios';
import Question from './Question';
import {nanoid} from 'nanoid';


export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);

    useEffect(() => {
        axios.get('https://opentdb.com/api.php?amount=10&category=10&type=multiple&encode=base64')
        .then(res => {
            const answers = [];
            const questionsData = [];
            res.data.results.map(result => {
                const id = nanoid();
                questionsData.push({
                    nanoid: id,
                    question: result.question,
                    options: [result.correct_answer, 
                    ...result.incorrect_answers]
                })
                return answers.push({nanoid: id, correct_answer: result.correct_answer});
            })
            console.log(questionsData)
            console.log(answers);
            setQuestions(questionsData);
            setCorrectAnswers(answers);
        })
    }, []);

    return (
        <section className="quiz-page">
            {
                questions.map(question => <Question key={question.id} id={question.id} options={question.options} question={question.question}/>)
            }
            <div className="quiz-page--button-container">
                <button className='btn btn-check'>Check Anwers</button>
            </div>
        </section>
    )
}