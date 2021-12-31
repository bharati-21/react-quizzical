import {useState, useEffect} from 'react';
import axios from 'axios';
import Question from './Question';
import {nanoid} from 'nanoid';


export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [quizEnded, setQuizEnded] = useState(false);
    const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
    

    useEffect(() => {
        console.log('Hello');
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
                userAnswers.push({id: id, option: ''});
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
    }, []);

    function handleUserSelection(event,id) {
        if(!quizEnded) {
            if(event.target.classList.contains('option')) {
                setOptions(oldOptions => oldOptions.map(oldOptions => {
                    return oldOptions.id === id ? 
                        {...oldOptions, options: oldOptions.options.map(option => { 
                            const decodedOption = atob(option.option);
                            setUserAnswers(oldUserAnswers => oldUserAnswers.map(oldUserAnswer => {
                                return oldUserAnswer.id === id  ? {...oldUserAnswer, option: btoa(event.target.value)} : oldUserAnswer
                            }))
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
            setUserAnswers([]); setOptions([]); setQuizEnded(false); setQuestions([]); setCorrectAnswers([]);
        }
        else {
            const allQuestionsAnswered = userAnswers.every(userAnswer => userAnswer.option);
            allQuestionsAnswered ? check() : throwError();
        }        
    }

    function check() {
        let numCorrect = 0;
        userAnswers.forEach(userAnswer => {
            const questionId = userAnswer.id;
            const correctAnswer = correctAnswers.find(correctAnswer => correctAnswer.id === questionId);
            if(userAnswer.option.trim() === correctAnswer.option.trim()) {
                setOptions(oldOptions => oldOptions.map(oldOption => {
                    if(oldOption.id === questionId) {
                        numCorrect++;
                        console.log(numCorrect)
                        return {...oldOption, answeredCorrect: true};
                    }
                    return oldOption;
                }))
            }
            else {
                setOptions(oldOptions => oldOptions.map(oldOption => {
                    return oldOption.id === questionId ? 
                    {...oldOption, answeredCorrect: false, 
                        options: oldOption.options.map(option => {
                            return option.isSelected ? {...option, incorrectAnswer: true} :  
                                option.option === correctAnswer.option ? {...option, correctAnswer: true} : option
                        }) 
                    }
                    : oldOption
                }))
            }
        })
        setNumCorrectAnswers(numCorrect)

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
                {quizEnded && `You answered ${numCorrectAnswers}/10 answers questions correctly`}
                <button className='btn btn-check' onClick={checkAnswers}>{quizEnded ? 'Play Again' : 'Check Anwers'}</button>
            </div>
        </section>
    )
}