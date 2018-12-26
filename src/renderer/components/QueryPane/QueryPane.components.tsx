import * as React from 'react';


export interface IAddressBarProps {
  handleSetAddress: (e: React.FormEvent) => void
}

export const AddressBar: React.SFC<IAddressBarProps> = ({ handleSetAddress }) => {
  return (
    <form action="" onSubmit={ (e) => handleSetAddress(e) }>
      <input type="url" name="address" placeholder="Service Address" />
      <button type="submit">Set</button>
    </form>
  );
}