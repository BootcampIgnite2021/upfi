import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const validateLessThan10MB = file => {
    if (file && file[0]) {
      return file[0].size <= 10000000;
    }
    return true;
  };

  const validateAcceptedFormats = file => {
    if (file && file[0]) {
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return acceptedTypes.includes(file[0].type);
    }
    return true;
  };

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: value =>
          validateLessThan10MB(value) || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: value =>
          validateAcceptedFormats(value) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const handleSubmitMutation = async data => {
    const result = await api.post('/images', data);

    return result;
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: any) => {
      return handleSubmitMutation(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          status: 'error',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });
      }
      const dataFormated = {
        title: data?.title,
        description: data?.description,
        url: imageUrl,
      };

      await mutation.mutateAsync(dataFormated);

      toast({
        title: 'Imagem cadastrada',
        status: 'success',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      reset();
      closeModal();
      setImageUrl('');
      setLocalImageUrl('');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', {
            ...formValidations.image,
          })}
          error={errors?.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', {
            ...formValidations.title,
          })}
          error={errors?.title}
        />

        <TextInput
          name="description"
          placeholder="Descrição da imagem..."
          {...register('description', {
            ...formValidations.description,
          })}
          error={errors?.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
