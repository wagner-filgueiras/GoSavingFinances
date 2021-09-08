import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
//import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components';

import { HistoryCard } from '../../components/HistoryCard'; 

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles';

import { categories } from '../../utils/categories';
import { StringLocale } from 'yup/lib/locale';


interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Summary(){
  const [isLoading, setIsLoading] = useState(false);
  const [ selectedDate, setSelectedDate ] = useState(new Date);
  const [totalByCategories, settotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  // passo os parametros da acao se eh o icone de avancar ou recuar
  function handleDateChange(action: 'next' | 'prev'){

    if(action === 'next') {
      const newDate = addMonths( selectedDate, 1)
      setSelectedDate(newDate);
    }else {
      const newDate = subMonths( selectedDate, 1)
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    setIsLoading(true);
      //define uma chave para a colecao (abaixo)
    const dataKey = '@gofinances:transactions';
    // recuperar os dados que ja estao gravados anteriormente
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    //filtrar transacoes de saida
    const expensives = responseFormatted
    .filter((expensive: TransactionData) => 
    expensive.type === 'negative' &&
    new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
    new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    //reduce serve para somar uma colecao
    const expensivesTotal = expensives.reduce((acumulator: number, expensive: TransactionData) => {
      return acumulator + Number(expensive.amount);
    }, 0);

    //array auxiliar
    const totalByCategory: CategoryData[] = [];

    // forEach nao devolve nada diferente do map mas essa funcao vai calcular para cada categoria a soma
    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) =>{
        // lembrar que salvamos a chave no asyncStorage por isso usamos a key abaixo
        if(expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
       // agora preciso armazenar o total de minha categoria
    // pois o laco vai voltar para uma segunda volta e asism por diante.
    //abaixo adicionar um novo objeto a esse array
    if(categorySum > 0){
      const totalFormatted = categorySum
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });

    const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

    totalByCategory.push({
      key: category.key,
      name: category.name,
      color: category.color,
      total: categorySum,
      totalFormatted,
      percent,
    });
    }
  });
  
  settotalByCategories(totalByCategory);
  setIsLoading(false);
}

  // abaixo faz com que a lista seja recarreagada apos o cadastro de uma transacao
  useFocusEffect(useCallback(() => {
    loadData();
  },[selectedDate]));



  return (
    <Container>
      <Header>
        <Title>Summary by Category</Title>
          </Header>
          {
            isLoading ? 
            <LoadContainer>
              <ActivityIndicator 
              color={theme.colors.primary}
              size="large"
              />
            </LoadContainer> :
      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight(),

        }}
      >
        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange('prev')}>
            <MonthSelectIcon name="chevron-left"/>
          </MonthSelectButton>

          <Month>
            { format(selectedDate, 'MMMM, yyyy') }
          </Month>

          <MonthSelectButton onPress={() => handleDateChange('next')}>
            <MonthSelectIcon name="chevron-right"/>
          </MonthSelectButton>

        </MonthSelect>

        <ChartContainer>
          <VictoryPie 
            data={totalByCategories}
            //abaixo pego das minhas categorias, somente as cores
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {fontSize: RFValue(16),
              fontWeight: 'bold',
              fill: theme.colors.shape,
              }
            }}
            labelRadius={80}
            x="percent"
            y="total"
          />
        </ChartContainer>

      {
        totalByCategories.map(item => (
        <HistoryCard
          key={item.key}
          title={item.name}
          amount={item.totalFormatted}
          color={item.color}
        />
      ))
      }
      </Content>
      }
    </Container>
  )
}