import React, { useState } from 'react';
import { Modal } from 'react-native';

import { Input } from '../../components/Forms/Input';
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
  TransctionTypes
 } from './styles';

export function Register() {
  
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false); 

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category'
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

  return (
    <Container>
      <Header>
        <Title>Add Transaction</Title>
      </Header>

      <Form>
        <Fields>
          <Input
            placeholder="Name"
          />
          <Input
            placeholder="Amount"
          />
          <TransctionTypes>
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
          </TransctionTypes>

          <CategorySelectButton 
          title={category.name}
          onPress= {handleOpenSelectCategoryModal}
          />
        </Fields>
        
        <Button title="Send" />
        
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect 
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>

      

    </Container>

  );
}