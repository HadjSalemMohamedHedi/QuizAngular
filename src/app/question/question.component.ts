import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../Services/question.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  name: string = '';
  questionList: any = [];
  currentQuestion: number = 0
  points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted:boolean = false;
  constructor(private QuestionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.GetAllQuestion();
    this.startCounter()
  }


  GetAllQuestion() {
    this.QuestionService.getQuestionJson().subscribe(res => {
      this.questionList = res.questions
    })
  }

  nextQuestion() {
    this.currentQuestion++;
  }


  previousQuestion() {
    this.currentQuestion--;
  }


  answer(currentQno: number, option: any) {
    if(currentQno === this.questionList.length){
      this.isQuizCompleted=true;
      this.startCounter();
    }

    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(()=>{
        this.currentQuestion++;
        this.resetCounter()
        this.getPrgressPercent();
      },500)
     

    } else {
      this.points -= 10;
      this.inCorrectAnswer++;
      setTimeout(()=>{
        this.currentQuestion++;
        this.resetCounter()
        this.getPrgressPercent();
      },500)    
    }
    
  }


  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter == 0) {
          this.currentQuestion++;
          this.counter = 60;
          this.points -= 10;
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 600000)
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.GetAllQuestion();
    this.points = 0;
    this.currentQuestion = 0
    this.progress="0";
  }

  getPrgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }

}
