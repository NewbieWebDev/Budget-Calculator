import React, {useState , useEffect} from 'react';
import ExpenseForm from './Components/ExpenseForm';
import ExpenseList from './Components/ExpenseList';
import Alert from './Components/Alert';
import { v4 as uuidv4 } from 'uuid'
import './App.css';


//const initialExpenses = [
 // {
  //  id:uuidv4(),charge:'rent',amount:1600
 // },
 // {
 //   id:uuidv4(),charge:'Car payment',amount:1000
 // },
 // {
  //  id:uuidv4(),charge:'loan',amount:1300
  //}
//]

const initialExpenses = localStorage.getItem('expenses') ? 
JSON.parse(localStorage.getItem("expenses"))
:[]

function App() {
  //******************** state values */
  const [expenses,setExpenses] = useState(initialExpenses)

  const [charge,setCharge] = useState('');

  const [amount,setAmount] = useState('');

  const [alert, setAlert]= useState({
    show:false
  })
  const [edit,setEdit] = useState(false)

  const [id,setId] = useState(0)

  //********************useEffct */

  useEffect(()=>{
    localStorage.setItem('expenses',JSON.stringify(expenses))
  },[expenses])



  //******************** functionality */

  const handleCharge = (e) =>{
    setCharge(e.target.value)
  }

  const handleAmount = (e) =>{
    setAmount(e.target.value)
  }

  // handle alert

  const handleALert = ({type,text}) => {
    setAlert({show:true,type,text})
    setTimeout(() => {
      setAlert({show:false})
    },3000)

  }

  // clear items

  const clearItems = () =>{
    setExpenses([]);
    handleALert({type:'danger',text:' All items deleted'})
  }

  // handle delete

  const handleDelete = (id) =>{
    let tempExpenses = expenses.filter(item => item.id !== id )
    setExpenses(tempExpenses)
    handleALert({type:'danger',text:'item deleted'})
  }

  // handle edit

  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id)
    let {charge,amount} = expense;
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }

  // handle submit
  const handleSubmit = (e) =>{
    e.preventDefault();

    if(charge !== '' && amount > 0){
      if(edit){

        let tempExpenses = expenses.map(item => {
          return item.id === id ?{...item,charge,amount} :item
        })
        setExpenses(tempExpenses)
        setEdit(false)
        handleALert({type:'success',text:'item edited'})

      }else{
        const singleExpense = {id:uuidv4(),charge,amount}
        setExpenses([...expenses,singleExpense])
        handleALert({type:'success',text:'item added'})
      }
      setCharge("")
      setAmount("")
    } else {
      handleALert({type:'danger', text:`charge can't be empty value and amount value has to be bigger than zero`})
    }

  }

  
  return <>
   {
     alert.show && <Alert type={alert.type} text={alert.text}/>
   }
    <Alert/>
    <h1>budget calculator</h1>
    <main className='App'>
    <ExpenseForm charge={charge} 
                  amount={amount} 
                  handleAmount={handleAmount} 
                  handleCharge={handleCharge} 
                  handleSubmit={handleSubmit}
                  edit={edit}  
                  />
    <ExpenseList expenses={expenses} handleDelete={handleDelete} handleEdit={handleEdit} clearItems={clearItems}/>

    </main>
    <h1>
    Total Spending : <span className='total'>
      ${
        expenses.reduce((acc,curr)=>{
          return acc += parseInt(curr.amount)
        },0)
      }
    </span></h1>
    </>;
  
}

export default App;
