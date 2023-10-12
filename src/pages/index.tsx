/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const getImages = async param => {
    const { pageParam } = param || { pageParam: null };
    const result = await api.get(`/images`, {
      params: {
        after: pageParam,
      },
    });

    return result;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: getImages,
    getNextPageParam: result => result?.data?.after || null,
  });

  const formattedData = useMemo(() => {
    const newFormattedData = data?.pages
      ?.map(item => item.data)
      ?.map(item => item.data)
      .flat();

    return newFormattedData;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
          mt={10}
          bg="orange.500"
        >
          {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
        </Button>
      </Box>
    </>
  );
}
