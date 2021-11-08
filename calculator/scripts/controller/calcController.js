class calcController{
    
    constructor (){
    
    this.setLastOperator = '';
    this.lastNumber = '';   

    this.locale = 'pt-br';
    this.operation = [];
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");       
    this._currentDate;

    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();

    this.audioOnOff = false;
    this.audio = new Audio('click.mp3');

    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this.locale, {day: '2-digit', month: 'short', year:'numeric'});
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
            console.log(text);

        });

    }
    
    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select(); 

        document.execCommand("Copy"); 

        input.remove();
    }

    initialize(){

        this.setDisplayDateTime();
        this.setLastNumberToDisplay();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.pasteFromClipboard();

        this.btnAudio()

    }

    btnAudio(){
    
        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });

        });

    }

    toggleAudio(){

        this.audioOnOff = !this.audioOnOff;

    }

    playAudio(){

        if(this.audioOnOff){

            this.audio.currentTime = 0;
            this.audio.play();

        }

    }

    addEventListenerAll(element, events, fn){

        events.split('; ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    };

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+')
            break;
            case 'subtracao':
                this.addOperation('-')
                break;
            case 'multiplicacao':
                this.addOperation('*')
                break;
            case 'divisao':
                this.addOperation('/')
                break;
            case 'porcento':
                this.addOperation('%')
                break;
            case 'igual':
                this.Calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;                        
        }
        
    }

    //operations

    setError(){
        this.displayCalc = "error";
    }

    clearAll(){
        this.operation = [];
        this.lastOperator = '';
        this.lastNumber = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this.operation.pop();
        this.setLastNumberToDisplay();
    }

    setLastOperation(value){

        return this.operation[this.operation.length - 1] = value;

    }
    
    getLastOperation(){

        return this.operation[this.operation.length - 1];

    }
    
    isOperator(value){
        return (['+','-','*','/','%'].indexOf(value)> -1);
    }

    pushOperation(value){

        this.operation.push(value);
        if(this.operation.length > 3){
            console.log(this.Calc());
        }
    }

    getResult(){
        try{
        return eval(this.operation.join(''));
        } catch{
            setTimeout(() => {
                this.setError();
            }, 0);
        }
    }

    

    Calc(){

        let last = '';
        this.setLastOperator = this.getLastItem();

        if(this.operation.length < 3){
            let firstItem = this.operation[0];
            this.operation = [firstItem, this.setLastOperator, this.lastNumber];
        }

        if(this.operation.length > 3) {
            let last = this.operation.pop();
            this.lastNumber = this.getResult();
        } else if(this.operation.length == 3){
            this.lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == '%'){

            result /= 100;
            this.operation = result; 

        } else {
            this.operation = [result];
            if(last) this.operation.push(last);
        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this.operation.length-1; i >= 0; i--){
                
            if (this.isOperator(this.operation[i]) == isOperator){
                lastItem = this.operation[i];
                break; 
            }   
       
        }

        if(!lastItem){

            lastItem = (isOperator) ? this.setLastOperator : this.lastNumber;
            
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;
    
        this.displayCalc = lastNumber;

    }


    addOperation(value){

        if (isNaN(this.getLastOperation())){

            if (this.isOperator(value)){

                this.setLastOperation(value);
                this.getLastItem();

            } else {

                    this.pushOperation(value);
                    this.setLastNumberToDisplay();
                } 

        }else{

            if (this.isOperator(value)){
                this.pushOperation(value);
            } else{
                
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(newValue);
            } 

            this.setLastNumberToDisplay();

            }

    }   

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; 

        if (this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.');

        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setLastNumberToDisplay();
    }

    //buttons events

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) =>{
            this.addEventListenerAll(btn,'click; drag', e=>{

                let textBtn = btn.className.baseVal.replace("btn-", "")

                this.execBtn(textBtn);
            
            });
            this.addEventListenerAll(btn, 'mouseover; mouseup; mousedown', e=>{
                btn.style.cursor = 'pointer';
            });
        });
    }

    initKeyboard(){

        document.addEventListener('keyup', e =>{

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key)
                    break;
                case 'Enter':
                case '=':
                    this.Calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;  ''
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;                 
            }

        });   

    }

    get displayTime(){
        return this._timeEl.innerHTML; 
    }


    set displayTime(value){
        return this._timeEl.innerHTML = value; 
    }


    get displayDate(){
        return this._dateEl.innerHTML;
    }
    

    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }


    get displayCalc(){
        return this._displayCalcEl.innerHTML;

    }


    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date;
    }

    set currentDate(value){
        this._currentDate = value;
    }
    
}