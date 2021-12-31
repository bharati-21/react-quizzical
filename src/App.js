import './App.css';
import {useState} from 'react';
import IntroPage from './components/IntroPage';
import Quiz from './components/Quiz';

function App() {
  const [startQuiz, setStartQuiz] = useState(false);

  function changeQuizState(){
    setStartQuiz(true);
  }

  return (
    <main className="main">
      {
        startQuiz ? 
        <div className='section-wrapper'>
          <Quiz />
        </div>
        :
        <div className='section-wrapper'>
          <IntroPage startQuizHandler={changeQuizState} />
        </div>
      }
    </main>
  );
}

export default App;
