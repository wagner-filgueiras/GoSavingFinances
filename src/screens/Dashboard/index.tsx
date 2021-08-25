import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard(){
 
  const data:DataListProps[] = [
    {
    id: '1',
    type: 'positive',
    title: "Desenvolvimento de Site",
            amount:"$17.400",
            category: {
              name: 'Vendas',
              icon: 'dollar-sign',
            },
            date:"13/04/2020",
  },
  {
    id: '2',
    type: 'negative',
    title: "Jantar",
            amount:"$59.00",
            category: {
              name: 'Alimentação',
              icon: 'coffee',
            },
            date:"13/04/2020",
  },
  {
    id: '3',
    type: 'negative',
    title: "Aluguel Apartamento",
            amount:"$1.200",
            category: {
              name: 'Casa',
              icon: 'shopping-bag',
            },
            date:"13/04/2020",
  },

]

  return (
    <Container>
      <Header>
        <UserWrapper>
            <UserInfo>
              <Photo 
              source={{ uri: 'https://avatars.githubusercontent.com/u/38699596?v=4' }} 
              />
              <User>
                <UserGreeting>Hello, </UserGreeting>
                <UserName>Wagner</UserName>
              </User>
          </UserInfo>

          <Icon name="power" />

        </UserWrapper>
        
        
      </Header>
        <HighlightCards>
          <HighlightCard
          type="up" 
          title="Income" 
          amount="$17.400" 
          lastTransaction="Last income on April  13th"
          />
          <HighlightCard 
          type="down"
          title="Debt" 
          amount="$17.400" 
          lastTransaction="Last income on April  13th"
          />
          <HighlightCard 
          type="total"
          title="Total" 
          amount="$17.400" 
          lastTransaction="1st to 16th April"
          />
        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionsList 
            data={data}
            keyExtractor= { item => item.id }
            renderItem={({ item }) => <TransactionCard data={ item }/>}
            
          />

          

        </Transactions>
    </Container>
  )
}
