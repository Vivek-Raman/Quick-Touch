/* eslint-disable react/jsx-props-no-spreading */
// FIXME: This is annoying.
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface NewContainerFormProps {
  position: number;
}

export default function NewContainerForm(props: NewContainerFormProps) {
  const { position } = props;
  const containerForm = useForm({
    name: 'new-container-form',
    mode: 'controlled',
    initialValues: {
      containerName: '',
      parentID: 0,
      position,
    },
  });

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <form onSubmit={containerForm.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Container Name"
          key={containerForm.key('containerName')}
          {...containerForm.getInputProps('containerName')}
        />
        <Button type="submit">Create container</Button>
      </Stack>
    </form>
  );
}
