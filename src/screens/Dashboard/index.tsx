import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

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
  LogoutButton,
  LoadContainer,
} from './styles';


export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightCardProps {
  amount: string;
}

interface HighlightCardData {
  entries: HighlightCardProps;
  expensives: HighlightCardProps;
  total: HighlightCardProps;
 
}

export function Dashboard(){
  const [isLoading, setisLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightCardData, setHighlightCardData] =useState<HighlightCardData>({} as HighlightCardData);
  const theme = useTheme();

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensivesTotal = 0;
    

    const transactionsFormatted: DataListProps[] = transactions
    // map percorre cada obejto da transacao e retorna um objeto
    // formatando abaixo amount do item, depois date do item...
    .map((item: DataListProps) => {
      // como o map ja percorre cada item eu aproveito para fazer a soma dos items
      //positivos e depois os negativos.
      if(item.type === 'positive'){
        entriesTotal += Number(item.amount);
      } else {
        expensivesTotal += Number(item.amount);
      }

      // amount sendo formatado
      const amount = Number(item.amount)
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      // date sendo formatado
      const date = Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format( new Date(item.date));
      // retornar o objeto ja formatado
    return{ 
      id: item.id,
      name: item.name,
      amount,
      type: item.type,
      category: item.category,
      date,
      }
    }); 
    
    setTransactions(transactionsFormatted);

    const transactionsTotal = entriesTotal - expensivesTotal;

    setHighlightCardData({
      entries: {
        amount: entriesTotal.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      },
      expensives: {
        amount: expensivesTotal.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      },
      total: {
        amount: transactionsTotal.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      },
    });

    //console.log(transactionsFormatted);
    setisLoading(false);

  }
  // carrega a listagem de transacoes
  useEffect(() => {
    loadTransactions();

  // se eu quiser limpar a lista uso as 2 linhas abaixo
  //const dataKey = '@gofinances:transactions';
  //AsyncStorage.removeItem(dataKey);
  }, []);
  // abaixo faz com que a lista seja recarreagada apos o cadastro de uma transacao
  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));


  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
          color={theme.colors.primary}
          size="large"
          />
        </LoadContainer> :
        <>
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
            <LogoutButton onPress={() => {}}>
              <Icon name="power" />
            </LogoutButton>

          </UserWrapper>
          
          
        </Header>
          <HighlightCards>
            <HighlightCard
            type="up" 
            title="Income" 
            amount={highlightCardData.entries.amount}
            lastTransaction="Last income on April  13th"
            />
            <HighlightCard 
            type="down"
            title="Outcome" 
            amount={highlightCardData.expensives.amount} 
            lastTransaction="Last income on April  13th"
            />
            <HighlightCard 
            type="total"
            title="Total" 
            amount={highlightCardData.total.amount} 
            lastTransaction="1st to 16th April"
            />
          </HighlightCards>

          <Transactions>
            <Title>Transactions List</Title>

            <TransactionsList 
              data={transactions}
              keyExtractor= { item => item.id }
              renderItem={({ item }) => <TransactionCard data={ item }/>}
              
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
