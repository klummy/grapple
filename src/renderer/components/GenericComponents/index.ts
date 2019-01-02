import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  width: 100%;

  input {
    flex: 1;
    margin-right: 5px;
  }
`

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
`

export const Input = styled.input`
  border: 1px solid rgba(72, 77, 109, .3);
  border-radius: 3px;
  flex: 1;
  font-size: 13px;
  padding: 10px;
  transition: border-color .3s ease-in-out;

  &:focus {
    border-color: rgba(72, 77, 109, 1);
    outline: thin;
  }
`

export const Button = styled.button`
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

export const Select = styled.select`
  background-color: transparent;
  border: 1px solid rgba(72, 77, 109, .6);
  display: flex;
  flex: 1;
  height: 35px;
  margin-right: 5px;
  width: 100%;

  &:focus {
    border-color: rgba(72, 77, 109, 1);
    outline: thin;
  }
`