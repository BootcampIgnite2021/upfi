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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [imgUrl, setImgUrl] = useState('');

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={12}>
        {cards.map(item => (
          <GridItem w="100%" key={item?.id}>
            <Card
              key={item?.id}
              data={item}
              viewImage={(url: string) => {
                onOpen();
                setImgUrl(url);
              }}
            />
          </GridItem>
        ))}
      </Grid>

      <ModalViewImage isOpen={isOpen} imgUrl={imgUrl} onClose={onClose} />
    </>
  );
}
