import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard'; 

import {
  Container,
  Header,
  Title,
  Content,
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
  total: string;
  color: string;
}

export function Resume(){

  const [totalByCategories, settotalByCategories] = useState<CategoryData>([]);

  async function loadData() {
      //define uma chave para a colecao (abaixo)
    const dataKey = '@gofinances:transactions';
    // recuperar os dados que ja estao gravados anteriormente
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    //filtrar transacoes de saida
    const expensives = responseFormatted
    .filter((expensive: TransactionData) => expensive.type === 'negative');

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
      const total = categorySum.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    totalByCategory.push({
      key: category.key,
      name: category.name,
      color: category.color,
      total,
    });
    }
  });
  
  settotalByCategories(totalByCategory);
}



  useEffect(() => {
    loadData();
  }, []);


  return (
    <Container>
      <Header>
        <Title>Summary by Category</Title>
      </Header>
      <Content>

      {
        totalByCategories.map(item => (
        <HistoryCard
          key={item.key}
          title={item.name}
          amount={item.total}
          color={item.color}
        />
      ))
      }
      </Content>
    </Container>
  )
}