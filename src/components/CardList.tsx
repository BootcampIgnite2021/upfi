import { Grid, GridItem, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={12}>
        {cards.map(item => (
          <GridItem w="100%">
            <Card
              key={item?.id}
              data={item}
              viewImage={(url: string) => {
                console.log('aqui', url);
              }}
            />
          </GridItem>
        ))}
      </Grid>

      {/* TODO MODALVIEWIMAGE */}
    </>
  );
}
