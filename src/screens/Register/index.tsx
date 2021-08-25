import React, { useState } from 'react';

import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelect } from '../../components/Forms/CategorySelect';

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

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
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

          <CategorySelect title="Category"/>
        </Fields>
        
        <Button title="Send" />
        
      </Form>

      

    </Container>

  );
}