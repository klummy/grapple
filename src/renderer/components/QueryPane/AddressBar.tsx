import * as React from 'react';
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  width: 100%;

  input {
    flex: 1;
    margin-right: 5px;
  }
`

const Input = styled.input`
  border: 1px solid rgba(72, 77, 109, .6);
  border-radius: 3px;
  font-size: 13px;
  padding: 10px;
  transition: border-color .3s ease-in-out;

  &:focus {
    border-color: rgba(72, 77, 109, 1);
    outline: none;
  }
`

const Button = styled.button`
  background-color: var(--primary-color);
  border: none;
  border-radius: 3px;
  color: var(--secondary-color-grey);
  cursor: pointer;
  font-size: 13px;
  padding: 0 20px;
  transition: opacity .3s ease-in-out;

  &:hover {
    opacity: .8;
  }
`

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