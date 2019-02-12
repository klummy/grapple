import styled from 'styled-components';

export const Form = styled.form`
  background-color: var(--color-black-default);
  display: flex;
  padding: 10px;
  width: 100%;

  input {
    flex: 1;
    margin-right: 10px;
  }
`;

export const InputGroup = styled.div`
  align-items: center;
  display: flex;
  max-width: 50%;
  padding: 10px 0;
  width: 100%;

  label {
    text-transform: capitalize;
    width: 30%;
  }

  > span {
    flex: 1;
    margin-right: 5px;
  }
`;

export const Input = styled.input`
  background-color: var(--color-black-alt-darker);
  border: 1px solid var(--color-black-alt-darker);
  border-radius: 50px;
  color: var(--text-color-default);
  font-size: 12px;
  height: 32px;
  padding: 0 10px;
  transition: all 0.3s ease-in-out;
  width: 100%;

  &:focus {
    border-color: var(--color-lines-default);
    outline: none;
  }
`;

export const Button = styled.button`
  background-color: var(--primary-color);
  border: none;
  border-radius: 50px;
  color: var(--secondary-color-grey);
  cursor: pointer;
  font-size: 13px;
  padding: 0 20px;
  opacity: 0.7;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`;

export const Select = styled.select`
  background-color: transparent;
  border: 1px solid rgba(72, 77, 109, 0.6);
  display: flex;
  flex: 1;
  height: 35px;
  margin-right: 5px;
  width: 100%;

  &:focus {
    border-color: rgba(72, 77, 109, 1);
    outline: thin;
  }
`;
