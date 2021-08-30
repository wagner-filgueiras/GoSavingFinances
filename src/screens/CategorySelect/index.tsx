import React from 'react';
import { FlatList } from 'react-native';

import { Button } from '../../components/Forms/Button';

import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void; // para receber o id e name da category
  closeSelectCategory: () => void; // para fechar o modal
}

export function CategorySelect({ 
  category,
  setCategory,
  closeSelectCategory
} : Props ){

  function handleCategorySelect(  category: Category){
    setCategory( category );

  }

  return (
    <Container>
      <Header>

        <Title>Category</Title>
      </Header>
      <FlatList 
        data={ categories }
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
          // chama a funcao que seleciona a categoria usa o set state
          //para receber e setar o id e name da categoria como definido la em cima
            onPress={() => handleCategorySelect(item)}
            // verifica se a categoria esta ativa
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}

      />

      <Footer>
        <Button 
        title="Select" 
        onPress={closeSelectCategory}
        />
      </Footer>

    </Container>
  )
}