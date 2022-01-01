import {useState, useEffect} from 'react';
import axios from 'axios';
import Question from './Question';
import {nanoid} from 'nanoid';
import CheckAnswers from './CheckAnswers';


export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [quizEnded, setQuizEnded] = useState(false);
    const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
    
    

    function fetchData() {
        axios.get('https://opentdb.com/api.php?amount=10&category=10&type=multiple&encode=base64')
        .then(res => {
            const answers = [];
            const questionsData = [];
            const optionsData = [];
            res.data.results.map(result => {
                const id = nanoid();
                questionsData.push({
                    id: id,
                    question: result.question,
                })
                optionsData.push({id: id, options:[result.correct_answer, 
                    ...result.incorrect_answers]})
                // userAnswers.push({id: id, option: ''});
                return answers.push({id: id, option: result.correct_answer});
            })
            
            
            setOptions(optionsData.map(option => {
                    return {
                        id: option.id,
                        options: option.options.map(opt => {
                            return {option: opt, isSelected: false}
                        }),
                    }
                })
            );
            setQuestions(questionsData);
            setCorrectAnswers(answers);
        })
    }

    useEffect(() => {       
        fetchData();
    }, []);

    function handleUserSelection(event,id) {
        if(!quizEnded) {
            if(event.target.classList.contains('option')) {
                setOptions(oldOptions => oldOptions.map(oldOptions => {
                    return oldOptions.id === id ? 
                        {...oldOptions, options: oldOptions.options.map(option => { 
                            const decodedOption = atob(option.option);
                            setUserAnswers(oldUserAnswers => [...oldUserAnswers, {id: id, option: btoa(event.target.value)}])
                            return decodedOption === event.target.value ? 
                                {...option, isSelected: !option.isSelected} : {...option, isSelected: false};
                        })}
                    : oldOptions;
                }))
            }
        }
    }

    function checkAnswers() {
        if(quizEnded) {
            setUserAnswers([]); 
            setOptions([]);  
            setQuizEnded(false); 
            setQuestions([]); 
            setCorrectAnswers([]);
            fetchData();
        }
        else {
            const allQuestionsAnswered = userAnswers.every(userAnswer => userAnswer.option);
            if(allQuestionsAnswered) {
                check();             
            }
            else throwError();
        }        
    }

    function check() {
        userAnswers.forEach(userAnswer => {
            const id = userAnswer.id;
            const correctAnswer = correctAnswers.find(answer => answer.id === id);
           
            const userOption = userAnswer.option;
            const correctOption = correctAnswer.option;

            const answeredCorrect = userOption.trim() === correctOption.trim();
            
            
            setOptions(oldOptions => oldOptions.map(oldOption => {
                return oldOption.id === id ? 
                {
                    ...oldOption, 
                    answeredCorrect: answeredCorrect,
                    options: answeredCorrect ? 
                        oldOption.options : 
                        oldOption.options.map(option => {
                            return option.isSelected ? 
                            {
                                ...option, 
                                incorrectAnswer: true
                            } 
                            : 
                                option.option === correctOption ? 
                                {
                                    ...option, 
                                    correctAnswer: true
                                } 
                                : option
                        })
                } 
                : oldOption
            }))           
        })     
        setQuizEnded(true);                     
    }

    function throwError() {
        alert('Answer all questions!');
    }

    return (
        <section className="quiz-page">
            {
                questions.map(question => {
                    return <Question 
                        key={question.id} 
                        id={question.id} 
                        options={options.find(option => option.id === question.id)}
                        question={question.question}
                        quizEnded={quizEnded}
                        handleUserSelection={(event) => handleUserSelection(event,question.id)}
                    />
                })
            }
            <div className="quiz-page--button-container">
                {
                    quizEnded ? 
                        <CheckAnswers options={options} setNumCorrectAnswers={setNumCorrectAnswers} numCorrectAnswers={numCorrectAnswers} checkAnswers={checkAnswers}/> 
                    : 
                        questions.length > 0 && <button className='btn btn-check' onClick={checkAnswers}>Check Anwers</button>
                }
            </div> 
        </section>
    )
}