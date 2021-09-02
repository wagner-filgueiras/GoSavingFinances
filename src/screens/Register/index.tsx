import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
 } from 'react-native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  uuid from 'react-native-uuid';

 import { useForm } from 'react-hook-form';


import { InputForm } from '../../components/Forms/InputForm';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
 } from './styles';

 interface FormData {
   name: string;
   amount: string;
 }

 const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Name is required'),
  amount: Yup
  .number()
  .typeError('Please inform a numeric value')
  .positive('The value must be positive')
  .required('The amount is required')
 });

export function Register() {
  
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false); 

  //define uma chave para a colecao (abaixo)
  const dataKey = '@gofinances:transactions';

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category'
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });


  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

   function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  // adiciono o async para poder utilizar o await na gravacao dos dados abaixo
  async function handleRegister(form: FormData){
    if (!transactionType)
      return Alert.alert('Please, select the Transaction type!');

    if(category.key === 'category')
    return Alert.alert('Please, select the Category type!');

    const newTransaction = { 
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      // recuperar os dados que ja estao gravados anteriormente
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      // um array de objetos
      const dataFormatted = [
        //nesse novo objeto pego todos os dados salvos e passo ainda a nova transacao
        ...currentData,
        newTransaction
      ];
      // usamos o await aqui para aguardar a gravacao dos dados no dispositivo do usuario
      // por isso utilizo o async function no inicio dessa funcao la em cima
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

    } catch (error) {
      console.log(error)
      Alert.alert("Nao foi possivel salvar");
    }
  }

  useEffect(() => {
    async function loadData(){
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!));
    }

    loadData();

    //como limpar uma colecao do asyncStorage pra comecar do zero 
    // async function removeAll() {
    //   await AsyncStorage.removeItem(dataKey);
    // }

    // removeAll();
  }, []);

  return (
    //abaixo a maneira de esconder o teclado clicando em qualquer parte do app quando ele esta aberto
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container>
      
      <Header>
        <Title>Add Transaction</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Name"
            // trabalha com a captalizacao do input
            autoCapitalize="sentences"
            // habilita ou desabilita o auto correct das palavras
            autoCorrect={false}
            error={errors.name && errors.name.message}
          />
          
          <InputForm
            name="amount"
            control={control}
            placeholder="Amount"
            // verifique a disponibilidade do keyboardType para ambos os sistemas operacionais
            keyboardType="numeric"
            error={errors.amount && errors.amount.message}
          />
          <TransactionTypes>
            <TransactionTypeButton 
              type="up"
              title="Income"
              onPress = {() => handleTransactionTypeSelect('up')}
              isActive ={transactionType === 'up'}
            />
            <TransactionTypeButton 
              type="down"
              title="Outcome"
              onPress={() => handleTransactionTypeSelect('down')}
              isActive ={transactionType === 'down'}
            />
          </TransactionTypes>

          <CategorySelectButton 
          // abaixo define a categoria selecionada pelo usuario no modal como
          // o titulo da categoria do botao
          title={category.name}
          // abre o modal de categorias utilizando uma funcao
          onPress= {handleOpenSelectCategoryModal}
          />
        </Fields>
        
        <Button 
        title="Send" 
        onPress={handleSubmit(handleRegister)}
        
        />
        
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect 
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>

      

    </Container>
  </TouchableWithoutFeedback>

  );
}