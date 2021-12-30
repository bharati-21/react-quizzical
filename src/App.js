import './App.css';
import {useState} from 'react';
import IntroPage from './components/IntroPage';

function App() {
  const [startQuiz, setStartQuiz] = useState(false);

  function changeQuizState(){
    setStartQuiz(true);
  }

  return (
    <main className="main">
      {
        startQuiz ? 
        <div className='section-wrapper'></div>
        :
        <div className='section-wrapper'>
          <IntroPage startQuizHandler={changeQuizState} />
        </div>
      }
    </main>
  );
}

export default App;
