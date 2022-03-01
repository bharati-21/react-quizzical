import {useState, useEffect} from 'react';
import axios from 'axios';
import Question from './Question';
import {nanoid} from 'nanoid';
import CheckAnswers from './CheckAnswers';
import {Modal} from './Modal';

export default function Quiz() {
    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { 
        if(quizEnded === false) {      
            ( async () => {
                setShowLoading(true);
                setShowError(false);
                setUserAnswers([]);
                try {
                    const res = await axios.get('https://opentdb.com/api.php?amount=10&category=10&type=multiple&encode=base64');

                    if(res.status >=200 && res.status < 300) {
                        setQuizData(res.data.results.map(result => {
                            const id = nanoid();
                            return {
                                id,
                                question: result.question,
                                correctAnswer: result.correct_answer,
                                options: [{
                                    option: result.correct_answer,
                                    isSelected: false
                                },
                                ...result.incorrect_answers.map(option => (
                                    {option, isSelected: false}
                                ))]
                            }
                        }));
                    }
                    else {
                        throw new Error('Some error occurred');
                    }
                }
                catch(err) {
                    console.log(err);
                    console.log('Some error occurred!');
                    setShowError(true);
                }
                setShowLoading(false);
            })();
        }
    }, [quizEnded]);

    const handleUserSelection = (event, id) => {
        const value = event.target.value;
        /* 
            Logic to check if user has contains any question answered. 
            If yes, then to check if user changed the answer for a previously anwered question
        */
        if(userAnswers.length > 0 && userAnswers.find(userAnswer => userAnswer.id === id)) {
            setUserAnswers(prevUserAnsers => prevUserAnsers.map(userAnswer => userAnswer.id === id ? {...userAnswer, answer: btoa(value)} : {...userAnswer}));
        }
        /* Logic if user selects option for a new question */
        else {
            setUserAnswers(prevUserAnsers => [...prevUserAnsers, {id, answer: value}]);
        }  
        
        /* Changing the option field if user had the option selected */
        setQuizData(prevQuizData => prevQuizData.map(prevQuizItem => prevQuizItem.id === id ? 
            {...prevQuizItem, 
            options: 
            prevQuizItem.options.reduce((innerAccum, currentOption) => currentOption.option === btoa(value) ? 
                    [...innerAccum, {...currentOption, isSelected: !currentOption.isSelected}] 
                    : 
                    [...innerAccum, {...currentOption, isSelected: false}], [])
            } :  {...prevQuizItem}))
    }

    const checkAnswers = event => {
        if(userAnswers.length === quizData.length)  {
            const correctAnsweredQuestions = quizData.filter(quizItem => userAnswers.find(userAnswer => userAnswer.id === quizItem.id).answer === atob(quizItem.correctAnswer));
            setNumCorrectAnswers(correctAnsweredQuestions.length);
            setQuizEnded(true);
        }
        else {
            toggleModal();
        }
    }

    const toggleModal = () => {
        console.log(showModal);
        setShowModal(prevShowModal => !prevShowModal);
    }

    const handleRetakeQuiz = event => {
        setQuizEnded(false);
    }
    
    return (
        <section className={`quiz-page`}>
            {showModal && <Modal toggleModal={toggleModal} />}
            {showLoading && <h1>Loading Questions...</h1>}
            {showError && <h1>Error occurred while fetching questions</h1>}
            {
                !showLoading && 
                quizData.map(quizItem => {
                    return <Question 
                        key={quizItem.id} 
                        quizItem={quizItem}
                        handleUserSelection={handleUserSelection}
                        quizEnded={quizEnded}
                    />
                })
            }
            <div className="quiz-page--button-container">
            {
                quizEnded ? 
                    <CheckAnswers numCorrectAnswers={numCorrectAnswers} handleRetakeQuiz={handleRetakeQuiz}/> 
                    : 
                    (!showLoading && !showError) &&<button className='btn btn-check' onClick={checkAnswers}>Check Anwers</button>
                }
            </div> 
        </section>
    )
}