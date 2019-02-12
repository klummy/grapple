import * as React from 'react';

const CloseIcon: React.SFC<{
  onClick: (e: React.MouseEvent) => void;
}> = ({ onClick }) => {
  return (
    <svg
      height="23"
      onClick={onClick}
      viewBox="0 0 23 23"
      width="23"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.16 7.84a.7.7 0 0 0-.99 0l-2.97 2.97-2.97-2.97a.7.7 0 1 0-.99.99l2.97 2.97-2.97 2.97a.699.699 0 1 0 .99.99l2.97-2.97 2.97 2.97a.7.7 0 0 0 .99-.99l-2.97-2.97 2.97-2.97a.7.7 0 0 0 0-.99M11.2 21.622c-5.403 0-9.8-4.418-9.8-9.822C1.4 6.396 5.797 2 11.2 2c5.404 0 9.8 4.396 9.8 9.8 0 5.404-4.396 9.822-9.8 9.822M11.2.6C5.015.6 0 5.614 0 11.8 0 17.986 5.015 23 11.2 23c6.186 0 11.2-5.014 11.2-11.2C22.4 5.614 17.386.6 11.2.6"
        fill="#76787B"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default CloseIcon;
