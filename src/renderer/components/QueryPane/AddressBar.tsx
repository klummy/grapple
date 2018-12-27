import * as React from 'react';

import {
  Button,
  Form,
  Input,
} from '../GenericComponents';

export interface IAddressBarProps {
  handleSetAddress: (e: React.FormEvent) => void
}

const AddressBar: React.SFC<IAddressBarProps> = ({ handleSetAddress }) => {
  return (
    <Form action="" onSubmit={ e => handleSetAddress(e) }>
      <Input type="url" name="address" placeholder="Service Address" />
      <Button type="submit">Send</Button>
    </Form>
  );
}

export default AddressBar;